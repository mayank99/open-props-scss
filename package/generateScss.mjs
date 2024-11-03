import Sizes from 'open-props/src/sizes';
import Colors from 'open-props/src/colors';
import ColorsHsl from 'open-props/src/colors-hsl';
import Shadows from 'open-props/src/shadows';
import Aspects from 'open-props/src/aspects';
import Borders from 'open-props/src/borders';
import Fonts from 'open-props/src/fonts';
import Easings from 'open-props/src/easing';
import Gradients from 'open-props/src/gradients';
import Svg from 'open-props/src/svg';
import Zindex from 'open-props/src/zindex';
import MasksEdges from 'open-props/src/masks.edges';
import MasksCornerCuts from 'open-props/src/masks.corner-cuts';
import { CustomMedia as Media } from 'open-props/src/media';
import Animations from 'open-props/src/animations';
import OklchColors from 'open-props/src/props.colors-oklch.js';
import OklchHues from 'open-props/src/props.colors-oklch-hues.js';
import BrandColors from 'open-props/src/props.brand-colors.js';

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CustomMediaHelper } from './CustomMediaHelper.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const customMediaHelper = new CustomMediaHelper(Media);

const openPropFiles = {
	media: Media,
	sizes: Sizes,
	colors: Colors,
	'colors-hsl': ColorsHsl,
	'colors-brand': BrandColors,
	shadows: Shadows,
	animations: Animations,
	aspects: Aspects,
	borders: Borders,
	fonts: Fonts,
	easings: Easings,
	gradients: Gradients,
	svg: Svg,
	zindex: Zindex,
	'masks.edges': MasksEdges,
	'masks.corner-cuts': MasksCornerCuts,
};

const writeSCSSModule = async (moduleName, content) => {
	const outFile = path.join(__dirname, `${moduleName}.scss`);
	await fs.writeFile(outFile, content, { encoding: 'utf-8' });
};

