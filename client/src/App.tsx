import { useEffect } from "react";
import { useQuestionnaireSchema } from "@hooks/useQuestionnaireSchema";
import { useQuestionnaireFlow } from "@hooks/useQuestionnaireFlow";
import {
  InfoStep,
  MultiSelectQuestion,
  SelectQuestion,
  TextQuestion,
} from "@components/steps";
import { Button, ProgressBar } from "@components/elements";
import { Step } from "@models/questionnaire";
import "./App.scss";
import { ThemeToggle } from "@components/ThemeToggle";

const App: React.FC = () => {
  const { questionnaire, loading, error } = useQuestionnaireSchema();

  const {
    path,
    responses,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    initializePath,
  } = useQuestionnaireFlow(questionnaire);

  useEffect(() => {
    if (!loading && questionnaire) {
      initializePath();
    }
  }, [loading, questionnaire, initializePath]);

  if (loading) {
    return <div>Loading questionnaire...</div>;
  }
  if (error || !questionnaire) {
    return <div>Error: {error || "No questionnaire"}</div>;
  }
  if (!currentStep) {
    return <div>No valid current step.</div>;
  }

  const renderStep = (step: Step) => {
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
  };

  const currentIndex =
    questionnaire.steps.findIndex((p) => p.id === currentStep.id) + 1;
  const total = questionnaire.steps.length;
  const isLastStep = currentIndex === total;
  const showBackButton = path.length > 1 && !isLastStep;

  return (
    <div className="questionnaire">
      <h1>{questionnaire.title}</h1>

      <main className="questionnaire__main">{renderStep(currentStep)}</main>

      <footer className="questionnaire__footer">
        {showBackButton && <Button onClick={goToPreviousStep}>Back</Button>}
      </footer>

      <ProgressBar current={currentIndex} total={total} />
      <ThemeToggle />
    </div>
  );
};

export default App;
