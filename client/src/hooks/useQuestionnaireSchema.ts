import { useEffect, useState } from "react";
import { getQuestionnaireSchema } from "@services/api";
import { QuestionnaireSchema } from "@models/questionnaire";

export function useQuestionnaireSchema() {
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireSchema>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getQuestionnaireSchema()
      .then((data) => {
        setQuestionnaire(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questionnaire:", err);
        setError("Failed to load questionnaire");
        setLoading(false);
      });
  }, []);

  return { questionnaire, loading, error };
}
