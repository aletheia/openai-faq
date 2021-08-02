import {inject, injectable} from 'tsyringe';
import {nanoid} from 'nanoid';
import {Adapter} from '../../core';
import {Answer, Question} from '../../model';
import {Config, Logger} from '../../infrastructure';
import {ServiceError} from '../../service';

import {GpTs} from 'gpts';
import {
  DigitalTransformation,
  JeanneRoss,
  MITSloanDigitalSchool,
} from './knowledge-base';

@injectable()
export class OpenAIAdapter extends Adapter {
  private gpts: GpTs;

  constructor(@inject(Logger) logger: Logger, @inject(Config) config: Config) {
    super(logger, config);
    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
      throw new ServiceError('OPENAI_API_KEY is not set');
    }
    this.gpts = new GpTs(openAiKey);
  }

  async ask(question: Question): Promise<Answer> {
    this.logger.info(`Asking "${question.text}"`);
    const documents = MITSloanDigitalSchool.concat(JeanneRoss).concat(
      DigitalTransformation
    );
    const examples_context = 'In 2017, U.S. life expectancy was 78.6 years.';
    const examples = [
      [
        'What is human life expectancy in the United States?',
        'An average person in United States lives 78 years.',
      ],
      [
        'Is it important to innovate?',
        'Innovation is the fundamental part of a company growth process',
      ],
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
    if (text.length === 0) {
      throw new ServiceError('No answer');
    }
    this.logger.info(`Answer: "${text}"`);
    return {uuid: nanoid(), text, question};
  }
}
