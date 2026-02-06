// 关闭 eslint 检查
/* eslint-disable */

import * as THREE from 'three'
/**
 * Three.js 点击坐标查看器
 * 专用于查看点击位置的坐标信息
 */
class ThreeClickCoordinator {
  constructor(scene, camera, domElement) {
    this.scene = scene
    this.camera = camera
    this.domElement = domElement || document.body

    // 射线检测
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    // 是否显示调试辅助
    this.showHelpers = false
    this.helpers = {
      point: null, // 点击点标记
      normal: null, // 法线标记
      coordText: null, // 坐标文字
      hitMarker: null // 命中物体标记
    }

    // 坐标格式配置
    this.formatOptions = {
      precision: 3, // 小数位数
      unit: 'm', // 单位
      showWorldCoord: true, // 显示世界坐标
      showLocalCoord: false, // 显示本地坐标
      showDistance: true, // 显示距离
      showNormal: false // 显示法线
    }

    // 点击记录
    this.clickHistory = []
    this.maxHistory = 10

    // 事件回调
    this.onClickCallback = null

    this.init()
  }

  /**
   * 初始化
   */
  init() {
    this.bindEvents()

    if (this.showHelpers) {
      this.createHelpers()
    }
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    this.handleClick = this.handleClick.bind(this)
    this.domElement.addEventListener('click', this.handleClick)
  }

  /**
   * 解绑事件
   */
  unbindEvents() {
    this.domElement.removeEventListener('click', this.handleClick)
  }

  /**
   * 处理点击事件
   */
  handleClick(event) {
    // 更新鼠标标准化坐标
    this.updateMousePosition(event)

    // 执行射线检测
    const intersects = this.raycastAll()

    // 处理点击结果
    const result = this.processIntersects(intersects, event)

    // 如果有交点，显示信息
    if (result.intersects.length > 0) {
      // this.showClickInfo(result)

      // 调用回调
      if (this.onClickCallback) {
        this.onClickCallback(result)
      }
    }

    // 添加到历史
    this.addToHistory(result)

    return result
  }

