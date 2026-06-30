import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import axe from "axe-core";
import { ContactForm } from "@/components/sections/contact-form";
import { Button } from "@/components/ui/button";

/**
 * Accessibility checks via axe-core (Milestone 4). Runs in CI (jsdom).
 *
 * NOTE: jsdom cannot compute layout/contrast, so `color-contrast` is checked
 * separately in the Lighthouse CI gate (real browser). Here we assert
 * structural/ARIA correctness: labels, names, roles.
 */

afterEach(cleanup);

const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    "color-contrast": { enabled: false },
    region: { enabled: false },
  },
};

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, AXE_OPTIONS);
  const messages = results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.length} node(s))`,
  );
  expect(messages).toEqual([]);
}

describe("accessibility (axe-core)", () => {
  it("contact form has labelled controls", async () => {
    const { container } = render(<ContactForm />);
    await expectNoViolations(container);
  });

  it("buttons expose an accessible name", async () => {
    const { container } = render(
      <div>
        <Button>Send message</Button>
        <Button aria-label="Toggle theme" size="icon">
          <span aria-hidden>☾</span>
        </Button>
      </div>,
    );
    await expectNoViolations(container);
  });
});
