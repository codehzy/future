---
title: linux安装mysql
author: future
date: '2022-5-31'
categories:
 - back
tags:
 - mysql
---
# mysql

## 一、版本

1. Centos7.8
2. Mysql8.0

## 二、目标

1. 安装mysql到linux
2. 使用nestjs连接linux上的mysql数据库

## 三、步骤

### 1、安装mysql到linux

(参考阿里云安装mysql)(https://help.aliyun.com/document_detail/116727.html)

- 安装过程中尽量选择允许访问
- 到安全组把服务器的3306端口放行

### 2、使用Navicat连接mysql

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202205310026009.png" alt="image-20220531002558050" style="zoom:50%;" />

- 根据上述步骤，不出意外的话，此时应该出意外了。你会发现连接不上数据库。

### 2.2、修改mysql8.0密码

1、mysql -u root -p '原来的密码' 

2、show databases；

3、use mysql；

4、使用下面的语句修改密码：

```shell
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '你的密码'; 
```

### 2.3、Mysql连接报错：1130-host ... is not allowed to connect to this MySql server

1、连接服务器

```shell
mysql -u root -p
```

2、查看当前所有数据库

```shell
show databases;
```

3、进入mysql数据库

```shell
use mysql;
```

4、查看mysql数据库中所有的表

```shell
show tables;
```

5、查看user表中的数据

```shell
select Host,User,Password from user;
```

6、修改user表中的Host

```shell
Host: update user set Host='%' where User='root';
```

7、刷新一下

```shell
flush privileges;
```

8、重新使用navicat连接会显示连接成功

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202205310038685.png" alt="image-20220531003849524" style="zoom:50%;" />

## 四、使用nest连接mysql

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: '公网ip',
  port: 3306,
  username: 'root',
  password: '数据库密码',
  database: '数据库名',
  autoLoadEntities: true,
  synchronize: true,
}),
```



## 总结

mysql连接需要多多尝试，另外连接成功只是第一步。主要还是nestjs逻辑的开发。后面会研究一下nestjs部署到服务器。