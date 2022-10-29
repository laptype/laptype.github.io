window.onload = init;

function init() {
  var root = new THREERoot({
    createCameraControls: !true,
    antialias: (window.devicePixelRatio === 1),
    fov: 60
  });
  let gui_params = {
    text_a: 'LaPt 666',
    diffuse_color: 0x29a2d4, 
    specular_color: 0xf0ea8f,
    re: () => {
        reset_g();
    },
    nu: () => {

    },
    size_g: 40
  }


  root.renderer.setClearColor(0x000000);
  root.renderer.setPixelRatio(window.devicePixelRatio || 1);
  root.camera.position.set(0, 0, 600);

  var tl = new TimelineMax({
    repeat: -1,
    repeatDelay: 0.5,
    yoyo: true
  });
  textAnim_g(root, gui_params, tl);
  createTweenScrubber(tl);

  root.gui.add(gui_params, 'text_a').name('文本(不支持中文)').onFinishChange(function() {reset_g();})
  root.gui.add(gui_params, 'size_g', 10,150,1).name('字的大小').onFinishChange(function() {reset_g();})
  var folder1 = root.gui.addFolder('颜色控制');
  folder1.addColor(gui_params, 'diffuse_color').name('扩散的颜色')
  folder1.addColor(gui_params, 'specular_color').name('反射光的颜色')
  folder1.add(gui_params, 're').name('重置颜色')
  root.gui.add(gui_params, 'nu').name('鼠标双击可以全屏！')
  root.gui.add(gui_params, 'nu').name('可以鼠标拖动看看')

  function reset_g() {
    // alert("控制项改变完成");
    console.log(gui_params.text_a);
    // 移除这两个
    root.scene.remove(root.textAnimation);
    root.scene.remove(root.light);
    // TweenMax.delayedCall(1, function(){
    //     console.log('kill')
    //     tl.kill();
    // });
    // var tl = new TimelineMax({
    //     repeat: -1,
    //     repeatDelay: 0.5,
    //     yoyo: true
    //   });
    textAnim_g(root, gui_params, tl);
  }
}


function textAnim_g(root, gui_params, tl) {
    root.textAnimation = createTextAnimation(gui_params.text_a, gui_params.diffuse_color, gui_params.specular_color, gui_params.size_g);
    root.scene.add(root.textAnimation);

    root.light = new THREE.DirectionalLight();
    root.light.position.set(0, 0, 1);
    root.scene.add(root.light);
  
    tl.fromTo(root.textAnimation, 4, {
        animationProgress: 0.0
      }, {
        animationProgress: 0.6,
        ease: Power1.easeInOut
      },
      0
    );
    tl.fromTo(root.textAnimation.rotation, 4, {
      y: 0
    }, {
      y: Math.PI * 2,
      ease: Power1.easeInOut
    }, 0);
  
    // createTweenScrubber(tl);
}

function createTextAnimation(text_a, diffuse_color, specular_color, size_g) {
// lapt
  var geometry = generateTextGeometry(text_a, {
    size: size_g,
    height: 12,
    font: 'droid sans',
    weight: 'bold',
    style: 'normal',
    curveSegments: 24,
    bevelSize: 2,
    bevelThickness: 2,
    bevelEnabled: true,
    anchor: {
      x: 0.5,
      y: 0.5,
      z: 0.0
    }
  });

  THREE.BAS.Utils.tessellateRepeat(geometry, 1.0, 2);

  THREE.BAS.Utils.separateFaces(geometry);

  return new TextAnimation(geometry, diffuse_color, specular_color);
}

function generateTextGeometry(text, params) {
  var geometry = new THREE.TextGeometry(text, params);

  geometry.computeBoundingBox();

  var size = geometry.boundingBox.size();
  var anchorX = size.x * -params.anchor.x;
  var anchorY = size.y * -params.anchor.y;
  var anchorZ = size.z * -params.anchor.z;
  var matrix = new THREE.Matrix4().makeTranslation(anchorX, anchorY, anchorZ);

  geometry.applyMatrix(matrix);

  return geometry;
}

////////////////////
// CLASSES
////////////////////

