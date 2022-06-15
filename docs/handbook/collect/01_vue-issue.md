---
title: vue问题收录
author: future
date: '2022-5-19'
categories:
 - issue
tags:
 - collect
---

# solution

## 问题一：vue禁止遮罩层下的页面滚动

解决： 功能开发过程中写遮罩时，遇到遮罩下页面还可以滚动的问题。

```js
<template>
	<div :class="isPopup ? 'disableRoll' : ''">
    <div>
      ...
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPopup: false,
    }
  }
}
</script>

<style>
  .disableRoll {
    overflow: hidden;
    position: fixed;
    height: 100%;
    width: 100%;
  }
</style>
```

## 问题二：vue使用element-ui的modal接入微前端出现蒙层

解决： 查看element-ui的文档，modal-append-to-body设置为false

```js
<el-dialog
      title="监控条件选择"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      destroy-on-close
    >
</el-dialog>
```

## 问题三：vue单页应用h5禁止用户缩放

解决：在index.html的mate加入以下属性

```js
width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=0
```

## 问题四：vue3的reactive对象初始化

解决：
1. 在reactive中如果直接赋值给一个空对象的话，会丢掉响应式
2. 在ts检测时候，Object.key遍历的值会访问显示string类型索引错误。

```typescript
const registerInfo = reactive<RegisterInfoType>({
  name: '',
  age: '',
  password: '',
});

type registerInfoItem = keyof typeof registerInfo;

/**
 * 重置注册表单
 */
const onReset = () => {
  Object.keys(registerInfo).forEach((key) => {
    registerInfo[key as registerInfoItem] = '';
  });
};
```


## 问题五： 图片禁止拖拽成缩略图

问题：在h5上禁止用户拖拽某张图片使其有缩略图

```js

```