import { ThemeProvider } from "@contexts/ThemeContext";
import { useTheme } from "@hooks/useTheme";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

vi.hoisted(() => {
  // Mock matchMedia API
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    enumerable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

function renderComponent() {
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );
}

describe("ThemeContext", () => {
  it("provides the inital theme", () => {
    renderComponent();

    const themeElement = screen.getByTestId("theme");
    expect(themeElement).toHaveTextContent("light");
  });

  it("toggles the theme", async () => {
    renderComponent();

    const themeElement = screen.getByTestId("theme");
    const toggleButton = screen.getByText("Toggle Theme");

    expect(themeElement).toHaveTextContent("light");

    await userEvent.click(toggleButton);
    expect(themeElement).toHaveTextContent("dark");

    await userEvent.click(toggleButton);
    expect(themeElement).toHaveTextContent("light");
  });

  it("saves to the local storage", async () => {
    renderComponent();

    const toggleButton = screen.getByText("Toggle Theme");

    await userEvent.click(toggleButton);
    expect(localStorage.getItem("theme")).toBe("dark");

    await userEvent.click(toggleButton);
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
