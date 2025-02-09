import { useState } from "react";
import { postResponse } from "@services/api";
import { QuestionnaireSchema } from "@models/questionnaire";
import { getNextStepId } from "@services/flow";

export function useQuestionnaireFlow(questionnaire?: QuestionnaireSchema) {
  const [path, setPath] = useState<string[]>([]);
  const [responses, setResponses] = useState<
    Record<string, string | string[] | null>
  >({});

  function initializePath() {
    if (questionnaire && questionnaire.steps.length > 0 && path.length === 0) {
      setPath([questionnaire.steps[0].id]);
    }
  }

  async function goToNextStep(answerValue: string | string[] | null) {
    if (!questionnaire) return;

    const currentStepId = path[path.length - 1];
    const currentStep = questionnaire.steps.find((s) => s.id === currentStepId);

    if (!currentStep) return;

    if (currentStep.type !== "info") {
      const newResponses = { ...responses, [currentStep.id]: answerValue };
      setResponses(newResponses);

      try {
        if (answerValue) await postResponse({ [currentStep.id]: answerValue });
      } catch (error) {
        console.error("Error saving response:", error);
      }
    }

    const nextId = getNextStepId(currentStep, answerValue);
    if (!nextId) return;

    const nextStep = questionnaire.steps.find((s) => s.id === nextId);
    if (!nextStep) {
      alert("Questionnaire completed!");
      return;
    }

    setPath((prev) => [...prev, nextId]);
  }

  function goToPreviousStep() {
    if (path.length > 1) {
      setPath((prev) => prev.slice(0, prev.length - 1));
    }
  }

  const currentStepId = path[path.length - 1];
  const currentStep = questionnaire?.steps.find((s) => s.id === currentStepId);

  return {
    path,
    responses,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    initializePath,
  };
}
