import { Construct } from "constructs";
import {
    aws_sqs as sqs, 
    aws_lambda as lambda,
    aws_dynamodb as dynamodb, 
    Duration
} from 'aws-cdk-lib'
import * as path from 'path';

interface CountryImageProps {
};

export class CountryImage extends Construct {
    countryImageDataProcessingQueue: sqs.Queue;
    countryImageApiLambda: lambda.Function;
    jobTable: dynamodb.Table;

    constructor(scope: Construct, id: string, props: CountryImageProps) {
        super(scope, id);

        this.countryImageDataProcessingQueue = new sqs.Queue(this, 'countryImageDataProcessingQueue');

        this.jobTable = new dynamodb.Table(this, 'jobTable', {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
            partitionKey: {
                name: "JobId", 
                type: dynamodb.AttributeType.STRING
            }
        })

        this.countryImageApiLambda = new lambda.Function(this, 'countryPredictionLambda',{
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromDockerBuild(path.resolve(__dirname, './'), {
                file: "dockerfile"
            }),
            handler: 'index.countryPredictionHandler', 
            environment: {
                "DATA_PROCESSING_QUEUE_URL": this.countryImageDataProcessingQueue.queueUrl, 
                "DYNAMODB_TABLE_NAME": this.jobTable.tableName
            }, 
            timeout: Duration.seconds(30)
        });

        this.jobTable.grantReadWriteData(this.countryImageApiLambda);

        this.countryImageDataProcessingQueue.grantSendMessages(this.countryImageApiLambda);

    }
}