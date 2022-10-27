import { Context, SQSEvent } from 'aws-lambda'
import * as dotenv from "dotenv";
import * as path from 'path';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { AttributeValue, DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import * as fs from 'fs';


if (process.env.ENVIRONMENT == null) {
    dotenv.config({
        path: path.resolve(__dirname, '../.env.local')
    });
}

const QUEUE_URL = process.env.DALLE_QUEUE_URL ?? '';
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME ?? '';

const sqsClient = new SQSClient({});
const dynamoDbClient = new DynamoDBClient({});

interface CountryPredictionApiBody {
    country: string, 
    numOfYears: number, 
    jobId: string
};

interface ForestDatum {
    Entity: string, 
    Code: string, 
    Year: number, 
    'Conversion as share of forest area': number
};

export const processPercentChange = async (event: any , context: Context) => {
    var forestData: ForestDatum[] = JSON.parse(fs.readFileSync('./process_csv/change-forest-area-share-total.json', 'utf-8'));

    const taskList: Promise<any>[] = [];

    for (const sqsRecord of event.Records) {
        try {
            const body = JSON.parse(sqsRecord.body);

            const country: string = body.country;
            const numOfYears = body.numOfYears;
            const jobId = body.jobId;

            const countryForestDatum = forestData.filter((item) => item.Entity.toLowerCase() == country.toLowerCase()).sort((a, b) => b.Year - a.Year)[0];

            const foilage = 1 - Math.pow((1 - (countryForestDatum['Conversion as share of forest area']/100)), numOfYears);

            const messageBody = {
                jobId: jobId, 
                country: country, 
                numOfYears: numOfYears, 
                foilage: foilage
            }

            const sqsCommand = new SendMessageCommand({
                QueueUrl: QUEUE_URL,
                MessageBody: JSON.stringify(messageBody)
            });
        
            taskList.push(sqsClient.send(sqsCommand));
            

        } catch (e) {
            const body = JSON.parse(sqsRecord.body);
            const jobId = body.jobId;
            console.log('job failed');
            failJob(jobId)
        }
    }

    await Promise.all(taskList);

    return {
        statusCode: 200
    };
}



async function failJob(jobId: string) {
    const items: Record<string, AttributeValue> = {
        'JobId': {
            "S": jobId
        },
        'isComplete': {
            "BOOL": false
        }, 
        'failed': {
            "BOOL": true
        }
    };

    const putItemInput = {
        TableName: DYNAMODB_TABLE_NAME,
        Item: items
    };

    const putItemCommand: PutItemCommand = new PutItemCommand(putItemInput);

    await dynamoDbClient.send(putItemCommand);
}

processPercentChange({
    Records: [{
        messageId: "", 
        receiptHandle: "", 
        body: "{\"country\":\"Uruguay\",\"numOfYears\":600,\"jobId\":\"ee3278d031667d79fdf4f04ba84510a144290de5ba75b3b598fe2f9e168f3a695e598fada4224b4394642519b5a07240f6a834f779a1aa1d18d7e9f9f8f087ce\"}"

    }]
}, {
    callbackWaitsForEmptyEventLoop: false,
    functionName: '',
    functionVersion: '',
    invokedFunctionArn: '',
    memoryLimitInMB: '',
    awsRequestId: '',
    logGroupName: '',
    logStreamName: '',
    getRemainingTimeInMillis: function (): number {
        throw new Error('Function not implemented.');
    },
    done: function (error?: Error | undefined, result?: any): void {
        throw new Error('Function not implemented.');
    },
    fail: function (error: string | Error): void {
        throw new Error('Function not implemented.');
    },
    succeed: function (messageOrObject: any): void {
        throw new Error('Function not implemented.');
    }
});