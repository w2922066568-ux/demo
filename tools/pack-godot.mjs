import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const relativePack = 'site/sunless-belfry/index.pck';
const pack = await readFile(path.join(root, relativePack));
const segmentSize = 60 * 1024 * 1024;
await mkdir(path.join(root, 'packs'), { recursive: true });
const digest = createHash('sha256').update(pack).digest('hex');
for (let start = 0, id = 0; start < pack.length; start += segmentSize, id++) {
  const name = 'sunless-belfry.pck.part-' + String(id).padStart(2, '0');
  await writeFile(path.join(root, 'packs', name), pack.subarray(start, start + segmentSize));
}
await writeFile(path.join(root, 'packs/sunless-belfry.sha256'), digest + '  ' + relativePack + '\n');
