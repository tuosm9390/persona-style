import { test, expect } from '@playwright/test';

test.describe('PersonaStyle Analysis Flow', () => {
  test('should load the home page and show the intro', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PersonaStyle/);
    
    // Check for the main heading using a more robust way
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/퍼스널 스타일|Style Persona/);
  });

  test('should navigate to the analysis page and show input options', async ({ page }) => {
    await page.goto('/');
    
    // Target the link inside the button in the main section
    const startLink = page.getByRole('main').getByRole('link', { name: /분석 시작하기|Start Analysis/ });
    await startLink.click();
    
    // Wait for the URL to change to ensure navigation happened
    await page.waitForURL('**/analyze');
    await expect(page.url()).toContain('/analyze');
    
    // Verify analysis page components
    await expect(page.getByText(/사진 업로드|Photo Upload/)).toBeVisible();
    await expect(page.getByText(/텍스트 설명|Text Description/)).toBeVisible();
  });

  test('should have disabled button when no input is provided', async ({ page }) => {
    await page.goto('/analyze');
    // The button text is "분석하기" in Korean, "Analyze" in English
    const analyzeButton = page.getByRole('button', { name: /분석하기|Analyze/i });
    
    await expect(analyzeButton).toBeVisible();
    await expect(analyzeButton).toBeDisabled();
  });

  test('should show language toggle and change text', async ({ page }) => {
    await page.goto('/');
    
    // Wait for hydration
    await page.waitForLoadState('networkidle');
    
    // Target the language toggle specifically in the header
    const header = page.locator('header');
    const langToggle = header.getByRole('button').filter({ hasText: /EN|KR/ });
    
    await expect(langToggle).toBeVisible();
    const initialText = await langToggle.innerText();
    
    await langToggle.click();
    
    // Wait for the text to change on the page
    if (initialText.includes('EN')) {
      // Button said EN, so we were in KO and switched to EN
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/True Style Persona/i);
    } else {
      // Button said KR, so we were in EN and switched to KO
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/퍼스널 스타일/);
    }
  });
});
