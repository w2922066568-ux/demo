import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
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
// Both games use the same single-threaded Godot export template. Reuse its URL
// only when the binaries are identical, including after an engine upgrade.
const wasmDigest = async game => createHash('sha256').update(await readFile(
  new URL('../site/' + game + '/index.wasm', import.meta.url))).digest('hex');
const localWasm = 'loadPromise = preloader.loadPromise(`${loadPath}.wasm`, size, true);';
const sharedWasm = 'loadPromise = preloader.loadPromise("../valley-chapel/index.wasm", size, true);';
const share = await wasmDigest('valley-chapel') === await wasmDigest('sunless-belfry');
const output = engine.replace(original, replacement).replace(sharedWasm, localWasm);
await writeFile(enginePath, share ? output.replace(localWasm, sharedWasm) : output);
await import('./wire-portfolio.mjs');
