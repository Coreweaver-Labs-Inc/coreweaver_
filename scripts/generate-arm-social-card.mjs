import sharp from "sharp";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 630;
const output = fileURLToPath(
  new URL("../public/arm-social-card.png", import.meta.url),
);

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#07090b" />
      <stop offset="1" stop-color="#0d1d1f" />
    </linearGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" fill="none" stroke="#78d7d3" stroke-opacity=".12" stroke-width="1" />
    </pattern>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="18" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#wash)" />
  <rect width="1200" height="630" fill="url(#grid)" />
  <circle cx="1045" cy="170" r="168" fill="#149ba2" fill-opacity=".12" filter="url(#glow)" />
  <circle cx="1080" cy="498" r="122" fill="#c98c3a" fill-opacity=".12" filter="url(#glow)" />
  <g fill="none" stroke="#78d7d3" stroke-width="2">
    <path d="M907 133h196v196H907z" stroke-opacity=".48" />
    <path d="M953 179h104v104H953z" stroke-opacity=".25" />
    <path d="M1005 194v165" stroke-opacity=".48" />
    <path d="M921 246h168" stroke-opacity=".48" />
  </g>
  <g fill="#78d7d3">
    <circle cx="953" cy="179" r="6" /><circle cx="1057" cy="179" r="6" /><circle cx="1057" cy="283" r="6" /><circle cx="953" cy="283" r="6" />
  </g>
  <text x="64" y="78" fill="#78d7d3" font-family="monospace" font-size="18" letter-spacing="3">COREWEAVER LABS / APPLICATION SURFACE / ARM 01</text>
  <text x="64" y="220" fill="#f1efea" font-family="Arial, sans-serif" font-size="86" font-weight="700" letter-spacing="-5">Make the resource</text>
  <text x="64" y="306" fill="#f1efea" font-family="Arial, sans-serif" font-size="86" font-weight="700" letter-spacing="-5">decision</text>
  <text x="64" y="393" fill="#78d7d3" font-family="Georgia, serif" font-size="88" font-style="italic">inspectable.</text>
  <line x1="64" y1="500" x2="1136" y2="500" stroke="#f1efea" stroke-opacity=".22" />
  <text x="64" y="550" fill="#aeb8ba" font-family="Arial, sans-serif" font-size="24">Constraint → Authority → Action → Record</text>
  <text x="1136" y="550" fill="#c98c3a" text-anchor="end" font-family="monospace" font-size="16" letter-spacing="2">COREWEAVERLABS.COM</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(output);
console.log(`Generated ${output}`);
