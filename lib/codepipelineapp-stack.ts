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
        input: CodePipelineSource.gitHub('chinnachaitanya/cdkcodepipe', 'main'), // Update with your GitHub repo
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

    // // Optionally, add additional steps before or after deployment
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

// ------------------------------------------------------------------------------

// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
// import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
// import * as codebuild from 'aws-cdk-lib/aws-codebuild';

// interface PipelineStackProps extends cdk.StackProps {
//   sourceAction: codepipeline_actions.Action;
//   sourceOutput: codepipeline.Artifact;
// }

// export class CodepipelineappStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props: PipelineStackProps) {
//     super(scope, id, props);

//     const { sourceAction, sourceOutput } = props;

//     // Define the pipeline
//     const pipeline = new codepipeline.Pipeline(this, 'MyPipeline7', {
//       pipelineName: 'MyS3LambdaPipeline7',
//     });

//     // Add the source stage to the pipeline (GitHub)
//     pipeline.addStage({
//       stageName: 'Source',
//       actions: [sourceAction],
//     });

//     // Define the build stage (optional, if Lambda assets need building)
//     const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
//       buildSpec: codebuild.BuildSpec.fromObject({
//         version: 0.2,
//         phases: {
//           install: {
//             'runtime-versions': {nodejs: '14',},
//             commands: ['npm install', 'npm install -g aws-cdk '],
//           },
//           build: {
//             commands: ['npm run build', 'cdk synth --output ./cdk.out',
//               'echo "The template path is: ${CODEBUILD_SRC_DIR}/cdk1.out/LambdaStack4-test.template.json"',
//               'ls -l ${CODEBUILD_SRC_DIR}/cdk1.out/LambdaStack4-test.template.json', // List file details
//             ],
//           },
//         },
//         artifacts: {
//           'base-directory': 'cdk.out',
//           files: ['**/*'],
//         },
//       }),
//       environment: {
//         buildImage: codebuild.LinuxBuildImage.STANDARD_6_0, // Use managed image standard 6.0
//       },
//     });

//     // Add build stage to the pipeline
//     pipeline.addStage({
//       stageName: 'Build',
//       actions: [
//         new codepipeline_actions.CodeBuildAction({
//           actionName: 'Build',
//           project: buildProject,
//           input: sourceOutput,
//         }),
//       ],
//     });

    
//     // Define the deploy stage for Lambda and S3 stacks
//     pipeline.addStage({
//       stageName: 'Deploy',
//       actions: [
//         new codepipeline_actions.CloudFormationCreateUpdateStackAction({
//           actionName: 'S3_Stack_Deploy',
//           stackName: 'S3Stack7-test',
//           templatePath: sourceOutput.atPath('cdk.out/S3Stack7-test.template.json'),
//           adminPermissions: true,
//         }),
        
//         new codepipeline_actions.CloudFormationCreateUpdateStackAction({
//           actionName: 'Lambda_Stack_Deploy',
//           stackName: 'LambdaStack7-test',
//           templatePath: sourceOutput.atPath('cdk.out/LambdaStack7-test.template.json'),
//           adminPermissions: true,
//         }),
//       ],
//     });
//   }
// }

//done comment new