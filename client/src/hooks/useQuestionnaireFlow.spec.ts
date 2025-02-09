import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuestionnaireFlow } from "./useQuestionnaireFlow";
import { postResponse } from "@services/api";
import { getNextStepId } from "@services/flow";
import { QuestionnaireSchema } from "@models/questionnaire";

vi.mock("@services/api", () => ({
  postResponse: vi.fn(),
}));
vi.mock("@services/flow", () => ({
  getNextStepId: vi.fn(),
}));

describe("useQuestionnaireFlow", () => {
  const mockSchema: QuestionnaireSchema = {
    id: "sample",
    title: "Sample Questionnaire",
    steps: [
      {
        id: "step1",
        type: "info",
        content: "Welcome",
        next: "step2",
      },
      {
        id: "step2",
        type: "text",
        question: "Enter something:",
        next: null,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes the path with the first step when `initializePath` is called", () => {
    const { result } = renderHook(() => useQuestionnaireFlow(mockSchema));

    expect(result.current.path).toEqual([]);

    act(() => {
      result.current.initializePath();
    });

    expect(result.current.path).toEqual(["step1"]);
  });

  it("goToNextStep does nothing if path is empty", async () => {
    (getNextStepId as Mock).mockReturnValue("step2");

    const { result } = renderHook(() => useQuestionnaireFlow(mockSchema));

    await act(async () => {
      await result.current.goToNextStep("test-answer");
    });

    expect(postResponse).not.toHaveBeenCalled();
    expect(result.current.path).toEqual([]);
  });

  it("goToNextStep saves response and calls postResponse if step is not info", async () => {
    (getNextStepId as Mock).mockReturnValue("step2");

    const { result } = renderHook(() => useQuestionnaireFlow(mockSchema));

    act(() => {
      result.current.initializePath();
    });
    expect(result.current.path).toEqual(["step1"]);

    await act(async () => {
      await result.current.goToNextStep(null);
    });
    expect(postResponse).not.toHaveBeenCalled();
    expect(result.current.path).toEqual(["step1", "step2"]);

    (getNextStepId as Mock).mockReturnValue(null);
    await act(async () => {
      await result.current.goToNextStep("User typed something");
    });

    expect(postResponse).toHaveBeenCalledWith({
      step2: "User typed something",
    });
    expect(result.current.path).toEqual(["step1", "step2"]);
    expect(result.current.responses).toEqual({
      step2: "User typed something",
    });
  });

  it("goToPreviousStep removes the last item from path", () => {
    const { result } = renderHook(() => useQuestionnaireFlow(mockSchema));

    act(() => {
      result.current.initializePath();
    });
    act(() => {
      result.current.path.push("step2");
    });

    expect(result.current.path).toEqual(["step1", "step2"]);
    act(() => {
      result.current.goToPreviousStep();
    });
    expect(result.current.path).toEqual(["step1"]);
  });

  it("currentStep references the last item in path", async () => {
    (getNextStepId as Mock).mockReturnValue("step2");

    const { result } = renderHook(() => useQuestionnaireFlow(mockSchema));

    act(() => {
      result.current.initializePath();
    });

    await act(async () => {
      await result.current.goToNextStep("User typed something");
    });

    expect(result.current.path).toEqual(["step1", "step2"]);
    expect(result.current.currentStep?.id).toBe("step2");
  });
});
