
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/user-login/user-login.component.ts": [
    {
      "path": "chunk-WP55FASJ.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-RDR5QBAI.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-XCYQSHBV.js",
      "dynamicImport": false
    }
  ],
  "src/app/user-register/user-register.component.ts": [
    {
      "path": "chunk-CHMP37FK.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-RDR5QBAI.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-XCYQSHBV.js",
      "dynamicImport": false
    }
  ],
  "src/app/homepage/homepage.component.ts": [
    {
      "path": "chunk-C5RI452C.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-N4SKW3JD.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-ZQ5BO5SC.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-XCYQSHBV.js",
      "dynamicImport": false
    }
  ],
  "src/app/course/course.component.ts": [
    {
      "path": "chunk-LWFTXTI7.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-N4SKW3JD.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-5IZ3TFL7.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-RDR5QBAI.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-ZQ5BO5SC.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-XCYQSHBV.js",
      "dynamicImport": false
    }
  ],
  "src/app/user-page/user-page.component.ts": [
    {
      "path": "chunk-DNHITI74.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-5IZ3TFL7.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-RDR5QBAI.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-ZQ5BO5SC.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-XCYQSHBV.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 23815, hash: '0806cd3848cc02b6ddf154b0144df7be0f152b7c2f4bbdc6915d6a70836f32f2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17389, hash: '29477374cbdca5d684978dd07eada3301b7df09e087e5340523176c37ca4d1a5', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PFJRHJWP.css': {size: 12360, hash: 'UwJpgSqxMPw', text: () => import('./assets-chunks/styles-PFJRHJWP_css.mjs').then(m => m.default)}
  },
};
