import { Construct } from "constructs";
import {
    aws_sqs as sqs, 
    aws_s3 as s3
} from 'aws-cdk-lib'
interface DalleGenImageProps {
    dalleQueue: sqs.Queue;
};

export class DalleGenImage extends Construct {
    constructor(scope: Construct, id: string, props: DalleGenImageProps) {
        super(scope, id);

        const dalleImageOutputBucket = new s3.Bucket(this, 'dalle-Output', {
            publicReadAccess: true
        });
        
    }
}