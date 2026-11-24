import { cp, mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const site = path.join(root, 'Demo-Pages/site');
const absolute = file => path.join(root, file);
const publish = file => path.join(site, file);
const stage = (source, target) => cp(absolute(source), publish(target), { recursive: true });
const sourceText = file => readFile(absolute(file), 'utf8');
await mkdir(publish('media'), { recursive: true });
await Promise.all([
  stage('Abyssal/dist', 'abyssal'),
  stage('Cinderline/dist', 'cinderline'),
  stage('FormaAtlas/dist', 'forma-index'),
  stage('Pop-up Atlas/dist', 'pop-up-atlas'),
  stage('Pop-up Atlas/deliverables/Pop-up Atlas - 30s.mp4', 'media/pop-up-atlas.mp4'),
  stage('山谷礼拜堂-实机巡览.mp4', 'media/valley-chapel.mp4'),
  stage('无日钟庭-开场.mp4', 'media/sunless-belfry.mp4'),
  stage('Forma Index - 动效实录.mp4', 'media/forma-index.mp4'),
  stage('Huazhao/public', 'huazhao'),
  stage('中世纪教堂概念图', 'concepts/chapel'),
  stage('经典斗地主/概念图', 'concepts/cards')
]);
await stage('Pop-up Atlas/licenses/three-MIT.txt', 'pop-up-atlas/three-MIT.txt');
await Promise.all(['assets','src','vendor','style.css','index.html'].map(file => stage('CapeMeridian/' + file, 'cape-meridian/' + file)));
const { browserEngine } = await import(new URL('../../Huazhao/engine-source.mjs', import.meta.url));
await writeFile(publish('huazhao/engine.js'), browserEngine());
const huazhao = 'https://huazhao-card-parlor.sunnyvale19.chatgpt.site/';
for (const file of ['index.html','app.js','table.js','style.css','table.css']) {
  let source = await sourceText('Huazhao/public/' + file);
  source = source
    .replace(/\b(href|src)="\/(?=[a-z])/gi, '$1="./')
    .replace(/url\((['"]?)\/art\//g, 'url($1./art/');
  if (file === 'index.html') {
    source = source.replace('</head>', '<style>.pages-mode{margin:1rem auto 0;width:fit-content;max-width:calc(100% - 2rem);padding:.62rem .85rem;background:#f3eee0;color:#29382d;border-radius:.45rem;font:14px system-ui}.pages-mode a{color:#184e3a;font-weight:600}</style></head>');
    source = source.replace('<body>', '<body><aside class="pages-mode">GitHub Pages 单人练习 · <a href="' + huazhao + '">和好友在线开桌</a></aside>');
  }
  if (file === 'app.js') {
    source = source.replace(/^if\(\["localhost","127\.0\.0\.1","\[::1\]"\].*\{\r?\n +void fetch\("\/api\/entry"\).*?\.catch\(\(\)=>\{\}\);\r?\n\}/m, '');
    source = source.replace(/const invite=new URLSearchParams\(location\.search\)\.get\("room"\);[\s\S]*?else if\(previous\?\.kind==="practice"/, 'const previous=load("active",load("active"),"sessionStorage");\nif(previous?.kind==="practice"');
    if (!source.includes('async function startPractice')) throw Error('Practice entry changed');
    source += '\n' + `
document.addEventListener("click", event => {
  const button = event.target.closest('[data-ui="create"],[data-ui="join"]');
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  location.assign("${huazhao}" + location.search);
}, true);
`;
  }
  await writeFile(publish('huazhao/' + file), source);
}
for (const [source,target] of [
  ['Abyssal/dist/assets/trench.webp','abyssal.webp'],
  ['Cinderline/dist/assets/ashfall.webp','cinderline.webp'],
  ['CapeMeridian/assets/ui/windward.webp','cape-meridian.webp'],
  ['FormaAtlas/dist/assets/strata.webp','forma.webp'],
  ['Huazhao/public/art/table.webp','huazhao.webp'],
  ['Tidebound/public/art/ocean.webp','tidebound.webp'],
  ['Pop-up Atlas/review/round-5/clean.jpg','atlas.jpg'],
  ['中世纪教堂概念图/教堂-清晨.png','chapel.png'],
]) await copyFile(absolute(source), publish('media/' + target));
await writeFile(publish('.nojekyll'), '');
