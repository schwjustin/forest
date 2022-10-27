import { Construct } from "constructs";
import {
    aws_sqs as sqs, 
    aws_lambda as lambda, 
    Duration
} from 'aws-cdk-lib'
import * as path from 'path';

interface CountryImageProps {
};

export class CountryImage extends Construct {
    countryImageDataProcessingQueue: sqs.Queue;
    countryImageApiLambda: lambda.Function

    constructor(scope: Construct, id: string, props: CountryImageProps) {
        super(scope, id);

        this.countryImageDataProcessingQueue = new sqs.Queue(this, 'countryImageDataProcessingQueue');

        this.countryImageApiLambda = new lambda.Function(this, 'countryPredictionLambda',{
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromDockerBuild(path.resolve(__dirname, './'), {
                file: "dockerfile"
            }),
            handler: 'index.countryPredictionHandler', 
            environment: {
                "DATA_PROCESSING_QUEUE_URL": this.countryImageDataProcessingQueue.queueUrl
            }, 
            timeout: Duration.seconds(30)
        });

        this.countryImageDataProcessingQueue.grantSendMessages(this.countryImageApiLambda)

    }
}