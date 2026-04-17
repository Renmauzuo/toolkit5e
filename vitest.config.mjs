import { defineConfig } from 'vitest/config';
import path from 'path';
export default defineConfig({
    resolve: {
        alias: {
            '@toolkit5e/base': path.resolve(__dirname, 'packages/base/src/index.ts'),
            '@toolkit5e/statblock': path.resolve(__dirname, 'packages/statblock/src/index.ts'),
            '@toolkit5e/monster-scaler': path.resolve(__dirname, 'packages/monster-scaler/src/index.ts'),
        },
    },
    test: {
        include: ['packages/*/src/**/*.test.ts'],
    },
});
