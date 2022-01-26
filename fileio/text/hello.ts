import { join } from 'https://deno.land/std/path/mod.ts';
const path = join('file', 'hello.txt')
const data = await Deno.readTextFile(path)
console.log(data)