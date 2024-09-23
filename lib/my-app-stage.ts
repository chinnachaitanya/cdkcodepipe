import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaStack } from './lambda-stack';  // Lambda stack
import { S3Stack } from './s3-stack';          // S3 stack
import * as fs from 'fs';
import * as path from 'path';

export class MyAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);

    // Load configuration specific to the environment
    const configFilePath = path.join(__dirname, `../config/config-test.json`);
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

    // Add Lambda and S3 stacks to this stage
    new LambdaStack(this, 'LambdaStack8', {
        sourceBucketName: config.sourceBucketName,
        destinationBucketName: config.destinationBucketName,
        env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.CDK_DEFAULT_REGION,
        }
    }); // Define Lambda stack
    new S3Stack(this, 'S3Stack8', {
        sourceBucketName: config.sourceBucketName,
        destinationBucketName: config.destinationBucketName,
        env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.CDK_DEFAULT_REGION,
        }
    });       // Define S3 stack
  }
}
