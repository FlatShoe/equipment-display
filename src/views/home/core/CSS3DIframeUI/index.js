import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

export default class CSS3DIframeManager {
  constructor(scene, camera, container) {
    this.scene = scene
    this.camera = camera
    this.container = container
    this.css3dObjects = []
    this.renderer = null
    
    this.init()
  }

  init() {
    // 创建 CSS3D 渲染器
    this.renderer = new CSS3DRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.domElement.style.position = 'absolute'
    this.renderer.domElement.style.top = '0'
    this.renderer.domElement.style.left = '0'
    this.renderer.domElement.style.pointerEvents = 'none'
    this.container.appendChild(this.renderer.domElement)

    // 监听窗口大小变化
    window.addEventListener('resize', this.onWindowResize.bind(this))
    
    console.log('CSS3DIframeManager 初始化完成')
  }

  /**
   * 创建玻璃拟态面板
   * @param {string} title - 面板标题
   * @param {Object} data - 参数数据
   * @param {THREE.Vector3} position - 位置
   * @param {Object} options - 配置选项
   * @returns {CSS3DObject}
   */
  createGlassPanel(title, data, position, options = {}) {
    const {
      width = 300,
      height = 250,
      backgroundColor = 'rgba(255, 255, 255, 0.15)',
      showCloseButton = true
    } = options

    // 创建面板容器
    const panelDiv = document.createElement('div')
    panelDiv.className = 'glass-panel-3d'
    panelDiv.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      background: ${backgroundColor};
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      padding: 20px;
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: auto;
      user-select: none;
    `

    // 创建标题区域
    const headerDiv = document.createElement('div')
    headerDiv.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `

    const titleDiv = document.createElement('h3')
    titleDiv.textContent = title
    titleDiv.style.cssText = `
      color: #fff;
      font-size: 1.5rem;
      font-weight: 600;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      margin: 0;
    `
    headerDiv.appendChild(titleDiv)

    // 关闭按钮
    if (showCloseButton) {
      const closeBtn = document.createElement('button')
      closeBtn.innerHTML = '×'
      closeBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.9);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      `
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        this.removeObject(css3dObject)
      })
      headerDiv.appendChild(closeBtn)
    }

    panelDiv.appendChild(headerDiv)

    // 创建参数信息区域
    const contentDiv = document.createElement('div')
    contentDiv.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 15px;
    `

    // 添加参数数据
    Object.entries(data).forEach(([key, value]) => {
      const paramDiv = document.createElement('div')
      paramDiv.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      `

      const labelSpan = document.createElement('span')
      labelSpan.textContent = `${key}：`
      labelSpan.style.cssText = `
        color: rgba(255, 255, 255, 0.9);
        font-size: 1rem;
        font-weight: 500;
      `

      const valueSpan = document.createElement('span')
      valueSpan.textContent = value
      valueSpan.style.cssText = `
        font-size: 1.1rem;
        font-weight: 600;
        padding: 5px 12px;
        border-radius: 15px;
        min-width: 80px;
        text-align: center;
        background: rgba(52, 152, 219, 0.3);
        color: #3498db;
        border: 1px solid rgba(52, 152, 219, 0.4);
      `

      paramDiv.appendChild(labelSpan)
      paramDiv.appendChild(valueSpan)
      contentDiv.appendChild(paramDiv)
    })

    panelDiv.appendChild(contentDiv)

    // 创建 CSS3D 对象
    const css3dObject = new CSS3DObject(panelDiv)
    css3dObject.position.copy(position)
    css3dObject.userData = { type: 'glass-panel', title, data }
    
    // 添加到场景和管理器
    this.scene.add(css3dObject)
    this.css3dObjects.push(css3dObject)

    return css3dObject
  }

  /**
   * 创建设备状态卡片（类似 test.html）
   * @param {string} deviceName - 设备名称
   * @param {Object} statusData - 状态数据
   * @param {THREE.Vector3} position - 位置
   * @returns {CSS3DObject}
   */
  createDeviceCard(deviceName, statusData, position) {
    const cardDiv = document.createElement('div')
    cardDiv.className = 'device-card-3d'
    cardDiv.style.cssText = `
      width: 350px;
      height: 220px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      padding: 20px;
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      pointer-events: auto;
    `

    // 左侧信息区域
    const infoSection = document.createElement('div')
    infoSection.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-right: 20px;
    `

    // 设备名称
    const nameDiv = document.createElement('div')
    const nameH2 = document.createElement('h2')
    nameH2.textContent = deviceName
    nameH2.style.cssText = `
      color: #fff;
      font-size: 1.8rem;
      font-weight: 600;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      margin: 0;
    `
    nameDiv.appendChild(nameH2)
    infoSection.appendChild(nameDiv)

    // 状态信息
    const statusInfo = document.createElement('div')
    statusInfo.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
    `

    Object.entries(statusData).forEach(([key, value]) => {
      const statusItem = document.createElement('div')
      statusItem.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
      `

      const labelSpan = document.createElement('span')
      labelSpan.textContent = `${key}：`
      labelSpan.style.cssText = `
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
        font-weight: 500;
      `

      const valueSpan = document.createElement('span')
      valueSpan.textContent = value
      valueSpan.style.cssText = `
        font-size: 1rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 12px;
        min-width: 70px;
        text-align: center;
        background: rgba(52, 152, 219, 0.3);
        color: #3498db;
        border: 1px solid rgba(52, 152, 219, 0.4);
      `

      statusItem.appendChild(labelSpan)
      statusItem.appendChild(valueSpan)
      statusInfo.appendChild(statusItem)
    })

    infoSection.appendChild(statusInfo)
    cardDiv.appendChild(infoSection)

    // 右侧图标区域
    const iconSection = document.createElement('div')
    iconSection.style.cssText = `
      width: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `

    const icon = document.createElement('i')
    icon.className = 'fas fa-server'
    icon.style.cssText = `
      font-size: 3.5rem;
      color: #fff;
      filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
    `
    iconSection.appendChild(icon)
    cardDiv.appendChild(iconSection)

    const css3dObject = new CSS3DObject(cardDiv)
    css3dObject.position.copy(position)
    css3dObject.userData = { type: 'device-card', deviceName, statusData }
    
    this.scene.add(css3dObject)
    this.css3dObjects.push(css3dObject)

    return css3dObject
  }

  /**
   * 移除对象
   */
  removeObject(object) {
    if (object.parent) {
      object.parent.remove(object)
    }
    const index = this.css3dObjects.indexOf(object)
    if (index > -1) {
      this.css3dObjects.splice(index, 1)
    }
  }

  /**
   * 移除所有对象
   */
  removeAllObjects() {
    this.css3dObjects.forEach(obj => {
      if (obj.parent) {
        obj.parent.remove(obj)
      }
    })
    this.css3dObjects = []
  }

  /**
   * 更新渲染
   */
  update() {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  /**
   * 窗口大小调整
   */
  onWindowResize() {
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }

  /**
   * 销毁
   */
  dispose() {
    this.removeAllObjects()
    if (this.renderer && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this))
  }
}