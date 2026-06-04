#!/usr/bin/env bash
# Stops ECS tasks and deletes the ALB to minimize costs.
# Run resume.sh to bring everything back up.
set -euo pipefail

REGION=${AWS_REGION:-us-east-1}
CLUSTER="coleren-cluster"

echo "Deleting ECS services..."
aws ecs delete-service --cluster $CLUSTER --service coleren-backend-service  --force --region $REGION > /dev/null 2>/dev/null || true
aws ecs delete-service --cluster $CLUSTER --service coleren-ai-agent-service --force --region $REGION > /dev/null 2>/dev/null || true
echo "Services deleted"

echo "Deleting ALB..."
ALB_ARN=$(aws elbv2 describe-load-balancers \
  --names coleren-alb \
  --query "LoadBalancers[0].LoadBalancerArn" --output text --region $REGION 2>/dev/null || echo "")

if [ -z "$ALB_ARN" ] || [ "$ALB_ARN" = "None" ]; then
  echo "ALB not found — already deleted"
else
  # Delete listener first (rules are auto-deleted with listener)
  LISTENER_ARN=$(aws elbv2 describe-listeners \
    --load-balancer-arn $ALB_ARN \
    --query "Listeners[0].ListenerArn" --output text --region $REGION)
  aws elbv2 delete-listener --listener-arn $LISTENER_ARN --region $REGION
  aws elbv2 delete-load-balancer --load-balancer-arn $ALB_ARN --region $REGION
  echo "Waiting for ALB to finish deleting..."
  aws elbv2 wait load-balancers-deleted --load-balancer-arns $ALB_ARN --region $REGION
  echo "ALB deleted"
fi

echo "Deleting target groups..."
for TG in coleren-ai-agent-tg coleren-backend-tg; do
  TG_ARN=$(aws elbv2 describe-target-groups \
    --names $TG \
    --query "TargetGroups[0].TargetGroupArn" --output text --region $REGION 2>/dev/null || echo "")
  if [ -n "$TG_ARN" ] && [ "$TG_ARN" != "None" ]; then
    aws elbv2 delete-target-group --target-group-arn $TG_ARN --region $REGION
    echo "Deleted $TG"
  fi
done

echo ""
echo "Paused. Fargate and ALB costs are now zero."
echo "Run resume.sh to bring everything back up."
