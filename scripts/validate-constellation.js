const fs = require('fs');
const vm = require('vm');

const files = [
  'constellation_part1.js',
  'constellation_part2.js',
  'constellation_part3.js',
  'constellation_part4.js',
  'constellation_links.js'
];

const context = { window: {} };
vm.createContext(context);
for (const file of files) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}

const data = context.window.QURAN_CONSTELLATION_DATA;
const fail = (message) => { throw new Error(message); };

if (!data || !Array.isArray(data.concepts)) fail('Constellation data missing.');
if (data.concepts.length < 40) fail(`Expected at least 40 concepts, got ${data.concepts.length}.`);
if (!Array.isArray(data.links) || data.links.length < 80) fail('Not enough constellation links.');
if (!Array.isArray(data.paths) || data.paths.length < 6) fail('Not enough guided paths.');

const categories = new Set(Object.keys(data.categories || {}));
const ids = new Set();
const versePattern = /^\d{1,3}:\d{1,3}(?:-\d{1,3})?$/;

for (const concept of data.concepts) {
  if (!concept.id || ids.has(concept.id)) fail(`Duplicate or missing concept id: ${concept.id}`);
  ids.add(concept.id);
  if (!concept.title || !concept.arabic || !concept.summary || !concept.key || !concept.practice) {
    fail(`Incomplete concept: ${concept.id}`);
  }
  if (!categories.has(concept.category)) fail(`Unknown category on ${concept.id}: ${concept.category}`);
  if (!Array.isArray(concept.tags) || concept.tags.length < 2) fail(`Not enough tags on ${concept.id}`);
  if (!Array.isArray(concept.verses) || concept.verses.length < 3) fail(`Not enough references on ${concept.id}`);
  for (const ref of concept.verses) {
    if (!versePattern.test(ref)) fail(`Invalid Qur'an reference "${ref}" on ${concept.id}`);
  }
}

const linkKeys = new Set();
for (const link of data.links) {
  if (!ids.has(link.from) || !ids.has(link.to)) fail(`Broken link ${link.from} -> ${link.to}`);
  if (link.from === link.to) fail(`Self link on ${link.from}`);
  if (!link.label) fail(`Missing link label ${link.from} -> ${link.to}`);
  const key = `${link.from}>${link.to}>${link.label}`;
  if (linkKeys.has(key)) fail(`Duplicate link ${key}`);
  linkKeys.add(key);
}

const pathIds = new Set();
for (const path of data.paths) {
  if (!path.id || pathIds.has(path.id)) fail(`Duplicate path id: ${path.id}`);
  pathIds.add(path.id);
  if (!path.title || !path.summary || !path.color || !path.icon) fail(`Incomplete path: ${path.id}`);
  if (!Array.isArray(path.concepts) || path.concepts.length < 5) fail(`Path too short: ${path.id}`);
  for (const id of path.concepts) if (!ids.has(id)) fail(`Unknown concept ${id} in path ${path.id}`);
}

console.log(`Constellation validated: ${data.concepts.length} concepts, ${data.links.length} links, ${data.paths.length} paths.`);
