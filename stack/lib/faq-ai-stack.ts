import * as cdk from '@aws-cdk/core';

import {Bucket} from '@aws-cdk/aws-s3';
import {CorsHttpMethod, HttpApi, HttpMethod} from '@aws-cdk/aws-apigatewayv2';
import {LambdaProxyIntegration} from '@aws-cdk/aws-apigatewayv2-integrations';
import {join} from 'path';
import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';
import {CfnOutput, Duration} from '@aws-cdk/core';
import {BucketDeployment, Source} from '@aws-cdk/aws-s3-deployment';

import * as dotenv from 'dotenv';
import {Runtime} from '@aws-cdk/aws-lambda';
dotenv.config({path: join(__dirname, '../../.env')});

export class FaqAiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const kbStorage = new Bucket(this, 'knowledge-base-storage', {
    //   bucketName: 'openai-stack-bucket',
    // });

    const questionFunction = new NodejsFunction(this, 'question-function', {
      functionName: 'openai-question-function',
      entry: join(__dirname, '../../app/lambda/question-service/index.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_14_X,
      bundling: {
        tsconfig: './tsconfig.json',
        minify: false,
        sourceMap: true,
      },
      environment: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
        MMT_API_KEY: process.env.MMT_API_KEY!,
        LOG_LEVEL: 'INFO',
        LOG_FORMAT: 'json',
      },
    });

    // new BucketDeployment(this, 'question-service-deployment', {
    //   destinationBucket: kbStorage,
    //   sources: [Source.asset(join(__dirname, '../../datasets/'))],
    //   retainOnDelete: false,
    // });

    // kbStorage.grantReadWrite(questionFunction);

    const api = new HttpApi(this, 'openai-api', {
      apiName: 'nsp-question-api',
      corsPreflight: {
        allowHeaders: ['Authorization'],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ['*'],
        maxAge: Duration.days(30),
      },
    });

    api.addRoutes({
      path: '/question',
      methods: [HttpMethod.POST],
      integration: new LambdaProxyIntegration({handler: questionFunction}),
    });

    new CfnOutput(this, 'ApiEndpoint', {
      value: api.apiEndpoint,
    });
  }
}
