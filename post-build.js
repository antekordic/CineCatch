const fs = require("fs-extra");
fs.move("dist/browser", "dist", (err) => {
  if (err) {
    return console.error(err);
  }
});
