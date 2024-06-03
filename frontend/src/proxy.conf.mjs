export default {
  "/api": {
    target: "",
    secure: false,
    logLevel: "debug", // nx serve must must be called with --verbose for this to have an effect
    changeOrigin: true,
    pathRewrite: {
      "": "",
    },
  },
};
