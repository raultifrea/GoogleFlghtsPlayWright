import test from "@playwright/test";
import FlightsPage from "../PageObjects/FlightsPage";
import ExplorePage from "../PageObjects/ExplorePage";
import CommonPage from "../PageObjects/CommonPage";

test('Search for nonstop one-way flights in Europe', async ({browser}, testInfo) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const flightsPage = new FlightsPage(page);
    const explorePage = new ExplorePage(page);
    const commonPage = new CommonPage(page);

    const originCity = 'CLJ';

    await page.goto('flights')
    // await page.getByRole('button', { name: 'Reject all' }).click();
    commonPage.changeCurrency('EUR');
    await page.waitForLoadState('networkidle');
    await commonPage.changeTicketType('One way');
    await flightsPage.whereFromInput.first().fill(originCity);
    await page.locator(`li[aria-label*="${originCity}"]`).first().click();
    const origin = await flightsPage.whereFromInput.first().inputValue();
    console.log(`[${testInfo.title}] Origin city is: ${origin}`);
    let exploreBtn = page.getByRole('button', { name: 'Explore' }).first();
    await exploreBtn.scrollIntoViewIfNeeded();
    await exploreBtn.click();
    await page.waitForTimeout(1000);
    explorePage.changeSingleTripDetails('August');
    await page.waitForTimeout(2000);
    explorePage.changeStopsNo('Nonstop only');
    await page.waitForTimeout(2000);
    explorePage.printDestinationDetails(true);
});

test('Search for nonstop one-way flights with specific dates in Europe', async ({browser}, testInfo) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const flightsPage = new FlightsPage(page);
    const explorePage = new ExplorePage(page);
    const commonPage = new CommonPage(page);

    const originCity = 'Malmö Municipality';

    await page.goto('flights')
    // await page.getByRole('button', { name: 'Reject all' }).click();
    commonPage.changeCurrency('EUR');
    await page.waitForLoadState('networkidle');
    await commonPage.changeTicketType('One way');
    await flightsPage.whereFromInput.first().fill(originCity);
    await page.locator(`li[aria-label*="${originCity}"]`).first().click();
    const origin = await flightsPage.whereFromInput.first().inputValue();
    console.log(`[${testInfo.title}] Origin city is: ${origin}`);
    let exploreBtn = page.getByRole('button', { name: 'Explore' }).first();
    await exploreBtn.scrollIntoViewIfNeeded();
    await exploreBtn.click();
    await page.waitForTimeout(1000);
    explorePage.setSpecificDates('1 Aug');
    await page.waitForTimeout(2000);
    explorePage.changeStopsNo('Nonstop only');
    await page.waitForTimeout(2000);
    explorePage.printDestinationDetails(false);
});
