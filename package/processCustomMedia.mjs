import * as lightningcss from 'lightningcss';

export class CustomMediaHelper {
	constructor(queries) {
		this.queriesCss = Object.entries(queries).reduce(
			(prev, [key, value]) => `${prev}@custom-media ${key} ${value};\n`,
			''
		);
	}

	process(queryName) {
		const unprocessedCss = `${this.queriesCss}\n@media (${queryName}) { .foo { color: red; } }`;

		const processedCss = lightningcss
			.transform({
				code: Buffer.from(unprocessedCss),
				drafts: { customMedia: true },
				targets: { chrome: (90 << 16) | (0 << 8) },
				filename: '',
			})
			.code.toString();

		const processedQuery = processedCss.substring(
			processedCss.indexOf('@media ') + '@media '.length,
			processedCss.indexOf(' {')
		);

		return processedQuery;
	}
}
