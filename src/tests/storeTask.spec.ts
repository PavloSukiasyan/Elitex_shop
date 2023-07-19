import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
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

    await expect.soft(checkoutPage.subtotalLabel).toHaveText("Subtotal");
    await expect.soft(checkoutPage.subtotalPrice).toHaveText("$2.07");
    await expect.soft(checkoutPage.shippingLabel).toHaveText("Shipping");
    await expect.soft(checkoutPage.shippingValue).toHaveText("Calculated at next step");
    await expect.soft(checkoutPage.totalLabel).toHaveText("Total");
    await expect.soft(checkoutPage.totalCurrencyLabel).toHaveText("USD");
    await expect.soft(checkoutPage.totalPrice).toHaveText("$2.07");
    await expect.soft(checkoutPage.recurringSubtotalLabel).toHaveText("Recurring subtotal");
    await expect.soft(checkoutPage.recurringSubtotalInfo).toHaveText("$2.07 every month");

    await expect.soft(checkoutPage.googlePayBtn).toBeVisible();
    await expect.soft(checkoutPage.contactFieldLabel).toHaveText("Contact");
    await expect.soft(checkoutPage.emailInput).toBeVisible();

    const randomFirstName = faker.person.firstName("male");
    const randomLastName = faker.person.lastName("male");
    const randomEmail = faker.internet.email({
      firstName: randomFirstName,
      lastName: randomLastName,
    });
    // This depends on search result order
    const addressToSearch = "664 9th Avenue";
    const city = "New York";
    const postCode = "10036";

    await checkoutPage.fillInformationForm(
      randomEmail,
      randomFirstName,
      randomLastName,
      addressToSearch,
    );
    await expect.soft(checkoutPage.shippingAreaFieldLabel).toHaveText("Shipping address");
    await expect.soft(checkoutPage.emailInput).toHaveValue(randomEmail);
    await expect.soft(checkoutPage.addressInput).toHaveValue(addressToSearch);
    await expect.soft(checkoutPage.cityInput).toHaveValue(city);
    await expect.soft(checkoutPage.stateSelect).toHaveValue("NY");
    expect.soft(await checkoutPage.getStateSelectedValue()).toBe(city);
    await expect.soft(checkoutPage.postalCodeInput).toHaveValue(postCode);

    await checkoutPage.continueToShippingBtn.click();

    await expect.soft(checkoutPage.sectionReview).toBeVisible();
    const checkoutURLShipping = await page.url();
    expect.soft(checkoutURLShipping).toContain("/shipping");

    await expect.soft(checkoutPage.subtotalLabel).toHaveText("Subtotal");
    await expect.soft(checkoutPage.subtotalPrice).toHaveText("$2.07");
    await expect.soft(checkoutPage.shippingLabel).toHaveText("Shipping");
    await expect.soft(checkoutPage.shippingValue).toHaveText("$2.00");
    await expect.soft(checkoutPage.totalLabel).toHaveText("Total");
    await expect.soft(checkoutPage.totalCurrencyLabel).toHaveText("USD");
    await expect.soft(checkoutPage.totalPrice).toHaveText("$4.07");
    await expect.soft(checkoutPage.recurringSubtotalLabel).toHaveText("Recurring subtotal");
    await expect.soft(checkoutPage.recurringSubtotalInfo).toHaveText("$2.07 every month");
  });
});
