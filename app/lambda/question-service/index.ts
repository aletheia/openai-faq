import {APIGatewayProxyHandlerV2} from 'aws-lambda';

import {getContainer} from '../../container';
import {LambdaController} from '../../controller/LambdaController';
import {Logger} from '../../infrastructure';

export const handler: APIGatewayProxyHandlerV2 = event => {
  const container = getContainer();
  const logger = container.resolve<Logger>(Logger);
  logger.info('Received event:\n' + JSON.stringify(event));
  const handler = container.resolve(LambdaController);
  return handler.handleEvent(event);
};
