import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {skills} from './skill-data.js';
import {renderSkillCard} from './skill-card.js';
const root=path.dirname(fileURLToPath(import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'evidence/baseline.json'),'utf8'));
for(const [file,expected] of Object.entries(manifest.hashes)){
 const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'evidence/before',file))).digest('hex');
 assert.equal(actual,expected,'Frozen baseline changed: '+file);
}
const original=fs.readFileSync(path.join(root,'evidence/before/app.js'),'utf8');
const snippet=original.slice(original.indexOf('const skills=['),original.indexOf('let filter='));
const initial=vm.runInNewContext(snippet+'JSON.stringify(skills)');
assert.deepEqual(skills,JSON.parse(initial),'Original 11 skill records must be preserved');
const selected=renderSkillCard(skills[0],0,skills[0].id);
assert.match(selected,/aria-pressed="true"/);
assert.match(selected,/✓ 已选/);
const escaped=renderSkillCard({...skills[0],name:'<img src=x onerror=alert(1)>'},0,'');
assert.ok(!escaped.includes('<img'));
assert.match(escaped,/&lt;img/);
console.log('RUN-001 检查通过：冻结快照未改变，11 项资料无损，选中提示与文本转义正常。');
