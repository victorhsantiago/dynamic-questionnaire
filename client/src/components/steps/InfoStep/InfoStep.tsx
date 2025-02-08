import { Button } from "@components/elements";
import "./InfoStep.scss";
import { Step } from "@models/questionnaire";

interface InfoStepProps {
  content?: string;
  next?: Step["next"];
  onNext: () => void;
}

export const InfoStep: React.FC<InfoStepProps> = ({
  content,
  next,
  onNext,
}) => {
  return (
    <div className="info-step">
      <p className="info-step__content">{content}</p>
      {next && (
        <Button className="info-step__button" onClick={onNext}>
          Continue
        </Button>
      )}
    </div>
  );
};
