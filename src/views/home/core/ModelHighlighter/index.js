import * as THREE from 'three'

export default class ModelHighlighter {
  /**
   * 模型高亮器
   * @param {Object} options 配置选项
   * @param {THREE.Scene} options.scene 场景
   * @param {THREE.Camera} options.camera 相机
   * @param {THREE.Object3D} options.model 模型
   */
  constructor(options = {}) {
    this.scene = options.scene
    this.camera = options.camera
    this.model = options.model

    // 存储当前高亮结果
    this.currentHighlights = []

    // 默认配置
    this.config = {
      highlightColor: 0xff6600, // 高亮颜色
      edgeColor: 0xffffff, // 边框颜色
      lineWidth: 2, // 边框宽度
      distance: 3, // 距离相机距离
      floatHeight: 0.1, // 悬浮高度
      floatSpeed: 0.001, // 悬浮速度
      rotationSpeed: 0.5, // 旋转速度
      ...options.config
    }
  }

  /**
   * 查找并高亮指定名称的模型
   * @param {string} targetName 目标模型名称
   * @param {Object} options 选项
   * @returns {Object|null} 高亮结果对象
   */
  findAndHighlight(targetName, options = {}) {
    if (!this.model || !targetName || !this.scene) {
      console.error('缺少必要的参数: model, targetName 或 scene')
      return null
    }

    // 合并选项
    const highlightOptions = {
      clone: true, // 是否克隆
      animate: true, // 是否添加动画
      autoPosition: true, // 是否自动定位
      ...options
    }

    // 1. 查找目标对象
    const targetObject = this.findObjectByName(this.model, targetName)

    if (!targetObject) {
      console.warn(`未找到名称为 "${targetName}" 的模型`)
      return null
    }

    console.log(`找到模型: ${targetName}`, targetObject)

    // 2. 克隆或使用原始对象
    let displayObject
    if (highlightOptions.clone) {
      displayObject = targetObject.clone()
    } else {
      displayObject = targetObject
      // 如果使用原始对象，先保存原始父级
      highlightOptions.originalParent = targetObject.parent
    }

    // 3. 保存原始信息
    const originalData = {
      parent: targetObject.parent,
      position: targetObject.position.clone(),
      rotation: targetObject.rotation.clone(),
      scale: targetObject.scale.clone(),
      visible: targetObject.visible
    }

    // 4. 隐藏原始模型
    if (highlightOptions.clone) {
      targetObject.visible = false
    }

    // 5. 计算位置
    if (highlightOptions.autoPosition) {
      const {position, scale} = this.calculateScreenPosition(displayObject)
      displayObject.position.copy(position)
      displayObject.scale.setScalar(scale)
    } else if (options.position) {
      displayObject.position.set(
        options.position.x || 0,
        options.position.y || 1.5,
        options.position.z || 3
      )
    }

    // 重置旋转
    displayObject.rotation.set(0, 0, 0)

    // 6. 应用高亮
    const highlightData = this.applyHighlight(displayObject)

    // 7. 添加到场景
    this.scene.add(displayObject)

    // 8. 如果使用原始对象，从原始位置移除
    if (!highlightOptions.clone && targetObject.parent) {
      targetObject.parent.remove(targetObject)
    }

    // 9. 添加动画
    let animationData = null
    if (highlightOptions.animate) {
      animationData = this.addFloatAnimation(displayObject)
    }

    // 10. 创建结果对象
    const result = {
      object: displayObject,
      original: targetObject,
      originalData,
      highlightData,
      animationData,
      name: targetName,
      options: highlightOptions,

      // 恢复原状
      restore: () => this.restore(result),

      // 设置位置
      setPosition: (x, y, z) => {
        displayObject.position.set(x, y, z)
        return result
      },

      // 设置缩放
      setScale: scale => {
        displayObject.scale.setScalar(scale)
        return result
      },

      // 设置旋转
      setRotation: (x, y, z) => {
        displayObject.rotation.set(x, y, z)
        return result
      },

      // 获取信息
      getInfo: () => ({
        name: targetName,
        type: displayObject.type,
        position: displayObject.position.toArray(),
        scale: displayObject.scale.toArray(),
        rotation: displayObject.rotation.toArray(),
        boundingBox: this.getObjectBoundingBox(displayObject),
        childCount: this.getObjectChildCount(displayObject)
      })
    }

    // 11. 存储结果
    this.currentHighlights.push(result)

    return result
  }

