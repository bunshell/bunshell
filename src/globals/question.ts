import { createInterface } from 'node:readline'

export async function question(
	query?: string,
	options?: { choices: string[] }
): Promise<string> {
	let completer = undefined
	if (options && Array.isArray(options.choices)) {
		/* c8 ignore next 5 */
		completer = function completer(line: string) {
			const completions = options.choices
			const hits = completions.filter((c) => c.startsWith(line))
			return [hits.length ? hits : completions, line]
		}
	}
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true,
		completer,
	})

	return new Promise((resolve) =>
		rl.question(query ?? '', (answer) => {
			rl.close()
			resolve(answer)
		})
	)
}