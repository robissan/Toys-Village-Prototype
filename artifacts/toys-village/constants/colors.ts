/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#263A2E',
    tint: '#3D6A4B',
    background: '#F8F6EE',
    foreground: '#263A2E',
    card: '#FFFDF8',
    cardForeground: '#263A2E',
    primary: '#3D6A4B',
    primaryForeground: '#FFFDF8',
    secondary: '#E8EFE4',
    secondaryForeground: '#31533C',
    muted: '#F0EEE5',
    mutedForeground: '#5E685C',
    accent: '#F0D27D',
    accentForeground: '#594414',
    destructive: '#A65043',
    destructiveForeground: '#FFFDF8',
    border: '#E1E2D7',
    input: '#E1E2D7',
    ink: '#263A2E',
    forest: '#3D6A4B',
    meadow: '#DCE8D1',
    sky: '#D9EAF0',
    paper: '#F8F6EE',
    cream: '#FFFDF8',
    sunshine: '#D8A936',
    sunshineWash: '#F8EBC2',
    lagoon: '#4F89A2',
    lagoonWash: '#DDECF1',
    tomato: '#C96D55',
    tomatoWash: '#F5E1D9',
    lilac: '#8278A7',
    lilacWash: '#EAE6F2',
    mint: '#58836A',
    mintWash: '#E0ECE0',
    peach: '#C67F4F',
    peachWash: '#F5E6D4',
    success: '#4B7957',
    successWash: '#E4EFE1',
    errorWash: '#F7E7E1',
  },
  radius: 18,
};

export default colors;
