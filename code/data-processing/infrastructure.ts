import { Construct } from "constructs";
import {
    aws_sqs as sqs
} from 'aws-cdk-lib'
import { DalleGenImage } from "./dalle-gen-image/infrastructure";
import { CountryPercentageChange } from "./country-percentage-change/infrastructure";
import { CountryImage } from "../web-api/country-prediction/infrastructure";
interface DataProcessingProps {
    countryImage: CountryImage;
};

export class DataProcessing extends Construct {
    constructor(scope: Construct, id: string, props: DataProcessingProps) {
        super(scope, id);

        const countryPercentageChange = new CountryPercentageChange(this, 'country-percentage-change', {
            countryDataProcessingQueue: props.countryImage.countryImageDataProcessingQueue, 
            jobTable: props.countryImage.jobTable
        });

        const dalleGenImage = new DalleGenImage(this, 'dalle-gen-image', {
            dalleQueue: countryPercentageChange.dalleGenQueue
        });

    }
}