---
title: hexo页面中嵌套其他页面
date: 2021-09-14 21:03:56
tags: hexo
---



以下是一个网页小游戏
使用的是 `<iframe>`实现的



<body>
	<iframe	src="\HTML\demo2\demo2.html"
			marginwidth='0' marginheight='0'
			width = 100% height = 650px
	        frameborder = "0" name = "testpage"
			visibility:inherit
			z-index:1
	        scrolling = "no">
	</iframe>
</body>





---


```html
<body>
	<iframe	src="\HTML\demo2\demo2.html" 
            	width = 100% height = 640px 
            	frameborder = "0" name = "testpage" 
            	scrolling = "no">
	</iframe>
</body>
```



`scrolling`: yes\no\auto 显示滚动条

路径就相对路径