import {Answer, Question} from '../model';

export interface AgentAdapter {
  getAnswer(question: Question): Promise<Answer>;
}
