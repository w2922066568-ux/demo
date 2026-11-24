import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = (game, file) => path.join(root, '.local/godot', game, file);
async function update(game, file, transform) {
  const target = source(game, file);
  const data = (await readFile(target, 'utf8')).replaceAll('\r\n','\n');
  await writeFile(target, transform(data));
}
const noto = 'NotoSansCJKsc-Regular.otf';
const license = 'Noto-LICENSE.txt';
const font = 'preload("res://art/' + noto + '")';
for (const game of ['valley-chapel','sunless-belfry']) {
  for (const [file,destination] of [[noto,source(game,'art/'+noto)],[license,path.join(root,'site',game,license)]]) {
    await copyFile(path.join(root,'.local/fonts',file),destination);
  }
  await update(game, 'project.godot', text => text.replace(/^anti_aliasing\/quality\/(use_taa|screen_space_aa)=.*\n/gm,''));
}
await update('valley-chapel','scenes/chapel.gd', text => text
  .replace(/^\tvar font:=SystemFont\.new\(\)\n\tfont\.font_names=.*$/m, '\tvar font:=' + font)
  .replace(/^\tenv\.volumetric_fog_enabled=true[\s\S]*?(?=^\t\$WorldEnvironment)/m,''));
await update('sunless-belfry','presentation/interface.gd', text => text
  .replace(/^var (serif|sans) := SystemFont\.new\(\)/gm, 'const $1 := ' + font)
  .replace(/^\t(?:serif|sans)\.font_names.*\n/gm,''));
await update('sunless-belfry','presentation/air.gd', text => text
  .replace(/^\tfor point in \[Vector3\(-19,-3,-9\)[\s\S]*?(?=^func _rose\(\))/m,'')
  .replace(/^\tenvironment\.volumetric_fog_enabled = (true|high)\n/gm,''));
