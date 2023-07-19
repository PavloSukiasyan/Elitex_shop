import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { CommonSteps } from "../pages/commonSteps";
import { PasswordPage } from "../pages/passwordPage";
import { ProductPage } from "../pages/productPage";
import { CheckoutHeaderComponent } from "../pages/checkout/checkoutPage";
import { AsideTotalComponent } from "../pages/checkout/asideTotalComponent";
import { InformationComponent } from "../pages/checkout/informationComponent";
import { ShippingComponent } from "../pages/checkout/shippingComponent";
import { PaymentComponent } from "../pages/checkout/paymentComponent";
import { SubscriptionAgreementComponent } from "../pages/checkout/subscriptionAgreementComponent";
import { ThankYouPage } from "../pages/thankYouPage";

test.describe("Tests for Store: ", () => {
  const password = "qwerty";
  const testProductName = "test-product-cherry";

  let prodPage: ProductPage;
  let headerComp: CheckoutHeaderComponent;
  let asideTotalComp: AsideTotalComponent;
  let infoComp: InformationComponent;
  let shippingComp: ShippingComponent;
  let paymentComp: PaymentComponent;
  let subscriptionAgr: SubscriptionAgreementComponent;
  let thankYouPage: ThankYouPage;

  test.beforeEach(async ({ page }) => {
    const commonSteps = new CommonSteps(page);
    const passPage = new PasswordPage(page);

    prodPage = new ProductPage(page);
    headerComp = new CheckoutHeaderComponent(page);
    asideTotalComp = new AsideTotalComponent(page);
    infoComp = new InformationComponent(page);
    shippingComp = new ShippingComponent(page);
    paymentComp = new PaymentComponent(page);
    subscriptionAgr = new SubscriptionAgreementComponent(page);
    thankYouPage = new ThankYouPage(page);

    await commonSteps.openHomePage();
    await passPage.submitPassword(password);
    await commonSteps.openTestStore();
  });

  test("The user can purchase the product with a subscription", async ({ page }) => {
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

    await expect(headerComp.headerBanner).toBeVisible();

    const checkoutURL = await page.url();
    expect.soft(checkoutURL).toContain("smartrr-staging-automation-1.myshopify.com/checkouts/bin/");

    await expect(headerComp.headerBanner).toHaveText("smartrr-staging-automation-1");

    await expect.soft(asideTotalComp.quantity).toHaveText("1");
    await expect.soft(asideTotalComp.productName).toHaveText(testProductName);
    await expect.soft(asideTotalComp.price).toHaveText("$2.07");
    await expect.soft(asideTotalComp.deliveryOption).toHaveText("Every month");

    await expect.soft(asideTotalComp.subtotalLabel).toHaveText("Subtotal");
    await expect.soft(asideTotalComp.subtotalPrice).toHaveText("$2.07");
    await expect.soft(asideTotalComp.shippingLabel).toHaveText("Shipping");
    await expect.soft(asideTotalComp.shippingValue).toHaveText("Calculated at next step");
    await expect.soft(asideTotalComp.totalLabel).toHaveText("Total");
    await expect.soft(asideTotalComp.totalCurrencyLabel).toHaveText("USD");
    await expect.soft(asideTotalComp.totalPrice).toHaveText("$2.07");
    await expect.soft(asideTotalComp.recurringSubtotalLabel).toHaveText("Recurring subtotal");
    await expect.soft(asideTotalComp.recurringSubtotalInfo).toHaveText("$2.07 every month");

    await expect.soft(infoComp.googlePayBtn).toBeVisible();
    await expect.soft(infoComp.contactFieldLabel).toHaveText("Contact");
    await expect.soft(infoComp.emailInput).toBeVisible();

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

    await infoComp.fillInformationForm(
      randomEmail,
      randomFirstName,
      randomLastName,
      addressToSearch,
    );
    await expect.soft(infoComp.shippingAreaFieldLabel).toHaveText("Shipping address");
    await expect.soft(infoComp.emailInput).toHaveValue(randomEmail);
    await expect.soft(infoComp.addressInput).toHaveValue(addressToSearch);
    await expect.soft(infoComp.cityInput).toHaveValue(city);
    await expect.soft(infoComp.stateSelect).toHaveValue("NY");
    expect.soft(await infoComp.getStateSelectedValue()).toBe(city);
    await expect.soft(infoComp.postalCodeInput).toHaveValue(postCode);

    await infoComp.continueToNextStepBtn.click();

    await expect.soft(shippingComp.email).toHaveText(randomEmail);
    await expect
      .soft(shippingComp.address)
      .toHaveText(`${addressToSearch}, ${city} NY ${postCode}, United States`);
    await expect.soft(shippingComp.descriptionOfShipping).toHaveText("$2 if order price is < $25");
    await expect.soft(shippingComp.priceOfShipping).toHaveText("$2.00");
    await expect.soft(shippingComp.shipping).toBeHidden();

    const checkoutURLShipping = await page.url();
    expect.soft(checkoutURLShipping).toContain("/shipping");

    await expect(headerComp.headerBanner).toBeVisible();

    await expect.soft(asideTotalComp.subtotalLabel).toHaveText("Subtotal");
    await expect.soft(asideTotalComp.subtotalPrice).toHaveText("$2.07");
    await expect.soft(asideTotalComp.shippingLabel).toHaveText("Shipping");
    await expect.soft(asideTotalComp.shippingValue).toHaveText("$2.00");
    await expect.soft(asideTotalComp.totalLabel).toHaveText("Total");
    await expect.soft(asideTotalComp.totalCurrencyLabel).toHaveText("USD");
    await expect.soft(asideTotalComp.totalPrice).toHaveText("$4.07");
    await expect.soft(asideTotalComp.recurringSubtotalLabel).toHaveText("Recurring subtotal");
    await expect.soft(asideTotalComp.recurringSubtotalInfo).toHaveText("$2.07 every month");

    await infoComp.continueToNextStepBtn.click();

    await expect
      .soft(shippingComp.address)
      .toHaveText(`${addressToSearch}, ${city} NY ${postCode}, United States`);
    await expect.soft(shippingComp.descriptionOfShipping).toHaveText("$2 if order price is < $25");
    await expect.soft(shippingComp.priceOfShipping).toHaveText("$2.00");
    await expect.soft(shippingComp.shipping).toHaveText("$2 if order price is < $25 · $2.00");

    const checkoutURLPayment = await page.url();
    expect.soft(checkoutURLPayment).toContain("/payment");

    await expect.soft(asideTotalComp.subtotalLabel).toHaveText("Subtotal");
    await expect.soft(asideTotalComp.subtotalPrice).toHaveText("$2.07");
    await expect.soft(asideTotalComp.shippingLabel).toHaveText("Shipping");
    await expect.soft(asideTotalComp.shippingValue).toHaveText("$2.00");
    await expect.soft(asideTotalComp.totalLabel).toHaveText("Total");
    await expect.soft(asideTotalComp.totalCurrencyLabel).toHaveText("USD");
    await expect.soft(asideTotalComp.totalPrice).toHaveText("$4.07");
    await expect.soft(asideTotalComp.recurringSubtotalLabel).toHaveText("Recurring subtotal");
    await expect.soft(asideTotalComp.recurringSubtotalInfo).toHaveText("$2.07 every month");

    await paymentComp.fillPaymentCardDetails(randomFirstName, randomLastName);
    await expect.soft(subscriptionAgr.alertMessage).toBeHidden();
    await infoComp.continueToNextStepBtn.click();

    await expect.soft(subscriptionAgr.alertMessage).toBeVisible();
    await expect.soft(subscriptionAgr.subscriptionCheckbox).toBeChecked({ checked: false });

    await subscriptionAgr.subscriptionCheckbox.check();
    await expect.soft(subscriptionAgr.subscriptionCheckbox).toBeChecked();
    await infoComp.continueToNextStepBtn.click();
    await page.waitForLoadState("networkidle");

    await expect.soft(thankYouPage.orderNumber).toBeVisible();
    await expect
      .soft(thankYouPage.orderHeaderTitle)
      .toContainText(`Thank you, ${randomFirstName}!`);

    const checkoutURLThankYou = await page.url();
    expect.soft(checkoutURLThankYou).toContain("/thank_you");
  });

  test("The user can purchase two products with a subscription", async ({ page }) => {
    await expect
      .soft(page)
      .toHaveURL("https://smartrr-staging-automation-1.myshopify.com/products/test-product-cherry");

    await expect.soft(prodPage.topLabel).toHaveText("Welcome to our store");
    await expect.soft(prodPage.prTitle).toHaveText(testProductName);
    await expect.soft(prodPage.prTitle).toHaveCSS("font-family", "Assistant, sans-serif");

    await expect.soft(prodPage.prPrice).toHaveText("$2.07");
    await expect.soft(prodPage.prQuantityInput).toHaveValue("1");
    await prodPage.prQuantityIncrease.click();
    await expect.soft(prodPage.prQuantityInput).toHaveValue("2");

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

    await prodPage.buyItNowBtn.click();

    await expect(headerComp.headerBanner).toBeVisible();

    const checkoutURL = await page.url();
    expect.soft(checkoutURL).toContain("smartrr-staging-automation-1.myshopify.com/checkouts/bin/");

    await expect(headerComp.headerBanner).toHaveText("smartrr-staging-automation-1");

    await expect.soft(asideTotalComp.quantity).toHaveText("2");
    await expect.soft(asideTotalComp.productName).toHaveText(testProductName);
    await expect.soft(asideTotalComp.price).toHaveText("$4.14");
    await expect.soft(asideTotalComp.deliveryOption).toHaveText("Every month");

    await expect.soft(asideTotalComp.subtotalLabel).toHaveText("Subtotal");
    await expect.soft(asideTotalComp.subtotalPrice).toHaveText("$4.14");
    await expect.soft(asideTotalComp.shippingLabel).toHaveText("Shipping");
    await expect.soft(asideTotalComp.shippingValue).toHaveText("Calculated at next step");
    await expect.soft(asideTotalComp.totalLabel).toHaveText("Total");
    await expect.soft(asideTotalComp.totalCurrencyLabel).toHaveText("USD");
    await expect.soft(asideTotalComp.totalPrice).toHaveText("$4.14");
    await expect.soft(asideTotalComp.recurringSubtotalLabel).toHaveText("Recurring subtotal");
    await expect.soft(asideTotalComp.recurringSubtotalInfo).toHaveText("$4.14 every month");

    await expect.soft(infoComp.googlePayBtn).toBeVisible();
    await expect.soft(infoComp.contactFieldLabel).toHaveText("Contact");
    await expect.soft(infoComp.emailInput).toBeVisible();

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

    await infoComp.fillInformationForm(
      randomEmail,
      randomFirstName,
      randomLastName,
      addressToSearch,
    );
    await expect.soft(infoComp.shippingAreaFieldLabel).toHaveText("Shipping address");
    await expect.soft(infoComp.emailInput).toHaveValue(randomEmail);
    await expect.soft(infoComp.addressInput).toHaveValue(addressToSearch);
    await expect.soft(infoComp.cityInput).toHaveValue(city);
    await expect.soft(infoComp.stateSelect).toHaveValue("NY");
    expect.soft(await infoComp.getStateSelectedValue()).toBe(city);
    await expect.soft(infoComp.postalCodeInput).toHaveValue(postCode);

    await infoComp.continueToNextStepBtn.click();

    await expect.soft(shippingComp.email).toHaveText(randomEmail);
    await expect
      .soft(shippingComp.address)
      .toHaveText(`${addressToSearch}, ${city} NY ${postCode}, United States`);
    await expect.soft(shippingComp.descriptionOfShipping).toHaveText("$2 if order price is < $25");
    await expect.soft(shippingComp.priceOfShipping).toHaveText("$2.00");
    await expect.soft(shippingComp.shipping).toBeHidden();

    const checkoutURLShipping = await page.url();
    expect.soft(checkoutURLShipping).toContain("/shipping");

    await expect(headerComp.headerBanner).toBeVisible();

    await expect.soft(asideTotalComp.subtotalLabel).toHaveText("Subtotal");
    await expect.soft(asideTotalComp.subtotalPrice).toHaveText("$4.14");
    await expect.soft(asideTotalComp.shippingLabel).toHaveText("Shipping");
    await expect.soft(asideTotalComp.shippingValue).toHaveText("$2.00");
    await expect.soft(asideTotalComp.totalLabel).toHaveText("Total");
    await expect.soft(asideTotalComp.totalCurrencyLabel).toHaveText("USD");
    await expect.soft(asideTotalComp.totalPrice).toHaveText("$6.14");
    await expect.soft(asideTotalComp.recurringSubtotalLabel).toHaveText("Recurring subtotal");
    await expect.soft(asideTotalComp.recurringSubtotalInfo).toHaveText("$4.14 every month");

    await infoComp.continueToNextStepBtn.click();

    await expect
      .soft(shippingComp.address)
      .toHaveText(`${addressToSearch}, ${city} NY ${postCode}, United States`);
    await expect.soft(shippingComp.descriptionOfShipping).toHaveText("$2 if order price is < $25");
    await expect.soft(shippingComp.priceOfShipping).toHaveText("$2.00");
    await expect.soft(shippingComp.shipping).toHaveText("$2 if order price is < $25 · $2.00");

    const checkoutURLPayment = await page.url();
    expect.soft(checkoutURLPayment).toContain("/payment");

    await expect.soft(asideTotalComp.subtotalLabel).toHaveText("Subtotal");
    await expect.soft(asideTotalComp.subtotalPrice).toHaveText("$4.14");
    await expect.soft(asideTotalComp.shippingLabel).toHaveText("Shipping");
    await expect.soft(asideTotalComp.shippingValue).toHaveText("$2.00");
    await expect.soft(asideTotalComp.totalLabel).toHaveText("Total");
    await expect.soft(asideTotalComp.totalCurrencyLabel).toHaveText("USD");
    await expect.soft(asideTotalComp.totalPrice).toHaveText("$6.14");
    await expect.soft(asideTotalComp.recurringSubtotalLabel).toHaveText("Recurring subtotal");
    await expect.soft(asideTotalComp.recurringSubtotalInfo).toHaveText("$4.14 every month");

    await paymentComp.fillPaymentCardDetails(randomFirstName, randomLastName);
    await expect.soft(subscriptionAgr.alertMessage).toBeHidden();
    await infoComp.continueToNextStepBtn.click();

    await expect.soft(subscriptionAgr.alertMessage).toBeVisible();
    await expect.soft(subscriptionAgr.subscriptionCheckbox).toBeChecked({ checked: false });

    await subscriptionAgr.subscriptionCheckbox.check();
    await expect.soft(subscriptionAgr.subscriptionCheckbox).toBeChecked();
    await infoComp.continueToNextStepBtn.click();
    await page.waitForLoadState("networkidle");

    await expect.soft(thankYouPage.orderNumber).toBeVisible();
    await expect
      .soft(thankYouPage.orderHeaderTitle)
      .toContainText(`Thank you, ${randomFirstName}!`);

    const checkoutURLThankYou = await page.url();
    expect.soft(checkoutURLThankYou).toContain("/thank_you");
  });
});
