#!/usr/bin/env bash
# One-time AWS infrastructure setup for Coleren.
# Run this once from your machine (requires AWS CLI + sufficient IAM permissions).
# After this completes: fill in SSM params, add GitHub secrets, then push to main.
set -euo pipefail

REGION=${AWS_REGION:-us-east-1}
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
CLUSTER_NAME="coleren-cluster"
AI_AGENT_REPO="coleren-ai-agent"
BACKEND_REPO="coleren-backend"
AI_AGENT_SERVICE="coleren-ai-agent-service"
BACKEND_SERVICE="coleren-backend-service"
LOG_GROUP="/ecs/coleren"
ECR_BASE="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "Account: $ACCOUNT_ID  Region: $REGION"

# ── Default VPC & subnets ─────────────────────────────────────────────────────
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=isDefault,Values=true" \
  --query "Vpcs[0].VpcId" --output text --region "$REGION")
echo "VPC: $VPC_ID"

SUBNET_IDS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query "Subnets[*].SubnetId" --output text --region "$REGION")
SUBNET_ARRAY=($SUBNET_IDS)
SUBNET_LIST=$(IFS=,; echo "${SUBNET_ARRAY[*]}")
echo "Subnets: $SUBNET_LIST"

# ── Security groups ───────────────────────────────────────────────────────────
ALB_SG=$(aws ec2 create-security-group \
  --group-name "coleren-alb-sg" \
  --description "Coleren ALB" \
  --vpc-id "$VPC_ID" \
  --query GroupId --output text --region "$REGION")
aws ec2 authorize-security-group-ingress \
  --group-id "$ALB_SG" --protocol tcp --port 80 --cidr 0.0.0.0/0 --region "$REGION"
echo "ALB SG: $ALB_SG"

TASKS_SG=$(aws ec2 create-security-group \
  --group-name "coleren-tasks-sg" \
  --description "Coleren ECS Tasks" \
  --vpc-id "$VPC_ID" \
  --query GroupId --output text --region "$REGION")
aws ec2 authorize-security-group-ingress \
  --group-id "$TASKS_SG" --protocol tcp --port 8000 \
  --source-group "$ALB_SG" --region "$REGION"
aws ec2 authorize-security-group-ingress \
  --group-id "$TASKS_SG" --protocol tcp --port 5050 \
  --source-group "$ALB_SG" --region "$REGION"
echo "Tasks SG: $TASKS_SG"

# ── ECR repositories ──────────────────────────────────────────────────────────
aws ecr create-repository --repository-name "$AI_AGENT_REPO" --region "$REGION" 2>/dev/null || true
aws ecr create-repository --repository-name "$BACKEND_REPO"  --region "$REGION" 2>/dev/null || true
echo "ECR repos ready"

# ── ECS cluster ───────────────────────────────────────────────────────────────
aws ecs create-cluster --cluster-name "$CLUSTER_NAME" --region "$REGION" > /dev/null
echo "ECS cluster: $CLUSTER_NAME"

# ── CloudWatch log group ──────────────────────────────────────────────────────
aws logs create-log-group --log-group-name "$LOG_GROUP" --region "$REGION" 2>/dev/null || true
echo "Log group: $LOG_GROUP"

# ── IAM task execution role ───────────────────────────────────────────────────
aws iam create-role \
  --role-name ecsTaskExecutionRole-coleren \
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":{"Service":"ecs-tasks.amazonaws.com"},
      "Action":"sts:AssumeRole"
    }]
  }' 2>/dev/null || true

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole-coleren \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole-coleren \
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess

EXEC_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/ecsTaskExecutionRole-coleren"
echo "Exec role: $EXEC_ROLE_ARN"

