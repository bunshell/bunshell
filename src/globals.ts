// Importing each module
import { $ } from "bun";
// @TODO: Remove globby, fs-extra and chalk
export { default as chalk } from 'chalk';
export { globby } from 'globby';
export { default as os } from 'node:os';
export { default as path } from 'path';
import minimist from 'minimist';

export * from './globals/utils';
export * from './globals/fs';

export const argv = minimist(process.argv.slice(2) || [])
export { minimist, $ };