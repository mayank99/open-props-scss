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
import MaskEdges from 'open-props/src/masks.edges';
import MaskCornerCuts from 'open-props/src/masks.corner-cuts';
import { CustomMedia } from 'open-props/src/media';
// import Animations from 'open-props/src/animations';

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CustomMediaHelper } from './CustomMediaHelper.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const customMediaHelper = new CustomMediaHelper(CustomMedia);

const openPropFiles = {
  CustomMedia,
  Sizes,
  Colors,
  ColorsHSL,
  Shadows,
  Aspects,
  Borders,
  Fonts,
  Easings,
  Gradients,
  Svg,
  Zindex,
  MaskEdges,
  MaskCornerCuts,
};

const writeSCSSModule = async (moduleName, content) => {
  const outFile = path.join(__dirname, `${moduleName}.scss`);
  await fs.writeFile(outFile, content, { encoding: 'utf-8' });
};

const generateSCSSModule = async (moduleName, importObj) => {
  let generatedScss = '';
  
  if (moduleName.toLowerCase() === 'aspects') {
    generatedScss = '@use "sass:list";\n';
    
    Object.entries(importObj).forEach(([key, value]) => {
      key = key.replace('--', '$');
      if (value.includes('/')) {
        value = `list.slash(${value.replace('/', ',')})`; // fix sass deprecation warning: https://sass-lang.com/documentation/breaking-changes/slash-div
      }
      generatedScss += `${key}: ${value};\n`;
    });
    
  } else if (moduleName.toLowerCase() === 'custommedia') {
    Object.keys(importObj).forEach((queryName) => {
      const processedQuery = customMediaHelper.process(queryName);
      queryName = queryName.replace('--', '$');
      generatedScss += `${queryName}: '${processedQuery}';\n`;
    });
    
  } else {
    Object.entries(importObj).forEach(([key, value]) => {
      if (key.includes('@')) {
        return;
      }
      key = key.replace('--', '$');
      generatedScss += `${key}: ${value};\n`;
    });
  }

  await writeSCSSModule(moduleName, generatedScss);
};

Object.entries(openPropFiles).forEach(([moduleName, importObj]) => {
  generateSCSSModule(moduleName.toLowerCase(), importObj);
});

// Generate index.scss
let indexScss = '';
for (const moduleName in openPropFiles) {
  indexScss += `@forward '${moduleName.toLowerCase()}';\n`;
}

const indexOutFile = path.join(__dirname, 'index.scss');
await fs.writeFile(indexOutFile, indexScss, { encoding: 'utf-8' });