  /**
   * 更新鼠标位置
   */
  updateMousePosition(event) {
    const rect = this.domElement.getBoundingClientRect()

    // 转换为标准化设备坐标 (-1 到 +1)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  /**
   * 射线检测所有物体
   */
  raycastAll() {
    this.raycaster.setFromCamera(this.mouse, this.camera)

    // 检测所有可见对象
    return this.raycaster.intersectObjects(this.scene.children, true)
  }

  /**
   * 处理射线检测结果
   */
  processIntersects(intersects, originalEvent) {
    if (intersects.length === 0) {
      return {
        intersects: [],
        hasHit: false,
        mouse: this.mouse.clone(),
        screenPos: {x: originalEvent.clientX, y: originalEvent.clientY},
        originalEvent: originalEvent
      }
    }

    // 获取第一个交点
    const firstIntersect = intersects[0]

    // 获取点击位置的世界坐标
    const worldPoint = firstIntersect.point

    // 获取物体的本地坐标
    const localPoint = new THREE.Vector3()
    firstIntersect.object.worldToLocal(localPoint.copy(worldPoint))

    // 计算到相机的距离
    const distanceToCamera = this.camera.position.distanceTo(worldPoint)

    // 获取物体的变换信息
    const objectInfo = this.getObjectInfo(firstIntersect.object)

    return {
      intersects: intersects,
      hasHit: true,

      // 第一个交点的详细信息
      firstIntersect: {
        point: worldPoint, // 世界坐标
        localPoint: localPoint, // 本地坐标
        distance: firstIntersect.distance, // 射线起点距离
        face: firstIntersect.face, // 面信息
        faceIndex: firstIntersect.faceIndex,
        normal: firstIntersect.normal, // 法线
        uv: firstIntersect.uv, // UV坐标

        // 物体信息
        object: firstIntersect.object,
        objectName: firstIntersect.object.name || '未命名',
        objectType: firstIntersect.object.type,
        objectUuid: firstIntersect.object.uuid
      },

      // 几何信息
      geometryInfo: firstIntersect.object.geometry
        ? {
            vertices: firstIntersect.object.geometry.attributes.position.count,
            faces: firstIntersect.object.geometry.index
              ? firstIntersect.object.geometry.index.count / 3
              : 0
          }
        : null,

      // 距离信息
      distances: {
        toCamera: distanceToCamera
      },

      // 点击信息
      mouse: this.mouse.clone(),
      screenPos: {x: originalEvent.clientX, y: originalEvent.clientY},
      originalEvent: originalEvent,

      // 物体变换信息
      objectTransform: objectInfo
    }
  }

  /**
   * 获取物体信息
   */
  getObjectInfo(object) {
    return {
      position: object.position.clone(),
      rotation: object.rotation.clone(),
      scale: object.scale.clone(),
      quaternion: object.quaternion.clone(),
      worldPosition: object.getWorldPosition(new THREE.Vector3()),
      worldRotation: object.getWorldQuaternion(new THREE.Quaternion()),
      worldScale: object.getWorldScale(new THREE.Vector3())
    }
  }

  /**
   * 显示点击信息
   */
  showClickInfo(result) {
    if (!result.hasHit) {
      console.log('没有点击到任何物体')
      return
    }

    const intersect = result.firstIntersect
    const pos = intersect.point

    // 控制台输出
    console.group('🎯 Three.js 点击坐标信息')

    console.log('📌 命中物体:', intersect.objectName)
    console.log('📦 物体类型:', intersect.objectType)
    console.log('🔑 UUID:', intersect.objectUuid)

    console.log('🌍 世界坐标:')
    console.log('  X:', pos.x.toFixed(3), this.formatOptions.unit)
    console.log('  Y:', pos.y.toFixed(3), this.formatOptions.unit)
    console.log('  Z:', pos.z.toFixed(3), this.formatOptions.unit)

    if (this.formatOptions.showLocalCoord) {
      console.log('📍 本地坐标:')
      console.log('  X:', intersect.localPoint.x.toFixed(3), this.formatOptions.unit)
      console.log('  Y:', intersect.localPoint.y.toFixed(3), this.formatOptions.unit)
      console.log('  Z:', intersect.localPoint.z.toFixed(3), this.formatOptions.unit)
    }

    if (this.formatOptions.showDistance) {
      console.log('📏 距离信息:')
      console.log('  到射线起点:', intersect.distance.toFixed(3), this.formatOptions.unit)
      console.log('  到相机:', result.distances.toCamera.toFixed(3), this.formatOptions.unit)
    }

    if (this.formatOptions.showNormal && intersect.normal) {
      console.log('📐 法线向量:')
      console.log('  X:', intersect.normal.x.toFixed(3))
      console.log('  Y:', intersect.normal.y.toFixed(3))
      console.log('  Z:', intersect.normal.z.toFixed(3))
    }

    if (intersect.uv) {
      console.log('🎨 UV坐标:')
      console.log('  U:', intersect.uv.x.toFixed(3))
      console.log('  V:', intersect.uv.y.toFixed(3))
    }

    if (result.objectTransform) {
      console.log('🔄 物体变换:')
      console.log(
        '  世界位置:',
        result.objectTransform.worldPosition.x.toFixed(3),
        result.objectTransform.worldPosition.y.toFixed(3),
        result.objectTransform.worldPosition.z.toFixed(3)
      )
    }

    console.log('🎯 屏幕坐标:', result.screenPos.x, result.screenPos.y)
    console.log('🖱️  标准化坐标:', result.mouse.x.toFixed(3), result.mouse.y.toFixed(3))

    console.groupEnd()

    // 创建可视化标记
    if (this.showHelpers) {
      this.updateHelpers(result)
    }
  }

  /**
   * 创建辅助标记
   */
  createHelpers() {
    // 点击点标记
    const pointGeometry = new THREE.SphereGeometry(0.1, 16, 16)
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.8
    })
    this.helpers.point = new THREE.Mesh(pointGeometry, pointMaterial)
    this.scene.add(this.helpers.point)

