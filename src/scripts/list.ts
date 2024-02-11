import {
	getScripts,
	getSources,
} from '@lib/sources';

export const desc = 'List all known scripts.';
export const usage = `bunmagic list ${ansis.gray('| bunmagic ls')}`;
export const alias = ['ls'];

export default async function () {
	const sources = await getSources();
	const separator = ansis.dim.gray('╌'.repeat(64));
	for (const source of sources) {
		let maxScriptNameLength = 0;
		const isNamespaced = Boolean(source.namespace);
		const basename = path.basename(source.dir);
		const name = basename.charAt(0).toUpperCase() + basename.slice(1);

		console.log();
		console.log(separator);
		console.log('  ' + ansis.bold(name));
		console.log('  ' + ansis.dim(source.dir));
		console.log(separator);

		const {scripts} = await getScripts(source.dir, source.namespace);
		for (const {slug, bin} of scripts) {
			if (slug.startsWith('_')) {
				continue;
			}

			const hasBinaryFile = Bun.which(bin) !== null;
			const symbol = hasBinaryFile || isNamespaced
				? ansis.bold.green('·')
				: ansis.bold.red('x');
			const scriptNameWithSymbolLength = `${symbol} ${slug}`.length;
			if (scriptNameWithSymbolLength > maxScriptNameLength) {
				maxScriptNameLength = scriptNameWithSymbolLength;
			}

			let scriptNameWithSymbol = `${symbol} ${slug}`;
			if ('namespace' in source) {
				const namespace = source.namespace ? ` ${source.namespace}` : '';
				scriptNameWithSymbol = `${symbol}${namespace} ${slug}`;
			}

			const scriptOutput = scriptNameWithSymbol;
			let line = `${scriptOutput}`;
			if (!hasBinaryFile && !isNamespaced) {
				line += `\n   ${ansis.red('▲ script executable missing')}`;
			}

			console.log(line);
		}
	}
}
