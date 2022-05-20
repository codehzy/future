---
title: 泛型
author: future
date: '2022-05-20'
categories:
 - FE
tags:
 - ts
---
[泛型学习地址](https://mp.weixin.qq.com/s?__biz=MzI2MjcxNTQ0Nw==&mid=2247496095&idx=1&sn=5fa0a9f8a7554684a9b487a94fc2b296&scene=21#wechat_redirect)
[ts进阶学习地址](https://juejin.cn/post/7095547569777934367#heading-0)
# TypeScript进阶
## 泛型

**泛型表示泛指某一种类型，开发者可以指定一个表示类型的变量，用它来作为实际类型的占位符，用尖括号来包裹类型变量 `<T>`**

```typescript
function identity<T>(value: T): T {
  return value
}

// function identity<number>(value: number): number
console.log(identity<number>(1))
```

<img src="http://imgsbed-1301560453.cossh.myqcloud.com/blog/202205201052165.png" alt="image-20220520105207670" style="zoom:50%;" />

- K（Key）：表示对象中的键类型；
- V（Value）：表示对象中的值类型；
- E（Element）：表示元素类型。

### 多个泛型

```typescript
function identity<T, U>(value: T, message: U): T {
  return value
}

// function identity<Number, String>(value: Number, message: String): Number
console.log(identity<Number, String>(68, 'nice'))

// function identity<68, string>(value: 68, message: string): 68
console.log(identity(68, 'code'))
```

### 返回多个类型的对象-元组

```typescript
function identity<T, U>(value: T, message: U): [T, U] {
  return [value, message]
}

// function identity<number, string>(value: number, message: string): [number, string]
console.log(identity(68, 'code'))
```

### 泛型接口

```typescript
// 泛型接口返回对象
interface Identities<V, M> {
  value: V
  message: M
}

function identity<T, U>(value: T, message: U): Identities<T, U> {
  const identities: Identities<T, U> = {
    value,
    message
  }
  return identities
}

// function identity<number, string>(value: number, message: string): Identities<number, string>
console.log(identity(68, 'nice'))
```

### 泛型类

```typescript
interface GenericInterface<U> {
  value: U
  getIdentity: () => U
}

class IdentityClass<T> implements GenericInterface<T> {
  value: T

  constructor(value: T) {
    this.value = value
  }

  getIdentity(): T {
    return this.value
  }
}

// constructor IdentityClass<number>(value: number): IdentityClass<number>

const myNumberClass = new IdentityClass<number>(89)
console.log(myNumberClass.getIdentity()) // 89
```


