---
title: Three.JS的一次尝试
date: 2022-10-29 21:58:24
tags: blog
---





## 效果

[3d文字扩散](/HTML/demo4/demo.html)

[旋转立方体，官网的简单教程](/HTML/demo3/demo.html)



[https://animpen.com/](https://animpen.com/)

这个网站上面有一些threejs的例子，我今天尝试的这个其实是在这个基础上改进的。



我添加了一个GUI可以修改文字，修改颜色，修改字体大小，并且让画布可以自适应屏幕大小和双击进入全屏。

> 事先说明，本人目前前端知识接近于0，本次只是对WebGL的一次好奇的尝试

## 更改文字等

这个例子中的文字是通过`THREE.TextGeometry` 创建的。

```javascript
var geometry = new THREE.TextGeometry(text, params);
```



但遗憾的是，想要在threeJS中动态的更改TextGeometry的文字是不可行的 [[1]](https://qa.1r1g.com/sf/ask/3486820501/#)。

必须得删除然后添加新的文本网络。这有一个巨大的性能损失，但不幸的是现在就是这样。

例如：

```javascript
//Group to hold mesh
group = new THREE.Group();
this.scene.add(group);

startTime = new Date();
earthClockMesh = this.getTextMesh(startTime.toLocaleString(), textMaterial);
group.add(earthClockMesh);

//------------Update Text  Mesh----------

//remove old mesh
group.remove(earthClockMesh);

//add new mesh
earthClockMesh = this.getTextMesh(
    new Date(timeNow).toLocaleString(),
        textMaterial
    );
group.add(earthClockMesh);
```



这个例子中，文字和扩散的那个特效是两个东西，如果只是删掉文字，特效也是不会消失的。

这里有个坑，我也不懂为什么，就是 添加的这个最好是在一个外部的函数中。

```javascript
function init() {
  ...
  // gui 里的参数
  let gui_params = {
    text_a: 'LaPt',
    diffuse_color: 0x29a2d4, 
    specular_color: 0xf0ea8f,
    re: () => {
        reset_g();
    },
    size_g: 40
  }
  // 这个是 TimelineMax 好像是动画那个吧
  var tl = new TimelineMax({
    repeat: -1,
    repeatDelay: 0.5,
    yoyo: true
  });
  // 这个函数就是用来添加 TextGeometry 和其他
  textAnim_g(root, gui_params, tl);
  
  createTweenScrubber(tl);
  ...
  root.gui.add(gui_params, 'text_a').name('文本(不支持中文)').onFinishChange(function() {reset_g();})
  ...
  function reset_g() {
    // 移除这两个
    root.scene.remove(root.textAnimation);
    root.scene.remove(root.light);
    // 添加新的 TextGeometry
    textAnim_g(root, gui_params, tl);
}
    

function textAnim_g(root, gui_params, tl) {
  root.textAnimation = createTextAnimation(...)
  root.scene.add(root.textAnimation);
  ...
}
```



- init():
  - 初始化设置 gui 里的参数
  - textAnim_g 添加
  - root.gui.add... GUI ，当里面数值更改后，会调用 reset_g() 函数
  - reset_g() 主要是 从scene中移除 textAnimation
- textAnim_g：
  - createTextAnimation
  - 向scene中add新的textAnimation



## GUI

首先需要配置GUI里有哪些参数：

```javascript
  let gui_params = {
    text_a: 'LaPt',
    diffuse_color: 0x29a2d4, 
    specular_color: 0xf0ea8f,
    re: () => {
        reset_g();
    },
    size_g: 40
  }
```



文字（默认表现为输入框）后面的 `onFinishChange` 表示改变后执行里面的函数（这里可能有些多余了，可能不需要function了）

```javascript
root.gui.add(gui_params, 'text_a').name('文本(不支持中文)').onFinishChange(function() {reset_g();})
```

字体大小（是可以调节的块）

```javascript
root.gui.add(gui_params, 'size_g', 10,150,1).name('字的大小').onFinishChange(function() {reset_g();})
```

颜色控制搞了一个折叠的

```javascript
var folder1 = root.gui.addFolder('颜色控制');
folder1.addColor(gui_params, 'diffuse_color').name('扩散的颜色')
folder1.addColor(gui_params, 'specular_color').name('反射光的颜色')
folder1.add(gui_params, 're').name('重置颜色')
```

颜色这个就不加事件检测了，`onFinishChange`加了没有用，`onChange`加了对于这个例子会变的卡，我也解决不了，所以办法是添加一个充值颜色的按钮，里面的函数是 reset_g





## 自适应屏幕大小、全屏

```javascript
function THREERoot(params) {
  ...
  this.renderer = new THREE.WebGLRenderer({
    antialias: params.antialias
  });
  this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  document.getElementById('three-container').appendChild(this.renderer.domElement);
  ...
  window.addEventListener('resize', this.resize, true);  
  window.addEventListener("dblclick", () => {
    const fullScreenElement = document.fullscreenElement;
    if (!fullScreenElement) {
        // 双击控制屏幕进入全屏，退出全屏
        // 让画布对象全屏
        this.renderer.domElement.requestFullscreen();
    } else {
        //   退出全屏，使用document对象
        document.exitFullscreen();
    }
  });

THREERoot.prototype = {
  ...
  resize: function() {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
```



## 想法

[https://animpen.com/](https://animpen.com/)

这个网站上还有很多例子，可以都玩一玩，他这个是可以在线改的

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/threeJS%E7%9A%84%E4%B8%80%E6%AC%A1%E5%B0%9D%E8%AF%95/22-49-505-image-20221029223912528-58.png" alt="image-20221029223912528" style="zoom:80%;" />

右边的代码的话，想复制在HTML中，模板如下

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>My first three.js app</title>
		<style>
			body { margin: 0; overflow: hidden;}
		</style>
	</head>
	<body>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js"></script>
		<script type="text/javascript" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/TextGeometry.js"></script>
		<script type="text/javascript" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/FontUtils.js"></script>
		<script type="text/javascript" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/pnltri.min.js"></script>
		<script type="text/javascript" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/droid_sans_bold.typeface.js"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.2/TweenMax.min.js"></script>
		<script type="text/javascript" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/bas.js"></script>
		<!-- dat.gui -->
		<script type="text/javascript" src="https://rawgit.com/josdirksen/learning-threejs/master/libs/dat.gui.js"></script>
        
		<script src="js/test.js"></script>
		<script>
			THREE.ShapeUtils.triangulateShape = (function() {
				var pnlTriangulator = new PNLTRI.Triangulator();
				return function triangulateShape(contour, holes) {
					return pnlTriangulator.triangulate_polygon([contour].concat(holes));
				};
			})();
		</script>
		<div id="three-container"></div>

	</body>
</html>

```

就是在body中添加 外链的JS代码，网站的JS代码复制到 `js/test.js`这个文件中，CSS 短的话就head中写一写。

外链的JS代码，可以在左下角那个 文件里面看



![image-20221029224309014](https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/threeJS%E7%9A%84%E4%B8%80%E6%AC%A1%E5%B0%9D%E8%AF%95/22-49-506-image-20221029224309014-9c.png)

这里面就是

但是有个坑是，这种链接（开头没有https的）最好是在浏览器中粘贴一下再复制

官方上面也有教程



[官方的教程](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)

[b站的一个教程](https://www.bilibili.com/read/readlist/rl594352)

[GUI](https://www.pudn.com/news/62a960e8a11cf7345fa06260.html)

[THREE.Color](https://blog.csdn.net/jdk137/article/details/88552791/)

[这也是个在线编辑JS的网站](https://jsfiddle.net/m3j694bu/12/)
