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

## 安装

**前置安装：**

  * 安装 NodeJS `>= 0.6.16`
  * 安装 NPM `>= 1.1.16`
  * 安装 phonegap
  * 安装并配置 各平台sdk 如 adk
  * **phonegap的Android运行环境可参考 [phonegap开发环境搭建摘要][1]**

## 测试和使用

### 去豆瓣申请一个 api_key，替换 www/js/api\_key.js 的douban\_api\_key

 本项目基于html5，所以

 * 可以作为一个web站点在各式html5浏览器中浏览
 * 可以用phonegap打包 安装到各个平台
 
说实话真机浏览还是挺慢的

**本机浏览器测试:**

  * 搭建任一web服务器环境，将www目录copy到 web server 的 htdoc目录

**手机应用安装步骤:**


    npm install -g phonegap 
    git clone https://github.com/jingxing05/dbmovie.git
    cd dbmovie
    phonegap run android


## Todo
* 更好的图片加载
* 更好的页面加载
* 列表滚动刷新优化

[1]:http://my.oschina.net/jingxing05/blog/265126 'android'