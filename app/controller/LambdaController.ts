import {APIGatewayProxyEventV2} from 'aws-lambda';
import {autoInjectable} from 'tsyringe';
import {Answer} from '../domain/Answer';
import {Logger} from '../infrastructure/Logger';
import {Controller} from '../core/Controller';
import {QuestionService} from '../service/QuestionService';
import {ServiceError} from '../service/ServiceError';
import {nanoid} from 'nanoid';

@autoInjectable()
export class LambdaController extends Controller {
  protected service: QuestionService;

  constructor(logger: Logger, service: QuestionService) {
    super(logger);
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

  buildServiceResultResponse(answer: Answer) {
    return {
      statusCode: 200,
      headers: this.headers(),
      body: JSON.stringify(answer),
    };
  }

  async handleEvent(event: APIGatewayProxyEventV2) {
    try {
      if (!event.body) {
        throw new ServiceError('Missing request body');
      }
      const {question} = JSON.parse(event.body);
      const answer = await this.service.askQuestion({uuid: nanoid(), question});
      return this.buildServiceResultResponse(answer);
    } catch (err) {
      return this.buildServiceErrorResponse(err);
    }
  }
}