function TextAnimation(textGeometry, diffuse_color = '0x444444',specular_color = '0x007acc') {
  var bufferGeometry = new THREE.BAS.ModelBufferGeometry(textGeometry);

  var aAnimation = bufferGeometry.createAttribute('aAnimation', 2);
  var aEndPosition = bufferGeometry.createAttribute('aEndPosition', 3);
  var aAxisAngle = bufferGeometry.createAttribute('aAxisAngle', 4);

  var faceCount = bufferGeometry.faceCount;
  var i, i2, i3, i4, v;

  var maxDelay = 0.0;
  var minDuration = 1.0;
  var maxDuration = 1.0;
  var stretch = 0.05;
  var lengthFactor = 0.001;
  var maxLength = textGeometry.boundingBox.max.length();

  this.animationDuration = maxDuration + maxDelay + stretch + lengthFactor * maxLength;
  this._animationProgress = 0;

  var axis = new THREE.Vector3();
  var angle;

  for (i = 0, i2 = 0, i3 = 0, i4 = 0; i < faceCount; i++, i2 += 6, i3 += 9, i4 += 12) {
    var face = textGeometry.faces[i];
    var centroid = THREE.BAS.Utils.computeCentroid(textGeometry, face);
    var centroidN = new THREE.Vector3().copy(centroid).normalize();

    // animation
    var delay = (maxLength - centroid.length()) * lengthFactor;
    var duration = THREE.Math.randFloat(minDuration, maxDuration);

    for (v = 0; v < 6; v += 2) {
      aAnimation.array[i2 + v] = delay + stretch * Math.random();
      aAnimation.array[i2 + v + 1] = duration;
    }

    // end position
    var point = utils.fibSpherePoint(i, faceCount, 200);

    for (v = 0; v < 9; v += 3) {
      aEndPosition.array[i3 + v] = point.x;
      aEndPosition.array[i3 + v + 1] = point.y;
      aEndPosition.array[i3 + v + 2] = point.z;
    }

    // axis angle
    axis.x = centroidN.x;
    axis.y = -centroidN.y;
    axis.z = -centroidN.z;

    axis.normalize();

    angle = Math.PI * THREE.Math.randFloat(0.5, 2.0);

    for (v = 0; v < 12; v += 4) {
      aAxisAngle.array[i4 + v] = axis.x;
      aAxisAngle.array[i4 + v + 1] = axis.y;
      aAxisAngle.array[i4 + v + 2] = axis.z;
      aAxisAngle.array[i4 + v + 3] = angle;
    }
  }

  var material = new THREE.BAS.PhongAnimationMaterial({
    shading: THREE.FlatShading,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
      uTime: {
        type: 'f',
        value: 0
      }
    },
    shaderFunctions: [
      THREE.BAS.ShaderChunk['cubic_bezier'],
      THREE.BAS.ShaderChunk['ease_out_cubic'],
      THREE.BAS.ShaderChunk['quaternion_rotation']
    ],
    shaderParameters: [
      'uniform float uTime;',
      'uniform vec3 uAxis;',
      'uniform float uAngle;',
      'attribute vec2 aAnimation;',
      'attribute vec3 aEndPosition;',
      'attribute vec4 aAxisAngle;'
    ],
    shaderVertexInit: [
      'float tDelay = aAnimation.x;',
      'float tDuration = aAnimation.y;',
      'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
      'float tProgress = ease(tTime, 0.0, 1.0, tDuration);'
      // 'float tProgress = tTime / tDuration;'
    ],
    shaderTransformPosition: [
      'transformed = mix(transformed, aEndPosition, tProgress);',

      'float angle = aAxisAngle.w * tProgress;',
      'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);',
      'transformed = rotateVector(tQuat, transformed);',
    ]
  }, {
    // color 

    diffuse: diffuse_color,
    specular: specular_color
      //emissive:0xffffff
  });

  THREE.Mesh.call(this, bufferGeometry, material);

  this.frustumCulled = false;
}
TextAnimation.prototype = Object.create(THREE.Mesh.prototype);
TextAnimation.prototype.constructor = TextAnimation;

Object.defineProperty(TextAnimation.prototype, 'animationProgress', {
  get: function() {
    return this._animationProgress;
  },
  set: function(v) {
    this._animationProgress = v;
    this.material.uniforms['uTime'].value = this.animationDuration * v;
  }
});

