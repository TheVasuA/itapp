import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

import { Button } from "@/components/ui/button";

/**
 * Smoke test for the testing framework (Task 1.4).
 *
 * Confirms that Vitest + React Testing Library + jsdom render a shadcn
 * primitive correctly and that jest-dom matchers are wired up.
 *
 * Uses React.createElement instead of JSX to avoid Vite SSR transform
 * parsing issues with JSX in .js files.
 */
describe("Button (testing-framework smoke test)", () => {
  it("renders its children and is present in the document", () => {
    render(React.createElement(Button, null, "Click me"));

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
  });

  it("applies the default variant classes", () => {
    render(React.createElement(Button, null, "Styled"));

    const button = screen.getByRole("button", { name: "Styled" });
    expect(button).toHaveClass("bg-primary");
  });
});
