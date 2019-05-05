const path = require('path');
const glob = require('glob');

// 保存图片数据
const arrImg = [];
glob.sync('./static/**/*.{png,jpeg,jpg,gif,svg,ico}').forEach(entry => {
    arrImg.push(entry);
});

// 在webpack的处理流中操作文件
function fileChunck(options) {
    this.options = options;
}

fileChunck.prototype.apply = function (compiler) {
    const delFileNameArr = this.options.del ? this.options.del : []; // 删除指定文件
    const copyArr = this.options.copy ? this.options.copy : []; // 移动指定文件
    compiler.hooks.emit
        .tapAsync('fileChunck', function (compilation, callback) {
            Object.keys(compilation.assets).filter((filePath) => {
                /* 删除指定文件 */
                if (delFileNameArr.length > 0) {
                    const targetFilePathArr = filePath.split('?')[0].split('/'),
                        targetFilePath = targetFilePathArr[targetFilePathArr.length - 1];
                    if (delFileNameArr.indexOf(targetFilePath) >= 0) {
                        delete compilation.assets[filePath];
                    }
                }

                /* 复制指定文件 */
                if (copyArr.length > 0) {
                    copyArr.filter((obj) => {
                        if (obj.from.indexOf('.html') != -1) {
                            if (filePath === obj.from) {
                                compilation.assets[obj.to] = compilation.assets[filePath];
                            }
                        } else {
                            if (filePath.indexOf('.html') != -1 && filePath.indexOf(obj.from) != -1) {
                                const targetStr = obj.to + filePath.replace(obj.from, '');
                                compilation.assets[targetStr] = compilation.assets[filePath];
                            }
                        }
                        return obj;
                    });
                }

                return (filePath);
            });
            callback();
        });
};

module.exports = {
    entry: arrImg,
    context: path.resolve(__dirname, './'),
    mode: 'production',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    resolve: {
    // 后缀名
        extensions: ['.js', '.css', '.vue']
    },
    module: {
        rules: [
            // image
            {
                test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1, // 小于5bit的图片自动转成base64格式，并且不会存在实体图片
                            name: '[path][name].[ext]?[hash:8]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            gifsicle: {
                                interlaced: false
                            },
                            optipng: {
                                optimizationLevel: 7
                            },
                            pngquant: {
                                quality: '65-90',
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
        new fileChunck({del: ['main.js']})
    ]
};
