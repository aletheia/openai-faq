import {APIGatewayProxyEventV2, Callback, Context} from 'aws-lambda';

export const fakeProxyEvent = (body: object): APIGatewayProxyEventV2 => {
  return {
    body: JSON.stringify(body),
    version: 'v1',
    headers: {},
    rawPath: '/v1/question',
    routeKey: 'v1.question',
    isBase64Encoded: false,
    rawQueryString: '',
    requestContext: {
      accountId: '0090212',
      apiId: 'testApi',
      domainName: 'testDomain',
      domainPrefix: 'testPrefix',
      http: {
        method: 'POST',
        path: '/v1/question',
        protocol: 'HTTP/1.1',
        sourceIp: '127.0.0.1',
        userAgent: 'curl/7.35.0',
      },
      requestId: 'testRequestId',
      routeKey: 'v1.question',
      stage: 'testStage',
      time: '2017-06-01T00:00:00.000Z',
      timeEpoch: 1496488000000,
    },
  };
};

export const fakeContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'testFunction',
  functionVersion: '$LATEST',
  invokedFunctionArn:
    'arn:aws:lambda:us-east-1:123456789012:function:testFunction:$LATEST',
  memoryLimitInMB: '128',
  awsRequestId: 'testRequestId',
  logGroupName: '/aws/lambda/testFunction',
  logStreamName: 'testFunction_2017-06-01T00:00:00.000Z',
  clientContext: {
    client: {
      installationId: 'testInstallationId',
      appPackageName: 'testAppPackageName',
      appTitle: 'testAppTitle',
      appVersionCode: 'testAppVersionCode',
      appVersionName: 'testAppVersionName',
    },
    env: {
      platform: 'Test',
      platformVersion: 'Test',
      make: 'Test',
      model: 'Test',
      locale: 'Test',
    },
  },
  done: () => {},
  fail: () => {},
  succeed: () => {},
  getRemainingTimeInMillis: () => 0,
};

export const fakeCallback: Callback = () => {};
