import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Share the navigation treatment with generated HTML without editing the game sources.
const site = fileURLToPath(new URL('../site/',import.meta.url));
const directories = (await readdir(site,{withFileTypes:true})).filter(e=>e.isDirectory()).map(e=>e.name);
for (const directory of ['',...directories]) {
  const file=path.join(site,directory,'index.html');
  let html;
  try { html=await readFile(file,'utf8'); } catch (error) { if(error.code==='ENOENT') continue; throw error; }
  if (html.includes('data-portfolio-passage')) continue;
  const prefix=directory?'../':'./';
  const tags='<link rel="stylesheet" href="'+prefix+'passage.css" data-portfolio-passage>\n<script src="'+prefix+'passage.js"></script>';
  await writeFile(file,html.replace('</head>',tags+'\n</head>'));
}
