import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DataProcessing } from './data-processing/infrastructure';
import { WebApi } from './web-api/infrastructure';

export class CodeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const webApi = new WebApi(this, 'web-api', {});

    const dataProcessing = new DataProcessing(this, 'data-processing', {
      countryImage: webApi.countryImage
    })

  }
}
