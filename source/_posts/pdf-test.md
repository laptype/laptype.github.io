---
title: pdf-test (github作OSS)
date: 2022-10-27 15:01:34
tags: DL&ML
---





SVM 笔记一部分



{% pdf https://cdn.jsdelivr.net/gh/laptype/cloud@main/svm%20%E7%AC%94%E8%AE%B0.pdf %}





---

### 附：github 改造成OSS对象存储

1. 创建一个仓库
2. push 一个文件
3. 使用免费的 jsdelivr [CDN](https://so.csdn.net/so/search?q=CDN&spm=1001.2101.3001.7020)
4. `https://cdn.jsdelivr.net/gh/ `前缀+`laptype/cloud`用户名和仓库名+文件名和文件夹名
5. 例：`https://cdn.jsdelivr.net/gh/laptype/cloud/svm%20`笔记.pdf
6. https://cdn.jsdelivr.net/gh/laptype/cloud/svm%20%E7%AC%94%E8%AE%B0.pdf



### hexo 中加入pdf

1. 安装 `npm install --save hexo-pdf`

2. 在正常的 md 文件中添加 `{% pdf ./pdf名字.pdf %}`

3. 例：

   ```
   {% pdf https://cdn.jsdelivr.net/gh/laptype/cloud/svm%20%E7%AC%94%E8%AE%B0.pdf %}
   ```

