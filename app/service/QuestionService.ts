import {injectable} from 'tsyringe';
import {Answer} from '../model/Answer';
import {Question} from '../model/question';
import {Logger} from '../infrastructure/Logger';
import {Service} from '../core/Service';
import {OpenAIAdapter} from '../adapter/OpenAIAdapter';
import {ModernMTAdapter} from '../adapter/ModernMTAdapter';
import {lang} from '../core/Types';
import {Config} from '../infrastructure/Config';

@injectable()
export class QuestionService extends Service {
  constructor(
    logger: Logger,
    config: Config,
    private aiAdapter: OpenAIAdapter,
    private translateAdapter: ModernMTAdapter
  ) {
    super(logger, config);
  }

  async askQuestion(question: Question): Promise<Answer> {
    this.logger.debug('Asking question: ' + JSON.stringify(question));
    const translatedText = await this.translateAdapter.translate(
      question.text,
      lang.ITALIAN,
      lang.ENGLISH
    );
    const englishQuestion = Object.assign({}, question, {text: translatedText});
    const englishAnswer = await this.aiAdapter.ask(englishQuestion);
    const italianTranslatedText = await this.translateAdapter.translate(
      englishAnswer.text,
      lang.ENGLISH,
      lang.ITALIAN
    );
    const italianAnswer = Object.assign({}, englishAnswer, {
      text: italianTranslatedText,
    });
    this.logger.debug('Receiverd answer:\n ' + JSON.stringify(italianAnswer));
    return italianAnswer;
  }
}
