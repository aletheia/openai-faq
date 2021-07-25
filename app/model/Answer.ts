import {Question} from './question';

export interface Answer {
  uuid: string;
  text: string;
  question?: Question;
}
