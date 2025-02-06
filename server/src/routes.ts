import { Router } from "express";
import { questionnaireSchema } from "./questionnaire.schema";

const router = Router();

router.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

router.get("/api/questionnaire", (req, res) => {
  res.json(questionnaireSchema);
});

export default router;
