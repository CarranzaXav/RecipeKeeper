const { chromium } = require("playwright");

const scrapeRecipe = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: "URL is Required" });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const title = await page.title();
  const ingredients = await page.$$eval("ul.ingredients li", (els) =>
    els.map((el) => el, innerText)
  );
  const instructions = await page.$$eval("ol.instructions li", (els) =>
    els.map((el) => el.innerText)
  );
  const photo = await page
    .$eval("img.recipe-photo", (el) => el.src)
    .catch(() => "");

  await browser.close();
  res.json({
    title,
    ingredients,
    instructions,
    photo,
    time: {
      hours: 1,
      minutes: 30,
    },
    course: ["Dinner"],
  });
};

module.exports = { scrapeRecipe };
