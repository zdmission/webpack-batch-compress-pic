const path = require("path");
const WebpackShellPlugin = require('webpack-shell-plugin');

const fs = require("fs");
const glob = require("glob");

const writeIntoFile = async (filepath, str, callback) => {
  await fs.writeFileSync(filepath, str, "utf8", callback);
};

let str = '';
const createAppJsonFile = function() {

  glob.sync("./static/**/*.{png,jpeg,jpg,gif,svg,ico}").forEach(entry => {
    str = str + `let A${Math.random().toString(36).substr(2)} = require('${entry}');`
  });

  writeIntoFile("./picmin.js", str, err => {
    if (err) throw err;
    console.log("文件已保存");
  });
};
createAppJsonFile()

module.exports = {
  entry: { picmin: path.join(__dirname, "./picmin.js") },
  context: path.resolve(__dirname, "./"),
  mode: "production",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js"
  },
  resolve: {
    //后缀名
    extensions: [".js", ".css", ".vue"]
  },
  module: {
    rules: [
      //image
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 5, // 小于5bit的图片自动转成base64格式，并且不会存在实体图片
              name: "[path][name].[ext]?[hash:8]"
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              },
              pngquant: {
                quality: "65-90",
                speed: 4
              },
              mozjpeg: {
                progressive: true,
                quality: 65
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new WebpackShellPlugin({ onBuildEnd:[`rm -rf ./picmin.js ./dist/picmin.js`]})
  ]
};
