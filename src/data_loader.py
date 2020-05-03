import json
import requests
import boto3

bucket = "covidnear.me"
cases_key = "coronavirus-cases.json"
districts_key = "districts.json"


def handler(event, context):
    s3 = boto3.client('s3')
    print("Downloading latest cases")
    response = requests.get("https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json")
    data = response.json()
    districts = set()
    print("Extracting districts")
    for case in data["utlas"]:
        districts.add(case["areaName"])
    print("Uploading cases")
    s3.put_object(Bucket=bucket, Key=cases_key, Body=bytes(json.dumps(data), "UTF-8"))
    print("Uploading districts")
    s3.put_object(Bucket=bucket, Key=districts_key, Body=bytes(json.dumps(list(districts)), "UTF-8"))
    print("Completed")
