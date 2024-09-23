#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CodepipelineappStack } from '../lib/codepipelineapp-stack';
import * as fs from 'fs';
import * as path from 'path';

const app = new cdk.App();

// Define the environment
const environment = app.node.tryGetContext('env') || 'test';

// Create the CodePipeline stack
const pipelineStack = new CodepipelineappStack(app, `CodepipelineappStack8-${environment}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});