import {nanoid} from 'nanoid';
import {Adapter} from '../core/Adapter';
import {Answer} from '../model/Answer';
import {Question} from '../model/question';

import {GpTs} from 'gpts';
import {Logger} from '../infrastructure/Logger';
import {ServiceError} from '../service/ServiceError';
import {injectable} from 'tsyringe';

import {Fastweb} from './open-ai/KnowledgeBase';
import {Config} from '../infrastructure/Config';
@injectable()
export class OpenAIAdapter extends Adapter {
  private gpts: GpTs;

  constructor(logger: Logger, config: Config) {
    super(logger, config);
    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
      throw new ServiceError('OPENAI_API_KEY is not set');
    }
    this.gpts = new GpTs(openAiKey);
  }

  async ask(question: Question): Promise<Answer> {
    this.logger.info(`Asking "${question.text}"`);
    const documents = Fastweb;
    const examples_context = 'In 2017, U.S. life expectancy was 78.6 years.';
    const examples = [
      ['What is human life expectancy in the United States?', '78 years.'],
    ];
    const answer = await this.gpts.answer({
      question: question.text,
      documents: documents,
      engineId: 'curie',
      model: 'curie',
      search_model: 'ada',
      max_tokens: 100,
      examples,
      examples_context,
      stop: ['\n', '<|endoftext|>'],
    });

    const text = answer.answers.join('\n');
    this.logger.info(`Answer: "${text}"`);
    return {uuid: nanoid(), text, question};
  }
}
