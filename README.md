# RecipeKeeper

Notes for myself:
---

## 🧠 Express 5 Wildcard Reminder

If you're using Express 5+, wildcard paths **must be named** due to stricter `path-to-regexp` rules.

**DO NOT USE:**
```js
app.use("/*", ...)          // ❌ This will crash

**USE THIS INSTEAD:**

app.use("/*splat", ...)     // ✅ Valid in Express 5

// To match the root path / as well, wrap the wildcard
app.use("/{*splat}", ...)   // ✅ Includes root

// This is important if you see this error
TypeError: Missing parameter name at X: https://git.new/pathToRegexpError


