import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, THEME_STORAGE_KEY, useTheme } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

function Probe() {
  const { theme } = useTheme();
  return <><output data-testid="theme">{theme}</output><ThemeToggle /></>;
}

function mount() {
  return render(<ThemeProvider><Probe /></ThemeProvider>);
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Appearance functions", () => {
  it("starts in light mode without a saved preference", async () => {
    mount();
    await waitFor(() => expect(screen.getByRole("button")).toBeEnabled());
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("switches both ways and persists the choice across remounts", () => {
    const view = mount();
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    view.unmount();
    mount();
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("falls back to light for an invalid preference", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "invalid");
    mount();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("still switches when browser storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Blocked"); });
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(document.documentElement).toHaveClass("dark");
  });

  it("synchronizes a saved preference from another tab", () => {
    mount();
    fireEvent(window, new StorageEvent("storage", { key: THEME_STORAGE_KEY, newValue: "dark" }));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });
});