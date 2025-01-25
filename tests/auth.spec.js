const { test, expect } = require('@playwright/test');

test('redirect unauthenticated users to login form', async ({ page }) => {
  await page.goto('http://localhost:3000/user/profile');
  await expect(page).toHaveURL('http://localhost:3000/user/signin?returnUrl=/user/profile');

  await page.goto('http://localhost:3000/user/changepassword');
  await expect(page).toHaveURL('http://localhost:3000/user/signin?returnUrl=/user/changepassword');

  await page.goto('http://localhost:3000/user/articles');
  await expect(page).toHaveURL('http://localhost:3000/user/signin?returnUrl=/user/articles');

  await page.goto('http://localhost:3000/user/signout');
  await expect(page).toHaveURL('http://localhost:3000/user/signin?returnUrl=/user/signout');
});
