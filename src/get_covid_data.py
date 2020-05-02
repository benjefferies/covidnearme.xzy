import json
import boto3

bucket = "covidnear.me"
key = "coronavirus-cases.json"


def handler(event, context):
    print(event)
    s3 = boto3.client('s3')
    covid_data_obj = s3.get_object(Bucket=bucket, Key=key)
    covid_data = json.loads(covid_data_obj['Body'].read())
    if "district" not in event["queryStringParameters"]:
        return {
            "statusCode": 400,
            "body": "Must provide district"
        }
    district = event["queryStringParameters"]["district"]
    district_cases = []
    for case in covid_data["utlas"]:
        if case["areaName"] == district:
            district_cases.append({
                "date": case["specimenDate"],
                "daily": case["dailyLabConfirmedCases"],
                "total": case["totalLabConfirmedCases"],
            })

    response = {
        "statusCode": 200,
        "headers": {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': True,
        },
        "body": json.dumps(district_cases)
    }

    return response