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
  if (!arr.length) {
    return false;
  }
  if (this.length !== arr.length) {
    return false;
  }
  for (let i = 0; i < this.length; i++) {
    if (Array.isArray(this[i]) && Array.isArray(arr[i])) {
      // 递归
      if (!this[i].equal(arr[i])) {
        return false;
      }
    } else {
      if (this[i] !== arr[i]) {
        return false;
      }
    }
  }
  return true;
};

// 优化：防止遍历
Object.defineProperty(Array.prototype, "equal", {
  enumerable: false,
});

// 测试用例
const a1 = ["a", ["b", ["c"]], "d"];
const a2 = ["a", ["b", ["c"]], "d", "F"];
console.log(a1.equal(a2));

const arr = [1, 2, 3, 4];

for (let i in arr) {
  console.log(i);
}
