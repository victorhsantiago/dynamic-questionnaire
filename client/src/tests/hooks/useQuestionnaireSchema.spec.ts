import { describe, it, expect, vi, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { getQuestionnaireSchema } from "@services/api";
import { QuestionnaireSchema } from "@models/questionnaire";
import { useQuestionnaireSchema } from "@hooks/useQuestionnaireSchema";

vi.mock("@services/api", () => ({
  getQuestionnaireSchema: vi.fn(),
}));

describe("useQuestionnaireSchema", () => {
  const mockSchema: QuestionnaireSchema = {
    id: "test-q",
    title: "Test Questionnaire",
    steps: [
      {
        id: "step1",
        type: "info",
        content: "First step",
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

  it("should fetch and return questionnaire data on success", async () => {
    (getQuestionnaireSchema as Mock).mockResolvedValueOnce(mockSchema);

    const { result } = renderHook(() => useQuestionnaireSchema());

    expect(result.current.loading).toBe(true);
    expect(result.current.questionnaire).toBeUndefined();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.questionnaire).toEqual(mockSchema);
    expect(result.current.error).toBeNull();
  });

  it("should handle error if the API call fails", async () => {
    (getQuestionnaireSchema as Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => useQuestionnaireSchema());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to load questionnaire");
    expect(result.current.questionnaire).toBeUndefined();
  });
});
