import { QuestionnaireResponse, Step } from "@models/questionnaire";

export function getNextStepId(
  step: Step,
  answerValue: QuestionnaireResponse[2]
): string | null {
  if (!step.next) {
    return null;
  }

  if (typeof step.next === "string") {
    return step.next;
  }

  const answer = Array.isArray(answerValue) ? null : answerValue;
  if (answer && step.next.conditions && step.next.conditions[answer]) {
    return step.next.conditions[answer];
  }
  return step.next.default || null;
}
