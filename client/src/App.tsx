import { useEffect, useState } from "react";
import { getQuestionnaireSchema, postResponse } from "@services/api";
import {
  QuestionnaireResponse,
  QuestionnaireSchema,
  Step,
} from "@models/questionnaire";
import {
  InfoStep,
  MultiSelectQuestion,
  SelectQuestion,
  TextQuestion,
} from "@components/steps";
import { Button } from "@components/elements";
import { getNextStepId } from "@services/flow";
import "./App.scss";

function App() {
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireSchema>();
  const [path, setPath] = useState<string[]>([]);
  const [responses, setResponses] = useState<
    Record<string, string | string[] | null>
  >({});

  useEffect(() => {
    getQuestionnaireSchema()
      .then((data) => {
        setQuestionnaire(data);
        if (data.steps.length > 0) {
          setPath([data.steps[0].id]);
        }
      })
      .catch((err) => {
        console.error("Error fetching questionnaire:", err);
      });
  }, []);

  if (!questionnaire || questionnaire.steps.length === 0) {
    return <div>Loading questionnaire or no steps defined...</div>;
  }

  const currentStepId = path[path.length - 1];
  const currentStep = questionnaire.steps.find((s) => s.id === currentStepId);

  async function goToNextStep(answerValue: QuestionnaireResponse[2]) {
    if (!currentStep || !questionnaire) {
      return;
    }

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
    if (!nextId) {
      return;
    }

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

  function renderStep(step: Step) {
    switch (step.type) {
      case "info":
        return (
          <InfoStep
            content={step.content}
            next={step.next}
            onNext={() => goToNextStep(null)}
          />
        );
      case "text":
        return (
          <TextQuestion
            question={step.question}
            initialValue={responses[step.id] as string}
            onNext={goToNextStep}
          />
        );
      case "select":
        return (
          <SelectQuestion
            stepId={step.id}
            question={step.question}
            options={step.options}
            initialValue={responses[step.id] as string}
            onNext={goToNextStep}
          />
        );
      case "multiselect":
        return (
          <MultiSelectQuestion
            stepId={step.id}
            question={step.question}
            options={step.options}
            initialValue={responses[step.id] as string[]}
            onNext={goToNextStep}
          />
        );
      default:
        return <div>Unknown step type: {step.type}</div>;
    }
  }

  return (
    <div className="questionnaire">
      <h1>{questionnaire.title}</h1>

      <main className="questionnaire__main">{renderStep(currentStep!)}</main>

      <footer className="questionnaire__footer">
        {path.length > 1 && (
          <Button className="questionnaire__button" onClick={goToPreviousStep}>
            Back
          </Button>
        )}
        <p>
          Step{" "}
          {`${Intl.NumberFormat("de-DE", { style: "percent" }).format(
            (questionnaire.steps.findIndex((p) => p.id === currentStep?.id) +
              1) /
              questionnaire.steps.length
          )}`}
        </p>
      </footer>
    </div>
  );
}

export default App;
