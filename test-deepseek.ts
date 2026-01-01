/**
 * DeepSeek API Connection Test Script
 *
 * Run with: npx tsx test-deepseek.ts
 */

import dotenv from "dotenv";
import { analyzeWithDeepSeek } from "./src/lib/ai-analyzer/deepseek";

// Load environment variables from .env file
dotenv.config();

const testContent = `
这个视频介绍了几种提高免疫力的补剂：

1. 维生素C - 每天1000mg，建议早上随餐服用
2. 维生素D3 - 每天2000 IU，需要和脂肪一起吃才能吸收
3. 锌 - 每天15mg，晚上睡前服用
4. 益生菌 - 每天100亿CFU，空腹服用效果最好

视频中提到这些补剂可以显著提高免疫力，预防感冒。但是没有引用任何科学研究。
`;

async function testDeepSeek() {
  console.log("🧪 Testing DeepSeek V3.2-Fast API connection...\n");
  console.log(`📌 Model: ${process.env.DEEPSEEK_MODEL}\n`);
  console.log("📝 Test content:");
  console.log(testContent);
  console.log("\n" + "=".repeat(60) + "\n");

  const startTime = Date.now();
  try {
    const result = await analyzeWithDeepSeek(testContent, "description");
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`✅ DeepSeek API connection successful! (⚡ ${duration}s)\n`);
    console.log("📊 Analysis Result:");
    console.log(JSON.stringify(result, null, 2));
    console.log("\n" + "=".repeat(60) + "\n");

    // Validate result structure
    if (result.supplements && result.supplements.length > 0) {
      console.log(`✅ Found ${result.supplements.length} supplements`);
      result.supplements.forEach((supp, i) => {
        console.log(`   ${i + 1}. ${supp.name} - ${supp.dosage || "no dosage"}`);
      });
    } else {
      console.log("⚠️  No supplements found in result");
    }

    if (result.warnings && result.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
      result.warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
    }

    console.log(`\n📈 Credibility Score: ${result.credibilityScore}/100`);

    process.exit(0);
  } catch (error) {
    console.error("❌ DeepSeek API test failed:");
    console.error(error);
    process.exit(1);
  }
}

testDeepSeek();
