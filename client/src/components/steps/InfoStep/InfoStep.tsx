import { Button } from "@components/elements";
import "./InfoStep.scss";

interface InfoStepProps {
  content?: string;
  onNext: () => void;
}

export const InfoStep: React.FC<InfoStepProps> = ({ content, onNext }) => {
  return (
    <div className="info-step">
      <p className="info-step__content">{content}</p>
      <Button className="info-step__button" onClick={onNext}>
        Continue
      </Button>
    </div>
  );
};
