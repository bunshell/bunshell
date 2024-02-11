import type {RouterCallback} from '../lib/commands';
import {slugify} from '../lib/utils';
import help from './help';
import {create} from './create';
import version from './version';

export const isRouter = true;
const router: RouterCallback = async (_, __, cmd, command, commands) => {
	const input = argv._.map(t => slugify(t)).join(' ');
	if (argv.v || argv.version || input === 'version') {
		await version();
		return;
	}

	if (argv.h || argv.help || input === 'help') {
		await help(commands);
		return;
	}

	// Offer to create utility if it doesn't exist.
	if (input && !command) {
		try {
			await create(input);
			return;
		} catch (error) {
			throw new Exit(error);
		}
	}

	if (!command) {
		await help(commands);
		return;
	}

	try {
		// Shift the first argument off the list and run the command.
		argv._.shift();
		await cmd();
	} catch (error) {
		throw new Exit(error);
	}
};

export default router;
