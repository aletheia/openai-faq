import {Answer} from '../model/Answer';
import {Question} from '../model/question';

export interface AgentAdapter {
  getAnswer(question: Question): Promise<Answer>;
}