  /**
   * 恢复指定高亮
   * @param {Object} result 高亮结果对象
   * @returns {boolean} 是否成功
   */
  restore(result) {
    if (!result) return false

    const index = this.currentHighlights.indexOf(result)
    if (index === -1) {
      console.warn('未找到要恢复的高亮对象')
      return false
    }

    console.log(`恢复模型: ${result.name}`)

    // 1. 停止动画
    if (result.animationData && result.animationData.stop) {
      result.animationData.stop()
    }

    // 2. 移除高亮效果
    if (result.highlightData && result.highlightData.restore) {
      result.highlightData.restore()
    }

    // 3. 从场景中移除显示对象
    if (result.object && result.object.parent) {
      result.object.parent.remove(result.object)
    }

    // 4. 如果是克隆模式，清理资源并恢复原始模型显示
    if (result.options.clone) {
      this.disposeObject(result.object)
      // 恢复原始模型显示
      if (result.original) {
        result.original.visible = result.originalData.visible
      }
    } else if (result.original && result.originalData.parent) {
      // 如果是原始对象模式，恢复原始位置
      result.originalData.parent.add(result.original)
      result.original.position.copy(result.originalData.position)
      result.original.rotation.copy(result.originalData.rotation)
      result.original.scale.copy(result.originalData.scale)
      result.original.visible = result.originalData.visible
    }

    // 5. 从数组中移除
    this.currentHighlights.splice(index, 1)

    return true
  }

  /**
   * 恢复所有高亮
   */
  restoreAll() {
    console.log(`恢复所有高亮对象 (${this.currentHighlights.length}个)`)

    // 创建副本，避免在遍历时修改数组
    const highlights = [...this.currentHighlights]

    highlights.forEach(result => {
      this.restore(result)
    })
  }

  /**
   * 查找多个模型并高亮
   * @param {Array<string>} names 模型名称数组
   * @param {Object} options 选项
   * @returns {Object} 结果集合
   */
  findAndHighlightMultiple(names, options = {}) {
    const results = names
      .map(name => this.findAndHighlight(name, options))
      .filter(result => result !== null)

    return {
      results,

      // 恢复所有
      restoreAll: () => {
        results.forEach(result => {
          if (result && result.restore) {
            result.restore()
          }
        })
      },

      // 设置所有位置
      setAllPositions: (x, y, z) => {
        results.forEach(result => {
          if (result && result.setPosition) {
            result.setPosition(x, y, z)
          }
        })
        return this
      },

      // 获取所有信息
      getAllInfo: () => {
        return results
          .map(result => (result && result.getInfo ? result.getInfo() : null))
          .filter(info => info !== null)
      }
    }
  }

  /**
   * 递归查找对象
   * @param {THREE.Object3D} object 要查找的对象
   * @param {string} name 目标名称
   * @returns {THREE.Object3D|null} 找到的对象
   */
  findObjectByName(object, name) {
    if (!object) return null

    // 如果当前对象名称匹配
    if (object.name === name) {
      return object
    }

    // 递归查找子对象
    for (let i = 0; i < object.children.length; i++) {
      const child = object.children[i]
      const found = this.findObjectByName(child, name)
      if (found) {
        return found
      }
    }

    return null
  }

  /**
   * 查找所有匹配名称的对象
   * @param {THREE.Object3D} object 要查找的对象
   * @param {string} name 目标名称
   * @returns {Array<THREE.Object3D>} 找到的对象数组
   */
  findAllObjectsByName(object, name) {
    const results = []

    const search = obj => {
      if (!obj) return

      if (obj.name === name) {
        results.push(obj)
      }

      for (let i = 0; i < obj.children.length; i++) {
        search(obj.children[i])
      }
    }

    search(object)
    return results
  }

  /**
   * 获取对象中所有唯一的名称
   * @param {THREE.Object3D} object 对象
   * @returns {Array<string>} 名称数组
   */
  getAllObjectNames(object) {
    const names = []

    const collectNames = obj => {
      if (!obj) return

      if (obj.name && obj.name.trim() !== '') {
        names.push(obj.name)
      }

      for (let i = 0; i < obj.children.length; i++) {
        collectNames(obj.children[i])
      }
    }

    collectNames(object)
    return [...new Set(names)] // 去重
  }

  /**
   * 获取模型统计信息
   * @param {THREE.Object3D} model 模型
   * @returns {Object} 统计信息
   */
  getModelStatistics(model = this.model) {
    if (!model) {
      console.warn('未提供模型')
      return null
    }

    const stats = {
      totalObjects: 0,
      meshes: 0,
      lights: 0,
      cameras: 0,
      groups: 0,
      uniqueNames: new Set(),
      boundingBox: null
    }

    const box = new THREE.Box3()

    model.traverse(object => {
      stats.totalObjects++
      stats.uniqueNames.add(object.name || 'unnamed')

      if (object.isMesh) stats.meshes++
      if (object.isLight) stats.lights++
      if (object.isCamera) stats.cameras++
      if (object.isGroup) stats.groups++

      box.expandByObject(object)
    })

    stats.boundingBox = {
      min: box.min.toArray(),
      max: box.max.toArray(),
      size: box.getSize(new THREE.Vector3()).toArray(),
      center: box.getCenter(new THREE.Vector3()).toArray()
    }

    stats.uniqueNames = Array.from(stats.uniqueNames)

    return stats
  }

