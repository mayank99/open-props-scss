# open-props-scss

**Problem**: [Open Props](https://open-props.style/) is super awesome but it leans heavily into PostCSS for things like custom media queries and treeshaking unused props. Sometimes you just want to use a color or shadow without bringing in the whole thing or configuring anything.

**Solution**: Sass variables! Import the whole thing, use only what you need, the rest will get compiled away. No need for any extra configuration.

Try it on [Stackblitz](https://stackblitz.com/github/mayank99/open-props-scss/tree/main/demo?file=src%2Fpages%2Findex.astro).

## Installation

```
npm i open-props-scss
```

## Usage

Import the package under a namespace:

```scss
@use 'open-props-scss' as op;
```

And start using the props!

Most of the names follow the same naming convention as open props CSS variables, except the `--` is replaced with `$`. You can find the values of all props by inspecting the scss files on [npm](https://www.npmjs.com/package/open-props-scss?activeTab=code).

```scss
body {
  font-family: op.$font-sans;
}
```

Shadows are made available through a `shadow()` function rather than a variable. This allows choosing between light and dark themes, as well as modifying `$shadow-color` and `$shadow-strength` if desired.

```scss
box-shadow: op.shadow(1);
box-shadow: op.shadow('inner-3', dark);
box-shadow: op.shadow(5, $shadow-color: var(--my-shadow-color));
```

Animations are made available as mixins rather than a variable. Some animations (e.g. `fade-in-bloom` and `fade-out-bloom`) also have a dark theme version, which can be included by passing a `dark` argument to the mixin.
```scss
button {
  @include op.scale-up;
}

section {
  @include op.fade-in-bloom(dark);
}
```

### Custom properties

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

### Unprefixed usage

You can also import the props into the global scope to use them without a prefix. Be careful when doing this as it might cause conflicts with some of your own variables.

```scss
@use 'open-props-scss' as *;

:root {
  --page-bg: #{$gray-2};
  --page-text: #{$gray-9};

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
