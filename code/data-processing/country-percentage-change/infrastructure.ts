import { Construct } from "constructs";
import {
    aws_sqs as sqs, 
    aws_s3 as s3,
    aws_lambda as lambda, 
    aws_dynamodb as dynamodb,
    Duration
} from 'aws-cdk-lib';
import * as path from 'path';

interface DalleGenImageProps {
    countryDataProcessingQueue: sqs.Queue;
    jobTable: dynamodb.Table
};

export class CountryPercentageChange extends Construct {
    dalleGenQueue: sqs.Queue;

    constructor(scope: Construct, id: string, props: DalleGenImageProps) {
        super(scope, id);

        this.dalleGenQueue = new sqs.Queue(this, 'country-percent-change');

        const countryPercentageChangeLambda = new lambda.Function(this, 'country-percent-change-lambda',{
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromDockerBuild(path.resolve(__dirname, './'), {
                file: "dockerfile"
            }),
            handler: 'index.processPercentChange', 
            environment: {
                "DALLE_QUEUE_URL": this.dalleGenQueue.queueUrl, 
                "DYNAMODB_TABLE_NAME": props.jobTable.tableName
            }, 
            timeout: Duration.seconds(30)
        });

        props.jobTable.grantReadWriteData(countryPercentageChangeLambda);

        this.dalleGenQueue.grantSendMessages(countryPercentageChangeLambda);
    }
}