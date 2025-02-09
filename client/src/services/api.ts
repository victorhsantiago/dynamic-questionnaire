import axios from "axios";
import { QuestionnaireSchema } from "@models/questionnaire";

const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_PRODUCTION
  : import.meta.env.VITE_DEVELOPMENT;

export async function getQuestionnaireSchema(): Promise<QuestionnaireSchema> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/questionnaire`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questionnaire:", error);
    throw error;
  }
}

export async function postResponse(
  data: Record<string, string | string[]>
): Promise<void> {
  try {
    await axios.post(`${API_BASE_URL}/api/response`, data);
  } catch (error) {
    console.error("Error saving response:", error);
    throw error;
  }
}
