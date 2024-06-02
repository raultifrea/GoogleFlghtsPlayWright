import test from "@playwright/test";
import FlightsPage from "../PageObjects/FlightsPage";
import ExplorePage from "../PageObjects/ExplorePage";
import CommonPage from "../PageObjects/CommonPage";

test('Search for nonstop flights in Europe', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const flightsPage = new FlightsPage(page);
    const explorePage = new ExplorePage(page);
    const commonPage = new CommonPage(page);

    await page.goto('flights')
    await page.getByRole('button', { name: 'Reject all' }).click();
    commonPage.changeCurrency('EUR');
    await page.waitForLoadState('networkidle');
    await flightsPage.setRoute('Frankfurt', 'Stockholm');
    await page.waitForLoadState('networkidle');
    await flightsPage.setDates(5);
    await page.waitForTimeout(1000);
    // await page.getByText('Done').last().click();
    await page.getByRole('button', { name: 'Search' }).first().click();
    await page.waitForTimeout(5000);

});

   