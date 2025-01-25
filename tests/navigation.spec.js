const { test, expect } = require('@playwright/test');
test('has link to login page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  // Simulate clicking on the link with text Login, navigate to the login page
  await page.click("text=Logowanie");
  // Check if the login form page URL is opened
  await expect(page).toHaveURL('http://localhost:3000/user/signin');
  // Check if the login page has a header with the text Login to App
  await expect(page.getByRole('heading', { name: 'Zaloguj się do aplikacji' })).toBeVisible();
  //Fill email input
  await page.fill('input[name=email]', 'test@test.pl');
  //Fill password input
  await page.fill('input[name=password]', 'Haselko1234!');
  //Click on the submit button
  await page.click('button[type=submit]');
  
  await page.goto('http://localhost:3000/user/profile');
  // Check if the user is redirected to the login page
  await expect(page).toHaveURL('http://localhost:3000/user/signin?returnUrl=/user/profile');
});