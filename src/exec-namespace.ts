import "./index";
import { getCommands } from './buns/commands';
import env_requirements from "./buns/env-requirements";
import { getSources } from './buns/sources';


if (true !== await env_requirements()) {
	console.log(`Environment requirements not met.`);
	process.exit(1);
}

const namespace = argv._.shift();
if (!namespace) {
	throw new Error(`Missing script namespace.`);
}

// Turn off verbose mode by default
BUNS.verbose = argv.verbose || Bun.env.DEBUG || false;


const sources = await getSources();
const scripts = sources.find(source => 'namespace' in source && source.namespace === namespace)?.scripts;
const files = scripts!.map(script => script.file);
const { router: routerInfo, commands } = await getCommands(files);
const input = argv._[0];

try {
	if (!routerInfo) {
		throw new Error(`No router found.`);
	}

	const router = await import(routerInfo.file).then(m => m.default);
	if (!router) {
		throw new Error(`Couldn't load the router: ${router.file}`);
	}

	const command = commands.get(input);
	if (command === undefined || command.type === "command") {
		const cmd = command?.file ? await import(command.file).then(m => m.default) : undefined;
		await router(cmd, command, commands);
	}

} catch (e) {
	console.log(chalk.bold.red("Error: "), e);
}