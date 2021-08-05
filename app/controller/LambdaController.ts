import {APIGatewayProxyEventV2} from 'aws-lambda';
import {autoInjectable, inject} from 'tsyringe';
import {Question} from '../model';
import {Config, Logger} from '../infrastructure';
import {Controller} from '../core';
import {QuestionService, ServiceError} from '../service';

import {nanoid} from 'nanoid';

@autoInjectable()
export class LambdaController extends Controller {
  protected service: QuestionService;

  constructor(
    @inject(Logger) logger: Logger,
    @inject(Config) config: Config,
    @inject(QuestionService) service: QuestionService
  ) {
    super(logger, config);
    this.service = service;
  }

  headers() {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Max-Age': '1728000',
      'Content-Type': 'application/json',
    };
  }

  buildServiceErrorResponse(error: Error) {
    return {
      statusCode: 500,
      headers: this.headers(),
      body: JSON.stringify(error),
    };
  }

  buildServiceResultResponse<T>(resultObject: T) {
    return {
      statusCode: 200,
      headers: this.headers(),
      body: JSON.stringify(resultObject),
    };
  }

  getQueryStringParameters(event: APIGatewayProxyEventV2) {
    if (!event.pathParameters) {
      return {};
    }
    return event.pathParameters;
  }

  getBody<T>(event: APIGatewayProxyEventV2): T {
    if (!event.body) {
      throw new ServiceError('Event has no body object');
    }
    const question = JSON.parse(event.body) as T;
    return question;
  }

  async handlePostEvent(event: APIGatewayProxyEventV2) {
    try {
      if (!event.body) {
        throw new ServiceError('Missing request body');
      }
      const question = this.getBody<Question>(event);
      this.logger.info(`Received question: ${question.text}`);
      const answer = await this.service.askQuestion(
        Object.assign({}, question, {uuid: nanoid()})
      );
      return this.buildServiceResultResponse(answer);
    } catch (err) {
      return this.buildServiceErrorResponse(err);
    }
  }
}
