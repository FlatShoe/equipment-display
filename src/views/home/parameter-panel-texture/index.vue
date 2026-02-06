<!-- components/ParameterPanelTexture.vue -->
<template>
  <div>
    <!-- 隐藏的参数面板，用于生成纹理 -->
    <div ref="parameterPanelHtml" class="hidden-panel">
      <div class="parameter-panel-texture" :class="{expanded: isPanelExpanded}" :style="panelStyle">
        <div class="parameter-header">
          <h3>设备参数监控</h3>
        </div>

        <div class="parameter-content">
          <div class="parameter-section">
            <h4><i class="fas fa-chart-line"></i> 基本状态</h4>
            <div class="parameter-grid">
              <div class="parameter-card">
                <div class="parameter-name"><i class="fas fa-thermometer-half"></i> 设备温度</div>
                <div class="parameter-value">{{ parameters.temperature }}°C</div>
                <div
                  class="parameter-indicator"
                  :class="getTemperatureStatus(parameters.temperature)"
                ></div>
              </div>

              <div class="parameter-card">
                <div class="parameter-name"><i class="fas fa-tint"></i> 内部湿度</div>
                <div class="parameter-value">{{ parameters.humidity }}%</div>
                <div
                  class="parameter-indicator"
                  :class="getHumidityStatus(parameters.humidity)"
                ></div>
              </div>

              <div class="parameter-card">
                <div class="parameter-name">
                  <i class="fas fa-battery-three-quarters"></i> 电池电量
                </div>
                <div class="parameter-value">{{ parameters.power }}%</div>
                <div class="parameter-indicator" :class="getPowerStatus(parameters.power)"></div>
              </div>

              <div class="parameter-card">
                <div class="parameter-name"><i class="fas fa-bolt"></i> 工作电压</div>
                <div class="parameter-value">{{ parameters.voltage }}V</div>
                <div class="parameter-indicator normal"></div>
              </div>
            </div>
          </div>

          <div class="parameter-section" v-if="isPanelExpanded">
            <h4><i class="fas fa-wifi"></i> 网络状态</h4>
            <div class="parameter-row">
              <div class="parameter-label">网络连接</div>
              <div class="parameter-status online">{{ parameters.network }}</div>
            </div>

            <div class="parameter-row">
              <div class="parameter-label">摄像头状态</div>
              <div class="parameter-status online">{{ parameters.camera }}</div>
            </div>

            <div class="parameter-row">
              <div class="parameter-label">信号强度</div>
              <div class="signal-strength">
                <div class="signal-bar active"></div>
                <div class="signal-bar active"></div>
                <div class="signal-bar active"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import html2canvas from 'html2canvas'
import * as THREE from 'three'

