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