import {inject, injectable} from 'tsyringe';
import {Adapter, Lang} from '../core';
import {Config, Logger} from '../infrastructure';
import {ServiceError} from '../service';

import {ModernMT, Translation} from 'modernmt';
@injectable()
export class ModernMTAdapter extends Adapter {
  protected mmt: ModernMT;

  constructor(@inject(Logger) logger: Logger, @inject(Config) config: Config) {
    super(logger, config);
    this.mmt = new ModernMT(config.get('MMT_API_KEY'));
  }

  private getTranslation(translation: Translation): string {
    if (!translation.translation) {
      throw new ServiceError('Translation failed:');
    }
    return translation.translation;
  }

  async translate(
    text: string,
    fromLang: Lang,
    toLang: Lang
  ): Promise<string | string[]> {
    this.logger.info(
      `Translating "${text}" from "${fromLang.toUpperCase()}" to "${toLang.toUpperCase()}"`
    );
    const translation = await this.mmt.translate(
      Lang[fromLang] as string,
      Lang[toLang] as string,
      text
    );
    if (Array.isArray(translation)) {
      return translation.map((item: Translation) => this.getTranslation(item));
    } else {
      return this.getTranslation(translation);
    }
  }
}
