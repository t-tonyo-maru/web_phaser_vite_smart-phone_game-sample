import path from 'path';
import { defineConfig } from 'vite';

const repoName = 'web_phaser_vite_smart-phone_game-sample';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? `/${repoName}/` : '/',
  build: {
    outDir: 'docs',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
}));
