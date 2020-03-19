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
    subpage: {
      entry: "src/subpage/main.js",
      title: "Corona - Settings"
    }
  }
};
