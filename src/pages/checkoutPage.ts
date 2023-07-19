import { Page } from "@playwright/test";

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  private base = this.page.locator("#app");
  headerBanner = this.base.locator("header span");

  private asidePart = this.base.locator("aside");
  private resourceListItems = this.asidePart.locator(
    'div[role="table"][aria-labelledby="ResourceList0"]',
  );
  quantity = this.resourceListItems.locator("p").nth(0);
  productName = this.resourceListItems.locator("p").nth(1);
  deliveryOption = this.resourceListItems.locator("p").nth(2);
  price = this.resourceListItems.locator('span[class*="notranslate"]');

  private moneyLineItems = this.asidePart.locator(
    'div[role="table"][aria-labelledby="MoneyLine-Heading0"]',
  );
  subtotalLabel = this.moneyLineItems.locator("span").nth(0);
  subtotalPrice = this.moneyLineItems.locator("span").nth(1);
  shippingLabel = this.moneyLineItems.locator("span").nth(2);
  shippingValue = this.moneyLineItems.locator("span").nth(3);
  totalLabel = this.moneyLineItems.locator("span").nth(4);

  totalCurrencyLabel = this.moneyLineItems.locator('abbr[class*="notranslate"]');
  totalPrice = this.moneyLineItems.locator('strong[class*="notranslate"]');

  private recurringSubtotal = this.asidePart.locator(
    'section[aria-label="Recurring subtotal"] span',
  );
  recurringSubtotalLabel = this.recurringSubtotal.nth(0);
  recurringSubtotalInfo = this.recurringSubtotal.nth(3);

  private mainCheckout = this.base.locator("#checkout-main");
  googlePayBtn = this.mainCheckout.locator("#google-pay-button-container button");
  private sectionContact = this.mainCheckout.locator('section[aria-label="Contact"]');
  contactFieldLabel = this.sectionContact.locator("#step-section-primary-header");
  emailInput = this.sectionContact.locator("input#email");
  private shippingAddress = this.mainCheckout.locator('section[aria-label="Shipping address"]');
  shippingAreaFieldLabel = this.shippingAddress.locator("h2");
  private shippingAreaForm = this.shippingAddress.locator("#shippingAddressForm");

  firstNameInput = this.shippingAreaForm.locator('input[id*="TextField"][name="firstName"]');
  lastNameInput = this.shippingAreaForm.locator('input[id*="TextField"][name="lastName"]');
  addressInput = this.shippingAreaForm.locator(
    'input[name="address1"][id*="address"]:not([aria-hidden="true"])',
  );

  cityInput = this.shippingAreaForm.locator('input[name="city"]:not([aria-hidden="true"])');
  stateSelect = this.shippingAreaForm.locator('select[name="zone"]:not([aria-hidden="true"])');
  postalCodeInput = this.shippingAreaForm.locator(
    'input[name="postalCode"]:not([aria-hidden="true"])',
  );

  private addressAutoCompleteComboBox = this.base.locator(
    '#PortalHost div[aria-labelledby*="autocomplete-title"]',
  );
  addressSuggestionsOptions = this.addressAutoCompleteComboBox.locator("ul#address1-options li");

  continueToShippingBtn = this.mainCheckout.locator(
    'button[type="submit"]:not([aria-hidden="true"])',
  );

  sectionReview = this.base.locator('section[aria-label="Review"]');

  async fillInformationForm(
    email: string,
    fistName: string,
    lastName: string,
    address: string,
    indexOfSearch = 0,
  ) {
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(fistName);
    await this.lastNameInput.fill(lastName);
    await this.addressInput.fill(address);
    await this.addressSuggestionsOptions.nth(indexOfSearch).click();
    // click away to close suggestions list
    await this.lastNameInput.click();
  }

  async getStateSelectedValue() {
    let result: string;
    const selectValue = await this.stateSelect.inputValue();

    if (selectValue === "AL") {
      result = "Alabama";
    } else if (selectValue === "AK") {
      result = "Alaska";
    } else if (selectValue === "NY") {
      result = "New York";
    } else {
      result = "There can be More States! Add them! or do something else";
    }
    return result;
  }
}
