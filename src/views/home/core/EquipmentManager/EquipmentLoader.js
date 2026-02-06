import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'


export default class EquipmentLoader {
  constructor(scene) {
    this.scene = scene
    this.loader = new GLTFLoader()
    this.model = null
    this.modelName = ''
    this.isLoaded = false
    this.loadingProgress = 0

    // 设置模型路径基础路径
    // 注意：import.meta.env.BASE_URL 是 Vite 的用法
    // 如果使用 Vue CLI，可能需要改为 process.env.BASE_URL
    const basePath = import.meta.env?.BASE_URL || process.env.BASE_URL || '/'
    this.loader.setPath(basePath + 'models/')
  }

  /**
   * 加载设备模型
   * @param {string} modelPath - 模型文件路径
   * @param {string} modelName - 模型名称
   * @returns {Promise<THREE.Group>} 设备模型
   */
  async loadModel(modelPath, modelName = '新版预约屏') {
    try {
      this.modelName = modelName
      this.isLoaded = false
      this.loadingProgress = 0

      console.log(`开始加载模型: ${modelName}`)

      // 设置加载进度回调
      this.loader.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        this.loadingProgress = itemsLoaded / itemsTotal
        console.log(`加载进度: ${(this.loadingProgress * 100).toFixed(1)}%`)
      }

      // 加载模型
      const gltf = await this.loader.loadAsync(modelPath)
      this.model = gltf.scene

      console.log('加载的模型:', this.model)

      // 设置模型的基本属性
      this.model.scale.setScalar(1)
      this.model.position.set(0, 0, 0)

      // 设置阴影
      this.setupShadows()

      // 添加到场景
      this.scene.add(this.model)

      // 分析模型结构
      this.analyzeModel()

      this.isLoaded = true
      console.log(`模型加载成功: ${modelName}`)

      return this.model
    } catch (error) {
      console.error(`模型加载失败: ${modelName}`, error)
      throw new Error(`模型加载失败: ${error.message}`)
    }
  }

  /**
   * 设置阴影
   */
  setupShadows() {
    if (!this.model) return

    this.model.traverse(child => {
      if (child.isMesh) {
        child.receiveShadow = true
        child.castShadow = true
      }
    })
  }

  /**
   * 分析模型结构
   */
  analyzeModel() {
    if (!this.model) return

    const analysis = {
      totalMeshes: 0,
      totalVertices: 0,
      totalFaces: 0,
      materials: new Set(),
      animations: this.model.animations?.length || 0,
      boundingBox: new THREE.Box3()
    }

    this.model.traverse(child => {
      if (child.isMesh) {
        analysis.totalMeshes++

        if (child.geometry) {
          analysis.totalVertices += child.geometry.attributes.position?.count || 0
          analysis.totalFaces += (child.geometry.index?.count || 0) / 3
        }

        if (child.material) {
          analysis.materials.add(child.material.type)
        }
      }
    })

    // 计算包围盒
    if (this.model) {
      analysis.boundingBox.setFromObject(this.model)
    }

    console.log('模型分析结果:', {
      名称: this.modelName,
      网格数量: analysis.totalMeshes,
      顶点数量: analysis.totalVertices.toLocaleString(),
      面片数量: analysis.totalFaces.toLocaleString(),
      材质类型: Array.from(analysis.materials),
      动画数量: analysis.animations,
      包围盒尺寸: {
        宽: (analysis.boundingBox.max.x - analysis.boundingBox.min.x).toFixed(2),
        高: (analysis.boundingBox.max.y - analysis.boundingBox.min.y).toFixed(2),
        深: (analysis.boundingBox.max.z - analysis.boundingBox.min.z).toFixed(2)
      }
    })
  }

  /**
   * 获取模型
   * @returns {THREE.Group | null} 模型
   */
  getModel() {
    return this.model
  }

  /**
   * 获取模型名称
   * @returns {string} 模型名称
   */
  getModelName() {
    return this.modelName
  }

  /**
   * 获取加载状态
   * @returns {boolean} 是否已加载
   */
  getLoadStatus() {
    return this.isLoaded
  }

  /**
   * 获取加载进度
   * @returns {number} 加载进度 (0-1)
   */
  getLoadingProgress() {
    return this.loadingProgress
  }

  /**
   * 显示/隐藏模型
   * @param {boolean} visible - 是否可见
   */
  setVisible(visible) {
    if (this.model) {
      this.model.visible = visible
    }
  }

  /**
   * 获取模型位置
   * @returns {THREE.Vector3} 模型位置
   */
  getPosition() {
    return this.model ? this.model.position.clone() : new THREE.Vector3()
  }

  /**
   * 设置模型位置
   * @param {THREE.Vector3} position - 新位置
   */
  setPosition(position) {
    if (this.model) {
      this.model.position.copy(position)
    }
  }

  /**
   * 获取模型旋转
   * @returns {THREE.Euler} 模型旋转
   */
  getRotation() {
    return this.model ? this.model.rotation.clone() : new THREE.Euler()
  }

  /**
   * 设置模型旋转
   * @param {THREE.Euler} rotation - 新旋转
   */
  setRotation(rotation) {
    if (this.model) {
      this.model.rotation.copy(rotation)
    }
  }

  /**
   * 获取模型缩放
   * @returns {THREE.Vector3} 模型缩放
   */
  getScale() {
    return this.model ? this.model.scale.clone() : new THREE.Vector3(1, 1, 1)
  }

  /**
   * 设置模型缩放
   * @param {THREE.Vector3} scale - 新缩放
   */
  setScale(scale) {
    if (this.model) {
      this.model.scale.copy(scale)
    }
  }

  /**
   * 显示模型信息
   */
  displayModelInfo() {
    if (!this.model) {
      console.log('模型未加载')
      return
    }

    const info = {
      模型名称: this.modelName,
      加载状态: this.isLoaded ? '已加载' : '未加载',
      位置: this.getPosition(),
      旋转: this.getRotation(),
      缩放: this.getScale(),
      子对象数量: this.model.children.length
    }

    console.log('模型信息:', info)
  }

  /**
   * 从场景中移除模型
   */
  removeFromScene() {
    if (this.model && this.model.parent) {
      this.model.parent.remove(this.model)
    }
  }

  /**
   * 销毁模型
   */
  dispose() {
    if (this.model) {
      // 清理几何体和材质
      this.model.traverse(child => {
        if (child.isMesh) {
          if (child.geometry) {
            child.geometry.dispose()
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose())
            } else {
              child.material.dispose()
            }
          }
        }
      })

      // 从场景中移除
      this.removeFromScene()

      // 重置属性
      this.model = null
      this.isLoaded = false
      this.loadingProgress = 0
    }
  }
}
