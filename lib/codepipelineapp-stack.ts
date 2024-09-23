import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { MyAppStage } from './my-app-stage'; // AppStage containing Lambda and S3 stacks

export class CodepipelineappStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the pipeline
    const pipeline = new CodePipeline(this, 'Pipeline8', {
      pipelineName: 'MyS3LambdaPipeline8',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('chinnachaitanya/cdkcodepipe', 'main'),
        commands: [
          'npm ci',                  // Install dependencies
          'npm run build',            // Build the app
          'npx cdk synth'             // Synthesize CloudFormation template
        ],
      }),
    });

    // // Add test stage (Deploy Lambda & S3 stacks)
    // const testStage = pipeline.addStage(new MyAppStage(this, 'TestStage', {
    //   env: {
    //     account: process.env.CDK_DEFAULT_ACCOUNT,
    //     region: process.env.CDK_DEFAULT_REGION,
    //   },
    // }));

    // // Optional steps before or after deployment
    // testStage.addPre(new ShellStep('RunUnitTests', { commands: ['npm test'] })); // Pre-deployment steps like unit tests

    // Add production stage (Deploy Lambda & S3 stacks)
    const prodStage = pipeline.addStage(new MyAppStage(this, 'ProdStage', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    }));

    // Add manual approval before production deployment
    prodStage.addPre(new ShellStep('ManualApproval', {
      commands: ['echo "Manually approve the deployment to production"'],
    }));
  }
}