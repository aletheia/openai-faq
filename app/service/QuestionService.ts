import {inject, injectable} from 'tsyringe';
import {Answer} from '../model';
import {Question} from '../model/question';
import {Service} from '../core';
import {OpenAIAdapter} from '../adapter/open-ai/OpenAIAdapter';
import {ModernMTAdapter} from '../adapter/ModernMTAdapter';
import {Lang} from '../core/Types';
import {Config} from '../infrastructure/Config';
import {Logger} from '../infrastructure';

@injectable()
export class QuestionService extends Service {
  constructor(
    @inject(Logger) logger: Logger,
    @inject(Config) config: Config,
    @inject(OpenAIAdapter) private aiAdapter: OpenAIAdapter,
    @inject(ModernMTAdapter) private translateAdapter: ModernMTAdapter
  ) {
    super(logger, config);
  }

  async askQuestion(question: Question): Promise<Answer> {
    this.logger.info('Asking question: ' + JSON.stringify(question));
    let translatedText = await this.translateAdapter.translate(
      question.text,
      Lang.it,
      Lang.en
    );

    // Convert translation array to a string
    if (Array.isArray(translatedText)) {
      translatedText = translatedText.join(' ');
    }

    const englishQuestion = Object.assign({}, question, {text: translatedText});
    const englishAnswer = await this.aiAdapter.ask(englishQuestion);
    let italianTranslatedText = await this.translateAdapter.translate(
      englishAnswer.text,
      Lang.en,
      Lang.it
    );

    // Convert translation array to a string
    if (Array.isArray(italianTranslatedText)) {
      italianTranslatedText = italianTranslatedText.join(' ');
    }

    const italianAnswer = Object.assign({}, englishAnswer, {
      text: italianTranslatedText,
    });
    this.logger.info('Receiverd answer:\n ' + JSON.stringify(italianAnswer));
    return italianAnswer;
  }
}
