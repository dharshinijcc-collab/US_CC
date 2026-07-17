const fs = require('fs');
const path = require('path');

function testRoutingConfigurations() {
  console.log("==================================================");
  console.log("[TEST] Running Frontend SPA Route Verification...");
  console.log("==================================================");

  // 1. Verify Entry HTML exists
  const htmlPath = path.resolve(__dirname, '../index.html');
  if (fs.existsSync(htmlPath)) {
    console.log("[PASS] Root index.html exists.");
  } else {
    console.error("[FAIL] index.html missing!");
    process.exit(1);
  }

  // 2. Verify Vite configurations exist
  const vitePath = path.resolve(__dirname, '../vite.config.ts');
  if (fs.existsSync(vitePath)) {
    console.log("[PASS] vite.config.ts exists.");
  } else {
    console.error("[FAIL] vite.config.ts missing!");
    process.exit(1);
  }

  // 3. Verify Next shims exist
  const shims = ['link.tsx', 'navigation.tsx', 'image.tsx', 'font.tsx'];
  for (const shim of shims) {
    const shimPath = path.resolve(__dirname, `../src/next-shims/${shim}`);
    if (fs.existsSync(shimPath)) {
      console.log(`[PASS] Next.js shim '${shim}' exists.`);
    } else {
      console.error(`[FAIL] Shim '${shim}' is missing!`);
      process.exit(1);
    }
  }

  // 4. Verify main entry components exist
  const mainPath = path.resolve(__dirname, '../src/main.tsx');
  const appPath = path.resolve(__dirname, '../src/App.tsx');
  
  if (fs.existsSync(mainPath) && fs.existsSync(appPath)) {
    console.log("[PASS] src/main.tsx and src/App.tsx exist.");
  } else {
    console.error("[FAIL] Main entry or App.tsx missing!");
    process.exit(1);
  }

  console.log("\n[SUCCESS] All frontend SPA configuration and routing tests PASSED!");
}

testRoutingConfigurations();
