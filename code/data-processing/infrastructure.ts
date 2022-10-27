import { Construct } from "constructs";
import {
    aws_sqs as sqs
} from 'aws-cdk-lib'
interface WebApiProps {
};

export class WebApi extends Construct {
    countryDataProcessingQueue: sqs.Queue;

    constructor(scope: Construct, id: string, props: WebApiProps) {
        super(scope, id);

        
    }
}