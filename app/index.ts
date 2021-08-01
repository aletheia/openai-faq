import {getContainer} from './container';
import {Logger} from './infrastructure';
import {QuestionService} from './service/QuestionService';

(async () => {
  const container = getContainer();
  const logger = container.resolve(Logger);
  try {
    const service = container.resolve(QuestionService);
    const answer = await service.askQuestion({
      uuid: 'test',
      text: 'Come va oggi?',
    });
    logger.info('Question answered!');
    logger.info(answer.text);
  } catch (err) {
    logger.error(err);
  }
})();
