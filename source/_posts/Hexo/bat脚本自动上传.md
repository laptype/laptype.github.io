---
title: bat脚本自动上传/本地部署hexo
date: 2022-10-27 13:05:32
tags: hexo
---





## 本地部署

```shell
@echo off

set d=%date:~0,10%
set t=%time:~0,8%

echo ==============cutting line============== >> "D:\lanbo\laptype.io\auto_git\commit.txt"
echo %d% %t% auto commit start... >> "D:\lanbo\laptype.io\auto_git\commit.txt"
echo ------------------------hexo g---------------------------- >> "D:\lanbo\laptype.io\auto_git\commit.txt"
call hexo g >> "D:\lanbo\laptype.io\auto_git\commit.txt"
echo ------------------------hexo s---------------------------- >> "D:\lanbo\laptype.io\auto_git\commit.txt"
call hexo s
echo =================END================>> "D:\lanbo\laptype.io\auto_git\commit.txt"
pause
```

记得用call



## 一键上传

```shell
@echo off

set d=%date:~0,10%
set t=%time:~0,8%

echo ==============cutting line============== >> "D:\lanbo\laptype.io\auto_git\commit.txt"
echo %d% %t% auto commit start... >> "D:\lanbo\laptype.io\auto_git\commit.txt"
echo ------------------------hexo clean------------------------ >> "D:\lanbo\laptype.io\auto_git\commit.txt"
call hexo clean >> "D:\lanbo\laptype.io\auto_git\commit.txt"
echo ------------------------hexo g---------------------------- >> "D:\lanbo\laptype.io\auto_git\commit.txt"
call hexo g >> "D:\lanbo\laptype.io\auto_git\commit.txt"
echo ------------------------hexo d---------------------------- >> "D:\lanbo\laptype.io\auto_git\commit.txt"
call hexo d >> "D:\lanbo\laptype.io\auto_git\commit.txt"
echo ----------------------------git pull---------------------------------- >> "D:\lanbo\laptype.io\auto_git\commit.txt"
call git pull
if errorlevel 1 goto Fail
echo ------------------------hexo clean---------------------------------- >> "D:\lanbo\laptype.io\auto_git\commit.txt"
call hexo clean >> "D:\lanbo\laptype.io\auto_git\commit.txt"
echo ---------------------------git add . --------------------------------- >> "D:\lanbo\laptype.io\auto_git\commit.txt"
call git add .
echo ---------------------------git commit ------------------------------ >> "D:\lanbo\laptype.io\auto_git\commit.txt"
call git commit -m %date:~0,4%-%date:~5,2%-%date:~8,2%
echo ---------------------------git push --------------------------------- >> "D:\lanbo\laptype.io\auto_git\commit.txt"
call git push
echo =================END======================>> "D:\lanbo\laptype.io\auto_git\commit.txt"
if errorlevel 0 goto Success
pause

:Fail
echo fall
pause

:Success
echo =================Success upload======================
pause
```



## 右键快捷打开

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/bat%E8%84%9A%E6%9C%AC%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0_img/19-23-703-image-20221028192019053-21.png" alt="image-20221028192019053"  />

这个主要是 redegit 里面配置的

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/bat%E8%84%9A%E6%9C%AC%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0_img/19-23-703-image-20221028192209813-a2.png" alt="image-20221028192209813" style="zoom:80%;" />

