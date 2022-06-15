---
title: nestjs入门
author: future
date: '2022-6-15'
categories:
 - back
tags:
 - nestjs
---


## 一、项目搭建

1. 命令行输入

```shell
npm i -g @nestjs/cli  //安装nest脚手架
nest new project_name // 创建nest项目，选择pnpm
```

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206141656276.png" alt="image-20220614165557388" style="zoom:50%;" />

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206141657038.png" alt="image-20220614165702762" style="zoom:50%;" />

2. 项目目录描述

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206141659236.png" alt="image-20220614165947563" style="zoom:50%;" />

3. 启动项目

```
pnpm start:dev
```

**端口3000在main.ts中查看**

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206141701590.png" alt="image-20220614170103209" style="zoom:50%;" />

## 二、架构描述

nest主要依附于`module`service`controller`。是一款oop开发的项目。通常情况下，将具体的业务功能都写入到`service`中，`service`中的方法可以被导出，最终通过`module`的连接使其注入到`controller`中使用。因此划分代码接口会比较清晰。

## 三、基本接口

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206141708369.png" alt="image-20220614170828612" style="zoom:50%;" />

## 四、postman测试

新增一个get请求

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206141709482.png" alt="image-20220614170921426" style="zoom:50%;" />

## 五、编写接口

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206141719720.png" alt="image-20220614171916521" style="zoom:50%;" />

测试接通

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206141722198.png" alt="image-20220614172221184" style="zoom:50%;" />


