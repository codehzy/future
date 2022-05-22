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
# 泛型

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

## 一、多个泛型

```typescript
function identity<T, U>(value: T, message: U): T {
  return value
}

// function identity<Number, String>(value: Number, message: String): Number
console.log(identity<Number, String>(68, 'nice'))

// function identity<68, string>(value: 68, message: string): 68
console.log(identity(68, 'code'))
```

## 二、返回多个类型的对象-元组

```typescript
function identity<T, U>(value: T, message: U): [T, U] {
  return [value, message]
}

// function identity<number, string>(value: number, message: string): [number, string]
console.log(identity(68, 'code'))
```

## 三、泛型接口

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

## 四、泛型类

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

## 五、泛型约束

### 1、确保属性存在

```typescript
interface Length {
  length: number
}

function identity<T extends Length>(arg: T): T {
  console.log(arg.length) // 可以获取length属性

  return arg
}
```

`T extends Length` 用于告诉编译器，我们支持已经实现 `Length` 接口的任何类型。之后，当我们使用不含有 `length` 属性的对象作为参数调用  `identity` 函数时，TypeScript 会提示相关的错误信息。使用 `,` 号来分隔多种约束类型。显示指定数组，则会有length属性。

```typescript
function identity<T>(arg: T[]): T[] {
  console.log(arg.length)

  return arg
}
```

### 2、检查对象上的键是否存在

```typescript
enum Difficulty {
  Easy,
  Intermediate,
  Hard
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

let tsInfo = {
  name: 'Typescript',
  supersetOf: 'Javascript',
  difficulty: Difficulty.Intermediate
}

let difficulty: Difficulty = getProperty(tsInfo, 'difficulty')

// 类型“"superset_of"”的参数不能赋给类型“"difficulty" | "name" | "supersetOf"”的参数。
// let supersetOf: string = getProperty(tsInfo, 'superset_of')
```

## 六、泛型参数默认类型

```typescript
interface Person<T = string> {
  id: T
}

const p0: Person = { id: 'hello' }
const p1: Person<number> = { id: 123 }
```

泛型参数的默认类型遵循以下规则：

- 有默认类型的类型参数被认为是可选的。
- 必选的类型参数不能在可选的类型参数后。
- 如果类型参数有约束，类型参数的默认类型必须满足这个约束。
- 当指定类型实参时，你只需要指定必选类型参数的类型实参。未指定的类型参数会被解析为它们的默认类型。
- 如果指定了默认类型，且类型推断无法选择一个候选类型，那么将使用默认类型作为推断结果。
- 一个被现有类或接口合并的类或者接口的声明可以为现有类型参数引入默认类型。
- 一个被现有类或接口合并的类或者接口的声明可以引入新的类型参数，只要它指定了默认类型。

## 七、泛型条件类型

```typescript
T extends U ? X : Y
```

若 `T` 能够赋值给 `U`，那么类型是 `X`，否则为 `Y`。在条件类型表达式中，我们通常还会结合 `infer` 关键字，实现类型抽取

```typescript
interface Dictionary<T = any> {
  [key: string]: T
}

type StrDict = Dictionary<string>

type DictMember<T> = T extends Dictionary<infer V> ? V : never

// type StrDictMember = string
type StrDictMember = DictMember<StrDict>
```

**分布式条件类型**

以 `T extends U ? X : Y` 条件类型为例，当类型参数的为 `A | B | C` 时，该条件类型将会被解析为 `(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)`

```typescript
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends undefined
  ? 'undefined'
  : T extends Function
  ? 'function'
  : 'object'

type T10 = TypeName<string | (() => void)> // "string" | "function"
type T12 = TypeName<string | string[] | undefined> // "string" | "object" | "undefined"
type T11 = TypeName<string[] | number[]> // "object"
```

## 八、泛型工具类型

### 8.1 Partial

`Partial<T>` 的作用就是将某个类型里的属性全部变为可选项 `?`。

```typescript
// Partial
type Partial<T> = {
  [P in keyof T]: T[P]
}
```

### 8.2 Record

`Record<K extends keyof any, T>` 的作用是将 `K` 中所有的属性的值转化为 `T` 类型。

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T
}

interface PageInfo {
  title: string
}

type Page = 'home' | 'about' | 'contact'

// Record<K , V>
const x: Record<Page, PageInfo> = {
  about: { title: 'about' },
  contact: { title: 'contact' },
  home: { title: 'home' }
}
```

### 8.3 Pick

`Pick<T, K extends keyof T>` 的作用是将某个类型中的子属性挑出来，变成包含这个类型部分属性的子类型。

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>

const TodoPreview = {
  title: 'Learn TS',
  completed: false
}
```


