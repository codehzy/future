---
title: nestjs使用jwt完成CRUD
author: future
date: '2022-6-15'
categories:
 - back
tags:
 - nestjs
---
## 1. 安装jwt依赖

```shell
pnpm add @nestjs/jwt @nestjs/passport @nestjs/swagger @types/passport-jwt crypto express passport passport-jwt swagger-ui-express uuid
```

## 2. 创建认证文件

```shell
nest g mo auth --no-spec
nest g s auth --no-spec
nest g co auth --no-spec

nest g mo user --no-spec
nset g s user --no-spec
nest g co user --no-spec
```

## 3. 创建jwt文件

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151614089.png" alt="image-20220615161417967" style="zoom:50%;" />

## 4. 编写文件

### 4.1 编写jwt.strategy.ts

```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { message: '123' };
  }
}
```

### 4.2 编写index.ts

```typescript
export * from './jwt.strategy';
```

###  4.3 编写main.ts

```type
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CRUD')
    .setDescription('一个练手标准项目')
    .setVersion('1.0')
    .addTag('future')
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(6666);
}
bootstrap();
```

### 4.4 编写utils/cryptogram.ts

```typescript
import * as crypto from 'crypto';

/**
 * Make salt
 */
export function makeSalt(): string {
  return crypto.randomBytes(3).toString('base64');
}

/**
 * 将密码hash
 * @param password 用户输入的密码
 * @param salt 盐
 * @returns
 */
export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) {
    return '';
  }
  const tempSalt = Buffer.from(salt, 'base64');
  return (
    // 10000 代表迭代次数 16代表长度
    crypto.pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1').toString('base64')
  );
}
```

### 4.5 编写app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { PhotoModule } from './photo/photo.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DatabaseModule, PhotoModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### 4.6 编写user.service.ts

```typescript
import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/entity/user/user.entity';
import { UsersDTO } from 'src/dto/userdto';
import { v4 as uuidv4 } from 'uuid';
import { CODE } from 'src/code/code';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram';
import { registerDTO } from 'src/dto/authdto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  /**
   * 通过邮箱：查找用户
   * @param email 用户邮箱
   * @returns
   */
  async findByEmail(email: string): Promise<UsersDTO> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * 通过用户唯一id查找用户
   * @param uuid 用户唯一id
   * @returns
   */
  async findOne(uuid: string): Promise<UsersDTO> {
    return await this.userRepository.findOne({
      where: {
        uuid: uuid,
      },
    });
  }

  /**
   * 根据用户email 和 data来更新
   * @param email 用户email地址
   * @param data  要变更的信息
   * @returns
   */
  async updateUser(email: string, data: Partial<UsersDTO>) {
    await this.userRepository.update({ email }, data);
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * 根据用户邮箱删除用户
   * @param email 用户邮箱
   * @returns
   */
  async deleteUser(email: string) {
    await this.userRepository.delete({ email });
    return {
      code: CODE.HTTP_OK,
      message: '删除成功',
    };
  }

  /**
   * 清空数据库中user表中所有数据
   */
  async clearUser(isClearAll: boolean) {
    if (isClearAll) {
      await this.userRepository.clear();
      return {
        code: CODE.HTTP_OK,
        message: '清空user表成功',
      };
    }
  }

  /**
   * 注册用户
   * @param body 注册用户体
   * @returns
   */
  async authRegister(body: registerDTO) {
    const { email, password } = body;
    const userExist = await this.findByEmail(email);
    console.log(userExist);

    if (userExist) {
      return {
        HttpStatus: CODE.HTTP_CREATED,
        message: '用户已经存在',
      };
    }
    const uuid = uuidv4();

    // 加盐加密
    const salt = makeSalt();
    const hashPwd = encryptPassword(password, salt);
    Object.keys(body).forEach((item) => {
      if (item === 'password') body[item] = hashPwd;
    });
    const reqBody = Object.assign({ uuid, salt }, body);

    return this.userRepository.save(reqBody);
  }
}
```

### 4.7 编写user.module.ts

