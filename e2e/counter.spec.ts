import { test, expect } from "@playwright/test";

test.only("Counter", async ({ page }) => {
  await page.goto("/");
  const widget = page.getByTestId("counter");
  const count = widget.getByTestId("count");

  await expect(count).toHaveText("0");
  await widget.getByTestId("button").click({ clickCount: 2 });

  await expect(count).toHaveText("2");
});
