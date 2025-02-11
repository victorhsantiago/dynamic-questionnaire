# Dynamic Questionnaire Application

A full-stack application for rendering and interacting with a **schema-driven** questionnaire. The backend serves the questionnaire schema and handles partial or final responses. The frontend dynamically renders each step and allows navigation (including branching logic).

## Overview & Design Decisions

### Schema-Driven Flow

- The backend provides a JSON schema (via GET /api/questionnaire), detailing steps, their types (info, text, select, multiselect, etc.), and next logic (potentially branching).
- The frontend renders each step based on its type. When the user answers, we store partial responses (via POST /api/response).
- This allows adding/removing/modifying steps without deeply changing the frontend logic.

### React Frontend

- Written in React + TypeScript (with SASS for styling).
- The app dynamically figures out which step to show:
- For simple flows, we store an index or path and proceed step by step.
- For branching flows, the schema’s next property might be a string or an object with conditions.

### Node.js/Express Backend

- Serves the JSON schema at /api/questionnaire.
- Accepts partial or final user responses at /api/response.
- Currently uses an in-memory store or logs in the console for demo. In a production app, you’d likely persist to a database.

## Setup & Running

### Backend

Install dependencies:

```bash
cd server
npm install
```

Start the server:

```bash
npm run dev
```

By default, it listens at port 3001. Visit http://localhost:3001/api/questionnaire to see the schema.

### Frontend

Install dependencies:

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
```

The app usually runs at http://localhost:5173 by default. It will fetch the questionnaire from the backend and render it dynamically.

## Schema Overview

The questionnaire schema is a JSON object, typically shaped like:

```json
{
  "id": "sample-questionnaire",
  "title": "Sample Questionnaire",
  "steps": [
    {
      "id": "welcome",
      "type": "info",
      "content": "Welcome to the questionnaire! Click continue to begin.",
      "next": "q1"
    },
    {
      "id": "q1",
      "type": "text",
      "question": "What is your name?",
      "next": "q2"
    },
    {
      "id": "q2",
      "type": "select",
      "question": "What is your favorite color?",
      "options": ["Red", "Blue"],
      "next": {
        "default": "blue-info",
        "conditions": {
          "Red": "red-info"
        }
      }
    },
    {
      "id": "red-info",
      "type": "info",
      "content": "Red is bold!",
      "next": "end"
    },
    {
      "id": "blue-info",
      "type": "info",
      "content": "Blue is calm!",
      "next": "end"
    },
    {
      "id": "end",
      "type": "info",
      "content": "Thanks for participating!",
      "next": null
    }
  ]
}
```

`id` and `type`: The step’s unique identifier (id) and step type (info, text, select, multiselect, etc.).

`question` or `content`: For question types, we display a prompt. For info steps, we show content.

`options`: An array of strings for select or multiselect.

`next`: Either a string for direct next step ID, or an object with default and conditions for branching logic.
E.g. `"next": { "default": "blue-info", "conditions": { "Red": "red-info" } }`

### Extending or Modifying the Schema

Add a New Step:

- Append a new object to the steps array with a unique id.
- Decide its type (maybe 'date', 'number'?), define the relevant fields (e.g., question, options if needed).
- Update the next property of any previous step(s) that should lead to it.
- In the frontend, create a new component for that type (e.g., DateQuestion.tsx).
- In App.tsx, add a case to handle that type in your renderStep or step logic.

Add More Branching Logic:

- In a given step’s next, add more keys to conditions. Example:

```json
"next": {
  "default": "end",
  "conditions": {
    "Under 18": "parent-info",
    "18 or older": "adult-step"
  }
}
```

Validation / Required Fields:

- Extend the schema to have a required: true property or a validation rule.
- In the frontend question component, if it sees required: true, it can disallow “Next” until an answer is provided.

Localization:

- Instead of question: 'What is your name?', you could do question: `{ en: 'What is your name?', pt: 'Como você se chama?' }`.
- Then the app picks the correct language string.

Essentially, the schema is flexible. Each step’s shape is determined by its type property and relevant fields. The frontend only needs to have a matching component or logic for each step type.
