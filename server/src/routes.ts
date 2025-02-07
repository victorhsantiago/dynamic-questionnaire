import { Router } from "express";
import { questionnaireSchema } from "./questionnaire.schema";

const router = Router();

let responses: Record<string, any> = {};

router.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

router.get("/api/questionnaire", (req, res) => {
  res.json(questionnaireSchema);
});

router.post("/api/response", (req, res) => {
  responses = { ...responses, ...req.body };

  console.log("Updated responses", responses);
  res.json({ message: "Response recorded" });
});

export default router;
