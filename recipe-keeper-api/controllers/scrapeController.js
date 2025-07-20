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

    let recipeData = null;

    // Try JSON-LD first
    try {
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
              } catch {
                return null;
              }
            })
            .filter(Boolean)
            .flat()
      );

      recipeData = ldJson.find(
        (entry) =>
          entry?.["@type"] === "Recipe" ||
          (Array.isArray(entry?.["@type"]) && entry["@type"].includes("Recipe"))
      );
    } catch {
      console.log("⚠️ No JSON-LD or parsing failed.");
    }

    let title = "";
    let ingredients = [];
    let instructions = [];
    let photo = "";
    let time = { hours: 0, minutes: 0 };
    let course = [];

    if (recipeData) {
      console.log("✅ Extracting from JSON-LD...");

      title = recipeData.name || "Untitled Recipe";
      ingredients = recipeData.recipeIngredient || [];
      instructions =
        recipeData.recipeInstructions?.map((step) =>
          typeof step === "string" ? step : step.text
        ) || [];

      time = parseISODuration(
        recipeData.totalTime || recipeData.cookTime || recipeData.prepTime || ""
      );

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

      course = recipeData.recipeCategory
        ? Array.isArray(recipeData.recipeCategory)
          ? recipeData.recipeCategory
          : [recipeData.recipeCategory]
        : [];
    } else {
      console.log("🔁 Falling back to manual selectors...");

      title = await page.title();

      ingredients = await page.$$eval(".wprm-recipe-ingredient", (nodes) =>
        nodes.map((node) => node.innerText.trim())
      );

      instructions = await page.$$eval(
        ".wprm-recipe-instruction-text",
        (nodes) => nodes.map((node) => node.innerText.trim())
      );

      // Try to extract a real image (skip SVG placeholders)
      photo = await page
        .$eval("figure.wp-block-image.size-full img", (img) => img.src)
        .catch(async () => {
          const src = await page.$$eval("img", (imgs) => {
            const valid = imgs.find(
              (img) =>
                img.src &&
                !img.src.startsWith("data:image/svg+xml") &&
                img.naturalWidth > 100
            );
            return valid?.src || "";
          });
          return src;
        });

      if (!photo) {
        photo = await page
          .$eval('meta[property="og:image"]', (meta) => meta.content)
          .catch(() => "");
      }

      // Optional: scrape time or course if they exist in page visually
    }

    await browser.close();

    if (!ingredients.length || !instructions.length) {
      console.log("⚠️ Missing critical data, aborting...");
      return res.status(400).json({ message: "Could not extract recipe data" });
    }

    console.log("✅ Final scraped result:", {
      title,
      ingredientsCount: ingredients.length,
      instructionsCount: instructions.length,
      photo,
    });

    return res.json({
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
    return res.status(500).json({ message: "Error scraping recipe" });
  }
};

module.exports = { scrapeRecipe };
