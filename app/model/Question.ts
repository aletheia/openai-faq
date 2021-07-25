export interface Question {
  uuid: string;
  text: string;
  context?: {
    knowledgeBases?: string[];
  };
}
