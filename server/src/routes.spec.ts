import { describe, it, expect } from "vitest";
import { questionnaireSchema } from "./questionnaire.schema";

describe("Server Index", () => {
  it("should respond with a 200 status", async () => {
    const response = await fetch("http://localhost:3001");
    const data = await response.text();

    expect(response.status).toBe(200);
    expect(data).toBe("Express + TypeScript Server");
  });

  it("should return JSON data", async () => {
    const response = await fetch("http://localhost:3001/api/questionnaire");
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(questionnaireSchema);
  });
});
