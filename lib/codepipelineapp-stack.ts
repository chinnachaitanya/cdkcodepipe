// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// // import * as sqs from 'aws-cdk-lib/aws-sqs';
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
//     const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
//       pipelineName: 'MyS3LambdaPipeline',
//     });

//     // Add the source stage to the pipeline (GitHub)
//     pipeline.addStage({
//       stageName: 'Source',
//       actions: [sourceAction],
//     });

//     // Define the build stage (optional, if Lambda assets need building)
//     const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
//       buildSpec: codebuild.BuildSpec.fromObject({
//         version: '0.2',
//         phases: {
//           install: {
//             commands: ['npm install'],
//           },
//           build: {
//             commands: ['npm run build'],
//           },
//         },
//         artifacts: {
//           'base-directory': 'dist',
//           files: ['**/*'],
//         },
//       }),
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
//           actionName: 'Lambda_Stack_Deploy',
//           stackName: 'LambdaStack',
//           templatePath: sourceOutput.atPath('LambdaStack.template.json'),
//           adminPermissions: true,
//         }),
//         new codepipeline_actions.CloudFormationCreateUpdateStackAction({
//           actionName: 'S3_Stack_Deploy',
//           stackName: 'S3Stack',
//           templatePath: sourceOutput.atPath('S3Stack.template.json'),
//           adminPermissions: true,
//         }),
//       ],
//     });
//     }
//     }
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

interface PipelineStackProps extends cdk.StackProps {
  sourceAction: codepipeline_actions.Action;
  sourceOutput: codepipeline.Artifact;
}

export class CodepipelineappStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const { sourceAction, sourceOutput } = props;

    // Define the pipeline
    const pipeline = new codepipeline.Pipeline(this, 'MyPipeline7', {
      pipelineName: 'MyS3LambdaPipeline7',
    });

    // Add the source stage to the pipeline (GitHub)
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    // const buildSpecYAML = `
    //     version: 0.2

    //     phases:
    //       install:
    //         runtime-versions:
    //           nodejs: 14
    //         commands:
    //           - npm install
    //           - npm install -g aws-cdk

    //       build:
    //         commands:
    //           - npm run build
    //           - cdk synth --output ./cdk.out

    //       post_build:
    //         commands:
    //           - echo Build completed on 'date'

    //     artifacts:
    //       base-directory: cdk.out
    //       files:
    //         - '**/*'

    //     # Optional cache section
    //     cache:
    //       paths:
    //         - 'node_modules/**/*'
    //     `;

    // const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
    //   buildSpec: codebuild.BuildSpec.fromSourceString(buildSpecYAML),
    // });


    // Define the build stage (optional, if Lambda assets need building)
    const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            'runtime-versions': {nodejs: '14',},
            commands: ['npm install', 'npm install -g aws-cdk '],
          },
          build: {
            commands: ['npm run build', 'cdk synth --output ./cdk1.out',
              'echo "The template path is: ${CODEBUILD_SRC_DIR}/cdk1.out/LambdaStack4-test.template.json"',
              'ls -l ${CODEBUILD_SRC_DIR}/cdk1.out/LambdaStack4-test.template.json', // List file details
            ],
          },
        },
        artifacts: {
          'base-directory': 'cdk.out',
          files: ['**/*'],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_6_0, // Use managed image standard 6.0
      },
    });

    // Add build stage to the pipeline
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'Build',
          project: buildProject,
          input: sourceOutput,
        }),
      ],
    });

    
    // Define the deploy stage for Lambda and S3 stacks
    pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new codepipeline_actions.CloudFormationCreateUpdateStackAction({
          actionName: 'S3_Stack_Deploy',
          stackName: 'S3Stack7-test',
          templatePath: sourceOutput.atPath('cdk.out/S3Stack7-test.template.json'),
          adminPermissions: true,
        }),
        
        new codepipeline_actions.CloudFormationCreateUpdateStackAction({
          actionName: 'Lambda_Stack_Deploy',
          stackName: 'LambdaStack7-test',
          templatePath: sourceOutput.atPath('cdk.out/LambdaStack7-test.template.json'),
          adminPermissions: true,
        }),
      ],
    });
  }
}
