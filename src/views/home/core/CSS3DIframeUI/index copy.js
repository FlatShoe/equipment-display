
import * as THREE from 'three'
import {CSS3DObject, CSS3DRenderer} from 'three/examples/jsm/renderers/CSS3DRenderer.js'
// CSS3DIframeUI.js
export default class CSS3DIframeUI {
  constructor(options = {}) {
    // 必填参数
    this.scene = options.scene // 外部传入的 Three.js 场景
    this.camera = options.camera // 外部传入的相机

    // 可选参数
    this.container = options.container || document.body // 容器元素
    this.controls = options.controls // 可选的控制器
    this.autoResize = options.autoResize !== false // 是否自动响应窗口大小变化

    // 内部状态
    this.css3dRenderer = null
    this.elements = new Map() // 存储所有 iframe 元素
    this.elementCount = 0
    this.isInitialized = false

    // 初始化
    this.init()
  }

  // 初始化
  init() {
    if (!this.scene || !this.camera) {
      console.error('CSS3DIframeUI: scene 和 camera 是必需的参数')
      return
    }

    // 创建 CSS3D 渲染器
    this.createCSS3DRenderer()

    // 设置控制器事件监听
    this.setupControlsListeners()

    // 监听窗口大小变化
    if (this.autoResize) {
      window.addEventListener('resize', () => this.onWindowResize())
    }

    this.isInitialized = true
  }

  // 创建 CSS3D 渲染器
  createCSS3DRenderer() {
    this.css3dRenderer = new CSS3DRenderer()

    // 设置渲染器大小
    const width = this.container.clientWidth || window.innerWidth
    const height = this.container.clientHeight || window.innerHeight
    this.css3dRenderer.setSize(width, height)

    // 设置渲染器样式
    this.css3dRenderer.domElement.style.position = 'absolute'
    this.css3dRenderer.domElement.style.top = '0'
    this.css3dRenderer.domElement.style.left = '0'
    this.css3dRenderer.domElement.style.pointerEvents = 'none'
    this.css3dRenderer.domElement.style.zIndex = '1'

    // 将渲染器添加到容器
    this.container.appendChild(this.css3dRenderer.domElement)
  }

  // 设置控制器监听
  setupControlsListeners() {
    if (!this.controls) return

    // 控制器开始时禁用 iframe 事件
    this.controls.addEventListener('start', () => {
      this.elements.forEach(element => {
        if (element.domElement) {
          element.domElement.style.pointerEvents = 'none'
        }
      })
    })

    // 控制器结束时启用 iframe 事件
    this.controls.addEventListener('end', () => {
      this.elements.forEach(element => {
        if (element.domElement) {
          element.domElement.style.pointerEvents = 'auto'
        }
      })
    })
  }

