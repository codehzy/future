---
title: 数组方法手写
author: future
date: '2022-5-19'
categories:
 - js-api
tags:
 - Handle-Api
---


# Array方法手写

## 1. 实现两个数组比较是否相等

[](../../../../example/handle-js-api/Array/01_twoArr-equal.js)

```js
/**
 * 实现两个数组对比是否相等，返回true或false
 *
 * 实现思路
 *
 * ① 如果equal()函数接收的值为空,return false;
 * ② 如果两个数组的长度不相同,return false;
 * ③ for循环遍历时,如果相对应的两个元素不相等(不考虑相对应的两个元素都是数组这种情况,因为这种情况在上面的if语句里面为true,不会到else这里),return false;
 * ④ 通过for循环遍历这两个数组中的任意一个(可以是equals()方法的调用者,也可以是传递进来的参数(数组)),如果相对应的两个元素都是数组,就开始递归,再调用equals()函数,如果又碰到了上面列出的那三种情况,接收return回来的false,取反为true,进入if语句,返回false;
 * 如果整个程序执行完都没有出现这三种return false的情况,那么可以判定这两个数组"相等";
 *
 * 直接在Array构造函数的原型上面挂载equals()函数,默认这个函数是可枚举的,而for...in遍历是可以遍历对象自身和继承的可枚举属性的,通过手动设置其enumerable属性为false之后,就枚举不出来了.因此,在某个构造函数的原型上扩展某个方法时,需要注意这一点。
 *
 */

// 实现
Array.prototype.equal = function (arr) {
    if(!arr.length){
        return false
    }
    if(this.length !== arr.length){
        return false
    }
    for(let i = 0;i < this.length;i++){
        if(Array.isArray(this[i]) && Array.isArray(arr[i])){
            if(!this[i].equal(arr[i])){
                return false
            }
        }else{
            if(this[i] !== arr[i]){
                return false
            }
        }
    }
    return true
}

// 优化：防止枚举
Object.defineProperty(Array.prototype,'equal',{
    enumerable:false
})
```

## 2. 实现数组分组,将传入的数据按指定特征进行分组

```js
// 数组分组,将传入的数据按指定特征进行分组。
// 输入: 数组值，函数或者属性
// 输出: 对象
//      key: 数组所有元素经过处理后的值
//      value: 相同key的数组元素集合
/**
 * 
 * 实现思路:
 *  1. 一轮循环筛选传入是函数还是属性
 *  2. 二轮循环将构建一个对象，如果当前值在上一轮执行结果中，那么就将其找到，使用数组concat加进去。如果没找到，那么就新增一个key（为当前只做key），值为数组的index
/**
   groupBy([6.1, 4.2, 6.3], Math.floor);
   // { 4: [4.2], 6: [6.1, 6.3] }
   groupBy(['one', 'two', 'three'], 'length');
   // { 3: ['one', 'two'], 5: ['three'] }
 */

function groupBy(arr, fn) {
  return arr
    .map((item) => {
      if (typeof fn === "function") {
        return fn(item);
      } else {
        return item[fn];
      }
    })
    .reduce((pre, cur, index) => {
      if (!pre[cur]) {
        pre[cur] = [arr[index]];
      } else {
        pre[cur] = pre[cur].concat(arr[index]);
      }
      return pre;
    }, {});
}

groupBy([6.1, 4.2, 6.3], Math.floor);
groupBy(["one", "two", "three"], "length");
```