# 疯狂的电影

**疯狂的电影** 试图提供方便的电影信息搜索和查看功能

电影信息来自豆瓣网提供的open movie api

Happy Coding!

## 采用的技术

  * **Html5** 希望越来越多的浏览器更好的支持html5m标准
  * **Phonegap** 就现在混搭式开发方式来说，这个用得最爽，确实是write less run on more
  * **Jingle** 让不懂设计，不会Css的程序猿的能较快速的开发应用，还做到界面还过得去，谢谢！

## 平台和浏览器 Support

基于html5开发的混合应用，支持html5标准的桌面Chrome, Safari

手机浏览器如 微信内置的，UC，QQ浏览器，百度浏览器

平台： phonegap支持的平台都可打包部署

## 安装和使用

**前置安装：**

  * 安装 NodeJS `>= 0.6.16`
  * 安装 NPM `>= 1.1.16`
  * 安装 phonegap
  * 安装并配置 各平台sdk 如 adk
  * **phonegap的Android运行环境可参考 [phonegap开发环境搭建摘要][1]**

**安装步骤:**

    npm install -g phonegap 
    git clone https://github.com/jingxing05/dbmovie.git
    cd dbmovie
    phonegap run android


## Todo
* 更好的图片加载
* 更好的页面加载
* 列表滚动刷新优化

[1]:http://my.oschina.net/jingxing05/blog/265126 'android'