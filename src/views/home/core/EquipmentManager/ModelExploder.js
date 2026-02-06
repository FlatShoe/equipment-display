/* eslint-disable */
import * as THREE from 'three'

export default class ModelExploder {
  /**
   * 模型分解类 - 按层级结构分解
   * 用于将整体模型按逻辑结构分解为多个部分并进行分散展示
   * @param {THREE.Scene} scene - Three.js 场景
   */
  constructor(scene) {
    this.scene = scene
    this.originalModel = null
    this.parts = new Map() // 存储分解后的部件
    this.originalTransforms = new Map() // 存储原始变换
    this.isExploded = false
    this.explosionDistance = 10
    this.currentAnimation = null
    
    // 配置选项
    this.config = {
      minPartSize: 0.1, // 最小部件尺寸，小于这个尺寸的不独立分解
      maxDepth: 3, // 最大分解深度
      extractStrategy: 'level', // 'level': 按层级, 'size': 按尺寸, 'group': 按组
    }
  }

  /**
   * 设置要分解的模型
   * @param {THREE.Object3D} model - 要分解的模型
   * @param {Object} options - 配置选项
   * @returns {Array<string>} 模型部件名称数组
   */
  setModel(model, options = {}) {
    this.clear()
    this.originalModel = model
    
    // 合并配置
    this.config = {...this.config, ...options}
    
    // 根据策略提取部件
    this.extractPartsByStrategy(model)
    
    return Array.from(this.parts.keys())
  }

  /**
   * 根据策略提取部件
   * @param {THREE.Object3D} model - 模型
   */
  extractPartsByStrategy(model) {
    if (!model) return

    switch (this.config.extractStrategy) {
      case 'level':
        this.extractByLevel(model)
        break
      case 'size':
        this.extractBySize(model)
        break
      case 'group':
        this.extractByGroup(model)
        break
      default:
        this.extractByLevel(model)
    }
  }

  /**
   * 按层级提取部件
   * 只提取特定层级的对象，避免过细的分解
   */
  extractByLevel(model) {
    if (!model) return

    // 从第0层（模型自身）开始遍历
    this.traverseLevel(model, 0, this.config.maxDepth, 'model')
  }

  /**
   * 层级遍历
   * @param {THREE.Object3D} obj - 当前对象
   * @param {number} currentDepth - 当前深度
   * @param {number} maxDepth - 最大深度
   * @param {string} parentName - 父级名称
   */
  traverseLevel(obj, currentDepth, maxDepth, parentName) {
    if (!obj || currentDepth > maxDepth) return

    // 检查对象是否适合作为独立部件
    if (this.isSuitableAsPart(obj, currentDepth)) {
      const partName = `${parentName}_${obj.name || obj.uuid.substring(0, 8)}`
      
      // 如果是组，检查是否应该继续分解
      if (obj.isGroup && this.shouldExtractGroup(obj)) {
        // 创建一个副本
        const partCopy = this.createPartCopy(obj, partName)
        
        if (partCopy) {
          // 保存原始信息
          this.saveOriginalTransform(obj, partName, partCopy)
          
          // 添加到部件列表
          this.parts.set(partName, partCopy)
          
          // 添加到场景
          this.scene.add(partCopy)
          
          // 隐藏原始对象
          obj.visible = false
        }
      } else if (obj.isMesh) {
        // 对于网格，直接作为部件
        const partCopy = this.createPartCopy(obj, partName)
        
        if (partCopy) {
          // 保存原始信息
          this.saveOriginalTransform(obj, partName, partCopy)
          
          // 添加到部件列表
          this.parts.set(partName, partCopy)
          
          // 添加到场景
          this.scene.add(partCopy)
          
          // 隐藏原始对象
          obj.visible = false
        }
      }
    }

    // 继续遍历子级
    if (currentDepth < maxDepth && obj.children) {
      obj.children.forEach((child, index) => {
        const childParentName = obj.name || `${parentName}_${index}`
        this.traverseLevel(child, currentDepth + 1, maxDepth, childParentName)
      })
    }
  }

