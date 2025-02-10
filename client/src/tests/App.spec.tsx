import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "../App.tsx";

vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("App Integration Tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the first step and navigates to the next step on user action", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: "test-q",
        title: "Test Questionnaire",
        steps: [
          {
            id: "welcome",
            type: "info",
            content: "Welcome to the questionnaire! Click continue.",
            next: "q1",
          },
          {
            id: "q1",
            type: "text",
            question: "What is your name?",
            next: null,
          },
        ],
      },
    });

    mockedAxios.post.mockResolvedValue({});

    render(<App />);

    expect(
      await screen.findByText(/Welcome to the questionnaire!/i)
    ).toBeDefined();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeInTheDocument();

    await userEvent.click(continueButton);

    expect(await screen.findByText(/what is your name\?/i)).toBeInTheDocument();

    const nameInput = screen.getByRole("textbox");
    await userEvent.type(nameInput, "Alice");
    const nextButton = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextButton);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/response"),
      { q1: "Alice" }
    );
  });

  it("allows navigating back", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: "test-q",
        title: "Test with Back Navigation",
        steps: [
          {
            id: "step1",
            type: "info",
            content: "Step One",
            next: "step2",
          },
          {
            id: "step2",
            type: "text",
            question: "Enter your name",
            next: "step3",
          },
          {
            id: "step3",
            type: "info",
            content: "Last step!",
            next: null,
          },
        ],
      },
    });

    mockedAxios.post.mockResolvedValue({});

    render(<App />);

    expect(await screen.findByText("Step One")).toBeInTheDocument();

    const continueBtn = screen.getByRole("button", { name: /continue/i });
    await userEvent.click(continueBtn);

    expect(await screen.findByText(/Enter your name/i)).toBeInTheDocument();

    const textBox = screen.getByRole("textbox");
    await userEvent.type(textBox, "John Wick");

    const nextBtn = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextBtn);

    expect(await screen.findByText("Last step!")).toBeInTheDocument();

    const backBtn = screen.getByRole("button", { name: /back/i });
    await userEvent.click(backBtn);

    expect(await screen.findByText(/Enter your name/i)).toBeInTheDocument();

    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(
      "John Wick"
    );
  });

  const branchingSchema = {
    id: "branching-q",
    title: "Branching Questionnaire",
    steps: [
      {
        id: "q1",
        type: "select",
        question: "What is your favorite color?",
        options: ["Red", "Blue"],
        next: {
          default: "blue-info",
          conditions: {
            Red: "red-info",
          },
        },
      },
      {
        id: "red-info",
        type: "info",
        content: "Red is bold!",
        next: "end",
      },
      {
        id: "blue-info",
        type: "info",
        content: "Blue is calm!",
        next: "end",
      },
      {
        id: "end",
        type: "info",
        content: "Thanks for participating!",
        next: null,
      },
    ],
  };

  it("shows red-info step if user picks Red", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: branchingSchema });
    mockedAxios.post.mockResolvedValue({});

    render(<App />);

    expect(
      await screen.findByText(/What is your favorite color?/i)
    ).toBeInTheDocument();

    const redRadio = screen.getByRole("radio", { name: /red/i });
    await userEvent.click(redRadio);

    const nextButton = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextButton);

    expect(await screen.findByText("Red is bold!")).toBeInTheDocument();

    const continueBtn = screen.getByRole("button", { name: /continue/i });
    await userEvent.click(continueBtn);

    expect(
      await screen.findByText("Thanks for participating!")
    ).toBeInTheDocument();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/response"),
      { q1: "Red" }
    );
  });

  it("shows blue-info step if user picks Blue", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: branchingSchema });
    mockedAxios.post.mockResolvedValue({});

    render(<App />);

    expect(
      await screen.findByText("What is your favorite color?")
    ).toBeInTheDocument();

    const blueRadio = screen.getByRole("radio", { name: /blue/i });
    await userEvent.click(blueRadio);

    const nextButton = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextButton);

    expect(await screen.findByText("Blue is calm!")).toBeInTheDocument();

    const continueBtn = screen.getByRole("button", { name: /continue/i });
    await userEvent.click(continueBtn);

    expect(
      await screen.findByText("Thanks for participating!")
    ).toBeInTheDocument();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/response"),
      { q1: "Blue" }
    );
  });

  it("Selecting multiple options", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: "multiselect-q",
        title: "Multiselect Questionnaire",
        steps: [
          {
            id: "q1",
            type: "multiselect",
            question: "Which languages do you speak?",
            options: ["German", "English", "Portuguese"],
            next: "end",
          },
          {
            id: "end",
            type: "info",
            content: "Thanks for participating!",
            next: null,
          },
        ],
      },
    });
    mockedAxios.post.mockResolvedValue({});

    render(<App />);

    expect(
      await screen.findByText(/Which languages do you speak?/i)
    ).toBeInTheDocument();

    const englishOption = screen.getByRole("checkbox", { name: /english/i });
    await userEvent.click(englishOption);

    const portugueseOption = screen.getByRole("checkbox", {
      name: /portuguese/i,
    });
    await userEvent.click(portugueseOption);

    const nextButton = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextButton);

    expect(
      await screen.findByText("Thanks for participating!")
    ).toBeInTheDocument();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/response"),
      { q1: ["English", "Portuguese"] }
    );
  });
});
