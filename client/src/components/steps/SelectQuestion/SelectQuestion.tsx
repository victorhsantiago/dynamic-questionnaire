import { Button, Label, RadioInput } from "@components/elements";
import { useState } from "react";
import "./SelectQuestion.scss";

interface SelectQuestionProps {
  stepId: string;
  question?: string;
  options?: string[];
  initialValue?: string;
  onNext: (val: string) => void;
}

export const SelectQuestion: React.FC<SelectQuestionProps> = ({
  stepId,
  question,
  options,
  initialValue,
  onNext,
}) => {
  const [selected, setSelected] = useState(initialValue || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext(selected);
  }

  return (
    <form onSubmit={handleSubmit} className="radio-question">
      <p className="radio-question__label">{question}</p>
      {options &&
        options.map((option) => (
          <div key={option} className="radio-question__option">
            <RadioInput
              id={option}
              className="radio-question__input"
              type="radio"
              name={stepId}
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
            />
            <Label htmlFor={option} className="radio-question__option">
              {option}
            </Label>
          </div>
        ))}
      <Button
        type="submit"
        className="radio-question__button"
        disabled={!selected}
      >
        Next
      </Button>
    </form>
  );
};