  /**
   * 按尺寸提取部件
   * 只提取达到最小尺寸的部件
   */
  extractBySize(model) {
    if (!model) return

    const traverse = (obj, parentName) => {
      if (!obj) return

      // 计算对象尺寸
      const size = this.getObjectSize(obj)
      
      // 如果达到最小尺寸，作为独立部件
      if (size > this.config.minPartSize) {
        const partName = `${parentName}_${obj.name || obj.uuid.substring(0, 8)}`
        
        // 创建副本
        const partCopy = this.createPartCopy(obj, partName)
        
        if (partCopy) {
          // 保存原始信息
          this.saveOriginalTransform(obj, partName, partCopy)
          
          // 添加到部件列表
          this.parts.set(partName, partCopy)
          
          // 添加到场景
          this.scene.add(partCopy)
          
          // 隐藏原始对象
          obj.visible = false
          
          // 不再继续分解这个对象的子级
          return
        }
      }

      // 如果尺寸太小，继续检查子级
      if (obj.children && obj.children.length > 0) {
        obj.children.forEach((child, index) => {
          const childParentName = `${parentName}_${index}`
          traverse(child, childParentName)
        })
      }
    }

    traverse(model, 'model')
  }

  /**
   * 按组提取部件
   * 智能分组相似的部件
   */
  extractByGroup(model) {
    if (!model) return

    // 收集所有网格
    const allMeshes = []
    model.traverse(obj => {
      if (obj.isMesh) {
        allMeshes.push(obj)
      }
    })

    // 按材质分组
    const groups = {}
    allMeshes.forEach(mesh => {
      if (mesh.material) {
        const materialId = mesh.material.uuid || 'unknown'
        if (!groups[materialId]) {
          groups[materialId] = []
        }
        groups[materialId].push(mesh)
      }
    })

    // 为每个组创建部件
    let groupIndex = 0
    Object.values(groups).forEach(meshes => {
      if (meshes.length === 0) return
      
      // 创建一个组来包含这个材质的所有网格
      const group = new THREE.Group()
      const partName = `group_${groupIndex++}`
      
      // 计算组的中心位置
      const center = new THREE.Vector3()
      meshes.forEach(mesh => {
        center.add(mesh.position)
      })
      center.divideScalar(meshes.length)
      
      // 复制每个网格
      meshes.forEach((mesh, meshIndex) => {
        const meshCopy = this.createPartCopy(mesh, `${partName}_mesh${meshIndex}`)
        
        if (meshCopy) {
          // 保存原始变换
          this.saveOriginalTransform(mesh, `${partName}_mesh${meshIndex}`, meshCopy)
          
          // 添加到组
          group.add(meshCopy)
          
          // 隐藏原始网格
          mesh.visible = false
        }
      })
      
      // 设置组的位置
      group.position.copy(center)
      group.name = partName
      
      // 添加到部件列表
      this.parts.set(partName, group)
      
      // 添加到场景
      this.scene.add(group)
    })
  }

  /**
   * 检查对象是否适合作为独立部件
   */
  isSuitableAsPart(obj, depth) {
    if (!obj) return false
    
    // 排除灯光、相机等
    if (obj.isLight || obj.isCamera || obj.isAudio) {
      return false
    }
    
    // 检查是否有几何体或子级
    if (obj.isMesh) {
      if (!obj.geometry || obj.geometry.attributes.position.count === 0) {
        return false
      }
    }
    
    // 检查尺寸
    if (this.config.minPartSize > 0) {
      const size = this.getObjectSize(obj)
      if (size < this.config.minPartSize) {
        return false
      }
    }
    
    return true
  }

  /**
   * 检查是否应该提取组
   */
  shouldExtractGroup(group) {
    if (!group.isGroup) return false
    
    // 检查组是否有有意义的子级
    const meaningfulChildren = group.children.filter(child => 
      this.isSuitableAsPart(child, 0)
    )
    
    return meaningfulChildren.length > 1
  }

  /**
   * 获取对象尺寸
   */
  getObjectSize(obj) {
    const box = new THREE.Box3()
    box.setFromObject(obj)
    
    const size = new THREE.Vector3()
    box.getSize(size)
    
    return Math.max(size.x, size.y, size.z)
  }

