export interface Question {
  uuid: string;
  question: string;
  context?: {
    knowledgeBases?: string[];
  };
}
