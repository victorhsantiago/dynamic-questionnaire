import { Button, Label, TextInput } from "@components/elements";
import React, { useId, useState } from "react";
import "./TextQuestion.scss";

interface TextQuestionProps {
  question?: string;
  initialValue?: string;
  onNext: (val: string) => void;
}

export const TextQuestion: React.FC<TextQuestionProps> = ({
  question,
  initialValue,
  onNext,
}) => {
  const [value, setValue] = useState(initialValue || "");
  const id = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext(value);
  }

  return (
    <form onSubmit={handleSubmit} className="text-question">
      <Label className="text-question__label" htmlFor={id}>
        {question}
      </Label>
      <TextInput
        id={id}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-question__input"
        variant="large"
        placeholder="Type your answer here"
      />
      <Button type="submit" className="text-question__button">
        Next
      </Button>
    </form>
  );
};