  /**
   * 创建部件副本
   * 支持 Mesh 和 Group
   */
  createPartCopy(obj, name) {
    if (!obj) return null
    
    let copy
    
    try {
      if (obj.isMesh) {
        // 对于网格，创建新的网格
        if (!obj.geometry || !obj.material) {
          console.warn('Mesh has no geometry or material:', obj)
          return null
        }
        
        copy = new THREE.Mesh(
          obj.geometry,
          obj.material.clone ? obj.material.clone() : obj.material
        )
        
        // 复制变换
        copy.position.copy(obj.position)
        copy.rotation.copy(obj.rotation)
        copy.scale.copy(obj.scale)
        
        // 复制材质属性
        if (obj.material) {
          if (obj.material.map) copy.material.map = obj.material.map
          if (obj.material.color) copy.material.color.copy(obj.material.color)
        }
        
        // 复制用户数据
        if (obj.userData) {
          copy.userData = JSON.parse(JSON.stringify(obj.userData))
        }
        
      } else if (obj.isGroup) {
        // 对于组，创建新组
        copy = new THREE.Group()
        copy.position.copy(obj.position)
        copy.rotation.copy(obj.rotation)
        copy.scale.copy(obj.scale)
        
        // 复制子级
        if (obj.children && obj.children.length > 0) {
          obj.children.forEach((child, index) => {
            if (this.isSuitableAsPart(child, 0)) {
              const childCopy = this.createPartCopy(child, `${name}_child${index}`)
              if (childCopy) {
                copy.add(childCopy)
              }
            }
          })
        }
        
        // 复制用户数据
        if (obj.userData) {
          copy.userData = JSON.parse(JSON.stringify(obj.userData))
        }
        
      } else {
        // 不支持的 Object3D 类型
        console.warn('Unsupported object type:', obj.type, obj)
        return null
      }
      
      // 设置名称
      if (copy) {
        copy.name = name
      }
      
    } catch (error) {
      console.error('Error creating part copy:', error, obj)
      return null
    }
    
    return copy
  }

  /**
   * 保存原始变换
   */
  saveOriginalTransform(original, partName, copy) {
    this.originalTransforms.set(partName, {
      position: original.position.clone(),
      rotation: original.rotation.clone(),
      scale: original.scale.clone(),
      matrix: original.matrix.clone(),
      worldPosition: original.getWorldPosition(new THREE.Vector3()),
      originalObject: original
    })
  }

  /**
   * 智能分解 - 根据部件位置自动分组
   */
  smartExplode(options = {}) {
    const {
      distance = this.explosionDistance,
      direction = 'outward',
      groupBy = 'position', // 'position', 'material', 'size'
    } = options

    const partsArray = Array.from(this.parts.entries())
    if (partsArray.length === 0) return

    // 根据分组策略创建组
    let groups
    switch (groupBy) {
      case 'position':
        groups = this.groupByPosition(partsArray)
        break
      case 'material':
        groups = this.groupByMaterial(partsArray)
        break
      case 'size':
        groups = this.groupBySize(partsArray)
        break
      default:
        groups = this.groupByPosition(partsArray)
    }

    // 为每个组安排位置
    this.arrangeGroups(groups, distance, direction)

    this.isExploded = true
  }

  /**
   * 按位置分组
   */
  groupByPosition(partsArray) {
    const groups = []
    const visited = new Set()
    const threshold = 2.0 // 距离阈值

    partsArray.forEach(([partName, part], index) => {
      if (visited.has(partName)) return

      const group = [partName]
      visited.add(partName)
      
      const position = part.getWorldPosition(new THREE.Vector3())
      
      // 寻找附近的其他部件
      partsArray.forEach(([otherName, otherPart], otherIndex) => {
        if (otherName === partName || visited.has(otherName)) return
        
        const otherPosition = otherPart.getWorldPosition(new THREE.Vector3())
        const distance = position.distanceTo(otherPosition)
        
        if (distance < threshold) {
          group.push(otherName)
          visited.add(otherName)
        }
      })
      
      if (group.length > 0) {
        groups.push(group)
      }
    })

    return groups
  }

  /**
   * 按材质分组
   */
  groupByMaterial(partsArray) {
    const materialGroups = {}
    
    partsArray.forEach(([partName, part]) => {
      if (part.isMesh && part.material) {
        const materialId = part.material.uuid || 'unknown'
        if (!materialGroups[materialId]) {
          materialGroups[materialId] = []
        }
        materialGroups[materialId].push(partName)
      } else {
        // 非网格对象放入默认组
        if (!materialGroups['default']) {
          materialGroups['default'] = []
        }
        materialGroups['default'].push(partName)
      }
    })
    
    return Object.values(materialGroups)
  }

  /**
   * 按尺寸分组
   */
  groupBySize(partsArray) {
    const sizeGroups = {
      small: [],
      medium: [],
      large: []
    }
    
    partsArray.forEach(([partName, part]) => {
      const size = this.getObjectSize(part)
      
      if (size < 1) {
        sizeGroups.small.push(partName)
      } else if (size < 5) {
        sizeGroups.medium.push(partName)
      } else {
        sizeGroups.large.push(partName)
      }
    })
    
    return [sizeGroups.small, sizeGroups.medium, sizeGroups.large].filter(group => group.length > 0)
  }

