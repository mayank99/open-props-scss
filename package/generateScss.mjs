import OpenProps from 'open-props';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let generatedScss = '';
Object.entries(OpenProps).forEach(([key, value]) => {
	if (key.includes('@') || key.includes('animation') || key.startsWith('--')) {
		return;
	}
	generatedScss += `$${key}: ${value};\n`;
});

const outFile = path.join(__dirname, 'index.scss');
await fs.writeFile(outFile, generatedScss, { encoding: 'utf-8' });