  /**
   * 创建 iframe UI
   * @param {Object} config 配置参数
   * @returns {Object} 包含 iframe 元素和控制方法的对象
   */
  createIframe(config = {}) {
    if (!this.isInitialized) {
      console.error('CSS3DIframeUI: 未初始化')
      return null
    }

    const {
      id = `iframe-${Date.now()}-${++this.elementCount}`,
      url = '',
      htmlContent = '',
      width = 1024,
      height = 768,
      position = {x: 0, y: 0, z: 0},
      rotation = {x: 0, y: 0, z: 0},
      scale = 1,
      withFrame = true,
      frameThickness = 30,
      frameColor = 0x2200ff,
      clickable = true
    } = config

    // 创建 iframe 容器
    const iframeContainer = this.createIframeContainer(width, height, url, htmlContent)

    // 创建 CSS3D 对象
    const css3dObject = new CSS3DObject(iframeContainer)
    css3dObject.position.set(position.x, position.y, position.z)
    css3dObject.rotation.set(rotation.x, rotation.y, rotation.z)
    css3dObject.scale.set(scale, scale, scale)

    // 添加到场景
    this.scene.add(css3dObject)

    // 创建点击检测平面
    const clickPlane = this.createClickPlane(width, height, clickable)
    clickPlane.position.copy(css3dObject.position)
    clickPlane.rotation.copy(css3dObject.rotation)
    clickPlane.scale.copy(css3dObject.scale)
    this.scene.add(clickPlane)

    // 创建边框
    let frame = null
    if (withFrame) {
      frame = this.createFrame(width, height, frameThickness, frameColor)
      frame.position.copy(css3dObject.position)
      frame.rotation.copy(css3dObject.rotation)
      frame.scale.copy(css3dObject.scale)
      this.scene.add(frame)
    }

    // 存储元素
    const elementData = {
      id,
      css3dObject,
      clickPlane,
      frame,
      domElement: iframeContainer,
      width,
      height,
      scale,
      position: {...position},
      rotation: {...rotation},
      config
    }

    this.elements.set(id, elementData)

    // 返回控制接口
    return {
      id,
      css3dObject,
      clickPlane,
      frame,
      domElement: iframeContainer,

      // 更新位置
      setPosition: (x, y, z) => {
        css3dObject.position.set(x, y, z)
        clickPlane.position.set(x, y, z)
        if (frame) frame.position.set(x, y, z)
        elementData.position = {x, y, z}
      },

      // 更新旋转
      setRotation: (x, y, z) => {
        css3dObject.rotation.set(x, y, z)
        clickPlane.rotation.set(x, y, z)
        if (frame) frame.rotation.set(x, y, z)
        elementData.rotation = {x, y, z}
      },

      // 更新缩放
      setScale: newScale => {
        css3dObject.scale.set(newScale, newScale, newScale)
        clickPlane.scale.set(newScale, newScale, newScale)
        if (frame) frame.scale.set(newScale, newScale, newScale)
        elementData.scale = newScale
      },

      // 更新尺寸
      setSize: (newWidth, newHeight) => {
        // 更新容器尺寸
        iframeContainer.style.width = `${newWidth}px`
        iframeContainer.style.height = `${newHeight}px`

        // 更新点击平面
        this.scene.remove(clickPlane)
        const newClickPlane = this.createClickPlane(newWidth, newHeight, clickable)
        newClickPlane.position.copy(css3dObject.position)
        newClickPlane.rotation.copy(css3dObject.rotation)
        newClickPlane.scale.copy(css3dObject.scale)
        this.scene.add(newClickPlane)

        // 更新边框
        if (frame) {
          this.scene.remove(frame)
          const newFrame = this.createFrame(newWidth, newHeight, frameThickness, frameColor)
          newFrame.position.copy(css3dObject.position)
          newFrame.rotation.copy(css3dObject.rotation)
          newFrame.scale.copy(css3dObject.scale)
          this.scene.add(newFrame)
          elementData.frame = newFrame
        }

        // 更新存储的数据
        elementData.clickPlane = newClickPlane
        elementData.width = newWidth
        elementData.height = newHeight
      },

      // 更新 URL
      setUrl: newUrl => {
        if (iframeContainer.tagName === 'IFRAME') {
          iframeContainer.src = newUrl
        } else if (iframeContainer.querySelector('iframe')) {
          iframeContainer.querySelector('iframe').src = newUrl
        }
      },

      // 移除元素
      remove: () => this.removeIframe(id),

      // 获取当前数据
      getData: () => ({...elementData})
    }
  }

  // 创建 iframe 容器
  createIframeContainer(width, height, url, htmlContent) {
    const container = document.createElement('div')
    container.style.width = `${width}px`
    container.style.height = `${height}px`
    container.style.border = '0px'
    container.style.overflow = 'hidden'
    container.style.backfaceVisibility = 'hidden'
    container.style.backgroundColor = 'transparent'

    if (url) {
      // 使用 iframe
      const iframe = document.createElement('iframe')
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.border = '0px'
      iframe.style.background = 'transparent'
      iframe.src = url
      container.appendChild(iframe)
    } else if (htmlContent) {
      // 使用 HTML 内容
      container.innerHTML = htmlContent
    } else {
      // 创建默认占位符
      container.style.backgroundColor = '#f0f0f0'
      container.style.display = 'flex'
      container.style.alignItems = 'center'
      container.style.justifyContent = 'center'
      container.style.color = '#666'
      container.innerText = 'CSS3D UI'
    }

    return container
  }

