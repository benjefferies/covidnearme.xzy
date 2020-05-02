import json
import boto3

bucket = "covidnear.me"
key = "districts.json"


def handler(event, context):
    print(event)
    s3 = boto3.client('s3')
    districts_obj = s3.get_object(Bucket=bucket, Key=key)
    return {
        "statusCode": 200,
        "headers": {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': True,
        },
        "body": json.dumps(json.loads(districts_obj['Body'].read()))
    }