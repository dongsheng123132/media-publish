import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const source = readFileSync(path.join(here, "article.md"), "utf8");
const imageBase = "https://raw.githubusercontent.com/dongsheng123132/media-publish/96a9dfda46f7f6ef7e81457e8434e1df74a3212b/public/wechat/2026-08-13-deepseek-v4-pro-agent-test";

function convertTable(lines, start) {
  const rows = [];
  let index = start;
  while (index < lines.length && /^\s*\|/.test(lines[index])) {
    rows.push(lines[index].trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
    index += 1;
  }
  rows.splice(1, 1);
  const body = rows.map((cells, rowIndex) => {
    const color = rowIndex === 0 ? ' color="blue_bg"' : "";
    return `\t<tr${color}>\n${cells.map((cell) => `\t\t<td>${cell}</td>`).join("\n")}\n\t</tr>`;
  }).join("\n");
  return { text: `<table fit-page-width="true" header-row="true">\n${body}\n</table>`, next: index };
}

const inputLines = source.replace(/^# .+\r?\n/, "").split(/\r?\n/);
const output = [];
for (let i = 0; i < inputLines.length;) {
  if (/^\s*\|/.test(inputLines[i]) && i + 1 < inputLines.length && /^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(inputLines[i + 1])) {
    const converted = convertTable(inputLines, i);
    output.push(converted.text);
    i = converted.next;
    continue;
  }
  output.push(inputLines[i]);
  i += 1;
}

let notion = output.join("\n");
notion = notion.replace(/\]\(images\/(0[1-6])\.png\)/g, `](${imageBase}/$1.png)`);
const markers = [
  ["==", "yellow_bg"],
  ["\\+\\+", "blue_bg"],
  ["%%", "pink_bg"],
  ["&&", "green_bg"],
  ["!!", "red"],
  ["@@", "blue"],
  ["\\^\\^", "orange"],
];
for (const [marker, color] of markers) {
  notion = notion.replace(new RegExp(`${marker}(.+?)${marker}`, "g"), `<span color="${color}">$1</span>`);
}
notion = notion.replace(/\n{3,}/g, "\n\n").trim();
process.stdout.write(notion);
