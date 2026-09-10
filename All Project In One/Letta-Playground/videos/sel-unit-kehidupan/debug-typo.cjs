const fs = require("fs");
const h = fs.readFileSync("compositions/frames/02-konsep.html", "utf8");
const sizes = [...h.matchAll(/font-size:(\d+(?:\.\d+)?)px/g)].map(m => parseFloat(m[1]));
console.log("sizes:", sizes);
const textDivs = [...h.matchAll(/<div id="[^"]+" style="[^"]*font-size:[^"]*">/g)];
console.log("textDivs matched:", textDivs.length);
textDivs.forEach(m => console.log("shadowed?", m[0].includes("text-shadow"), "|", m[0].slice(0, 100)));
