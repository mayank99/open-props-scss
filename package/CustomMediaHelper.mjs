import * as lightningcss from 'lightningcss';

export class CustomMediaHelper {
	constructor(queries) {
		// this creates a string with every @custom-media declaration
		this.customMediaCss = Object.entries(queries).reduce(
			(prev, [key, value]) => `${prev}@custom-media ${key} ${value};\n`,
			''
		);
	}

	process(queryName) {
		// list all custom media declarations, then use the passed query in a fake media query
		const unprocessedCss = `${this.customMediaCss}\n@media (${queryName}) { .foo { --foo: bar; } }`;

		const processedCss = lightningcss
			.transform({
				code: Buffer.from(unprocessedCss),
				drafts: { customMedia: true },
				targets: { chrome: (90 << 16) | (0 << 8) },
				filename: '',
			})
			.code.toString();

		// grab the processed media query out of the transformed css
		const processedQuery = processedCss.substring(
			processedCss.indexOf('@media ') + '@media '.length,
			processedCss.indexOf(' {')
		);

		return processedQuery;
	}
}
