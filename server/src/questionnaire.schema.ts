export interface Step {
  id: string;
  type: "info" | "text" | "select" | "multiselect";
  content?: string;
  question?: string;
  options?: string[];
  next:
    | null
    | string
    | {
        default: string;
        conditions?: { [answer: string]: string };
      };
}

export interface QuestionnaireSchema {
  id: string;
  title: string;
  steps: Step[];
}

export const questionnaireSchema: QuestionnaireSchema = {
  id: "sample-questionnaire",
  title: "Sample Questionnaire",
  steps: [
    {
      id: "welcome",
      type: "info",
      content: "Welcome to the questionnaire! Click continue to begin.",
      next: "q1",
    },
    {
      id: "q1",
      type: "text",
      question: "What is your name?",
      next: "q2",
    },
    {
      id: "q2",
      type: "select",
      question: "What is your favorite color?",
      options: ["Red", "Green", "Blue"],
      next: {
        default: "q3",
        conditions: {
          Red: "red-info",
        },
      },
    },
    {
      id: "red-info",
      type: "info",
      content: "Red is a bold choice!",
      next: "q3",
    },
    {
      id: "q3",
      type: "multiselect",
      question: "Which programming languages do you know?",
      options: ["JavaScript", "Python", "Java", "C#"],
      next: null,
    },
  ],
};
