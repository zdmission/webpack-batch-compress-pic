# webpack-batch-compress-pic
基于webpack批量压缩图片，对于webpack，图片，js，css文件都是模块之一，所以webpack的入口可以是图片，js，css等资源

## 注意
+ 图片放在根目录static文件下
+ webpack4对应的file-loader的版本是3.x，而webpack3.x对应的file-loader的版本是2，切记，否则可能会出错
+ clean-webpack-plugin这个插件的使用与之前的版本有所区别，提别是添加需要删除的文件，最新版本默认会删除webpack中output下path的全部文件，如果不需要这样的默认设置，需要重新覆盖cleanOnceBeforeBuildPatterns这个过滤规则，记住你写的文件路径要少写output.path这一层（例如：cleanOnceBeforeBuildPatterns: ['static/images']），详情参考https://www.npmjs.com/package/clean-webpack-plugin

## webpack3.x配置
[webpack3.x-batch-compress-pic](https://github.com/zdmission/webpack3.x-batch-compress-pic)

## 输出
+ 输出目录是dist

## 命令
```bash
npm run imgmin
# 或者
yarn imgmin
```
