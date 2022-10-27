import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import * as crypto from 'crypto';
import * as dotenv from "dotenv";
import * as path from 'path';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { AttributeValue, DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

if (process.env.ENVIRONMENT == null) {
    dotenv.config({
        path: path.resolve(__dirname, '../.env.local')
    });
}

const QUEUE_URL = process.env.DATA_PROCESSING_QUEUE_URL ?? '';
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME ?? '';

const sqsClient = new SQSClient({});
const dynamoDbClient = new DynamoDBClient({});

interface CountryPredictionApiBody {
    country: string, 
    numOfYears: number, 
    jobId: string
}


export const countryPredictionHandler = async (event: APIGatewayEvent , context: Context): Promise<APIGatewayProxyResult> => {
    const token = crypto.randomBytes(64).toString('hex');

    const messageBody: CountryPredictionApiBody = JSON.parse(event.body ?? '{}') as CountryPredictionApiBody;
    
    messageBody.jobId = token;

    const sqsCommand = new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(messageBody)
    });

    const tasks = [storeJobId(token), sqsClient.send(sqsCommand)]

    await Promise.all(tasks);

    const result: APIGatewayProxyResult = {
        statusCode: 200, 
        body: JSON.stringify(messageBody)
    };

    return result
}



async function storeJobId(jobId: string) {
    const items: Record<string, AttributeValue> = {
        'JobId': {
            "S": jobId
        },
        'isComplete': {
            "BOOL": false
        }
    };

    const putItemInput = {
        TableName: DYNAMODB_TABLE_NAME,
        Item: items
    };

    const putItemCommand: PutItemCommand = new PutItemCommand(putItemInput);

    await dynamoDbClient.send(putItemCommand);
}