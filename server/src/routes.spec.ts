import request from "supertest";
import express from "express";
import { describe, it, expect, beforeAll } from "vitest";
import { questionnaireSchema } from "./questionnaire.schema";
import router from "./routes";

describe("Router tests", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router);
  });

  it("GET / should return a greeting", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Express + TypeScript Server");
  });

  it("GET /api/questionnaire should return the questionnaire schema", async () => {
    const response = await request(app).get("/api/questionnaire");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(questionnaireSchema);
  });

  it("POST /api/response should update and return a response message", async () => {
    const testData = { name: "John Doe", favoriteColor: "Blue" };

    const response = await request(app).post("/api/response").send(testData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Response recorded" });
  });
});
