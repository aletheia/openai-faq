import {singleton} from 'tsyringe';

import * as nconf from 'nconf';
import {join} from 'path';
import {config} from 'dotenv';

@singleton()
export class Config {
  protected _config: nconf.Provider;

  constructor() {
    this._config = nconf.argv().env();

    const loadedConfig = config();
    if (loadedConfig.parsed) {
      for (const key in loadedConfig.parsed) {
        this._config.set(key, loadedConfig.parsed[key]);
      }
    }

    // if (!loadedConfig.parsed) {
    //   throw new Error('No config file found');
    // }
    // this._config = loadedConfig.parsed;
  }

  get(key: string): string {
    return this._config.get(key);
  }
}
