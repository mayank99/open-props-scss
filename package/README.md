# open-props-scss

**Problem**: [Open Props](https://open-props.style/) is super awesome but it's all runtime unless you use JIT. Sometimes you just want to use a color or two without bringing in the whole thing or configuring anything.

**Solution**: Sass variables! Import the whole thing, use only what you need, the rest will get compiled away.

## Installation

```
npm i open-props-scss
```

## Usage

Import the package under a namespace:

```scss
@use 'open-props-scss' as op;
```

And start using the props! The names are all camelCase by convention. You can see the full list of variables on [unpkg](https://unpkg.com/open-props-scss).

```scss
body {
	font-family: op.$fontSans;
}
```

A common workflow is to assign open props to your own custom properties. This requires interpolating the values inside `#{}`.

```scss
:root {
	--page-bg: #{op.$gray2};
	--page-text: #{op.$gray9};

	@media (prefers-color-scheme: dark) {
		--page-bg: #{op.$gray9};
		--page-text: #{op.$gray1};
	}

	background-color: var(--page-bg);
	color: var(--page-text);
}
```

## Acknowledgements

All I did is convert the tokens to Sass variables. The credit for the actual thing goes to [Adam Argyle](https://github.com/argyleink) for making Open Props. 💜
