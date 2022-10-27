import asyncio
import aiohttp
import pandas as pd
import certifi
import ssl
from io import StringIO
import os
import boto3
from dotenv import load_dotenv
from dalle2 import Dalle2
import json

load_dotenv('./.env.local')

dynamoDbClient = boto3.resource('dynamodb')

ADDRESS = os.environ.get('API_ENDPOINT')
S3_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')
DALLE_BEARER = os.environ.get('DALLE_BEARER')
# KEY NAME is the jobId 
# S3_KEY_NAME = os.environ.get('S3_KEY_NAME')

loop = asyncio.get_event_loop()


dalle = Dalle2(DALLE_BEARER)

async def getDalleImage(prompt: str):
    generations = dalle.generate(prompt=prompt)
    return generations

def createPrompt(country, years, percent):
    return "aerial view of " + country + " forest " + years + " years nito the futre with " + percent + "% less foliage due to deforestation" 

async def mark_complete(jobId: str, generationLink: str, dynamoDbClient = dynamoDbClient):
    # Specify the table
    devices_table = dynamoDbClient.Table('Devices')
    response = devices_table.put_item(
        Item={
            'JobId': jobId,
            'isComplete': True, 
            'link': generationLink
        }
    )
    return response


async def asyncHandler(event: any, context: any):
    for sqsRecord in event['Records']:
        messageBody = json.loads(sqsRecord['body'])
        prompt = createPrompt(messageBody['country'], str(messageBody['numOfYears']), str(messageBody['foilage']))
        generations = getDalleImage(prompt=prompt)
        await mark_complete(messageBody['jobId'], generations)

    return {
        'statusCode': 200
    }

def handler(event, context):
    return loop.run_until_complete(asyncHandler(event, context))

print(handler({
    "Records": [{
        "body": "{\"jobId\":\"ee3278d031667d79fdf4f04ba84510a144290de5ba75b3b598fe2f9e168f3a695e598fada4224b4394642519b5a07240f6a834f779a1aa1d18d7e9f9f8f087ce\",\"country\":\"Uruguay\",\"numOfYears\":600,\"foilage\":0.9999981930125694}"
    }]
}, None))