```typescript
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../db/database.module';
import { userProviders } from '../entity/user/user.providers';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, ...userProviders],
  controllers: [UserController],
})
export class UserModule {}
```

### 4.8 编写user.controller.ts

```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { registerDTO } from 'src/dto/authdto';
import { UserFindByEmail, UserFindOne, UsersDTO } from 'src/dto/userdto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('用户模块')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 查找用户
   * @param email 用户邮箱
   * @returns
   */
  @Get('findByEmail')
  @ApiOperation({
    summary: '根据邮箱查询某个用户',
  })
  @ApiQuery({ name: 'email', description: '用户email', type: UserFindByEmail })
  async findByEmail(@Query('email') email: string) {
    return await this.userService.findByEmail(email);
  }

  /**
   * 通过用户唯一id查找用户
   * @param uuid 用户唯一id
   * @returns
   */
  @Get()
  @ApiOperation({
    summary: '根据用户uuid查找用户',
  })
  @ApiQuery({ name: 'uuid', description: '用户uuid', type: UserFindOne })
  async findOne(@Query('uuid') uuid: string) {
    return await this.userService.findOne(uuid);
  }

  @Put('/update/:email')
  @ApiOperation({
    summary: '根据用户email更新用户信息',
  })
  async updateUser(@Param('email') email: string, @Body() data: UsersDTO) {
    const checkUser = await this.findByEmail(email);
    if (!checkUser) {
      return {
        HttpStatus: 201,
        message: '用户不存在',
      };
    }

    await this.userService.updateUser(email, data);
    return {
      status: HttpStatus.OK,
      message: '用户信息更新成功',
    };
  }

  /**
   * 根据用户邮箱删除用户
   * @param email 用户邮箱
   * @returns
   */
  @Delete('/delete/:email')
  @ApiOperation({
    summary: '根据用户email删除用户',
  })
  async deleteOne(@Param('email') email: string) {
    const checkUser = await this.findByEmail(email);
    if (!checkUser) {
      return {
        HttpStatus: 201,
        message: '用户不存在',
      };
    }

    await this.userService.deleteUser(email);
    return {
      status: HttpStatus.OK,
      message: '用户删除成功',
    };
  }

  /**
   * 清空数据库中user表中所有数据
   */
  @Get('clearUser')
  @ApiOperation({
    summary: '清空用户表中所有用户',
  })
  async clearUser(@Query('isClear') isClear: boolean) {
    return await this.userService.clearUser(isClear);
  }

  /**
   * 注册用户
   * @param body 注册用户体
   * @returns
   */
  @Post('register')
  @ApiOperation({
    summary: '注册用户',
  })
  async authRegister(@Body() body: registerDTO) {
    return await this.userService.authRegister(body);
  }
}
```

### 4.9 编写user.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '主键id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    length: 150,
    name: 'uuid',
    comment: 'uuid',
  })
  uuid: string;

  @Column('varchar', {
    nullable: false,
    name: 'salt',
    comment: '密码盐',
  })
  salt: string;

  @Column('varchar', {
    nullable: false,
    name: 'username',
    comment: '用户名',
  })
  username: string;

  @Column('varchar', {
    nullable: false,
    name: 'password',
    comment: '密码',
  })
  password: string;

  @Column('varchar', {
    name: 'email',
    length: 100,
    comment: '邮箱',
  })
  email: string;

  @Column('varchar', {
    nullable: false,
    name: 'avatar',
    comment: '头像',
  })
  avatar: string;

  @Column('int', {
    nullable: false,
    name: 'active',
    comment: '是否激活状态',
  })
  active: 0; // 0 未激活 1 激活

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date;
}
```

### 4.10 编写user.providers.ts

```typescript
import { DataSource } from 'typeorm';
import { User } from './user.entity';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
```

### 4.11 编写userDto.ts

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UsersDTO {
  uuid: string;

  @ApiPropertyOptional({
    description: '用户名',
  })
  username: string;

  salt: string;

  @ApiPropertyOptional({
    description: '密码',
  })
  password: string;

  @ApiPropertyOptional({
    description: '邮箱',
    maxLength: 100,
  })
  email: string;

  @ApiPropertyOptional({
    description: '头像',
  })
  avatar: string;

  @ApiPropertyOptional({
    description: '0 未激活 1 激活',
  })
  active: 0; // 0 未激活 1 激活

  createAt: Date;
  updateAt: Date;
}

export class UserFindByEmail {
  @ApiPropertyOptional({
    description: '邮箱',
  })
  email: string;
}

export class UserFindOne {
  @ApiPropertyOptional({
    description: 'uuid',
  })
  uuid: string;
}
```