  // 创建点击检测平面
  createClickPlane(width, height, clickable) {
    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      blending: THREE.NoBlending,
      opacity: clickable ? 0.1 : 0, // 可点击时稍微可见，方便调试
      transparent: true,
      depthTest: false
    })

    const plane = new THREE.Mesh(geometry, material)
    plane.userData = {isClickPlane: true}

    return plane
  }

  // 创建边框
  createFrame(width, height, thickness, color) {
    const group = new THREE.Group()

    // 边框材质
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.4,
      metalness: 0.6
    })

    // 边框几何体
    const shape = new THREE.Shape()
    shape.moveTo(-width / 2, -height / 2)
    shape.lineTo(width / 2, -height / 2)
    shape.lineTo(width / 2, height / 2)
    shape.lineTo(-width / 2, height / 2)
    shape.lineTo(-width / 2, -height / 2)

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: false
    }

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    const frame = new THREE.Mesh(geometry, material)
    frame.position.z = -thickness / 2

    group.add(frame)

    return group
  }

  /**
   * 移除 iframe
   * @param {string} id iframe 的 ID
   */
  removeIframe(id) {
    const element = this.elements.get(id)
    if (!element) return false

    // 从场景中移除
    this.scene.remove(element.css3dObject)
    this.scene.remove(element.clickPlane)
    if (element.frame) {
      this.scene.remove(element.frame)
    }

    // 从 DOM 中移除
    if (element.domElement && element.domElement.parentNode) {
      element.domElement.parentNode.removeChild(element.domElement)
    }

    // 从集合中移除
    this.elements.delete(id)

    return true
  }

  /**
   * 获取 iframe
   * @param {string} id iframe 的 ID
   * @returns {Object} iframe 控制接口
   */
  getIframe(id) {
    const element = this.elements.get(id)
    if (!element) return null

    return {
      id: element.id,
      css3dObject: element.css3dObject,
      clickPlane: element.clickPlane,
      frame: element.frame,
      domElement: element.domElement,
      setPosition: (x, y, z) => {
        element.css3dObject.position.set(x, y, z)
        element.clickPlane.position.set(x, y, z)
        if (element.frame) element.frame.position.set(x, y, z)
        element.position = {x, y, z}
      },
      setRotation: (x, y, z) => {
        element.css3dObject.rotation.set(x, y, z)
        element.clickPlane.rotation.set(x, y, z)
        if (element.frame) element.frame.rotation.set(x, y, z)
        element.rotation = {x, y, z}
      }
    }
  }

  /**
   * 获取所有 iframe
   * @returns {Array} 所有 iframe 的数组
   */
  getAllIframes() {
    return Array.from(this.elements.values()).map(element => ({
      id: element.id,
      css3dObject: element.css3dObject,
      position: element.position,
      rotation: element.rotation,
      width: element.width,
      height: element.height
    }))
  }

  /**
   * 渲染 CSS3D
   * 需要在外部渲染循环中调用
   */
  render() {
    if (this.css3dRenderer && this.scene && this.camera) {
      this.css3dRenderer.render(this.scene, this.camera)
    }
  }

  /**
   * 窗口大小变化处理
   */
  onWindowResize() {
    if (!this.css3dRenderer) return

    const width = this.container.clientWidth || window.innerWidth
    const height = this.container.clientHeight || window.innerHeight

    this.css3dRenderer.setSize(width, height)

    // 如果需要更新相机，这里也可以更新
    if (this.camera && this.camera.aspect) {
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }
  }

  /**
   * 设置容器
   * @param {HTMLElement} container 新的容器元素
   */
  setContainer(container) {
    if (!container || container === this.container) return

    // 从旧容器中移除渲染器
    if (this.css3dRenderer && this.css3dRenderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.css3dRenderer.domElement)
    }

    // 更新容器
    this.container = container

    // 将渲染器添加到新容器
    if (this.css3dRenderer && this.css3dRenderer.domElement) {
      container.appendChild(this.css3dRenderer.domElement)
    }

    // 更新渲染器大小
    this.onWindowResize()
  }

  /**
   * 设置控制器
   * @param {THREE.OrbitControls} controls 新的控制器
   */
  setControls(controls) {
    this.controls = controls
    this.setupControlsListeners()
  }

  /**
   * 销毁
   */
  destroy() {
    // 移除所有 iframe
    this.elements.forEach((element, id) => {
      this.removeIframe(id)
    })

    // 移除渲染器
    if (this.css3dRenderer && this.css3dRenderer.domElement.parentNode) {
      this.css3dRenderer.domElement.parentNode.removeChild(this.css3dRenderer.domElement)
    }

    // 移除事件监听
    if (this.autoResize) {
      window.removeEventListener('resize', () => this.onWindowResize())
    }

    // 清空引用
    this.css3dRenderer = null
    this.elements.clear()
    this.isInitialized = false
  }
}