  /**
   * 安排组的位置
   */
  arrangeGroups(groups, distance, direction) {
    const groupCount = groups.length
    const angleStep = (Math.PI * 2) / groupCount
    const center = new THREE.Vector3(0, 0, 0)

    groups.forEach((group, groupIndex) => {
      const groupAngle = angleStep * groupIndex
      const groupRadius = distance
      
      let groupX, groupY, groupZ
      if (direction === 'outward') {
        groupX = Math.cos(groupAngle) * groupRadius
        groupY = 0
        groupZ = Math.sin(groupAngle) * groupRadius
      } else if (direction === 'upward') {
        groupX = 0
        groupY = groupIndex * 2
        groupZ = 0
      } else if (direction === 'spiral') {
        const spiralRadius = (groupIndex + 1) * 2
        groupX = Math.cos(groupAngle) * spiralRadius
        groupY = groupIndex * 1.5
        groupZ = Math.sin(groupAngle) * spiralRadius
      }

      // 为组内每个部件安排位置
      group.forEach((partName, partIndex) => {
        const part = this.parts.get(partName)
        if (!part) return

        const partCount = group.length
        let partOffsetX = 0, partOffsetY = 0, partOffsetZ = 0
        
        if (partCount > 1) {
          // 在组内创建小圆排列
          const partAngle = (partIndex / partCount) * Math.PI * 2
          const partRadius = 1.5
          partOffsetX = Math.cos(partAngle) * partRadius
          partOffsetZ = Math.sin(partAngle) * partRadius
        }

        const targetPosition = new THREE.Vector3(
          groupX + partOffsetX,
          groupY + partOffsetY,
          groupZ + partOffsetZ
        )

        part.userData.targetPosition = targetPosition
        part.userData.targetRotation = new THREE.Euler(0, 0, 0)
      })
    })
  }

  /**
   * 圆形分解
   */
  circleExplode(options = {}) {
    const {radius = this.explosionDistance, height = 0, faceCenter = true} = options

    const partsArray = Array.from(this.parts.entries())
    const partCount = partsArray.length
    if (partCount === 0) return

    const angleStep = (Math.PI * 2) / partCount
    const center = new THREE.Vector3(0, height, 0)

    partsArray.forEach(([partName, part], index) => {
      const angle = angleStep * index
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = height

      part.userData.targetPosition = new THREE.Vector3(x, y, z)
      
      if (faceCenter) {
        // 朝向中心
        const lookAt = new THREE.Vector3(0, y, 0)
        part.lookAt(lookAt)
        part.userData.targetRotation = part.rotation.clone()
      } else {
        part.userData.targetRotation = new THREE.Euler(0, 0, 0)
      }
    })

    this.isExploded = true
  }

  /**
   * 线性分解
   */
  lineExplode(options = {}) {
    const {direction = 'x', spacing = 3, startPosition = new THREE.Vector3(0, 0, 0)} = options

    const partsArray = Array.from(this.parts.entries())
    if (partsArray.length === 0) return

    partsArray.forEach(([partName, part], index) => {
      const position = startPosition.clone()

      if (direction === 'x') {
        position.x += index * spacing
      } else if (direction === 'y') {
        position.y += index * spacing
      } else if (direction === 'z') {
        position.z += index * spacing
      }

      part.userData.targetPosition = position
      part.userData.targetRotation = new THREE.Euler(0, 0, 0)
    })

    this.isExploded = true
  }

  /**
   * 执行分解动画
   */
  animateExplosion(duration = 1000, easing = this.easeInOutCubic) {
    if (this.currentAnimation) {
      cancelAnimationFrame(this.currentAnimation)
    }

    const startTime = performance.now()
    const startPositions = new Map()
    const startRotations = new Map()

    this.parts.forEach((part, partName) => {
      startPositions.set(partName, part.position.clone())
      startRotations.set(partName, part.rotation.clone())
    })

    const animate = currentTime => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)

