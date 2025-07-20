const { chromium } = require("playwright");

const parseISODuration = (isoString) => {
  const match = isoString.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  return {
    hours: match?.[1] ? parseInt(match[1]) : 0,
    minutes: match?.[2] ? parseInt(match[2]) : 0,
  };
};

const scrapeRecipe = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    console.log("❌ No URL provided");
    return res.status(400).json({ message: "URL is required" });
  }

  console.log(`🌐 Scraping URL: ${url}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    console.log("✅ Page loaded");

    // Wait for ld+json to appear (up to 5 seconds)
    await page.waitForSelector('script[type="application/ld+json"]', {
      timeout: 5000,
      state: "attached",
    });

    console.log("📦 JSON-LD script found");

    const ldJson = await page.$$eval(
      'script[type="application/ld+json"]',
      (scripts) =>
        scripts
          .map((script) => {
            try {
              return JSON.parse(script.innerText);
            } catch (e) {
              return null;
            }
          })
          .filter(Boolean)
    );

    // Flatten in case one of the blocks is an array
    const flatLdJson = ldJson.flat();

    const recipeData = flatLdJson.find(
      (entry) =>
        entry?.["@type"] === "Recipe" ||
        (Array.isArray(entry?.["@type"]) && entry["@type"].includes("Recipe"))
    );

    if (!recipeData) {
      console.log("⚠️ No Recipe data found in JSON-LD");
      await browser.close();
      return res.status(400).json({ message: "No recipe data found" });
    }

    const title = recipeData.name || "Untitled Recipe";
    const ingredients = recipeData.recipeIngredient || [];
    const instructions =
      recipeData.recipeInstructions?.map((step) =>
        typeof step === "string" ? step : step.text
      ) || [];

    const time = parseISODuration(
      recipeData.totalTime || recipeData.cookTime || recipeData.prepTime || ""
    );

    let photo = "";

    if (Array.isArray(recipeData.image)) {
      const first = recipeData.image[0];
      photo = typeof first === "string" ? first : first?.url || "";
    } else if (
      typeof recipeData.image === "object" &&
      recipeData.image !== null
    ) {
      photo = recipeData.image.url || "";
    } else if (typeof recipeData.image === "string") {
      photo = recipeData.image;
    }

    const course = recipeData.recipeCategory
      ? Array.isArray(recipeData.recipeCategory)
        ? recipeData.recipeCategory
        : [recipeData.recipeCategory]
      : [];

    await browser.close();

    console.log("✅ Scraped:", {
      title,
      ingredientsCount: ingredients.length,
      instructionsCount: instructions.length,
      time,
      photo,
    });

    res.json({
      title,
      ingredients,
      instructions,
      photo,
      time,
      course,
    });
  } catch (err) {
    console.error("❌ Scraping failed:", err);
    await browser.close();
    res.status(500).json({ message: "Error scraping recipe" });
  }
};

module.exports = { scrapeRecipe };
