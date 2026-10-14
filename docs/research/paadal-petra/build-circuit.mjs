// Builds the `paadal-petra-sthalams` circuit from the master list
// (00-master-list.tsv): stops in traditional order, grouped by Tevaram region.
// Only temples that already have content files are included, so the circuit can
// ship region by region while the rest are being written. Existing catalog
// temples on the list get the circuit added to their `circuits`.
// Run from the repo root: node docs/research/paadal-petra/build-circuit.mjs
import fs from 'node:fs';

const D = 'packages/content/data';
const LOCALES = ['en', 'ta', 'te', 'kn', 'ml', 'hi'];
const ID = 'paadal-petra-sthalams';

const N = { // region names per locale (Divya Desams wording where shared)
  'chola-nadu-north': ['Chola Nadu — north of the Kaveri', 'சோழ நாடு — காவிரி வடகரை', 'చోళ నాడు — కావేరి ఉత్తర తీరం', 'ಚೋಳ ನಾಡು — ಕಾವೇರಿಯ ಉತ್ತರ ದಡ', 'ചോഴ നാട് — കാവേരിയുടെ വടക്കേക്കര', 'चोल नाडु — कावेरी का उत्तरी तट'],
  'chola-nadu-south': ['Chola Nadu — south of the Kaveri', 'சோழ நாடு — காவிரி தென்கரை', 'చోళ నాడు — కావేరి దక్షిణ తీరం', 'ಚೋಳ ನಾಡು — ಕಾವೇರಿಯ ದಕ್ಷಿಣ ದಡ', 'ചോഴ നാട് — കാവേരിയുടെ തെക്കേക്കര', 'चोल नाडु — कावेरी का दक्षिणी तट'],
  'eezha-nadu': ['Eezha Nadu (Sri Lanka)', 'ஈழ நாடு', 'ఈళ నాడు (శ్రీలంక)', 'ಈಳ ನಾಡು (ಶ್ರೀಲಂಕಾ)', 'ഈഴ നാട് (ശ്രീലങ്ക)', 'ईழ नाडु (श्रीलंका)'],
  'pandya-nadu': ['Pandya Nadu', 'பாண்டிய நாடு', 'పాండ్య నాడు', 'ಪಾಂಡ್ಯ ನಾಡು', 'പാണ്ഡ്യ നാട്', 'पांड्य नाडु'],
  'malai-nadu': ['Malai Nadu', 'மலை நாடு', 'మలై నాడు', 'ಮಲೈ ನಾಡು', 'മലൈ നാട്', 'मलै नाडु'],
  'kongu-nadu': ['Kongu Nadu', 'கொங்கு நாடு', 'కొంగు నాడు', 'ಕೊಂಗು ನಾಡು', 'കൊങ്ങ് നാട്', 'कोंगु नाडु'],
  'nadu-nadu': ['Nadu Nadu', 'நடு நாடு', 'నడు నాడు', 'ನಡು ನಾಡು', 'നടു നാട്', 'नडु नाडु'],
  'thondai-nadu': ['Thondai Nadu', 'தொண்டை நாடு', 'తొండై నాడు', 'ತೊಂಡೈ ನಾಡು', 'തൊണ്ടൈ നാട്', 'तोंडै नाडु'],
  'tulu-nadu': ['Tulu Nadu', 'துளு நாடு', 'తుళు నాడు', 'ತುಳುನಾಡು', 'തുളു നാട്', 'तुलु नाडु'],
  'vada-nadu': ['Vada Nadu', 'வட நாடு', 'వడ నాడు', 'ವಡ ನಾಡು', 'വട നാട്', 'वड नाडु'],
};
// Tevaram region order (as in the master list's numbering).
const ORDER = ['chola-nadu-north', 'chola-nadu-south', 'eezha-nadu', 'pandya-nadu', 'malai-nadu', 'kongu-nadu', 'nadu-nadu', 'thondai-nadu', 'tulu-nadu', 'vada-nadu'];

const rows = fs.readFileSync('docs/research/paadal-petra/00-master-list.tsv', 'utf8').trim().split('\n').slice(1)
  .map((l) => l.split('\t')).map((c) => ({ no: +c[0], region: c[1], id: (c[8] || c[9]).replace(/\?$/, '') }));
// A temple joins the circuit once all six locale files exist.
const have = (id) => LOCALES.every((l) => fs.existsSync(`${D}/temples/${l}/${id}.json`));

const groupsEn = [];
for (const region of ORDER) {
  const stops = rows.filter((r) => r.region === region && have(r.id)).sort((a, b) => a.no - b.no).map((r) => r.id);
  if (stops.length) groupsEn.push({ region, stops });
}
const stops = groupsEn.flatMap((g) => g.stops);

for (const [li, loc] of LOCALES.entries()) {
  const f = `${D}/circuits/${loc}/${ID}.json`;
  if (!fs.existsSync(f)) { if (loc === 'en') throw new Error('write circuits/en/' + ID + '.json first'); continue; }
  const c = JSON.parse(fs.readFileSync(f, 'utf8'));
  c.stops = stops;
  c.groups = groupsEn.map((g) => ({ id: g.region, name: N[g.region][li], stops: g.stops }));
  fs.writeFileSync(f, JSON.stringify(c, null, 2) + '\n');
  for (const s of stops) {
    const tf = `${D}/temples/${loc}/${s}.json`;
    if (!fs.existsSync(tf)) continue;
    const t = JSON.parse(fs.readFileSync(tf, 'utf8'));
    if (!t.circuits.includes(ID)) { t.circuits.push(ID); fs.writeFileSync(tf, JSON.stringify(t, null, 2) + '\n'); }
  }
}
console.log(`${ID}: ${stops.length} stops in ${groupsEn.length} regions —`, groupsEn.map((g) => `${g.region} ${g.stops.length}`).join(', '));
