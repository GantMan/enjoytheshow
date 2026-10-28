#!/usr/bin/env bash
# AppSync API keys expire after at most 365 days, which is what took the site
# down. This installs a Lambda that pushes every key on the API out another
# year, run monthly by an EventBridge rule. Safe to re-run (e.g. in CloudShell).
set -euo pipefail

API_ID="${API_ID:-f6gwcwcbmbazflkwwr3h6uypne}" # facefun-prod
REGION="${AWS_REGION:-us-east-1}"
NAME=enjoyingtheshow-renew-api-key
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
WORK=$(mktemp -d)

cat > "$WORK/index.py" <<PY
import time, boto3

API_ID = "$API_ID"
appsync = boto3.client("appsync")

def handler(event, context):
    # AppSync requires an hour-aligned expiry no more than 365 days out
    expires = int((time.time() + 364 * 86400) // 3600 * 3600)
    keys = appsync.list_api_keys(apiId=API_ID)["apiKeys"]
    for key in keys:
        appsync.update_api_key(apiId=API_ID, id=key["id"], expires=expires)
    return {"renewed": [k["id"] for k in keys], "expires": expires}
PY
(cd "$WORK" && zip -q fn.zip index.py)

if ! aws iam get-role --role-name "$NAME" >/dev/null 2>&1; then
  aws iam create-role --role-name "$NAME" --assume-role-policy-document \
    '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' >/dev/null
  aws iam attach-role-policy --role-name "$NAME" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  sleep 10 # let the new role propagate before Lambda uses it
fi
aws iam put-role-policy --role-name "$NAME" --policy-name appsync-api-keys --policy-document \
  "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"appsync:ListApiKeys\",\"appsync:UpdateApiKey\"],\"Resource\":[\"arn:aws:appsync:$REGION:$ACCOUNT:apis/$API_ID*\",\"arn:aws:appsync:$REGION:$ACCOUNT:/v1/apis/$API_ID/*\"]}]}"

if aws lambda get-function --function-name "$NAME" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$NAME" --zip-file "fileb://$WORK/fn.zip" >/dev/null
else
  aws lambda create-function --function-name "$NAME" --runtime python3.13 --handler index.handler \
    --role "arn:aws:iam::$ACCOUNT:role/$NAME" --zip-file "fileb://$WORK/fn.zip" --timeout 30 >/dev/null
  aws lambda wait function-active-v2 --function-name "$NAME"
fi

RULE_ARN=$(aws events put-rule --name "$NAME" --schedule-expression 'rate(30 days)' \
  --description 'Keep the enjoyingthe.show AppSync API key from expiring' --query RuleArn --output text)
aws lambda add-permission --function-name "$NAME" --statement-id events-invoke \
  --action lambda:InvokeFunction --principal events.amazonaws.com --source-arn "$RULE_ARN" >/dev/null 2>&1 || true
aws events put-targets --rule "$NAME" \
  --targets "Id=1,Arn=arn:aws:lambda:$REGION:$ACCOUNT:function:$NAME" >/dev/null

sleep 10 # let the policy change propagate
echo "Renewing now:"
aws lambda invoke --function-name "$NAME" "$WORK/out.json" >/dev/null && cat "$WORK/out.json" && echo
