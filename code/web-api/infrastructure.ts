import { Construct } from "constructs";
import {
    aws_sqs as sqs,
    aws_apigateway as apigateway
} from 'aws-cdk-lib';
import { CountryImage } from "./country-prediction/infrastructure";

interface WebApiProps {
};

export class WebApi extends Construct {
    countryImage: CountryImage;

    constructor(scope: Construct, id: string, props: WebApiProps) {
        super(scope, id);

        const apiGateway = new apigateway.RestApi(this, 'webApi', {
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS, 
                allowMethods: apigateway.Cors.ALL_METHODS
            }
        });

        const countryImageService = new CountryImage(this, 'countryImageService', {});
        this.countryImage = countryImageService;

        const countryImageApiIntegration = new apigateway.LambdaIntegration(countryImageService.countryImageApiLambda);

        apiGateway.root.addMethod('POST', countryImageApiIntegration);

    }
}