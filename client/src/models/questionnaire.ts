export interface Step {
  id: string;
  type: "info" | "text" | "select" | "multiselect";
  content?: string;
  question?: string;
  options?: string[];
  next?:
    | string
    | {
        default: string;
        conditions?: { [answer: string]: string };
      }
    | null;
}

export interface QuestionnaireSchema {
  id: string;
  title: string;
  steps: Step[];
}

export type QuestionnaireResponse = Record<string, string | string[] | null>;
