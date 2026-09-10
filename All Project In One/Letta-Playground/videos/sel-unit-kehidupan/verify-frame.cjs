const fs = require("fs");
const s = fs.readFileSync("compositions/frames/02-konsep.html", "utf8");
const imgSrc = (s.match(/<img[^>]+src="([^"]+)"/) || [])[1];
console.log("img src:", imgSrc);
console.log("img CSS has opacity:0:", /#f02-imgbg \{[^}]*opacity: 0/.test(s));
console.log("genBg fade-in:", /tl\.fromTo\(genBg/.test(s));
console.log("flatBg fade:", /tl\.to\(flatBg/.test(s));
console.log("flatBg id:", (s.match(/getElementById\("(f02-bg)"\)/) || [])[1]);
console.log("bg CSS correct:", /#f02-bg \{ z-index: 0; background: #F5F0E8; \}/.test(s));
