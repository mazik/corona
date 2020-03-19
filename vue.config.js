module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        publish: ["github"]
      }
    }
  },
  pages: {
    index: "src/main.js",
    subpage: "src/subpage/main.js"
  }
};
