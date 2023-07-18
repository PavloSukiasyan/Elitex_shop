import { test, expect } from "@playwright/test";
import { CommonSteps } from "../pages/commonSteps";
import { PasswordPage } from "../pages/passwordPage";
import { ProductPage } from "../pages/productPage";

test.describe("Tests for Store: ", () => {
  const password = "qwerty";

  test.beforeEach(async ({ page }) => {
    const commonSteps = new CommonSteps(page);
    const passPage = new PasswordPage(page);

    await commonSteps.openHomePage();
    await passPage.submitPassword(password);
    await commonSteps.openTestStore();
  });

  test("The user can purchase the product with a subscription", async ({ page }) => {
    const prodPage = new ProductPage(page);
    await expect
      .soft(page)
      .toHaveURL("https://smartrr-staging-automation-1.myshopify.com/products/test-product-cherry");

    await expect.soft(prodPage.topLabel).toHaveText("Welcome to our store");
    await expect.soft(prodPage.topLabel).toHaveCSS("font-size", "13px");
    await expect.soft(prodPage.topLabel).toHaveCSS("font-family", "Assistant, sans-serif");
    await expect.soft(prodPage.topLabel).toHaveCSS("color", "rgb(18, 18, 18)");

    await expect.soft(prodPage.prTitle).toHaveText("test-product-cherry");
    await expect.soft(prodPage.prTitle).toHaveCSS("font-size", "40px");

    await expect.soft(prodPage.prTitle).toHaveCSS("font-family", "Assistant, sans-serif");
    await expect.soft(prodPage.prTitle).toHaveCSS("color", "rgb(18, 18, 18)");

    await expect.soft(prodPage.prPrice).toHaveText("$2.07");
    await expect.soft(prodPage.prQuantityInput).toHaveValue("1");

    await expect.soft(prodPage.sellingOptionOneName).toHaveText("One time purchase");
    await expect.soft(prodPage.sellingOptionOneInput).toBeChecked({ checked: false });
    await expect.soft(prodPage.sellingOptionTwoName).toHaveText("Subscribe & Save");
    await expect.soft(prodPage.sellingOptionTwoInput).toBeChecked();
  });
});
