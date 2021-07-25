import {injectable} from 'tsyringe';
import {Adapter} from '../core/Adapter';
import {lang} from '../core/Types';

@injectable()
export class ModernMTAdapter extends Adapter {
  async translate(text: string, fromLang: lang, toLang: lang): Promise<string> {
    this.logger.info(
      `Translating "${text}" from "${fromLang.toUpperCase()}" to "${toLang.toUpperCase()}"`
    );
    return text;
  }
}
