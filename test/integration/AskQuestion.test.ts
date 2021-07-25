import 'reflect-metadata';
import {DependencyContainer} from 'tsyringe';
import {getContainer} from '../../app/container';
import {QuestionService} from '../../app/service/QuestionService';

let service: QuestionService;

describe('QuestionService', () => {
  let container: DependencyContainer;
  beforeEach(() => {
    container = getContainer();
  });
  it('ask a question to the engine', () => {
    service = container.resolve(QuestionService);
    service.askQuestion({uuid: 'test', text: 'How to configure modem?'});
  });
});
