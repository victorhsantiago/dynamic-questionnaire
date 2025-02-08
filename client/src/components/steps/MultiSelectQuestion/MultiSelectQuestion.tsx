import { useState } from "react";
import { Button, CheckboxInput, Label } from "@components/elements";
import "./MultiSelectQuestion.scss";

interface MultiSelectQuestionProps {
  stepId: string;
  question?: string;
  options?: string[];
  initialValue?: string[];
  onNext: (vals: string[]) => void;
}

export const MultiSelectQuestion: React.FC<MultiSelectQuestionProps> = ({
  stepId,
  question,
  options,
  initialValue,
  onNext,
}) => {
  const [selected, setSelected] = useState<string[]>(initialValue || []);

  function toggleOption(option: string) {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((x) => x !== option)
        : [...prev, option]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext(selected);
  }

  return (
    <form onSubmit={handleSubmit} className="multi-select-question">
      <p className="multi-select-question__label">{question}</p>
      {options &&
        options.map((option) => (
          <Label key={option} className="multi-select-question__option">
            <CheckboxInput
              className="multi-select-question__checkbox"
              type="checkbox"
              name={stepId}
              value={option}
              checked={selected.includes(option)}
              onChange={() => toggleOption(option)}
            />
            <span className="multi-select-question__text">{option}</span>
          </Label>
        ))}
      <Button type="submit" className="multi-select-question__button">
        Next
      </Button>
    </form>
  );
};