export default {
  name: 'ParameterPanelTexture',
  computed: {
    ...mapState('home', ['showParameters', 'isParameterPanelExpanded', 'parameters']),
    panelStyle() {
      return {
        width: this.isPanelExpanded ? '450px' : '350px'
      }
    }
  },
  data() {
    return {
      // 面板状态
      isPanelExpanded: false,
      panelScale: 1.0,
      panelRotation: 0,

      // Three.js相关
      texturePlane: null,
      panelId: null,
      isMounted: false
    }
  },
  methods: {
    // 获取温度状态
    getTemperatureStatus(temp) {
      if (temp < 20) return 'low'
      if (temp > 40) return 'high'
      return 'normal'
    },

    // 获取湿度状态
    getHumidityStatus(humidity) {
      if (humidity < 30) return 'low'
      if (humidity > 70) return 'high'
      return 'normal'
    },

    // 获取电量状态
    getPowerStatus(power) {
      if (power > 80) return 'high'
      if (power > 20) return 'normal'
      return 'low'
    },

    // 切换面板展开状态
    togglePanelExpand() {
      this.isPanelExpanded = !this.isPanelExpanded
    },

    // 生成HTML纹理
    async generateTexture() {
      if (!this.$refs.parameterPanelHtml) {
        console.error('HTML元素不存在')
        return null
      }

      try {
        const canvas = await html2canvas(this.$refs.parameterPanelHtml.firstElementChild, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
          allowTaint: true,
          logging: false
        })

        const texture = new THREE.Texture(canvas)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.needsUpdate = true

        return texture
      } catch (error) {
        console.error('生成纹理失败:', error)
        throw error
      }
    },

    // 创建纹理平面 - 由父组件调用
    async createTexturePlane(scene, options = {}) {
      if (!scene || !(scene instanceof THREE.Scene)) {
        console.error('无效的Three.js场景')
        return null
      }

      try {
        const texture = await this.generateTexture()

        // 创建材质
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        })

        // 计算大小
        const canvas = texture.image
        const aspect = canvas.width / canvas.height
        const height = 2.5
        const width = height * aspect

        // 创建几何体
        const geometry = new THREE.PlaneGeometry(width, height)

        // 创建网格
        this.texturePlane = new THREE.Mesh(geometry, material)
        this.texturePlane.position.set(options.x || 3, options.y || 2, options.z || 0)
        this.texturePlane.rotation.set(
          options.rotationX || 0,
          (options.rotationY || 0) + this.panelRotation,
          options.rotationZ || 0
        )
        this.texturePlane.scale.setScalar(this.panelScale)

        // 添加用户数据
        this.texturePlane.userData = {
          type: 'parameter_panel',
          id: 'parameter_panel_' + Date.now(),
          interactive: true
        }

        // 添加到场景
        scene.add(this.texturePlane)
        this.panelId = this.texturePlane.userData.id
        this.isMounted = true

        console.log('参数面板已添加到3D场景')
        return this.texturePlane
      } catch (error) {
        console.error('创建纹理平面失败:', error)
        throw error
      }
    },

    // 更新纹理 - 由父组件调用
    async updateTexture() {
      if (!this.texturePlane || !this.isMounted) {
        console.warn('纹理平面未创建或未挂载')
        return false
      }

      try {
        const newTexture = await this.generateTexture()

        // 更新纹理
        this.texturePlane.material.map.dispose()
        this.texturePlane.material.map = newTexture
        this.texturePlane.material.needsUpdate = true

        console.log('参数面板纹理已更新')
        return true
      } catch (error) {
        console.error('更新纹理失败:', error)
        return false
      }
    },

    // 更新面板缩放
    updatePanelScale(scale) {
      this.panelScale = scale
      if (this.texturePlane) {
        this.texturePlane.scale.setScalar(scale)
      }
    },

    // 设置面板位置
    setPanelPosition(x, y, z) {
      if (this.texturePlane) {
        this.texturePlane.position.set(x, y, z)
      }
    },

    // 设置面板旋转
    setPanelRotation(x, y, z) {
      if (this.texturePlane) {
        this.texturePlane.rotation.set(x, y, z)
      }
    },

    // 移除面板 - 由父组件调用
    removePanel(scene) {
      if (this.texturePlane && scene && this.isMounted) {
        scene.remove(this.texturePlane)

        if (this.texturePlane.material) {
          this.texturePlane.material.dispose()
        }
        if (this.texturePlane.geometry) {
          this.texturePlane.geometry.dispose()
        }

        this.texturePlane = null
        this.panelId = null
        this.isMounted = false

        console.log('参数面板已移除')
        return true
      }
      return false
    },

    // 获取面板对象
    getPanel() {
      return this.texturePlane
    },

    // 获取面板ID
    getPanelId() {
      return this.panelId
    },

    // 检查是否已挂载
    isPanelMounted() {
      return this.isMounted
    },

    // 设置展开状态
    setExpanded(expanded) {
      this.isPanelExpanded = expanded
    }
  },

  watch: {
    // 监听Vuex参数变化
    parameters: {
      handler() {
        // 如果面板已挂载，自动更新纹理
        if (this.isMounted) {
          this.updateTexture()
        }
      },
      deep: true
    },

    // 监听面板展开状态变化
    isParameterPanelExpanded: {
      handler(newVal) {
        this.isPanelExpanded = newVal
        if (this.isMounted) {
          this.updateTexture()
        }
      }
    },

    // 监听本地展开状态变化
    isPanelExpanded() {
      if (this.isMounted) {
        this.updateTexture()
      }
    }
  }
}
</script>

<style scoped>
.hidden-panel {
  position: absolute;
  top: -9999px;
  left: -9999px;
  z-index: -9999;
  opacity: 0;
  pointer-events: none;
}

.parameter-panel-texture {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: width 0.3s ease;
}

.parameter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.5);
}

.parameter-header h3 {
  color: #2c3e50;
  font-size: 16px;
  margin: 0;
  font-weight: 600;
}

.parameter-content {
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.parameter-section {
  margin-bottom: 20px;
}

.parameter-section h4 {
  color: #2c3e50;
  font-size: 14px;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.parameter-section h4 i {
  color: #3498db;
}

.parameter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.parameter-card {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(200, 200, 200, 0.3);
  position: relative;
  transition: all 0.2s ease;
}

.parameter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.parameter-name {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.parameter-value {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.parameter-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.parameter-indicator.low {
  background-color: #3498db;
  box-shadow: 0 0 6px rgba(52, 152, 219, 0.5);
}

.parameter-indicator.normal {
  background-color: #2ecc71;
  box-shadow: 0 0 6px rgba(46, 204, 113, 0.5);
}

.parameter-indicator.high {
  background-color: #e74c3c;
  box-shadow: 0 0 6px rgba(231, 76, 60, 0.5);
}

.parameter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.parameter-label {
  font-size: 13px;
  color: #5d6d7e;
  font-weight: 500;
}

.parameter-status {
  font-size: 13px;
  font-weight: 600;
}

.parameter-status.online {
  color: #27ae60;
}

.signal-strength {
  display: flex;
  gap: 2px;
  align-items: flex-end;
}

.signal-bar {
  width: 4px;
  height: 8px;
  background: rgba(155, 155, 155, 0.3);
  border-radius: 2px;
}

.signal-bar.active {
  background: #2ecc71;
}

.signal-bar.active:nth-child(1) {
  height: 6px;
}
.signal-bar.active:nth-child(2) {
  height: 9px;
}
.signal-bar.active:nth-child(3) {
  height: 12px;
}
</style>
