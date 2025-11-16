
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/user-login/user-login.component.ts": [
    {
      "path": "chunk-624A7CCW.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-J2WM3DB5.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-UENCSKWL.js",
      "dynamicImport": false
    }
  ],
  "src/app/user-register/user-register.component.ts": [
    {
      "path": "chunk-OUKLZLOL.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-J2WM3DB5.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-UENCSKWL.js",
      "dynamicImport": false
    }
  ],
  "src/app/homepage/homepage.component.ts": [
    {
      "path": "chunk-CCNEVYGC.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-MA67W5AD.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-EU6ZTCF4.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-UENCSKWL.js",
      "dynamicImport": false
    }
  ],
  "src/app/course/course.component.ts": [
    {
      "path": "chunk-PWWHONUL.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-MA67W5AD.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-JRXPBAKO.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-J2WM3DB5.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-EU6ZTCF4.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-UENCSKWL.js",
      "dynamicImport": false
    }
  ],
  "src/app/user-page/user-page.component.ts": [
    {
      "path": "chunk-BB7EBA3N.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-JRXPBAKO.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-J2WM3DB5.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-EU6ZTCF4.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-UENCSKWL.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 23815, hash: 'ae793d4fa4e1aef4922b80618c3b80e9d24254e5a1716be11f0281fd1f30de14', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17389, hash: 'f1c4f055b3ec38d6b6190b6f9f2c2e7556712960e2436593bde3ec5296073d89', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PFJRHJWP.css': {size: 12360, hash: 'UwJpgSqxMPw', text: () => import('./assets-chunks/styles-PFJRHJWP_css.mjs').then(m => m.default)}
  },
};
