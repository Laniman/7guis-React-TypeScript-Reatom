import { test, expect } from "@playwright/test";

test.describe("Flight Booker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.only("one way option", async ({ page }) => {
    const widget = page.getByTestId("flight-booker");
    const select = widget.getByTestId("flight-booker-type");
    const inputStart = widget.getByTestId("input-start");
    const inputEnd = widget.getByTestId("input-end");
    const button = widget.getByTestId("button-book");

    await expect(select).toHaveValue("one-way");
    await expect(inputEnd).toBeDisabled();

    page.once("dialog", async (dialog) => {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const currentDate = `${dd}.${mm}.${yyyy}`;
      expect(dialog.message()).toContain(currentDate);
      await dialog.dismiss();
    });

    await button.click();

    const date1 = "01.01.2000";
    await inputStart.fill(date1);

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain(date1);
      await dialog.dismiss();
    });

    await button.click();
  });

  test.only("return option", async ({ page }) => {
    const widget = page.getByTestId("flight-booker");
    const select = widget.getByTestId("flight-booker-type");
    const inputStart = widget.getByTestId("input-start");
    const inputEnd = widget.getByTestId("input-end");
    const button = widget.getByTestId("button-book");

    await expect(select).toHaveValue("one-way");
    await select.selectOption("return");

    const date1 = "01.01.2000";
    await inputStart.fill(date1);

    const date2 = "29.02.2000";
    await inputEnd.fill(date2);

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain(date1);
      expect(dialog.message()).toContain(date2);
      await dialog.dismiss();
    });

    await button.click();
  });

  test.only("wrong date", async ({ page }) => {
    const widget = page.getByTestId("flight-booker");
    const select = widget.getByTestId("flight-booker-type");
    const inputStart = widget.getByTestId("input-start");
    const inputEnd = widget.getByTestId("input-end");
    const button = widget.getByTestId("button-book");

    await expect(select).toHaveValue("one-way");

    await inputStart.fill("01.20.2000");
    await expect(button).toBeDisabled();

    await inputStart.fill("01.01.2000");
    await expect(button).toBeEnabled();

    await select.selectOption("return");
    await inputEnd.fill("01.01.1999");
    await expect(button).toBeDisabled();
  });
});
