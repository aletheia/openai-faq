import {APIGatewayProxyEventV2} from 'aws-lambda';
import {ServiceError, ServiceErrorCode} from '../service';
import {LambdaController} from './LambdaController';

export interface FacebookWebhook {
  object: string;
  entry: Array<{messaging: string[]}>;
}

export class FacebookLambdaController extends LambdaController {
  async handleGetEvent(event: APIGatewayProxyEventV2) {
    const verifyToken = this.config.get('FB_MESSENGER_VERIFY_TOKEN');
    const {mode, token, challenge} = this.getQueryStringParameters(event);
    if (mode && token && mode === 'subscribe' && token === verifyToken) {
      this.logger.info(
        'Verified subscription request from Facebook Messenger '
      );
      return this.buildServiceResultResponse(challenge);
    } else {
      return this.buildServiceErrorResponse(
        new ServiceError(ServiceErrorCode.InvalidRequest)
      );
    }
  }

  async handlePostEvent(event: APIGatewayProxyEventV2) {
    try {
      const webhook = this.getBody<FacebookWebhook>(event);
      this.logger.info(`Received question: ${webhook}`);
      if (webhook.object === 'page') {
        webhook.entry.forEach(entry => {
          entry.messaging.forEach(message => {
            this.logger.info(`Received message: ${message}`);
          });
        });
      } else {
        return this.buildServiceErrorResponse(
          new ServiceError(ServiceErrorCode.InvalidRequest)
        );
      }
      //   const answer = await this.service.askQuestion(
      //     Object.assign({}, webhook, {uuid: nanoid()})
      //   );
      const answer = {uuid: 'dsdsds', text: 'dsdsds'};
      return this.buildServiceResultResponse(answer);
    } catch (err) {
      return this.buildServiceErrorResponse(err);
    }
  }
}
