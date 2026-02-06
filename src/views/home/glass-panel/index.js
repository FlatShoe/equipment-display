import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

export default class GlassPanel {
  constructor(scene, camera, container) {
    this.scene = scene
    this.camera = camera
    this.container = container
    this.panels = new Map()
  }

  /**
   * 创建玻璃拟态面板
   * @param {Object} options - 面板配置
   * @param {string} options.id - 面板ID
   * @param {string} options.title - 面板标题
   * @param {Object} options.data - 显示的数据
   * @param {THREE.Vector3} options.position - 位置
   * @param {THREE.Vector3} options.rotation - 旋转
   * @param {Object} options.style - 样式配置
   * @returns {CSS3DObject} 面板对象
   */
  createPanel(options = {}) {
    const {
      id = 'glass-panel-' + Date.now(),
      title = '设备参数',
      data = {},
      position = new THREE.Vector3(0, 0, 0),
      rotation = new THREE.Euler(0, 0, 0),
      style = {}
    } = options

    // 创建面板容器
    const panelDiv = document.createElement('div')
    panelDiv.className = 'glass-panel-container'
    panelDiv.id = id
    panelDiv.style.cssText = `
      position: absolute;
      width: 320px;
      height: 250px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      padding: 20px;
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      pointer-events: auto;
      transform-style: preserve-3d;
      overflow: hidden;
    `

    // 添加背景装饰
    const bgElement = document.createElement('div')
    bgElement.style.cssText = `
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, #3498db, #2ecc71);
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.1;
      z-index: -1;
    `
    panelDiv.appendChild(bgElement)

    // 添加标题
    const titleDiv = document.createElement('div')
    titleDiv.style.cssText = `
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `
    
    const titleH2 = document.createElement('h2')
    titleH2.textContent = title
    titleH2.style.cssText = `
      color: #fff;
      font-size: 1.5rem;
      font-weight: 600;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      margin: 0;
    `
    titleDiv.appendChild(titleH2)

    // 添加关闭按钮
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
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    `
    closeBtn.addEventListener('click', () => {
      this.removePanel(id)
    })
    titleDiv.appendChild(closeBtn)
    panelDiv.appendChild(titleDiv)

    // 添加数据内容
    const contentDiv = document.createElement('div')
    contentDiv.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 15px;
    `

    // 温度
    if (data.temperature !== undefined) {
      const tempItem = this.createStatusItem('温度：', `${data.temperature}°C`, '#3498db')
      contentDiv.appendChild(tempItem)
    }

    // 湿度
    if (data.humidity !== undefined) {
      const humidityItem = this.createStatusItem('湿度：', `${data.humidity}%`, '#2ecc71')
      contentDiv.appendChild(humidityItem)
    }

    // 电量
    if (data.power !== undefined) {
      const powerItem = this.createStatusItem('电量：', `${data.power}%`, '#e74c3c')
      contentDiv.appendChild(powerItem)
    }

    // 电压
    if (data.voltage !== undefined) {
      const voltageItem = this.createStatusItem('电压：', `${data.voltage}V`, '#f39c12')
      contentDiv.appendChild(voltageItem)
    }

    panelDiv.appendChild(contentDiv)

    // 创建 CSS3D 对象
    const css3dObject = new CSS3DObject(panelDiv)
    css3dObject.position.copy(position)
    css3dObject.rotation.copy(rotation)
    css3dObject.userData = { id, type: 'glass-panel' }

    // 添加到场景
    this.scene.add(css3dObject)
    this.panels.set(id, css3dObject)

    return css3dObject
  }

  /**
   * 创建状态项
   */
  createStatusItem(label, value, color) {
    const itemDiv = document.createElement('div')
    itemDiv.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
    `

    const labelSpan = document.createElement('span')
    labelSpan.textContent = label
    labelSpan.style.cssText = `
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      font-weight: 500;
    `

    const valueDiv = document.createElement('div')
    valueDiv.textContent = value
    valueDiv.style.cssText = `
      font-size: 1.2rem;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 15px;
      min-width: 80px;
      text-align: center;
      background: rgba(${this.hexToRgb(color)}, 0.3);
      color: ${color};
      border: 1px solid rgba(${this.hexToRgb(color)}, 0.4);
    `

    itemDiv.appendChild(labelSpan)
    itemDiv.appendChild(valueDiv)
    return itemDiv
  }

  /**
   * 十六进制颜色转 RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '255, 255, 255'
  }

  /**
   * 更新面板数据
   */
  updatePanel(id, newData) {
    const panel = this.panels.get(id)
    if (!panel) return

    // 这里可以更新面板内容，暂时简化处理
    console.log('更新面板数据:', id, newData)
  }

  /**
   * 移除面板
   */
  removePanel(id) {
    const panel = this.panels.get(id)
    if (panel && panel.parent) {
      panel.parent.remove(panel)
      this.panels.delete(id)
    }
  }

  /**
   * 移除所有面板
   */
  removeAllPanels() {
    this.panels.forEach((panel, id) => {
      if (panel.parent) {
        panel.parent.remove(panel)
      }
    })
    this.panels.clear()
  }

  /**
   * 设置面板位置
   */
  setPanelPosition(id, position) {
    const panel = this.panels.get(id)
    if (panel) {
      panel.position.copy(position)
    }
  }

  /**
   * 设置面板旋转
   */
  setPanelRotation(id, rotation) {
    const panel = this.panels.get(id)
    if (panel) {
      panel.rotation.copy(rotation)
    }
  }

  /**
   * 销毁
   */
  dispose() {
    this.removeAllPanels()
    this.scene = null
    this.camera = null
    this.container = null
  }
}