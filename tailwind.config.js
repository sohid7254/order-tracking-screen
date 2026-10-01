const v = (n) => `var(--${n})`;
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'), card: v('card'), ink: v('ink'), mute: v('mute'), line: v('line'), skel: v('skel'),
        brand: { DEFAULT: v('brand'), s: v('brand-s') },
        warn: { DEFAULT: v('warn'), s: v('warn-s') },
        bad: { DEFAULT: v('bad'), s: v('bad-s') },
      },
      fontFamily: { sans: ['Figtree', 'system-ui', 'sans-serif'] },
    },
  },
};
