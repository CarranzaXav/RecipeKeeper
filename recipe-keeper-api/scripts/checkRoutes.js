const fs = require("fs");
const path = require("path");

// Search one level up from scripts/
const searchDir = path.join(__dirname, "..");

function checkFilesForBadRoutes(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!["node_modules", ".git", "scripts"].includes(entry.name)) {
        checkFilesForBadRoutes(fullPath);
      }
    } else if (entry.name.endsWith(".js")) {
      const content = fs.readFileSync(fullPath, "utf8");
      const badRoutePattern = /\*[^a-zA-Z{]/g;

      if (badRoutePattern.test(content)) {
        console.warn(`⚠ Potential bad wildcard in: ${fullPath}`);
        const lines = content.split("\n");
        lines.forEach((line, index) => {
          if (
            line.includes("/*") &&
            !line.includes("/*splat") &&
            !line.includes("{*")
          ) {
            console.log(`   Line ${index + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

checkFilesForBadRoutes(searchDir);
