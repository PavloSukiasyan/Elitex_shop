import { test, expect } from "@playwright/test";
import { CommonSteps } from "../pages/commonStepsPage";

test.describe("Tests for Store: ", () => {
  test.beforeEach(async ({ page }) => {
    const commonSteps = new CommonSteps(page);

    await commonSteps.openTestStore();
  });

  test("The user can purchase the product with a subscription", async ({
    page,
  }) => {
    await expect(page).toHaveTitle("smartrr-staging-automation-1");
  });
});
