---
title: nestjs连接&操作mysql
author: future
date: '2022-6-15'
categories:
 - back
tags:
 - nestjs
---

## 一、使用typeorm连接mysql

官方文档 https://docs.nestjs.com/recipes/sql-typeorm

1. **安装依赖**

```shell
pnpm add --save typeorm mysql2
```

注意安装以后会得到一下内容

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151349750.png" alt="image-20220615134957082" style="zoom:50%;" />

因为pnpm不会帮我们安装某个依赖的预设依赖，故我们需要手动安装webpack,

```shell
pnpm add webpack@^5.0.0 
```

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151351766.png" alt="image-20220615135138717" style="zoom:50%;" />

## 二、使用typeorm建立数据表

1. 完成上述安装，下面为连接数据库做准备,在src下创建db文件夹，再db文件夹下创建provider/database.providers.ts

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151357420.png" alt="image-20220615135717353" style="zoom:50%;" />

2. 命令行执行

```shell
nest -h
```

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151407906.png" alt="image-20220615140728727" style="zoom:50%;" />

3. 执行一下命令来生成`database`的`module`,`service`,`controller`

```shll
nest g mo database --no-spec
```

将生成出文件移入db下，你会得到以下文件

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151449587.png" alt="image-20220615144928562" style="zoom:50%;" />

4. 继续跟着官方文档编写代码 

```typescript
/src/database/database.module.ts


import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { databaseProviders } from '../db/provider/database.providers';

@Module({
  providers: [DatabaseService, ...databaseProviders],
  controllers: [DatabaseController],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
```

5. 创建目录和文件CRUD

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151420941.png" alt="image-20220615142036864" style="zoom:50%;" />

编写photo.entity.ts

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column('int')
  views: number;

  @Column()
  isPublished: boolean;
}
```

编写photo.providers.ts

```typescript
import { DataSource } from 'typeorm';
import { Photo } from './photo.entity';

export const photoProviders = [
  {
    provide: 'PHOTO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Photo),
    inject: ['DATA_SOURCE'],
  },
];
```

执行命令创建文件

```shell
nest g mo photo --no-spec 
nest g s photo --no-spec
nest g co photo --no-spec 
```

编写photo.service.ts

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Photo } from '../entity/photo/photo.entity';

@Injectable()
export class PhotoService {
  constructor(
    @Inject('PHOTO_REPOSITORY')
    private photoRepository: Repository<Photo>,
  ) {}

  async findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }
}
```

编写photo.modules.ts

```typescript
import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { photoProviders } from '../entity/photo/photo.providers';

@Module({
  imports: [DatabaseModule],
  providers: [PhotoService, ...photoProviders],
  controllers: [PhotoController],
})
export class PhotoModule {}
```

编写photo.controller.ts

```typescript
import { Controller, Get } from '@nestjs/common';
import { PhotoService } from './photo.service';

@Controller('photo')
export class PhotoController {
  constructor(private photoService: PhotoService) {}

  @Get('findAll')
  async findAll() {
    return await this.photoService.findAll();
  }
}
```

修改main.ts，将端口号改为6666

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(6666);
}
bootstrap();
```

6. 至此我们已经基本构建完成了。执行pnpm start:dev启动项目，在数据库中会自动建立出photo的entity定义的数据库字段。

   打开navicat，点击mysql连接

   <img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151452797.png" alt="image-20220615145208501" style="zoom:50%;" />

   点测试连接

   <img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151452716.png" alt="image-20220615145227415" style="zoom:50%;" />

   点保存

   <img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151453492.png" alt="image-20220615145330632" style="zoom:50%;" />

这个photo表就是我们要的数据库表，此时表中内容的每个字段都对应这photo.entity.ts文件所定义的每个字段。

7. 测试刚才的查询方法

我们在数据库中加入一条数据

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151456978.png" alt="image-20220615145648298" style="zoom:50%;" />

8. 打开postman，新建一个GET请求
   <img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151502532.png" alt="image-20220615150214426" style="zoom:50%;" />




