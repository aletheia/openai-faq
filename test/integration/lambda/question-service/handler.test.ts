import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import {getContainer} from '../../../../app/container';
import {handler} from '../../../../app/lambda/question-service';
import {Answer, Question} from '../../../../app/model';
import {
  fakeCallback,
  fakeContext,
  fakeProxyEvent,
} from '../../../fixture/ApiGatewayMock';

const spyCallToAnswerGpTs = jest
  .fn()
  .mockReturnValue(Promise.resolve({answers: ['test answer']}));

jest.mock('gpts', () => {
  return {
    GpTs: jest.fn().mockImplementation(() => {
      return {
        answer: spyCallToAnswerGpTs,
      };
    }),
  };
});

const spyMmtTranslate = jest
  .fn()
  .mockImplementation((from: string, to: string, text: string) => {
    return {translation: text};
  });

jest.mock('modernmt', () => {
  return {
    ModernMT: jest.fn().mockImplementation(() => {
      return {
        translate: spyMmtTranslate,
      };
    }),
  };
});

describe('question service lambda', () => {
  let sut: APIGatewayProxyHandlerV2;

  describe('#handler', () => {
    beforeEach(() => {
      getContainer();
      process.env.LOG_LEVEL = 'error';
      sut = handler;
    });
    it('should return an answer', async () => {
      const question: Question = {
        uuid: 'testEvent',
        text: 'test question',
      };
      const event: APIGatewayProxyEventV2 = fakeProxyEvent(question);
      const resultEventSerialized = await sut(event, fakeContext, fakeCallback);
      expect(resultEventSerialized).toBeDefined();
      const resultEvent: APIGatewayProxyStructuredResultV2 =
        resultEventSerialized! as APIGatewayProxyStructuredResultV2;
      expect(resultEvent.statusCode).toBe(200);
      expect(resultEvent.body).toBeDefined();
      const answer: Answer = JSON.parse(resultEvent.body!);
      expect(answer.text).toBe('test answer');
    });
  });
});
