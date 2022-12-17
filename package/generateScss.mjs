import Sizes from 'open-props/src/sizes';
import Colors from 'open-props/src/colors';
import ColorsHSL from 'open-props/src/colors-hsl';
import { StaticShadows as Shadows } from 'open-props/src/shadows';
import Aspects from 'open-props/src/aspects';
import Borders from 'open-props/src/borders';
import Fonts from 'open-props/src/fonts';
import Easings from 'open-props/src/easing';
import Gradients from 'open-props/src/gradients';
import Svg from 'open-props/src/svg';
import Zindex from 'open-props/src/zindex';
// import MaskEdges from 'open-props/src/masks.edges';
// import MaskCornerCuts from 'open-props/src/masks.corner-cuts';
// import Media from 'open-props/src/media';
// import Animations from 'open-props/src/animations';

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let generatedScss = '';

Object.entries({
	...Sizes,
	...Colors,
	...ColorsHSL,
	...Shadows,
	...Aspects,
	...Borders,
	...Fonts,
	...Easings,
	...Gradients,
	...Svg,
	...Zindex,
	// ...MaskEdges,
	// ...MaskCornerCuts,
	// ...Media,
}).forEach(([key, value]) => {
	if (key.includes('@')) {
		return;
	}
	key = key.slice(2); // remove -- from beginning
	generatedScss += `$${key}: ${value};\n`;
});

const outFile = path.join(__dirname, 'index.scss');
await fs.writeFile(outFile, generatedScss, { encoding: 'utf-8' });
