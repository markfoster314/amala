import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  splitting: false,
  bundle: true,
  minify: false,
  keepNames: true,
  dts: false,
  esbuildOptions(options) {
    options.platform = 'node';
  },
});
