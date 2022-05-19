---
title: 设计模式
author: future
date: '2022-5-19'
categories:
 - Design
tags:
 - Design
---

# JavaScript设计模式

## 前言

1、所谓不变的东西，则是**驾驭技术的能力**。

2、能力

- 能用健壮的代码去解决具体的问题
- 能用抽象的思维去应对复杂的系统
- 能用工程化的思想去规划更大规模的业务

Tip: 基础理论知识是一个人的基线，理论越强基线越高。再为自己定一个目标和向上攀附的阶梯，那么达到目标就是时间问题，而很多野路子工程师搞了半辈子也未达到优秀工程师的基线，很多他们绞尽脑汁得出的高深学问，不过是正规工程师看起来很自然的东西。—— 吴军

3、**很多人缺乏的并不是这种高瞻远瞩的激情，而是我们前面提到的“不变能力”中最基本的那一点——用健壮的代码去解决具体的问题的能力**。那么首先掌握设计模式。

## 创建型

### 1、变与不变（简单工厂）

1、构造器工厂函数

- 构造器对变量进行封装，既确保了共性的不变，又保证了变量个性的灵活。

```js
function User(name , age, career) {
    this.name = name
    this.age = age
    this.career = career 
}
```

2、给User划分不同的职责

- 第一步

```js
function Coder(name , age) {
    this.name = name
    this.age = age
    this.career = 'coder' 
    this.work = ['写代码','写系分', '修Bug']
}
function ProductManager(name, age) {
    this.name = name 
    this.age = age
    this.career = 'product manager'
    this.work = ['订会议室', '写PRD', '催更']
}

function Factory(name, age, career) {
    switch(career) {
        case 'coder':
            return new Coder(name, age) 
            break
        case 'product manager':
            return new ProductManager(name, age)
            break
        ...
}
```

- 优化

```js
function User(name , age, career, work) {
    this.name = name
    this.age = age
    this.career = career 
	  this.work = work
}

function Factory(name, age, career) {
    let work
    switch(career) {
        case 'coder':
            work =  ['写代码','写系分', '修Bug'] 
            break
        case 'product manager':
            work = ['订会议室', '写PRD', '催更']
            break
        case 'boss':
            work = ['喝茶', '看报', '见客户']
        case 'xxx':
            // 其它工种的职责分配
            ...
            
    return new User(name, age, career, work)
}
```

总结： 工厂模式**将创建对象的过程单独封装**

### 2、抽象工厂（开放封闭）

- 生产手机工厂抽象类（抽象类不干活，只做抽象）

```js
abstract class MobilePhoneFactory {
    // 提供操作系统的接口
    createOS(){
        throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
    }
    // 提供硬件的接口
    createHardWare(){
        throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
    }
}
```

- 2、具体工厂来实现抽象工厂方法

```js
// 具体工厂继承自抽象工厂
class FakeStarFactory extends MobilePhoneFactory {
    createOS() {
        // 提供安卓系统实例
        return new AndroidOS()
    }
    createHardWare() {
        // 提供高通硬件实例
        return new QualcommHardWare()
    }
}
```

- 3、抽象操作系统 并实现操作系统

```js
// 定义操作系统这类产品的抽象产品类
abstract class OS {
    controlHardWare() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
    controlHardWare() {
        console.log('我会用安卓的方式去操作硬件')
    }
}

class AppleOS extends OS {
    controlHardWare() {
        console.log('我会用🍎的方式去操作硬件')
    }
}
```

- 4、 抽象硬件产品类，并实现硬件产品类

```js
// 定义手机硬件这类产品的抽象产品类
class HardWare {
    // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
    operateByOrder() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
    operateByOrder() {
        console.log('我会用高通的方式去运转')
    }
}

class MiWare extends HardWare {
    operateByOrder() {
        console.log('我会用小米的方式去运转')
    }
}
```

- 5、生产一个手机全过程

```js
// 这是我的手机
const myPhone = new FakeStarFactory()
// 让它拥有操作系统
const myOS = myPhone.createOS()
// 让它拥有硬件
const myHardWare = myPhone.createHardWare()
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare()
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder()
```

