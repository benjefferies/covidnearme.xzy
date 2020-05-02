import json
import requests
import boto3

bucket = "covidnear.me"
cases_key = "coronavirus-cases.json"
districts_key = "districts.json"


def handler(event, context):
    s3 = boto3.client('s3')
    response = requests.get("https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json")
    data = response.json()
    districts = set()
    for case in data["utlas"]:
        districts.add(case["areaName"])
    s3.put_object(Bucket=bucket, Key=cases_key, Body=bytes(json.dumps(data), "UTF-8"))
    s3.put_object(Bucket=bucket, Key=districts_key, Body=bytes(json.dumps(list(districts)), "UTF-8"))
