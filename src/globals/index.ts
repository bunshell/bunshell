// Importing each module
import { $ } from "bun";
import { notMinimist } from './not-minimist';
import ansis from 'ansis';
export { default as os } from 'node:os';
export { default as path } from 'path';
export { notMinimist };

export * from './utils';
export * from './fs';



export const argv = notMinimist(Bun.argv.slice(2) || []);
export { $, ansis, ansis as chalk };