# ── SSM Parameter Store placeholders ─────────────────────────────────────────
# Fill these in via AWS Console → SSM → Parameter Store before first deploy.
for PARAM in MONGO_URI SECRET_ACCESS_TOKEN GEMINI_API_KEY EMAIL_USER EMAIL_PASS FIREBASE_PROJECT_ID FIREBASE_CLIENT_EMAIL FIREBASE_PRIVATE_KEY FRONTEND_URL; do
  aws ssm put-parameter \
    --name "/coleren/$PARAM" \
    --value "REPLACE_ME" \
    --type SecureString \
    --region "$REGION" 2>/dev/null || true
done
echo "SSM placeholders created at /coleren/*  <-- fill these before deploying"

# ── Application Load Balancer ─────────────────────────────────────────────────
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name coleren-alb \
  --subnets "${SUBNET_ARRAY[@]}" \
  --security-groups "$ALB_SG" \
  --scheme internet-facing \
  --type application \
  --query "LoadBalancers[0].LoadBalancerArn" --output text --region "$REGION")
echo "ALB ARN: $ALB_ARN"

ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns "$ALB_ARN" \
  --query "LoadBalancers[0].DNSName" --output text --region "$REGION")
echo "ALB DNS: $ALB_DNS"

# ── Target groups ─────────────────────────────────────────────────────────────
AI_TG_ARN=$(aws elbv2 create-target-group \
  --name coleren-ai-agent-tg \
  --protocol HTTP --port 8000 \
  --vpc-id "$VPC_ID" \
  --target-type ip \
  --health-check-path /health \
  --matcher HttpCode=200 \
  --query "TargetGroups[0].TargetGroupArn" --output text --region "$REGION")
echo "AI Agent TG: $AI_TG_ARN"

BACKEND_TG_ARN=$(aws elbv2 create-target-group \
  --name coleren-backend-tg \
  --protocol HTTP --port 5050 \
  --vpc-id "$VPC_ID" \
  --target-type ip \
  --health-check-path /health \
  --matcher HttpCode=200 \
  --query "TargetGroups[0].TargetGroupArn" --output text --region "$REGION")
echo "Backend TG: $BACKEND_TG_ARN"

# ── Listener + routing rules ──────────────────────────────────────────────────
LISTENER_ARN=$(aws elbv2 create-listener \
  --load-balancer-arn "$ALB_ARN" \
  --protocol HTTP --port 80 \
  --default-actions "Type=forward,TargetGroupArn=$BACKEND_TG_ARN" \
  --query "Listeners[0].ListenerArn" --output text --region "$REGION")
echo "Listener: $LISTENER_ARN"

# /ask  → ai-agent
aws elbv2 create-rule \
  --listener-arn "$LISTENER_ARN" \
  --conditions 'Field=path-pattern,Values=["/ask"]' \
  --priority 10 \
  --actions "Type=forward,TargetGroupArn=$AI_TG_ARN" \
  --region "$REGION" > /dev/null
echo "Rule: /ask → ai-agent"

# /api/* → backend (default already covers this, but explicit is cleaner)
aws elbv2 create-rule \
  --listener-arn "$LISTENER_ARN" \
  --conditions 'Field=path-pattern,Values=["/api/*"]' \
  --priority 20 \
  --actions "Type=forward,TargetGroupArn=$BACKEND_TG_ARN" \
  --region "$REGION" > /dev/null
echo "Rule: /api/* → backend"

# ── Task definitions ──────────────────────────────────────────────────────────
aws ecs register-task-definition \
  --family coleren-ai-agent \
  --network-mode awsvpc \
  --requires-compatibilities FARGATE \
  --cpu 512 --memory 1024 \
  --execution-role-arn "$EXEC_ROLE_ARN" \
  --container-definitions "[
    {
      \"name\": \"ai-agent\",
      \"image\": \"${ECR_BASE}/${AI_AGENT_REPO}:latest\",
      \"portMappings\": [{\"containerPort\": 8000, \"protocol\": \"tcp\"}],
      \"secrets\": [
        {\"name\": \"GEMINI_API_KEY\", \"valueFrom\": \"/coleren/GEMINI_API_KEY\"}
      ],
      \"environment\": [
        {\"name\": \"ALLOWED_ORIGINS\", \"value\": \"https://coleren-dapp.web.app\"}
      ],
      \"logConfiguration\": {
        \"logDriver\": \"awslogs\",
        \"options\": {
          \"awslogs-group\": \"${LOG_GROUP}\",
          \"awslogs-region\": \"${REGION}\",
          \"awslogs-stream-prefix\": \"ai-agent\"
        }
      }
    }
  ]" --region "$REGION" > /dev/null