      this.parts.forEach((part, partName) => {
        if (part.userData.targetPosition && part.userData.targetRotation) {
          const startPos = startPositions.get(partName)
          const startRot = startRotations.get(partName)
          const targetPos = part.userData.targetPosition
          const targetRot = part.userData.targetRotation

          if (startPos && startRot) {
            part.position.lerpVectors(startPos, targetPos, easedProgress)
            
            const startQuat = new THREE.Quaternion().setFromEuler(startRot)
            const targetQuat = new THREE.Quaternion().setFromEuler(targetRot)
            part.quaternion.slerpQuaternions(startQuat, targetQuat, easedProgress)
          }
        }
      })

      if (progress < 1) {
        this.currentAnimation = requestAnimationFrame(animate)
      } else {
        this.currentAnimation = null
      }
    }

    this.currentAnimation = requestAnimationFrame(animate)
  }

  /**
   * 执行合并动画
   */
  animateAssemble(duration = 1000) {
    if (this.currentAnimation) {
      cancelAnimationFrame(this.currentAnimation)
    }

    const startTime = performance.now()
    const startPositions = new Map()
    const startRotations = new Map()

    this.parts.forEach((part, partName) => {
      startPositions.set(partName, part.position.clone())
      startRotations.set(partName, part.rotation.clone())
    })

    const animate = currentTime => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = this.easeInOutCubic(progress)

      this.parts.forEach((part, partName) => {
        const originalTransform = this.originalTransforms.get(partName)
        if (originalTransform) {
          const startPos = startPositions.get(partName)
          const startRot = startRotations.get(partName)
          
          if (startPos && startRot) {
            part.position.lerpVectors(startPos, originalTransform.position, easedProgress)
            
            const startQuat = new THREE.Quaternion().setFromEuler(startRot)
            const targetQuat = new THREE.Quaternion().setFromEuler(originalTransform.rotation)
            part.quaternion.slerpQuaternions(startQuat, targetQuat, easedProgress)
          }
        }
      })

      if (progress < 1) {
        this.currentAnimation = requestAnimationFrame(animate)
      } else {
        this.currentAnimation = null
        this.isExploded = false
      }
    }

    this.currentAnimation = requestAnimationFrame(animate)
  }

  /**
   * 立即分解
   */
  explodeImmediately() {
    this.parts.forEach((part, partName) => {
      if (part.userData.targetPosition) {
        part.position.copy(part.userData.targetPosition)
      }
      if (part.userData.targetRotation) {
        part.rotation.copy(part.userData.targetRotation)
      }
    })
    this.isExploded = true
  }

  /**
   * 立即合并
   */
  assembleImmediately() {
    this.parts.forEach((part, partName) => {
      const originalTransform = this.originalTransforms.get(partName)
      if (originalTransform) {
        part.position.copy(originalTransform.position)
        part.rotation.copy(originalTransform.rotation)
        part.scale.copy(originalTransform.scale)
      }
    })
    this.isExploded = false
  }

  /**
   * 重置模型
   */
  reset() {
    if (this.currentAnimation) {
      cancelAnimationFrame(this.currentAnimation)
      this.currentAnimation = null
    }

    // 从场景中移除所有部件
    this.parts.forEach(part => {
      this.scene.remove(part)
    })

    // 显示原始模型
    if (this.originalModel) {
      this.originalModel.traverse(obj => {
        if (obj.isMesh || obj.isGroup) {
          obj.visible = true
        }
      })
    }

    // 清理数据
    this.parts.clear()
    this.originalTransforms.clear()
    this.isExploded = false
  }

  /**
   * 获取部件列表
   */
  getParts() {
    return Array.from(this.parts.keys())
  }

  /**
   * 获取部件
   */
  getPart(partName) {
    return this.parts.get(partName) || null
  }

  /**
   * 聚焦单个部件
   */
  focusPart(partName) {
    const part = this.parts.get(partName)
    if (!part) return

    this.parts.forEach((p, name) => {
      if (name !== partName) {
        p.visible = false
      }
    })

    part.visible = true
    part.position.set(0, 0, 0)
  }

  /**
   * 显示所有部件
   */
  showAllParts() {
    this.parts.forEach(part => {
      part.visible = true
    })
  }

  /**
   * 缓动函数
   */
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  /**
   * 清理
   */
  clear() {
    this.reset()
    this.originalModel = null
  }

  /**
   * 销毁
   */
  dispose() {
    this.clear()
    this.parts.forEach(part => {
      if (part.isMesh) {
        if (part.geometry && part.geometry.dispose) part.geometry.dispose()
        if (part.material && part.material.dispose) part.material.dispose()
      }
    })
  }
}