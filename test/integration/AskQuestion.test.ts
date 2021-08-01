import 'reflect-metadata';
import {DependencyContainer} from 'tsyringe';
import {QuestionService} from '../../app/service/QuestionService';
import {getContainer} from '../fixture/ContainerMock';

import {GpTs} from 'gpts';
import {ModernMT} from 'modernmt';
import {Lang} from '../../app/core';

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

describe('QuestionService', () => {
  let container: DependencyContainer;
  let service: QuestionService;

  beforeAll(() => {
    container = getContainer();
    service = container.resolve(QuestionService);
  });

  it('ask a question to the engine', async () => {
    const answer = await service.askQuestion({
      uuid: 'test',
      text: 'Quali capacità sono critiche dopo la pandemia?',
    });
    expect(answer).toBeDefined();
    expect(answer.text).toEqual('test answer');
    expect(spyCallToAnswerGpTs).toHaveBeenCalled();
    expect(spyMmtTranslate).toHaveBeenCalled();
  });
});
