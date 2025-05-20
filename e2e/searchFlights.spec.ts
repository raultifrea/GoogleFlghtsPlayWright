import test from "@playwright/test";
import ExplorePage from "../PageObjects/ExplorePage";
import CommonPage from "../PageObjects/CommonPage";

test('Search for nonstop flights in Europe', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const explorePage = new ExplorePage(page);
    const commonPage = new CommonPage(page);

    await page.goto('flights')
    await page.getByRole('button', { name: 'Reject all' }).click();
    commonPage.changeCurrency('EUR');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Explore' }).first().click();
    await page.waitForTimeout(1000);
    explorePage.changeTripDetails('July', 'Weekend');
    await page.waitForTimeout(2000);
    explorePage.changeStopsNo('Nonstop only');
    await page.waitForTimeout(2000);
    explorePage.printDestinationDetails(true);
});
