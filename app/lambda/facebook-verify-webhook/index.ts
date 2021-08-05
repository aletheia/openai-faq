import {APIGatewayProxyHandlerV2} from 'aws-lambda';

import {getContainer} from '../../container';
import {FacebookLambdaController} from '../../controller';
import {Logger} from '../../infrastructure';

export const handler: APIGatewayProxyHandlerV2 = event => {
  const container = getContainer();
  const logger = container.resolve<Logger>(Logger);
  logger.info('Received event:\n' + JSON.stringify(event));
  const handler = container.resolve(FacebookLambdaController);
  return handler.handleGetEvent(event);
};
