// Registers jest-dom's custom matchers (toBeInTheDocument, toHaveClass, etc.)
// and cleans up the DOM between tests so component tests stay isolated.
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