  /**
   * 计算屏幕中心位置
   * @param {THREE.Object3D} object 对象
   * @returns {Object} 包含位置和缩放的对象
   */
  calculateScreenPosition(object) {
    if (!this.camera) {
      return {
        position: new THREE.Vector3(0, 1.5, this.config.distance),
        scale: 1
      }
    }

    // 计算对象的包围盒
    const box = new THREE.Box3().setFromObject(object)
    const size = box.getSize(new THREE.Vector3())
    const maxSize = Math.max(size.x, size.y, size.z)

    // 计算合适的缩放比例
    const scale = (this.config.distance / Math.max(maxSize, 0.001)) * 0.5

    // 计算相机前方位置
    const cameraDirection = new THREE.Vector3()
    this.camera.getWorldDirection(cameraDirection)

    const position = new THREE.Vector3()
      .copy(this.camera.position)
      .add(cameraDirection.multiplyScalar(this.config.distance))
      .setY(this.camera.position.y) // 保持相机高度

    return {position, scale}
  }

  /**
   * 应用高亮效果
   * @param {THREE.Object3D} object 对象
   * @returns {Object} 高亮数据
   */
  applyHighlight(object) {
    const originalMaterials = new Map()

    object.traverse(child => {
      if (child.isMesh) {
        // 保存原始材质
        originalMaterials.set(child, child.material)

        // 创建高亮材质
        const highlightMaterial = new THREE.MeshPhongMaterial({
          color: this.config.highlightColor,
          emissive: 0x222222,
          shininess: 100,
          transparent: true,
          opacity: 0.9
        })

        // 应用高亮材质
        // child.material = highlightMaterial

        // 添加边框效果
        if (child.geometry) {
          const edges = new THREE.EdgesGeometry(child.geometry, 15)
          const lineMaterial = new THREE.LineBasicMaterial({
            color: this.config.edgeColor,
            linewidth: this.config.lineWidth
          })
          const wireframe = new THREE.LineSegments(edges, lineMaterial)
          child.add(wireframe)

          // 保存边框引用
          child.userData.wireframe = wireframe
        }
      }
    })

    return {
      originalMaterials,

      // 恢复原始材质
      restore: () => {
        originalMaterials.forEach((material, child) => {
          if (child && child.isMesh) {
            child.material = material

            // 移除边框
            if (child.userData.wireframe) {
              child.remove(child.userData.wireframe)
              if (child.userData.wireframe.geometry) {
                child.userData.wireframe.geometry.dispose()
              }
              if (child.userData.wireframe.material) {
                child.userData.wireframe.material.dispose()
              }
              delete child.userData.wireframe
            }
          }
        })
      }
    }
  }

  /**
   * 添加悬浮动画
   * @param {THREE.Object3D} object 对象
   * @returns {Object} 动画数据
   */
  addFloatAnimation(object) {
    const originalY = object.position.y
    let animationId = null
    let isAnimating = true

    const animate = () => {
      if (!isAnimating || !object.parent) {
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
        return
      }

      const time = Date.now() * this.config.floatSpeed
      object.position.y = originalY + Math.sin(time) * this.config.floatHeight
      object.rotation.y = time * this.config.rotationSpeed

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return {
      stop: () => {
        isAnimating = false
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
      },

      toggle: () => {
        isAnimating = !isAnimating
        if (isAnimating) {
          animate()
        }
      },

      isAnimating: () => isAnimating
    }
  }

  /**
   * 获取对象的包围盒
   * @param {THREE.Object3D} object 对象
   * @returns {Object} 包围盒信息
   */
  getObjectBoundingBox(object) {
    const box = new THREE.Box3().setFromObject(object)
    return {
      min: box.min.toArray(),
      max: box.max.toArray(),
      size: box.getSize(new THREE.Vector3()).toArray(),
      center: box.getCenter(new THREE.Vector3()).toArray()
    }
  }

  /**
   * 获取对象的子对象数量
   * @param {THREE.Object3D} object 对象
   * @returns {number} 子对象数量
   */
  getObjectChildCount(object) {
    let count = 0
    object.traverse(() => count++)
    return count
  }

  /**
   * 清理对象资源
   * @param {THREE.Object3D} object 对象
   */
  disposeObject(object) {
    if (!object) return

    object.traverse(child => {
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose())
        } else {
          child.material.dispose()
        }
      }
      if (child.geometry) {
        child.geometry.dispose()
      }
    })
  }

  /**
   * 获取当前高亮对象
   * @returns {Array} 当前高亮对象数组
   */
  getCurrentHighlights() {
    return this.currentHighlights
  }

  /**
   * 获取高亮对象数量
   * @returns {number} 高亮对象数量
   */
  getHighlightCount() {
    return this.currentHighlights.length
  }

  /**
   * 清理所有资源
   */
  dispose() {
    this.restoreAll()
    this.scene = null
    this.camera = null
    this.model = null
    this.currentHighlights = []
  }
}