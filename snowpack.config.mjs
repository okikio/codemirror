// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  // exclude: ["typescript"],
  
  optimize: {
    bundle: true,
    minify: true,
    keepNames: true,
    target: 'es2020',
  },
  mount: {
    /* ... */
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
    polyfillNode: true
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
