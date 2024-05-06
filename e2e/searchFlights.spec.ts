import test from "@playwright/test";
import FlightsPage from "../PageObjects/FlightsPage";
import ExplorePage from "../PageObjects/ExplorePage";
import CommonPage from "../PageObjects/CommonPage";

test('Search for flights in Europe', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const flightsPage = new FlightsPage(page);
    const explorePage = new ExplorePage(page);
    const commonPage = new CommonPage(page);

    await page.goto('flights')
    await page.getByRole('button', { name: 'Reject all' }).click();
    commonPage.changeCurrency('EUR');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Explore' }).first().click();
    explorePage.changeTripDetails('October', 'Weekend');
    explorePage.changeStopsNo('Nonstop only');
    await page.waitForTimeout(5000);
    explorePage.printDestinationDetails();
});
