import fs from 'node:fs'
import { test, expect } from '@playwright/test'

const visit = page => page.goto('/', { waitUntil: 'domcontentloaded', timeout: 15000 })
const assertNoOverflow = async page => {
  const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
  expect(dimensions.scroll, `horizontal overflow: ${dimensions.scroll}px > ${dimensions.client}px`).toBeLessThanOrEqual(dimensions.client + 1)
}
const openMobileNavIfNeeded = async page => {
  const menu = page.getByRole('button', { name: 'Toggle navigation' })
  if (await menu.isVisible()) await menu.click()
}

test('responsive discovery journey has no horizontal overflow', async ({ page }, testInfo) => {
  fs.mkdirSync('artifacts', { recursive: true })
  await visit(page)
  await expect(page.getByRole('heading', { name: /Go somewhere/i })).toBeVisible()
  await assertNoOverflow(page)
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-home.png`, fullPage: true })
  await page.getByRole('button', { name: 'Design' }).click()
  await expect(page.getByText('Marrakech')).toBeVisible()
  await assertNoOverflow(page)
  await page.getByRole('button', { name: /View Marrakech/i }).click()
  await expect(page.getByRole('dialog', { name: /Marrakech journey details/i })).toBeVisible()
  await assertNoOverflow(page)
  await page.getByRole('button', { name: /Build this journey/i }).click()
  await expect(page.getByRole('dialog', { name: /Book Marrakech/i })).toBeVisible()
  await assertNoOverflow(page)
})

test('saved and search states remain usable', async ({ page }) => {
  await visit(page)
  await openMobileNavIfNeeded(page)
  await page.getByRole('button', { name: /Saved/i }).click()
  await page.locator('#stays').scrollIntoViewIfNeeded()
  await expect(page.getByText('Kyoto')).toBeVisible()
  await openMobileNavIfNeeded(page)
  await page.getByRole('button', { name: /Saved/i }).click()
  await page.getByLabel('Search curated journeys').fill('zzzz-no-trip')
  await expect(page.getByText('No journeys found')).toBeVisible()
  await page.getByRole('button', { name: 'Reset discovery' }).click()
  await expect(page.getByText('Amalfi Coast')).toBeVisible()
  await assertNoOverflow(page)
})

test('showcase walkthrough', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'single showcase recording')
  await visit(page); await page.waitForTimeout(3500)
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * .20, behavior: 'smooth' })); await page.waitForTimeout(3500)
  await page.getByRole('button', { name: 'Culture' }).click(); await page.waitForTimeout(2500)
  await page.getByRole('button', { name: /View Kyoto/i }).click(); await page.waitForTimeout(3500)
  await page.getByRole('button', { name: /Build this journey/i }).click(); await page.waitForTimeout(3500)
  await page.getByRole('button', { name: /Close booking/i }).click(); await page.waitForTimeout(1500)
  await page.getByRole('button', { name: /Saved/i }).click(); await page.waitForTimeout(3000)
  await page.getByRole('button', { name: /Sign in/i }).click(); await page.waitForTimeout(3000)
  await page.getByRole('button', { name: /Close account/i }).click(); await page.waitForTimeout(1500)
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * .66, behavior: 'smooth' })); await page.waitForTimeout(3500)
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })); await page.waitForTimeout(3500)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await page.waitForTimeout(3500)
})