- **拓展**：如果有一天FakeStarFactory这个手机过时了，那么我们不需要去重新定义工厂了。只需要

```js
class newStarFactory extends MobilePhoneFactory {
    createOS() {
        // 操作系统实现代码
    }
    createHardWare() {
        // 硬件实现代码
    }
}
```

### 3、单例模式

单例模式：**一个类，不管我们尝试去创建多少次，它都只给你返回第一次所创建的那唯一的一个实例**。

```js
class SingleDog {
  static getInstance() {
    if (!SingleDog.instance) {
      SingleDog.instance = new SingleDog()
    }
    return SingleDog.instance
  }
}

const s1 = SingleDog.getInstance()
const s2 = SingleDog.getInstance()
console.log(s1 === s2) // true
```

- 通常全局唯一的时候，使用单例模式。

- 场景: 单例实现一个localStorage的封装

```typescript
class Storage {
  static instance: Storage
  static getInstance() {
    if (!Storage.instance) {
      Storage.instance = new Storage()
    }
    return Storage.instance
  }

  getItem(key: string) {
    return localStorage.getItem(key)
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, value)
  }
}
  const s1 = Storage.getInstance()
  const s2 = Storage.getInstance()
  console.log(s1 === s2)

  s1.setItem('code', '12344')

  console.log(s2.getItem('code'))
```

- 场景二： 单例实现全局弹框

```js
// 核心逻辑，这里采用了闭包思路来实现单例模式
const Modal = (function() {
  let modal = null
  return function() {
    if(!modal) {
      modal = document.createElement('div')
      modal.innerHTML = '我是一个全局唯一的Modal'
      modal.id = 'modal'
      modal.style.display = 'none'
      document.body.appendChild(modal)
    }
    return modal
  }
})()
```

### 4、原型模式

