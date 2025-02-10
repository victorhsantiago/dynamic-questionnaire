import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import axios from "axios";
import { QuestionnaireSchema } from "@models/questionnaire";
import { getQuestionnaireSchema, postResponse } from "@services/api";

vi.mock("axios");

describe("API service", () => {
  const mockedAxios = axios as unknown as {
    get: Mock;
    post: Mock;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the questionnaire schema via GET request", async () => {
    const mockData: QuestionnaireSchema = {
      id: "test-questionnaire",
      title: "Test Title",
      steps: [
        {
          id: "step1",
          type: "info",
          content: "Welcome!",
          next: "step2",
        },
        {
          id: "step2",
          type: "text",
          question: "What is your name?",
          next: null,
        },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await getQuestionnaireSchema();

    expect(mockedAxios.get).toHaveBeenCalledOnce();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/questionnaire")
    );
    expect(result).toEqual(mockData);
  });

  it("should throw an error when fetching the questionnaire schema fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Test error"));

    await expect(getQuestionnaireSchema()).rejects.toThrow("Test error");
  });

  it("should post a response via POST request", async () => {
    const testData = { step1: "Sample answer" };
    mockedAxios.post.mockResolvedValueOnce({});

    await postResponse(testData);

    expect(mockedAxios.post).toHaveBeenCalledOnce();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/response"),
      testData
    );
  });

  it("should throw an error when posting a response fails", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Test error"));

    await expect(postResponse({})).rejects.toThrow("Test error");
  });
});
