import {APIGatewayProxyHandlerV2} from 'aws-lambda';

import 'reflect-metadata';
import {container} from 'tsyringe';
import {LambdaController} from '../../controller/LambdaController';

export const handler: APIGatewayProxyHandlerV2 = event => {
  const handler = container.resolve(LambdaController);
  return handler.handleEvent(event);
};
