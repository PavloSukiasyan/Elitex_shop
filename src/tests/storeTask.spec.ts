import { test, expect } from "@playwright/test";
import { CommonSteps } from "../pages/commonSteps";
import { PasswordPage } from "../pages/passwordPage";
import { ProductPage } from "../pages/productPage";
import { CheckoutPage } from "../pages/checkoutPage";

test.describe("Tests for Store: ", () => {
  const password = "qwerty";
  const testProductName = "test-product-cherry";

  test.beforeEach(async ({ page }) => {
    const commonSteps = new CommonSteps(page);
    const passPage = new PasswordPage(page);

    await commonSteps.openHomePage();
    await passPage.submitPassword(password);
    await commonSteps.openTestStore();
  });

  test("The user can purchase the product with a subscription", async ({ page }) => {
    const prodPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await expect
      .soft(page)
      .toHaveURL("https://smartrr-staging-automation-1.myshopify.com/products/test-product-cherry");

    await expect.soft(prodPage.topLabel).toHaveText("Welcome to our store");
    await expect.soft(prodPage.topLabel).toHaveCSS("font-size", "13px");
    await expect.soft(prodPage.topLabel).toHaveCSS("font-family", "Assistant, sans-serif");
    await expect.soft(prodPage.topLabel).toHaveCSS("color", "rgb(18, 18, 18)");

    await expect.soft(prodPage.prTitle).toHaveText(testProductName);
    await expect.soft(prodPage.prTitle).toHaveCSS("font-size", "40px");

    await expect.soft(prodPage.prTitle).toHaveCSS("font-family", "Assistant, sans-serif");
    await expect.soft(prodPage.prTitle).toHaveCSS("color", "rgb(18, 18, 18)");

    await expect.soft(prodPage.prPrice).toHaveText("$2.07");
    await expect.soft(prodPage.prQuantityInput).toHaveValue("1");

    await expect.soft(prodPage.sellingOptionOneName).toHaveText("One time purchase");
    await expect.soft(prodPage.sellingOptionOneInput).toBeChecked({ checked: false });
    await expect.soft(prodPage.sellingOptionTwoName).toHaveText("Subscribe & Save");
    await expect.soft(prodPage.sellingOptionTwoInput).toBeChecked();

    await expect.soft(prodPage.deliveryFrequencyTitle).toHaveText("Deliver Every");
    await expect.soft(prodPage.deliverySelect).toHaveValue("3253633272");
    expect.soft(await prodPage.getDeliverySelectedValue()).toBe("Monthly");

    await expect.soft(prodPage.prDescription).toHaveText("sweet cherry");

    await expect.soft(prodPage.addToCartBtn).toBeVisible();
    await expect.soft(prodPage.buyItNowBtn).toBeVisible();
    await expect.soft(prodPage.buyItNowBtn).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect.soft(prodPage.buyItNowBtn).toHaveCSS("background-color", "rgb(18, 18, 18)");

    await prodPage.buyItNowBtn.click();

    await expect(checkoutPage.headerBanner).toBeVisible();

    const checkoutURL = await page.url();
    expect.soft(checkoutURL).toContain("smartrr-staging-automation-1.myshopify.com/checkouts/bin/");

    await expect(checkoutPage.headerBanner).toHaveText("smartrr-staging-automation-1");

    await expect.soft(checkoutPage.quantity).toHaveText("1");
    await expect.soft(checkoutPage.productName).toHaveText(testProductName);
    await expect.soft(checkoutPage.price).toHaveText("$2.07");
    await expect.soft(checkoutPage.deliveryOption).toHaveText("Every month");
  });
});
