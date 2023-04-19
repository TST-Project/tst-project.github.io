import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
    build: {
        outDir: './dist/',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),

                collections: resolve(__dirname, 'collections/index.html'),
                all: resolve(__dirname, 'collections/all/index.html'),
                bnf: resolve(__dirname, 'collections/bnf/index.html'),
                ancienfonds: resolve(__dirname, 'collections/bnf/ancienfonds/index.html'),
                ariel: resolve(__dirname, 'collections/bnf/ariel/index.html'),
                burnouf: resolve(__dirname, 'collections/bnf/burnouf/index.html'),
                cordier: resolve(__dirname, 'collections/bnf/cordier/index.html'),
                ducler: resolve(__dirname, 'collections/bnf/ducler/index.html'),
                haas: resolve(__dirname, 'collections/bnf/haas/index.html'),
                reydellet: resolve(__dirname, 'collections/bnf/reydellet/index.html'),
                vinson: resolve(__dirname, 'collections/bnf/vinson/index.html'),
                sub: resolve(__dirname, 'collections/sub/index.html'),

                paratexts: resolve(__dirname, 'paratexts/index.html'),
                blessings: resolve(__dirname, 'paratexts/blessings/index.html'),
                colophons: resolve(__dirname, 'paratexts/colophons/index.html'),
                headers: resolve(__dirname, 'paratexts/headers/index.html'),
                invocations: resolve(__dirname, 'paratexts/invocations/index.html'),
                ownershipstatements: resolve(__dirname, 'paratexts/ownership-statements/index.html'),
                satellitestanzas: resolve(__dirname, 'paratexts/satellite-stanzas/index.html'),
                tablesofcontents: resolve(__dirname, 'paratexts/tables-of-contents/index.html'),
                titles: resolve(__dirname, 'paratexts/titles/index.html'),
                tbc: resolve(__dirname, 'paratexts/tbc/index.html'),

                palaeography: resolve(__dirname, 'palaeography/index.html'),
                belowbaseligatures: resolve(__dirname, 'palaeography/below-base-ligatures/index.html'),
                postbaseligatures: resolve(__dirname, 'palaeography/post-base-ligatures/index.html'),
                tools: resolve(__dirname, 'tools/index.html'),
                databasequery: resolve(__dirname, 'tools/database-query/index.html'),

                search: resolve(__dirname, 'search/index.html'),
            },
        },
    },
    base: './',
});
