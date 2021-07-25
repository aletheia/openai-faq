import {APIGatewayProxyHandlerV2} from 'aws-lambda';

import {getContainer} from '../../container';
import {LambdaController} from '../../controller/LambdaController';

export const handler: APIGatewayProxyHandlerV2 = event => {
  const container = getContainer();
  const handler = container.resolve(LambdaController);
  return handler.handleEvent(event);
};
