import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
        jsxImportSource: undefined,
        babel: {
          plugins: [],
        },
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    base: '/',

    server: {
      port: 3000,
      host: true,
      open: false,
      cors: true,
      strictPort: false,
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
      },
    },

    preview: {
      port: 4173,
      host: true,
      strictPort: false,
    },

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isProduction,
      minify: isProduction ? 'esbuild' : false,
      cssMinify: isProduction,
      cssCodeSplit: true,

      target: 'es2022',
      modulePreload: {
        polyfill: true,
      },

      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name!.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext!)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/woff2?|eot|ttf|otf/i.test(ext!)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/${ext}/[name]-[hash][extname]`;
          },
        },
      },

      chunkSizeWarningLimit: 1000,
      reportCompressedSize: true,
      emptyOutDir: true,
    },

    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: [],
    },

    esbuild: {
      legalComments: 'none',
      treeShaking: true,
    },

    css: {
      devSourcemap: !isProduction,
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isProduction
          ? '[hash:base64:5]'
          : '[name]__[local]___[hash:base64:5]',
      },
    },

    define: {
      __APP_VERSION__: JSON.stringify(
        process.env['npm_package_version'] || '0.1.0'
      ),
    },

    logLevel: isProduction ? 'warn' : 'info',
  };
});
