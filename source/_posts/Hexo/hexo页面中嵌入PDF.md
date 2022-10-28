---
title: hexo页面中嵌入PDF
date: 2022-10-27 12:04:32
tags: hexo
---



### hexo 中加入pdf

1. 安装 `npm install --save hexo-pdf`

2. 在正常的 md 文件中添加 `{% pdf ./pdf名字.pdf %}`

3. 例：

   ```
   {% pdf https://cdn.jsdelivr.net/gh/laptype/cloud/svm%20%E7%AC%94%E8%AE%B0.pdf %}
   ```


4. 但是这样只有chrome可以正常浏览，edge是不行的。

   ```html
   <body>
   	<iframe	src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/svm%20%E7%AC%94%E8%AE%B0.pdf"
   			marginwidth='0' marginheight='0'
   			width = 100% height = 650px
   	        frameborder = "0" name = "testpage"
   			visibility:inherit
   			z-index:1
   	        scrolling = "no">
   	</iframe>
   </body>
   ```

   


[效果](\2022\10\27\pdf-test)



### 附：github 改造成OSS对象存储

1. 创建一个仓库
2. push 一个文件
3. 使用免费的 jsdelivr [CDN](https://so.csdn.net/so/search?q=CDN&spm=1001.2101.3001.7020)
4. `https://cdn.jsdelivr.net/gh/ `前缀+`laptype/cloud`用户名和仓库名+文件名和文件夹名
5. 例：`https://cdn.jsdelivr.net/gh/laptype/cloud/svm%20`笔记.pdf
6. https://cdn.jsdelivr.net/gh/laptype/cloud/svm%20%E7%AC%94%E8%AE%B0.pdf
7. 不能用就改成`gcore.jsdelivr.net/gh/`



