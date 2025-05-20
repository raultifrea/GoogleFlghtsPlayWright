import test from "@playwright/test";
import FlightsPage from "../PageObjects/FlightsPage";
import CommonPage from "../PageObjects/CommonPage";

test('Search for a specific flight', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const flightsPage = new FlightsPage(page);
    const commonPage = new CommonPage(page);

    await page.goto('flights')
    await page.getByRole('button', { name: 'Reject all' }).click();
    commonPage.changeCurrency('EUR');
    await page.waitForLoadState('networkidle');
    await flightsPage.setRoute('Bucharest', 'London');
    await page.waitForLoadState('networkidle');
    await flightsPage.setDates(5);
    await page.getByRole('button', { name: 'Search' }).first().click();
    await page.waitForLoadState('networkidle');
    await flightsPage.changeStopsNo('Nonstop only');
    await page.waitForTimeout(2000);
    await flightsPage.printDestinationDetails();
});

   