const generateSCSSModule = async (moduleName, importObj) => {
	let generatedScss = '';

	// aspects.scss
	if (moduleName.toLowerCase() === 'aspects') {
		generatedScss = '@use "sass:list";\n';

		Object.entries(importObj).forEach(([key, value]) => {
			key = key.replace('--', '$');
			if (value.includes('/')) {
				value = `list.slash(${value.replace('/', ',')})`; // fix sass deprecation warning: https://sass-lang.com/documentation/breaking-changes/slash-div
			}
			generatedScss += `${key}: ${value};\n`;
		});

		// animations.scss
	} else if (moduleName.toLowerCase() === 'animations') {
		generatedScss = "@use 'easings' as _e;\n@use 'sass:string';\n\n$id: string.unique-id();\n\n";

		Object.entries(importObj).filter(([key]) => !key.includes('@')).forEach(([key, value]) => {
			let [animationName, duration, easing] = value.split(' ')
			easing = easing.replace(/var\(--(.*?)\)/g, '#{_e.$$$1}');

			const keyframesLightName = `op-#{$id}-${animationName}`;
			const keyframesDarkName = `${keyframesLightName}-dark`;

			let keyframesLight = importObj[`${key}-@`].replace(animationName, keyframesLightName);
			let keyframesDark = importObj[`${key}-@media:dark`]?.replace(animationName, keyframesDarkName);

			if (!keyframesDark) {
				generatedScss += `@mixin ${animationName}($theme: light) {
					$name: ${keyframesLightName};
					${keyframesLight}
					animation: #{$name} ${duration} ${easing};
				}`;
			} else {
				generatedScss += `@mixin ${animationName}($theme: light) {
					@if $theme == light {
						$name: ${keyframesLightName};
						${keyframesLight}
						animation: $name ${duration} ${easing};
					} @else if $theme == dark {
						$name: ${keyframesDarkName};
						${keyframesDark}
						animation: $name ${duration} ${easing};
					}
				}\n`
			}
		});
		// media.scss
	} else if (moduleName.toLowerCase() === 'media') {
		Object.keys(importObj).forEach((queryName) => {
			const processedQuery = customMediaHelper.process(queryName);
			queryName = queryName.replace('--', '$');
			generatedScss += `${queryName}: '${processedQuery}';\n`;
		});

		// shadows.scss
	} else if (moduleName.toLowerCase() === 'shadows') {
		let mapKeysValues = '';
		const lightColor = Shadows['--shadow-color'];
		const lightStrength = Shadows['--shadow-strength'];
		const darkColor = Shadows['--shadow-color-@media:dark'];
		const darkStrength = Shadows['--shadow-strength-@media:dark'];
		const lightInnerHighlight = Shadows['--inner-shadow-highlight'];
		const darkInnerHighlight = Shadows['--inner-shadow-highlight-@media:dark'];

		// filter out non-shadow variables
		const entries = Object.entries(importObj).filter(([key]) => {
			return key !== '--shadow-color' &&
				key !== '--shadow-strength' &&
				!key.includes('@') &&
				!key.includes('highlight')
		});

		for (let index = 0; index < entries.length; index++) {
			let [key, value] = entries[index];

			key = key.replace('--shadow-', '');
			if (key.includes('--inner-shadow-')) {
				key = key.replace('--inner-shadow-', "'inner-");
				key = key.replace(/$/, "'");
			}

			value = value.replace(/var\(--(.*?)\)/g, '$$--$1');
			value = value.replace(/hsl/g, 'Hsl');
			mapKeysValues += `${key}: (${value})`;

			if (index < entries.length - 1) {
				mapKeysValues += ',\n '; // Add comma and new line for all entries except the last one
			}
		}

		generatedScss += `@use 'sass:map';\n@use 'sass:list';

@function shadow($level, $theme: light, $shadow-color: null, $shadow-strength: null) {
  $--shadow-color: $shadow-color or if($theme == dark, ${darkColor}, ${lightColor});
  $--shadow-strength: $shadow-strength or if($theme == dark, ${darkStrength}, ${lightStrength});
	$--inner-shadow-highlight: if($theme == dark, (${darkInnerHighlight}), (${lightInnerHighlight}));
  $shadows-map: (
    ${mapKeysValues}
  );

  @return map.get($shadows-map, $level);
}`;

		// All other open props
	} else {
		Object.entries(importObj).forEach(([key, value]) => {
			if (key.includes('@')) {
				return;
			}
			key = key.replace('--', '$');
			if (typeof value === 'string' && value.includes('var(--')) {
				value = value.replace(/var\(--(.*?)\)/g, '#{$$$1}'); // replace var(--cssvar) with #{$cssvar} when they occur in a value
			}
			generatedScss += `${key}: ${value};\n`;
		});
	}

	await writeSCSSModule(moduleName, generatedScss);
};

// Seperate scss module for colors-oklch.scss
const generateOklchScss = async () => {
	let oklchScss = '';

	for (const [hueKey, hueValue] of Object.entries(OklchHues)) {
		const hueName = hueKey.replace('--hue-', '');

		for (const [colorKey, colorValue] of Object.entries(OklchColors)) {
			if (colorKey.includes('--color-')) {
				const colorIndex = colorKey.replace('--color-', '');
				oklchScss += `$${hueName}-${colorIndex}: ${colorValue.replace(
					/\bvar\(--color-hue,\s*0\)/g,
					`${hueValue}`
				)};\n`;
			}
		}
	}

	await writeSCSSModule('colors-oklch', oklchScss);
};

for (const [moduleName, importObj] of Object.entries(openPropFiles)) {
	generateSCSSModule(moduleName, importObj);
}

// Generate colors-oklch.scss
generateOklchScss();

// Generate index.scss
let indexScss = '';
for (const moduleName in openPropFiles) {
	indexScss += `@forward '${moduleName}';\n`;
}

const indexOutFile = path.join(__dirname, 'index.scss');
await fs.writeFile(indexOutFile, indexScss, { encoding: 'utf-8' });
