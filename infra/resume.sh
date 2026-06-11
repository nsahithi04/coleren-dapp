#!/usr/bin/env bash
# Recreates the ALB and starts ECS tasks back up.
# After running, update VITE_API_URL and VITE_API_BASE in coleren-frontend/.env.production
# with the new ALB URL, then redeploy the frontend.
set -euo pipefail

REGION=${AWS_REGION:-us-east-1}
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
CLUSTER="coleren-cluster"
LOG_GROUP="/ecs/coleren"

# ── Look up existing resources by name ───────────────────────────────────────
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=isDefault,Values=true" \
  --query "Vpcs[0].VpcId" --output text --region $REGION)

SUBNET_IDS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query "Subnets[*].SubnetId" --output text --region $REGION)
SUBNET_ARRAY=($SUBNET_IDS)
SUBNET_LIST=$(IFS=,; echo "${SUBNET_ARRAY[*]}")

ALB_SG=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=coleren-alb-sg" "Name=vpc-id,Values=$VPC_ID" \
  --query "SecurityGroups[0].GroupId" --output text --region $REGION)

TASKS_SG=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=coleren-tasks-sg" "Name=vpc-id,Values=$VPC_ID" \
  --query "SecurityGroups[0].GroupId" --output text --region $REGION)

echo "VPC: $VPC_ID | ALB SG: $ALB_SG | Tasks SG: $TASKS_SG"

# ── Recreate ALB ──────────────────────────────────────────────────────────────
echo "Creating ALB..."
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name coleren-alb \
  --subnets "${SUBNET_ARRAY[@]}" \
  --security-groups $ALB_SG \
  --scheme internet-facing \
  --type application \
  --query "LoadBalancers[0].LoadBalancerArn" --output text --region $REGION)

ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --query "LoadBalancers[0].DNSName" --output text --region $REGION)
echo "ALB DNS: $ALB_DNS"

# ── Recreate target groups ────────────────────────────────────────────────────
AI_TG_ARN=$(aws elbv2 create-target-group \
  --name coleren-ai-agent-tg \
  --protocol HTTP --port 8000 \
  --vpc-id $VPC_ID --target-type ip \
  --health-check-path /health --matcher HttpCode=200 \
  --query "TargetGroups[0].TargetGroupArn" --output text --region $REGION)

BACKEND_TG_ARN=$(aws elbv2 create-target-group \
  --name coleren-backend-tg \
  --protocol HTTP --port 5050 \
  --vpc-id $VPC_ID --target-type ip \
  --health-check-path /health --matcher HttpCode=200 \
  --query "TargetGroups[0].TargetGroupArn" --output text --region $REGION)

echo "Target groups created"

# ── Recreate listener + routing rules ────────────────────────────────────────
LISTENER_ARN=$(aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP --port 80 \
  --default-actions "Type=forward,TargetGroupArn=$BACKEND_TG_ARN" \
  --query "Listeners[0].ListenerArn" --output text --region $REGION)

aws elbv2 create-rule \
  --listener-arn $LISTENER_ARN \
  --conditions 'Field=path-pattern,Values=["/ask"]' \
  --priority 10 \
  --actions "Type=forward,TargetGroupArn=$AI_TG_ARN" \
  --region $REGION > /dev/null

aws elbv2 create-rule \
  --listener-arn $LISTENER_ARN \
  --conditions 'Field=path-pattern,Values=["/api/*"]' \
  --priority 20 \
  --actions "Type=forward,TargetGroupArn=$BACKEND_TG_ARN" \
  --region $REGION > /dev/null

echo "Listener and routing rules created"

# ── Recreate ECS services with new target groups ──────────────────────────────
TASKS_SG=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=coleren-tasks-sg" "Name=vpc-id,Values=$VPC_ID" \
  --query "SecurityGroups[0].GroupId" --output text --region $REGION)

aws ecs create-service \
  --cluster $CLUSTER \
  --service-name coleren-ai-agent-service \
  --task-definition coleren-ai-agent \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_LIST],securityGroups=[$TASKS_SG],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$AI_TG_ARN,containerName=ai-agent,containerPort=8000" \
  --region $REGION > /dev/null

aws ecs create-service \
  --cluster $CLUSTER \
  --service-name coleren-backend-service \
  --task-definition coleren-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_LIST],securityGroups=[$TASKS_SG],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$BACKEND_TG_ARN,containerName=backend,containerPort=5050" \
  --region $REGION > /dev/null

# ── Update CloudFront origin to new ALB ──────────────────────────────────────
CF_ID="E2VJKND1NYOUDO"
echo "Updating CloudFront origin..."
ETAG=$(aws cloudfront get-distribution-config --id $CF_ID --query "ETag" --output text)
aws cloudfront get-distribution-config --id $CF_ID --query "DistributionConfig" > /tmp/cf-config.json
python3 -c "
import json
with open('/tmp/cf-config.json') as f:
    config = json.load(f)
config['Origins']['Items'][0]['DomainName'] = '${ALB_DNS}'
with open('/tmp/cf-config.json', 'w') as f:
    json.dump(config, f)
"
aws cloudfront update-distribution --id $CF_ID --if-match "$ETAG" \
  --distribution-config file:///tmp/cf-config.json > /dev/null
echo "CloudFront updated (takes ~5 min to propagate)"

echo ""
echo "Resumed!"
echo "CloudFront URL (unchanged): https://dcqw9757o5e4m.cloudfront.net"
echo "Frontend .env.production is already correct — no changes needed."
echo "Wait ~5 minutes for CloudFront to propagate, then the site will work."
