---
title: hexo中md内置html的操作
date: 2021-09-14 20:00:17
tags: blogs
---



刚刚实现了一下md内置html的操作
想在博客页面内添加html页面套娃

[实现效果](/2021/09/14/page-test/)


<img src="https://files.alexhchu.com/2021/09/14/f8a334fd75eea.png" alt="g" title="实现效果" style="zoom:50%;"/>



其实没啥操作，也不知道这操作对不对

就是像这样把代码一股脑全粘了进去

<img src="https://files.alexhchu.com/2021/09/14/19f994c922896.png" alt="Snipaste_2021-09-14_20-07-10.png" title="Snipaste_2021-09-14_20-07-10.png" style="zoom:50%;"/>



顺便记录一下修正其中的一个bug：

就是鼠标监听事件，跟着鼠标移动做动作

原本代码是这样：

```js
canvas.addEventListener('mousemove',function (e) {
    var x = e.pageX,
    y = e.pageY,
    len = nBubble.length;
    nBubble[len] = new Bubble(x,y);
    console.log(x,y);
})
```



放在单独的html文件中没啥问题，可当我放在md中时，鼠标位置出现了偏移现象，原本应该鼠标位置为0，0的点变成了400多，400多

这是因为canvas不是填充整个页面了，所以不能再使用全部页面的鼠标坐标

要使用相对鼠标坐标



```js
canvas.addEventListener("mousemove", function(e) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left * (canvas.width / rect.width);
        var y = e.clientY - rect.top * (canvas.height / rect.height);
        var len = nBubble.length;
        // console.log("x:"+x+",y:"+y);
        nBubble[len] = new Bubble(x,y);
});
```



`getBoundingClientRect()` 函数返回属性

| 属性   | 描述                         |
| ------ | ---------------------------- |
| top    | 元素上边界距窗口最上边的距离 |
| left   | 元素左边界距窗口最左边的距离 |
| bottom | 元素下边界距窗口最上边的距离 |
| right  | 元素右边界距窗口最左边的距离 |
| width  | 元素的宽度                   |
| height | 元素的高度                   |

再使用鼠标坐标减去就行了

