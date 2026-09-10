// fix-img-path.cjs — make img src resolve from the frame file location.
// Frames live in compositions/frames/, images in assets/img/.
// So img src must be ../../assets/img/frame-NN.png
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "compositions", "frames");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".html"));
let n = 0;
for (const f of files) {
  const fp = path.join(dir, f);
  let h = fs.readFileSync(fp, "utf8");
  if (h.includes('src="assets/img/')) {
    h = h.replace(/src="assets\/img\//g, 'src="../../assets/img/');
    fs.writeFileSync(fp, h);
    n++;
  }
}
console.log("patched " + n + " frames to ../../assets/img");
