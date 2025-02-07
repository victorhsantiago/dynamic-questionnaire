import { useEffect, useState } from "react";
import { getQuestionnaireSchema } from "@services/api";
import { QuestionnaireSchema } from "@models/questionnaire";
import "./App.css";

function App() {
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireSchema>();

  useEffect(() => {
    getQuestionnaireSchema()
      .then((data) => setQuestionnaire(data))
      .catch((err) => {
        console.error("Error fetching questionnaire:", err);
      });
  }, []);

  return <pre>{JSON.stringify(questionnaire, null, 2) || "error"}</pre>;
}

export default App;