![](http://imgsbed-1301560453.cossh.myqcloud.com/blog/202205181755434.png )

- 实现一个深拷贝

```js
const deepClone = (obj) => {
  if (typeof obj != 'object' || obj === null) {
    return obj
  }

  let copy = {}

  if (obj.constructor === Array) {
    copy = []
  }

  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      // 核心
      copy[key] = deepClone(obj[key])
    }
  }

  return copy
}

const obj = {
  name: "hzy",
  obj: {
    company: {
      name: "金贝"
    }
  }
}

const obj2 = deepClone(obj)
console.log(obj2);
obj2.name = 'hello'
console.log(obj);
```

## 结构型

### 1、 装饰器 - es6

- **只添加，不修改**
- 此时有一个按钮

```js
// 定义打开按钮
class OpenButton {
    // 点击后展示弹框（旧逻辑）
    onClick() {
        const modal = new Modal()
    	modal.style.display = 'block'
    }
}
```

- 扩展这个按钮的功能

```js
// 定义按钮对应的装饰器
class Decorator {
    // 将按钮实例传入
    constructor(open_button) {
        this.open_button = open_button
    }
    
    onClick() {
        this.open_button.onClick()
        // “包装”了一层新逻辑
        this.changeButtonStatus()
    }
    
    changeButtonStatus() {
        this.changeButtonText()
        this.disableButton()
    }
    
    disableButton() {
        const btn =  document.getElementById('open')
        btn.setAttribute("disabled", true)
    }
    
    changeButtonText() {
        const btn = document.getElementById('open')
        btn.innerText = '快去登录'
    }
}

const openButton = new OpenButton()
const decorator = new Decorator(openButton)
```

**形象总结**：

```js
// 想象这里有一坨屎山，它虽然实现了业务功能，但代码乱七八糟
var falsebbb = "rld",
 aaatrue = "hel",
 shit = "lo wo",
 dsadq2 = aaatrue + shit + falsebbb;
// 我们把屎山的逻辑抽离出来，包装成函数
function oldShit() {
 // 屎山，也就是上面的代码
}
// 老板让我们加一个新功能，我们把新功能写在新函数里
function newShit() {
 // 自己写的新屎山
}
// 把新旧功能合并包装一下
function moreShit() {
 oldShit();
 newShit();
}
// 这种“只添加，不修改”的模式就是装shi器模式，newShit即装shi器
```

### 2、装饰器 - es7

- 给类加装饰器

```js
function classDecorator(target) {
    target.hasDecorator = true
  	return target
}

// 将装饰器“安装”到Button类上
@classDecorator
class Button {
    // Button类的相关逻辑
}
```

- 给方法加装饰器
  - (装饰器在编译阶段执行，如果加载click事件，此时Button实例还不存在)。为了确保实例生成后可以顺利调用被装饰好的方法，装饰器只能去修饰 Button 类的原型对象。
  - target ：Button.prototype
  - name： 修饰目标的属性名
  - Descriptor: 数据描述符 和 存取描述符

```js
function funcDecorator(target, name, descriptor) {
    let originalMethod = descriptor.value
    descriptor.value = function() {
    console.log('我是Func的装饰器逻辑')
    return originalMethod.apply(this, arguments)
  }
  return descriptor
}

class Button {
    @funcDecorator
    onClick() { 
        console.log('我是Func的原有逻辑')
    }
}   
```

- 应用场景

  - React HOC 高阶组件

    -  传入一个组件，返回一个新的组件

  - Redux

    - `mapStateToProps` 是一个函数，它可以建立组件和状态之间的映射关系；`mapDispatchToProps`也是一个函数，它用于建立组件和`store.dispatch`的关系，使组件具备通过 dispatch 来派发状态的能力。

    - ```js
      export default connect(mapStateToProps, mapDispatchToProps)
      ```

### 3、适配器模式

- 原则
  - 将方法的入参和出餐都固定，方便用户调用。
  - 将复杂的逻辑放到函数体中，让用户无感知调用。

- 如果说 A 连接到 B ，需要json格式，那么此时A又不具备 转换json的能力，此时我们需要提供类似接口一样转换的方法。
- 在A 和 B 之间嫁接一个 AMethods ， 这样我们依然保留以前A调用B的方式，在其中调用AMethods转换一下为json，并完成连接。

- 场景： [axios](https://github.com/axios/axios/tree/63e559fa609c40a0a460ae5d5a18c3470ffc6c9e)

### 4、代理模式

- es6中Proxy就是典型的代理模式

```js
const p = new Proxy(target,{
  get: function(){
    // 满足一些条件，才能访问到
  },
  set: function(){
    // 满足一些条件，才能正常设置属性
  }
})
```

- 场景： [miniVue](https://github.com/cuixiaorui/mini-vue)

#### 代理的类型

- 事件代理 ： 5个A标签实现点击弹出xx被点击了

```html
// 通常做法
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>事件代理</title>
  </head>
  <body>
    <div id="father">
      <a href="#">链接1号</a>
      <a href="#">链接2号</a>
      <a href="#">链接3号</a>
      <a href="#">链接4号</a>
      <a href="#">链接5号</a>
      <a href="#">链接6号</a>
    </div>

    <script>
      const aNodes = document.getElementById('father').getElementsByTagName('a')

      const aLength = aNodes.length

      for (let i = 0; i < aLength; i++) {
        aNodes[i].addEventListener('click', function (e) {
          e.preventDefault()
          alert(`我是${aNodes[i].innerText}`)
        })
      }
    </script>
  </body>
</html>


// 父元素代理
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>事件代理</title>
  </head>
  <body>
    <div id="father">
      <a href="#">链接1号</a>
      <a href="#">链接2号</a>
      <a href="#">链接3号</a>
      <a href="#">链接4号</a>
      <a href="#">链接5号</a>
      <a href="#">链接6号</a>
    </div>

    <script>
      const father = document.getElementById('father')

      father.addEventListener('click', function (e) {
        if (e.target.tagName == 'A') {
          e.preventDefault()
          alert(`我是${e.target.innerText}`)
        }
      })
    </script>
  </body>
</html>
```

#### 缓存代理