import test from 'node:test';
import assert from 'node:assert/strict';
import {makeTask,taskMarkdown} from './task.mjs';
const base = {source:'photo.jpg',kind:'single',count:1,modes:['left-right'],sizes:['16:9'],custom:'',text:'none',locale:'zh-CN',copy:'',wallpaper:'linked'};
test('first run is a complete one-image request',() => {
 const task = makeTask(base); assert.deepEqual(task.errors,[]); assert.equal(task.total,1); assert.match(task.request,/无文字/); assert.doesNotMatch(task.command,/--locale/); assert.match(task.command,/--prefs off/);
});
test('mixed batch counts wallpaper once per input, not once per ordinary ratio',() => {
 const task = makeTask({...base,kind:'batch',count:3,modes:['top-bottom','design-only','wallpaper-pack'],sizes:['3:4','16:9']});
 assert.equal(task.total,24); assert.match(task.request,/盘点实际/); assert.match(task.command,/--wallpaper-size/);
});
test('wallpaper alone ignores hidden ordinary dimensions',() => {
 const task = makeTask({...base,modes:['wallpaper-pack'],custom:'invalid'}); assert.deepEqual(task.errors,[]); assert.equal(task.total,4); assert.doesNotMatch(task.command,/--size /);
});
test('equivalent ratios and repeated selections are deduplicated',() => {
 const task = makeTask({...base,modes:['design-only','design-only'],sizes:['3:4'],custom:'6:8，2160×3840,2160x3840'}); assert.deepEqual(task.sizes,['3:4','2160x3840']); assert.equal(task.total,2);
});
test('invalid or incomplete configuration does not generate a task',() => {
 for (const override of [{modes:[]},{sizes:[]},{custom:'0:4'},{custom:'10xNaN'},{kind:'batch',count:1.2},{kind:'batch',count:0},{source:'x\ny'},{text:'exact',copy:' '}]) {
  const task = makeTask({...base,...override}); assert.ok(task.errors.length); assert.equal(task.request,'');
 }
});
test('exact multilingual copy survives quotation and markdown-like characters',() => {
 const copy = '“让风经过这里”\n<script>不是页面代码</script> `标题`';
 const task = makeTask({...base,kind:'batch',count:2,text:'exact',copy});
 assert.ok(task.request.includes(copy)); assert.match(task.request,/同一文案/); assert.ok(task.command.includes(JSON.stringify(copy))); assert.ok(taskMarkdown(task).includes(copy));
});
test('independent wallpaper does not request an anchor',() => {
 const task = makeTask({...base,modes:['wallpaper-pack'],wallpaper:'independent'}); assert.match(task.request,/每张只参考原照片/); assert.doesNotMatch(task.request,/经确认后/);
});
