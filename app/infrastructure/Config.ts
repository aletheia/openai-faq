import {config as configLoader} from 'dotenv';
import {singleton} from 'tsyringe';

@singleton()
export class Config {
  protected _config: {
    [k: string]: string;
  };
  constructor() {
    const loadedConfig = configLoader();
    if (!loadedConfig.parsed) {
      throw new Error('No config file found');
    }
    this._config = loadedConfig.parsed;
  }

  get(key: string): string {
    return this._config[key];
  }
}
