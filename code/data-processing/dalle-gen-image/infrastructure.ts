import { Construct } from "constructs";
import { 
    aws_lambda as lambda,
    aws_sqs as sqs, 
    aws_s3 as s3,
    aws_dynamodb as dynamodb, 
    Duration,
    aws_lambda_event_sources as events
} from "aws-cdk-lib";
import * as path from 'path';

interface DalleGenImageProps {
    dalleQueue: sqs.Queue;
    jobTable: dynamodb.Table
};


export class DalleGenImage extends Construct {
    constructor(scope: Construct, id: string, props: DalleGenImageProps) {
        super(scope, id);

        const layer = lambda.LayerVersion.fromLayerVersionArn( this, 'pandasLayer', 'arn:aws:lambda:us-east-1:336392948345:layer:AWSSDKPandas-Python38:1' );

        const dalleGenImageLambda = new lambda.Function(this, 'CsvToApiLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromDockerBuild(path.resolve(__dirname, './'), {
                file: "dockerfile"
            }),
            handler: 'app.handler', 
            environment: {
                "DYNAMODB_TABLE_NAME": props.jobTable.tableName,
                "DALLE_BEARER": process.env.DALLE_KEY ?? ''
            }, 
            memorySize: 512,
            timeout: Duration.seconds(60),
            layers: [layer], 
            events: [
                new events.SqsEventSource(props.dalleQueue, {
                    batchSize: 1
                })
            ]
        });

        props.jobTable.grantReadWriteData(dalleGenImageLambda);

        props.dalleQueue.grantConsumeMessages(dalleGenImageLambda);

    }
}