function THREERoot(params) {
  params = utils.extend({
    fov: 60,
    zNear: 10,
    zFar: 100000,

    createCameraControls: true
  }, params);

  this.renderer = new THREE.WebGLRenderer({
    antialias: params.antialias
  });
  this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  document.getElementById('three-container').appendChild(this.renderer.domElement);

  this.camera = new THREE.PerspectiveCamera(
    params.fov,
    window.innerWidth / window.innerHeight,
    params.zNear,
    params.zfar
  );

  this.scene = new THREE.Scene();

  if (params.createCameraControls) {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  }

  this.gui = new dat.GUI({ // 可接收参数
    name: 'My GUI',
    width: 300,
    closed:true
  })

  this.resize = this.resize.bind(this);
  this.tick = this.tick.bind(this);

  this.resize();
  this.tick();

  window.addEventListener('resize', this.resize, true);
  window.addEventListener("dblclick", () => {
    const fullScreenElement = document.fullscreenElement;
    if (!fullScreenElement) {
        //   双击控制屏幕进入全屏，退出全屏
        // 让画布对象全屏
        this.renderer.domElement.requestFullscreen();
    } else {
        //   退出全屏，使用document对象
        document.exitFullscreen();
    }
  });
}
THREERoot.prototype = {
  tick: function() {
    this.update();
    this.render();
    requestAnimationFrame(this.tick);
  },
  update: function() {
    this.controls && this.controls.update();
  },
  render: function() {
    this.renderer.render(this.scene, this.camera);
  },
  resize: function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

////////////////////
// UTILS
////////////////////

var utils = {
  extend: function(dst, src) {
    for (var key in src) {
      dst[key] = src[key];
    }

    return dst;
  },
  randSign: function() {
    return Math.random() > 0.5 ? 1 : -1;
  },
  ease: function(ease, t, b, c, d) {
    return b + ease.getRatio(t / d) * c;
  },
  // mapEase:function(ease, v, x1, y1, x2, y2) {
  //   var t = v;
  //   var b = x2;
  //   var c = y2 - x2;
  //   var d = y1 - x1;
  //
  //   return utils.ease(ease, t, b, c, d);
  // },
  fibSpherePoint: (function() {
    var v = {
      x: 0,
      y: 0,
      z: 0
    };
    var G = Math.PI * (3 - Math.sqrt(5));

    return function(i, n, radius) {
      var step = 2.0 / n;
      var r, phi;

      v.y = i * step - 1 + (step * 0.5);
      r = Math.sqrt(1 - v.y * v.y);
      phi = i * G;
      v.x = Math.cos(phi) * r;
      v.z = Math.sin(phi) * r;

      radius = radius || 1;

      v.x *= radius;
      v.y *= radius;
      v.z *= radius;

      return v;
    }
  })()
};

function createTweenScrubber(tween, seekSpeed) {
  seekSpeed = seekSpeed || 0.001;

  function stop() {
    TweenMax.to(tween, 1, {
      timeScale: 0
    });
  }

  function resume() {
    TweenMax.to(tween, 1, {
      timeScale: 1
    });
  }
  function seek(dx) {
    var progress = tween.progress();
    var p = THREE.Math.clamp((progress + (dx * seekSpeed)), 0, 1);

    tween.progress(p);
  }

  var _cx = 0;

  // desktop
  var mouseDown = false;
  document.body.style.cursor = 'pointer';

  window.addEventListener('mousedown', function(e) {
    mouseDown = true;
    document.body.style.cursor = 'ew-resize';
    _cx = e.clientX;
    stop();
  });
  window.addEventListener('mouseup', function(e) {
    mouseDown = false;
    document.body.style.cursor = 'pointer';
    resume();
  });
  window.addEventListener('mousemove', function(e) {
    if (mouseDown === true) {
      var cx = e.clientX;
      var dx = cx - _cx;
      _cx = cx;

      seek(dx);
    }
  });
  // mobile
  window.addEventListener('touchstart', function(e) {
    _cx = e.touches[0].clientX;
    stop();
    e.preventDefault();
  });
  window.addEventListener('touchend', function(e) {
    resume();
    e.preventDefault();
  });
  window.addEventListener('touchmove', function(e) {
    var cx = e.touches[0].clientX;
    var dx = cx - _cx;
    _cx = cx;

    seek(dx);
    e.preventDefault();
  });
}