### 4.12 编写config/constants

```typescript
export const jwtConstants = {
  secret: 'super_hero', // 秘钥
};
```

### 4.13 编写config/index.ts

```typescript
export * from './constants';
```

### 4.14 编写code/code.ts

```typescript
export enum CODE {
  HTTP_OK = '200',
  HTTP_CREATED = '201',
  REP_WARNING = '1001',
  REP_ERROR = '1002',
}
```

### 4.15 编写auth.service.ts

```typescript
import { encryptPassword } from 'src/utils/cryptogram';
import { authDto, loginData, registerDTO } from 'src/dto/authdto';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CODE } from 'src/code/code';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  // 校验用户信息
  async validateUser({ email, password }: loginData) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const { password: PWD, salt } = user;
      const hashPassword = encryptPassword(password, salt);
      if (hashPassword === PWD) {
        return {
          code: CODE.HTTP_OK,
          user,
        };
      } else {
        return {
          code: CODE.HTTP_OK,
          message: '用户名或者密码错误',
        };
      }
    } else {
      return {
        code: CODE.REP_WARNING,
        message: '用户不存在',
      };
    }
  }

  async certificate(user: authDto) {
    const { email, password } = user;
    const payload = Object.assign({ email, password });
    try {
      const token = this.jwtService.sign(payload);
      return {
        code: CODE.HTTP_OK,
        data: {
          token,
        },
      };
    } catch (error) {
      return {
        code: CODE.REP_WARNING,
        msg: '账号或密码错误',
      };
    }
  }

  async register(body: registerDTO) {
    return await this.usersService.authRegister(body);
  }
}
```

### 4.16 编写auth.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { userProviders } from 'src/entity/user/user.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/config';
import { JwtStrategy } from './strategy';
import { DatabaseModule } from 'src/db/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5min' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, ...userProviders, JwtStrategy],
})
export class AuthModule {}
```

### 4.17 编写auth.controller.ts

```typescript
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CODE } from 'src/code/code';
import { AuthGuard } from '@nestjs/passport';
import { authDto, loginData } from 'src/dto/authdto';

@Controller('auth')
@ApiTags('用户认证模块')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * @param body 登录信息
   */
  @Post('login')
  @ApiOperation({
    summary: '用户登录',
  })
  async login(@Body() body: loginData) {
    const { email, password } = body;

    console.log('JWT验证 - Step 1: 用户请求登录');
    const authResult = await this.authService.validateUser({ email, password });

    switch (authResult.code) {
      case CODE.HTTP_OK:
        return this.authService.certificate(authResult.user);
      case CODE.REP_WARNING:
        return {
          code: 600,
          msg: `账号或密码不正确`,
        };
      default:
        return {
          code: 600,
          msg: `查无此人`,
        };
    }
  }

  @Post('register')
  @ApiOperation({
    summary: '注册',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt')) // 使用 'JWT' 进行验证
  async register(@Body() body: authDto) {
    return await this.authService.register(body);
  }
}
```

## 5. 测试

###  5.1 测试注册用户

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151630568.png" alt="image-20220615163048059" style="zoom:50%;" />

此时由于加了auth.controller.ts中加了jwt守卫

```shell
@UseGuards(AuthGuard('jwt')) // 使用 'JWT' 进行验证
```

此时我们需要先登录才可以注册，将登录的token放到postman的中

### 5.2 测试登录用户

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151633468.png" alt="image-20220615163325963" style="zoom:50%;" />

将token放入认证，此时可以注册

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202206151634634.png" alt="image-20220615163407180" style="zoom:50%;" />

### 5.3 注册swagger

访问http://localhost:6666/api/#/


