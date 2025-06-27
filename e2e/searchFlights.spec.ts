import test from "@playwright/test";
import ExplorePage from "../PageObjects/ExplorePage";
import CommonPage from "../PageObjects/CommonPage";
import FlightsPage from "../PageObjects/FlightsPage";

test('Search for nonstop flights in Europe', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const explorePage = new ExplorePage(page);
    const commonPage = new CommonPage(page);
    const flightsPage = new FlightsPage(page)
    const originCity = 'LHR';


    await page.goto('flights')
    // await page.getByRole('button', { name: 'Reject all' }).click();
    commonPage.changeCurrency('EUR');
    await page.waitForLoadState('networkidle');
    await flightsPage.whereFromInput.first().fill(originCity);
    await page.locator(`li[aria-label*="${originCity}"]`).first().click();
    const origin = await flightsPage.whereFromInput.first().inputValue();
    console.log(`Origin city is: ${origin}`);
    await page.getByRole('button', { name: 'Explore' }).first().click();
    await page.waitForTimeout(1000);
    explorePage.changeTripDetails('July', 'Weekend');
    await page.waitForTimeout(2000);
    explorePage.changeStopsNo('Nonstop only');
    await page.waitForTimeout(2000);
    explorePage.printDestinationDetails(true);
});
