export function avatarDataUrl(
  name: string,
  bg = "#FFFFFF",
  color = "#fff",
  size = 64,
) {
  const initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("");

  const fontSize = Math.round(size * 0.42);

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>` +
    `<rect width='100%' height='100%' fill='${bg}' rx='${Math.round(size * 0.2)}'/>` +
    `<text x='50%' y='50%' text-anchor='middle' dominant-baseline='central' alignment-baseline='central' font-family='Inter, system-ui, Arial, sans-serif' font-size='${fontSize}' font-weight='600' fill='${color}'>${initials}</text>` +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
