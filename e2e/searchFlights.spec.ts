import test from "@playwright/test";
import FlightsPage from "../PageObjects/FlightsPage";
import ExplorePage from "../PageObjects/ExplorePage";

test('Search for flights in Europe', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const flightsPage = new FlightsPage(page);
    const explorePage = new ExplorePage(page);

    await page.goto('flights')
    await page.getByRole('button', { name: 'Reject all' }).click();
    await page.getByRole('button', { name: 'Explore' }).first().click();
    // await page.waitForTimeout(5000);
});