    // 法线标记
    const normalGeometry = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      1,
      0x00ff00
    )
    this.helpers.normal = normalGeometry
    this.scene.add(this.helpers.normal)

    // 创建文字精灵显示坐标
    this.createCoordText()
  }

  /**
   * 创建坐标文字
   */
  createCoordText() {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const context = canvas.getContext('2d')

    context.fillStyle = 'rgba(0, 0, 0, 0.7)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.font = '20px Arial'
    context.fillStyle = '#ffffff'
    context.fillText('坐标信息', 10, 30)
    context.fillText('X: 0.000', 10, 60)
    context.fillText('Y: 0.000', 10, 90)
    context.fillText('Z: 0.000', 10, 120)

    const texture = new THREE.CanvasTexture(canvas)
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    })

    this.helpers.coordText = new THREE.Sprite(spriteMaterial)
    this.helpers.coordText.scale.set(2, 1, 1)
    this.scene.add(this.helpers.coordText)
  }

  /**
   * 更新辅助标记
   */
  updateHelpers(result) {
    if (!result.hasHit) return

    const pos = result.firstIntersect.point

    // 更新点击点位置
    if (this.helpers.point) {
      this.helpers.point.position.copy(pos)
    }

    // 更新法线标记
    if (this.helpers.normal && result.firstIntersect.normal) {
      this.helpers.normal.position.copy(pos)
      this.helpers.normal.setDirection(result.firstIntersect.normal)
    }

    // 更新坐标文字
    if (this.helpers.coordText) {
      this.helpers.coordText.position.copy(pos).add(new THREE.Vector3(0, 1, 0))

      // 更新文字内容
      const canvas = this.helpers.coordText.material.map.image
      const context = canvas.getContext('2d')

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = 'rgba(0, 0, 0, 0.7)'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.font = '16px Arial'
      context.fillStyle = '#ffffff'
      context.fillText(result.firstIntersect.objectName, 10, 25)
      context.fillText(`X: ${pos.x.toFixed(3)}`, 10, 50)
      context.fillText(`Y: ${pos.y.toFixed(3)}`, 10, 75)
      context.fillText(`Z: ${pos.z.toFixed(3)}`, 10, 100)

      this.helpers.coordText.material.map.needsUpdate = true
    }
  }

  /**
   * 添加点击记录
   */
  addToHistory(result) {
    this.clickHistory.unshift({
      ...result,
      timestamp: new Date()
    })

    if (this.clickHistory.length > this.maxHistory) {
      this.clickHistory.pop()
    }
  }

  /**
   * 设置点击回调
   */
  onClick(callback) {
    this.onClickCallback = callback
  }

  /**
   * 手动触发点击检测
   */
  triggerClick(clientX, clientY) {
    const event = new MouseEvent('click', {
      clientX: clientX,
      clientY: clientY
    })

    return this.handleClick(event)
  }

  /**
   * 获取指定屏幕坐标的世界坐标
   */
  getWorldPosition(screenX, screenY) {
    const rect = this.domElement.getBoundingClientRect()

    const mouse = new THREE.Vector2(
      ((screenX - rect.left) / rect.width) * 2 - 1,
      -((screenY - rect.top) / rect.height) * 2 + 1
    )

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, this.camera)

    const intersects = raycaster.intersectObjects(this.scene.children, true)

    if (intersects.length > 0) {
      return {
        hasHit: true,
        point: intersects[0].point,
        object: intersects[0].object
      }
    }

    return {
      hasHit: false,
      point: null,
      object: null
    }
  }

  /**
   * 获取点击历史
   */
  getHistory() {
    return [...this.clickHistory]
  }

  /**
   * 清空历史
   */
  clearHistory() {
    this.clickHistory = []
  }

  /**
   * 显示/隐藏辅助标记
   */
  toggleHelpers(show) {
    this.showHelpers = show !== undefined ? show : !this.showHelpers

    if (this.showHelpers && !this.helpers.point) {
      this.createHelpers()
    }

    if (this.helpers.point) {
      this.helpers.point.visible = this.showHelpers
    }
    if (this.helpers.normal) {
      this.helpers.normal.visible = this.showHelpers
    }
    if (this.helpers.coordText) {
      this.helpers.coordText.visible = this.showHelpers
    }
  }

  /**
   * 设置坐标格式选项
   */
  setFormatOptions(options) {
    this.formatOptions = {...this.formatOptions, ...options}
  }

  /**
   * 获取帮助信息
   */
  getHelpInfo() {
    console.log(`
🎯 ThreeClickCoordinator 使用说明:

1. 点击场景中的物体查看坐标信息
2. 控制台会显示详细的位置信息
3. 可选的视觉辅助标记

📊 获取的信息包括:
   - 世界坐标 (x, y, z)
   - 本地坐标
   - 物体信息
   - 距离信息
   - 法线向量
   - UV坐标
   - 屏幕坐标

⚙️ 可用方法:
   - coordinator.onClick(callback) - 设置点击回调
   - coordinator.toggleHelpers(true/false) - 显示/隐藏辅助标记
   - coordinator.getHistory() - 获取点击历史
   - coordinator.clearHistory() - 清空历史
   - coordinator.setFormatOptions(options) - 设置显示格式
   - coordinator.triggerClick(x, y) - 手动触发点击
   - coordinator.getWorldPosition(x, y) - 获取屏幕坐标对应的世界坐标
    `)
  }

  /**
   * 销毁
   */
  dispose() {
    this.unbindEvents()

    // 移除辅助标记
    Object.values(this.helpers).forEach(helper => {
      if (helper && helper.parent) {
        helper.parent.remove(helper)
      }
    })

    this.helpers = {}
  }
}

// 简单使用示例
/*
// 创建场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

// 添加一些测试物体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.name = "绿色立方体";
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(2, 0, 0);
sphere.name = "红色球体";
scene.add(sphere);

// 创建坐标查看器
const coordinator = new ThreeClickCoordinator(scene, camera, renderer.domElement);

// 设置点击回调
coordinator.onClick((result) => {
  if (result.hasHit) {
    console.log('点击了:', result.firstIntersect.objectName);
    console.log('位置:', result.firstIntersect.point);
  }
});

// 显示辅助标记
coordinator.toggleHelpers(true);

// 设置显示选项
coordinator.setFormatOptions({
  precision: 4,
  showLocalCoord: true,
  showNormal: true
});

// 获取帮助信息
coordinator.getHelpInfo();

// 在动画循环中
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
*/

export default ThreeClickCoordinator
