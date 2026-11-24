import { readFile, writeFile } from 'node:fs/promises';
const htmlPath = new URL('../site/sunless-belfry/index.html', import.meta.url);
const enginePath = new URL('../site/sunless-belfry/index.js', import.meta.url);
const html = await readFile(htmlPath, 'utf8');
const engine = await readFile(enginePath, 'utf8');
const original = 'if(canvas.requestPointerLock){canvas.requestPointerLock()}},releasePointer:function(){if(document.exitPointerLock){document.exitPointerLock()}}';
const replacement = 'window.belfryPointerLock.request(canvas)},releasePointer:function(){window.belfryPointerLock.release()}';
if (!engine.includes(original) && !engine.includes(replacement)) throw Error('Godot changed its pointer-lock entry points');
if (!html.includes('<script src="pointer-lock.js">')) {
  await writeFile(htmlPath, html.replace('<script src="index.js">', '<script src="pointer-lock.js"></script>\n\t\t<script src="index.js">'));
}
await writeFile(enginePath, engine.replace(original, replacement));
