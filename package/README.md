# open-props-scss

**Problem**: [Open Props](https://open-props.style/) is super awesome but it leans heavily into PostCSS for things like custom media queries and treeshaking unused props. Sometimes you just want to use a color or shadow without bringing in the whole thing or configuring anything.

**Solution**: Sass variables! Import the whole thing, use only what you need, the rest will get compiled away. No need for any extra configuration.

## Installation

```
npm i open-props-scss
```

## Usage

Import the package under a namespace:

```scss
@use 'open-props-scss' as op;
```

And start using the props! The names all follow the same naming convention as open props CSS variables, except the `--` is replaced with `$`. You can see the full list of variables on [unpkg](https://unpkg.com/open-props-scss).

```scss
body {
  font-family: op.$font-sans;
}
```

A common workflow is to assign open props to your own custom properties. This requires interpolating the values inside `#{}`.

```scss
:root {
  --page-bg: #{op.$gray-2};
  --page-text: #{op.$gray-9};

  @media (op.$OSdark) {
    --page-bg: #{op.$gray-9};
    --page-text: #{op.$gray-1};
  }

  background-color: var(--page-bg);
  color: var(--page-text);
}
```

You can also import the props into the global scope to use them without a prefix. Be careful when doing this as it might cause conflicts with some of your own variables.

```scss
@use 'open-props-scss' as *;

:root {
  --page-bg: #{$gray-2};
  --page-text: #{$gray09};

  @media ($OSdark) {
    --page-bg: #{$gray-9};
    --page-text: #{$gray-1};
  }

  font-family: $font-sans;
  background-color: var(--page-bg);
  color: var(--page-text);
}
```

## Acknowledgements

All I did is convert the tokens to Sass variables. The credit for actually making Open Props goes to [Adam Argyle](https://github.com/argyleink). 💜
