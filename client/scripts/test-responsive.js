const puppeteer = require('puppeteer');
const { exec } = require('child_process');

const viewports = [
  { width: 320, height: 568, name: 'Mobile (iPhone SE)' },
  { width: 375, height: 667, name: 'Mobile (iPhone 8)' },
  { width: 768, height: 1024, name: 'Tablet (iPad)' },
  { width: 1024, height: 768, name: 'Tablet (Landscape)' },
  { width: 1366, height: 768, name: 'Desktop (HD)' },
  { width: 1920, height: 1080, name: 'Desktop (Full HD)' },
];

async function testResponsive() {
  // Start the development server
  const server = exec('npm start');
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const viewport of viewports) {
    console.log(`\nTesting viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
    
    await page.setViewport(viewport);
    await page.goto('http://localhost:3000');

    // Take screenshot
    await page.screenshot({
      path: `screenshots/${viewport.name.replace(/\s+/g, '_')}.png`,
      fullPage: true
    });

    // Test mobile menu
    if (viewport.width <= 768) {
      const menuButton = await page.$('[aria-label="menu"]');
      if (menuButton) {
        await menuButton.click();
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: `screenshots/${viewport.name.replace(/\s+/g, '_')}_menu_open.png`,
          fullPage: true
        });
      }
    }

    // Test form submission
    if (viewport.width > 768) {
      await page.click('a[href="/apply"]');
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: `screenshots/${viewport.name.replace(/\s+/g, '_')}_form.png`,
        fullPage: true
      });
    }
  }

  await browser.close();
  server.kill();
}

// Create screenshots directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

testResponsive().catch(console.error); 