echo "Task def registered: coleren-ai-agent"

aws ecs register-task-definition \
  --family coleren-backend \
  --network-mode awsvpc \
  --requires-compatibilities FARGATE \
  --cpu 512 --memory 1024 \
  --execution-role-arn "$EXEC_ROLE_ARN" \
  --container-definitions "[
    {
      \"name\": \"backend\",
      \"image\": \"${ECR_BASE}/${BACKEND_REPO}:latest\",
      \"portMappings\": [{\"containerPort\": 5050, \"protocol\": \"tcp\"}],
      \"secrets\": [
        {\"name\": \"MONGO_URI\",             \"valueFrom\": \"/coleren/MONGO_URI\"},
        {\"name\": \"SECRET_ACCESS_TOKEN\",   \"valueFrom\": \"/coleren/SECRET_ACCESS_TOKEN\"},
        {\"name\": \"EMAIL_USER\",            \"valueFrom\": \"/coleren/EMAIL_USER\"},
        {\"name\": \"EMAIL_PASS\",            \"valueFrom\": \"/coleren/EMAIL_PASS\"},
        {\"name\": \"FIREBASE_PROJECT_ID\",   \"valueFrom\": \"/coleren/FIREBASE_PROJECT_ID\"},
        {\"name\": \"FIREBASE_CLIENT_EMAIL\", \"valueFrom\": \"/coleren/FIREBASE_CLIENT_EMAIL\"},
        {\"name\": \"FIREBASE_PRIVATE_KEY\",  \"valueFrom\": \"/coleren/FIREBASE_PRIVATE_KEY\"},
        {\"name\": \"FRONTEND_URL\",          \"valueFrom\": \"/coleren/FRONTEND_URL\"}
      ],
      \"logConfiguration\": {
        \"logDriver\": \"awslogs\",
        \"options\": {
          \"awslogs-group\": \"${LOG_GROUP}\",
          \"awslogs-region\": \"${REGION}\",
          \"awslogs-stream-prefix\": \"backend\"
        }
      }
    }
  ]" --region "$REGION" > /dev/null
echo "Task def registered: coleren-backend"

# ── ECS services ──────────────────────────────────────────────────────────────
aws ecs create-service \
  --cluster "$CLUSTER_NAME" \
  --service-name "$AI_AGENT_SERVICE" \
  --task-definition coleren-ai-agent \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_LIST],securityGroups=[$TASKS_SG],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$AI_TG_ARN,containerName=ai-agent,containerPort=8000" \
  --region "$REGION" > /dev/null
echo "ECS service created: $AI_AGENT_SERVICE"

aws ecs create-service \
  --cluster "$CLUSTER_NAME" \
  --service-name "$BACKEND_SERVICE" \
  --task-definition coleren-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_LIST],securityGroups=[$TASKS_SG],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$BACKEND_TG_ARN,containerName=backend,containerPort=5050" \
  --region "$REGION" > /dev/null
echo "ECS service created: $BACKEND_SERVICE"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "Infrastructure ready!"
echo "ALB URL: http://$ALB_DNS"
echo ""
echo "Next steps:"
echo "  1. Go to AWS Console → SSM → Parameter Store → fill in /coleren/* values"
echo "  2. Add GitHub repository secrets:"
echo "       AWS_ACCESS_KEY_ID"
echo "       AWS_SECRET_ACCESS_KEY"
echo "       AWS_ACCOUNT_ID  (value: $ACCOUNT_ID)"
echo "  3. Update frontend API base URL to: http://$ALB_DNS"
echo "  4. Push to main — GitHub Actions will build, push images, and deploy"
