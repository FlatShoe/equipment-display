import * as THREE from 'three'
import Scene from './core/Scene/index'
import EquipmentLoader from './core/EquipmentManager/EquipmentLoader'
import gsap from 'gsap'
import sceneConfig from './core/Scene/config'
import ThreeClickCoordinator from './core/ThreeClickCoordinator/index.js'
import CSS3DIframeManager from './core/CSS3DIframeUI/index'

class EquipmentDisplay {
  constructor(container) {
    this.container = container
    this.scene = null
    this.equipmentLoader = null
    this.deviceMonitor = null
    this.clickCoordinator = null

    // 加载状态
    this.isLoaded = false
    this.loadingCallbacks = []

    // 模型实例
    this.model = null

    // 初始化
    this.initialize()
  }

  /**
   * 初始化
   */
  async initialize() {
    const container = this.container
    if (!container) {
      throw new Error('找不到应用容器')
    }

    try {
      // 创建场景
      this.scene = new Scene(container)

      // 创建设备加载器
      this.equipmentLoader = new EquipmentLoader(this.scene.getScene())

      // 加载设备模型
      console.log('开始加载模型...')
      this.model = await this.equipmentLoader.loadModel('yyp.glb')
      console.log('模型加载完成:', this.model)

      // 创建点击坐标查看器
      this.clickCoordinator = new ThreeClickCoordinator(
        this.scene.getScene(),
        this.scene.getCamera(),
        this.scene.getRenderer().domElement
      )

      // 创建 CSS3DIframeUI
      // this.css3dManager = new CSS3DIframeManager(
      //   this.scene.getScene(),
      //   this.scene.getCamera(),
      //   this.container
      // )

      // 设置点击回调
      this.setupClickHandler()

      // 标记加载完成
      this.isLoaded = true

      // 执行所有加载完成的回调函数
      this.executeLoadCallbacks()

      // 启动更新循环
      this.update()

      console.log('EquipmentDisplay 初始化完成')
    } catch (error) {
      console.error('EquipmentDisplay 初始化失败:', error)
      throw error
    }
  }

  /**
   * 设置点击处理器
   */
  setupClickHandler() {
    if (!this.clickCoordinator) return

    // 设置点击回调
    this.clickCoordinator.onClick(result => {
      if (result.hasHit) {
        // 触发点击事件
        this.triggerEvent('click', {
          object: result.firstIntersect.object,
          point: result.firstIntersect.point,
          data: result
        })
      }
    })

    // 显示辅助标记
    this.clickCoordinator.toggleHelpers(false)
  }

  /**
   * 更新循环
   */
  update() {
    if (!this.scene) return

    requestAnimationFrame(this.update.bind(this))
    this.scene.update()
  }

  /**
   * 设置视图
   */
  setView(mode) {
    if (!this.isLoaded) {
      console.warn('模型尚未加载完成')
      return
    }

    // 获取配置
    const config = sceneConfig

    // 视图模式映射
    const viewModes = {
      front: {
        position: new THREE.Vector3(0, 1.5, 5),
        target: config.controls.defaultTarget
      },
      top: {
        position: new THREE.Vector3(0, 10, 0.0001),
        target: config.controls.defaultTarget
      },
      side: {
        position: new THREE.Vector3(5, 1.5, 0),
        target: config.controls.defaultTarget
      },
      default: {
        position: config.camera.position,
        target: config.controls.defaultTarget
      }
    }

    const viewConfig = viewModes[mode] || viewModes.default
    this.moveCamera(viewConfig.position, viewConfig.target)

    // 触发视图改变事件
    this.triggerEvent('viewChange', {mode, config: viewConfig})
  }

  /**
   * 移动相机
   */
  moveCamera(position, target) {
    const camera = this.scene.getCamera()
    const controls = this.scene.getControls()

    if (camera && controls) {
      gsap.killTweensOf(camera)
      gsap.killTweensOf(controls)
      controls.enabled = false
      gsap.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 1,
        ease: 'power2.inOut'
      })
      gsap.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          controls.enabled = true
        }
      })
    }
  }

  /**
   * 重置相机到默认位置
   */
  resetCamera() {
    const config = sceneConfig
    this.moveCamera(config.camera.position, config.controls.defaultTarget)
  }

  /**
   * 加载完成回调
   */
  onLoad(callback) {
    if (this.isLoaded) {
      // 如果已经加载完成，立即执行回调
      setTimeout(() => callback(this), 0)
    } else {
      // 否则添加到回调列表
      this.loadingCallbacks.push(callback)
    }
    return this // 支持链式调用
  }

  /**
   * 执行加载完成回调
   */
  executeLoadCallbacks() {
    console.log(`执行 ${this.loadingCallbacks.length} 个加载完成回调`)

    this.loadingCallbacks.forEach(callback => {
      try {
        callback(this)
      } catch (error) {
        console.error('加载回调执行失败:', error)
      }
    })

    // 清空回调列表
    this.loadingCallbacks = []
  }

  /**
   * 检查是否加载完成
   */
  isLoading() {
    return !this.isLoaded
  }

  /**
   * 获取模型
   */
  getModel() {
    return this.model
  }

  /**
   * 获取场景
   */
  getScene() {
    return this.scene ? this.scene.getScene() : null
  }

  /**
   * 获取相机
   */
  getCamera() {
    return this.scene ? this.scene.getCamera() : null
  }

  /**
   * 获取渲染器
   */
  getRenderer() {
    return this.scene ? this.scene.getRenderer() : null
  }

  /**
   * 事件系统
   */
  events = {}

  /**
   * 注册事件监听
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
    return this
  }

  /**
   * 移除事件监听
   */
  off(eventName, callback) {
    if (!this.events[eventName]) return

    if (callback) {
      const index = this.events[eventName].indexOf(callback)
      if (index > -1) {
        this.events[eventName].splice(index, 1)
      }
    } else {
      this.events[eventName] = []
    }
  }

  /**
   * 触发事件
   */
  triggerEvent(eventName, data) {
    if (!this.events[eventName]) return

    this.events[eventName].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`事件 ${eventName} 回调执行失败:`, error)
      }
    })
  }

  /**
   * 获取坐标查看器
   */
  getCoordinator() {
    return this.clickCoordinator
  }

  /**
   * 手动获取点击位置的坐标
   */
  getClickPosition(screenX, screenY) {
    if (this.clickCoordinator) {
      return this.clickCoordinator.getWorldPosition(screenX, screenY)
    }
    return null
  }

  /**
   * 销毁
   */
  dispose() {
    // 停止动画循环
    cancelAnimationFrame(this.animationFrameId)

    if (this.clickCoordinator) {
      this.clickCoordinator.dispose()
    }

    if (this.scene) {
      this.scene.dispose()
    }

    // 清空引用
    this.model = null
    this.equipmentLoader = null
    this.clickCoordinator = null
    this.scene = null
    this.isLoaded = false

    console.log('EquipmentDisplay 已销毁')
  }
}

export default EquipmentDisplay
