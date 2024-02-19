import { test, expect } from "@playwright/test";

test("TempConv Manual", async ({ page }) => {
  await page.goto("/");

  const widget = page.getByTestId("TempConvManual");
  const inputCelsius = widget.getByTestId("inputCelsius");
  const inputFahrenheit = widget.getByTestId("inputFahrenheit");

  await expect(inputCelsius).toHaveValue("");

  await inputCelsius.fill("100");
  await expect(inputFahrenheit).toHaveValue("212");

  await inputFahrenheit.fill("100");
  await expect(inputCelsius).toHaveValue("38");
});

test("TempConv Auto", async ({ page }) => {
  await page.goto("/");

  const widget = page.getByTestId("TempConvAuto");
  const inputCelsius = widget.getByTestId("inputCelsius");
  const inputFahrenheit = widget.getByTestId("inputFahrenheit");

  await expect(inputCelsius).toHaveValue("");

  await inputCelsius.fill("100");
  await expect(inputFahrenheit).toHaveValue("212");

  await inputFahrenheit.fill("100");
  await expect(inputCelsius).toHaveValue("38");
});
