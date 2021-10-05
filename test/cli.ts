import { readdirSync } from 'fs';
import path from 'path';
import pkg from '../package.json';

async function cli() {
	console.log(pkg.name);
	process.env.NODE_DEBUG ??= '';
	process.env.NODE_ENV = pkg.name + '-test';
	const debugFlags: string[] = [];
	if (process.argv.includes('-d')) {
		debugFlags.push(pkg.name + '-debug');
	}
	if (process.argv.includes('-v')) {
		debugFlags.push(pkg.name + '-debug');
		debugFlags.push(pkg.name + '-verbose');
	}
	if (process.argv.includes('-m')) {
		debugFlags.push(pkg.name + '-manual');
	}
	process.env.NODE_DEBUG += debugFlags.join(',');

	// we must set up environment first
	const { run } = await import('./test.js');
	let files = process.argv
		.filter((file) => /\.ts$/.test(file))
		.map((f) => (path.isAbsolute(f) ? f : path.join(process.cwd(), f)));
	if (files.length < 2) {
		files = readdirSync(path.join(process.cwd(), 'src')).map((f) =>
			path.join(process.cwd(), 'src', f),
		);
	}

	await Promise.all(files.map(file => import(file)));
	await run();

	if (process.argv.includes('-w')) {
		(async () => {
			const fs = await import('fs');

			for (const file of files) {
				fs.watchFile(file, async () => {
					console.log();
					delete require.cache[file];
					await import(file);
					await run();
				});
			}
		})();
	}
}

cli();
