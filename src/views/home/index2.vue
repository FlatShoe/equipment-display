<!-- 
* @Description 首页
-->
<template>
  <div class="home">
    <!-- 三维展示容器 - 您将Three.js渲染器挂载到这里 -->
    <div class="equipment-display-container equipment-display-container-hook"></div>

    <!-- UI覆盖层 -->
    <div class="ui-overlay">
      <!-- 顶部控制栏 -->
      <div class="control-bar">
        <div class="logo-section">
          <div class="logo">三维预约终端沙盒系统</div>
          <div class="device-status">
            <span class="status-indicator online"></span>
            <span>设备在线 | 预约终端 HRY-1300U</span>
          </div>
        </div>

        <div class="control-buttons">
          <button class="control-btn" @click="toggleExplodeMode">
            <span class="btn-icon">⚡</span>
            <span class="btn-text">{{ isExploded ? '组合视图' : '分解视图' }}</span>
          </button>

          <button class="control-btn" @click="toggleWireframeMode">
            <span class="btn-icon">▦</span>
            <span class="btn-text">{{ showWireframe ? '实体模式' : '线框模式' }}</span>
          </button>

          <button class="control-btn" @click="resetView">
            <span class="btn-icon">↺</span>
            <span class="btn-text">重置视图</span>
          </button>

          <div class="view-mode-selector">
            <select v-model="selectedViewMode" class="mode-select">
              <option value="full">整体视图</option>
              <option value="front">正面视图</option>
              <option value="top">顶部视图</option>
              <option value="side">侧面视图</option>
              <option value="perspective">透视视图</option>
            </select>
          </div>

          <button class="control-btn primary" @click="showParameters = !showParameters">
            <span class="btn-icon">📊</span>
            <span class="btn-text">参数面板</span>
          </button>
        </div>
      </div>

      <!-- 左侧组件列表 -->
      <div class="component-panel" :class="{collapsed: isPanelCollapsed}">
        <div class="panel-header" @click="togglePanelCollapse">
          <h3>设备组件</h3>
          <span class="collapse-icon">{{ isPanelCollapsed ? '▶' : '◀' }}</span>
        </div>

        <div class="panel-content">
          <div class="component-search">
            <input
              type="text"
              placeholder="搜索组件..."
              v-model="searchQuery"
              class="search-input"
            />
          </div>

          <div class="component-list">
            <div
              v-for="component in filteredComponents"
              :key="component.id"
              class="component-item"
              :class="{
                active: selectedComponentId === component.id,
                [component.status]: true
              }"
              @click="selectComponent(component.id)"
            >
              <div class="component-icon">
                <div class="icon-placeholder" :style="{backgroundColor: component.color}"></div>
              </div>
              <div class="component-info">
                <div class="component-name">{{ component.name }}</div>
                <div class="component-status" :class="component.status">
                  {{ getStatusText(component.status) }}
                </div>
              </div>
              <div class="component-actions">
                <button
                  class="action-btn"
                  @click.stop="isolateComponent(component.id)"
                  title="单独查看"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧参数面板 -->
      <div
        class="parameter-panel"
        :class="{
          visible: showParameters,
          expanded: isParameterPanelExpanded
        }"
      >
        <div class="parameter-header">
          <h3>设备参数监控</h3>
          <div class="parameter-controls">
            <button
              class="panel-control-btn"
              @click="toggleParameterPanelExpand"
              :title="isParameterPanelExpanded ? '折叠面板' : '展开面板'"
            >
              <i
                :class="isParameterPanelExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
              ></i>
            </button>
            <button
              class="panel-control-btn close-btn"
              @click="showParameters = false"
              title="关闭面板"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
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

          <div class="parameter-section" v-if="isParameterPanelExpanded">
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
                <div class="signal-bar"></div>
                <div class="signal-bar"></div>
              </div>
            </div>
          </div>

          <div class="parameter-section" v-if="isParameterPanelExpanded">
            <h4><i class="fas fa-sliders-h"></i> 控制选项</h4>
            <div class="control-options">
              <label class="checkbox-option">
                <input type="checkbox" v-model="autoRotate" />
                <span>自动旋转</span>
              </label>

              <label class="checkbox-option">
                <input type="checkbox" v-model="showLabels" />
                <span>显示标签</span>
              </label>

              <label class="checkbox-option">
                <input type="checkbox" v-model="showGrid" />
                <span>显示网格</span>
              </label>

              <label class="checkbox-option">
                <input type="checkbox" v-model="showAxes" />
                <span>显示坐标轴</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部状态栏 -->
      <div class="status-bar">
        <div class="coordinate-display">
          <span><i class="fas fa-crosshairs"></i> X: {{ coordinates.x.toFixed(2) }}</span>
          <span>Y: {{ coordinates.y.toFixed(2) }}</span>
          <span>Z: {{ coordinates.z.toFixed(2) }}</span>
        </div>

        <div class="fps-display"><i class="fas fa-tachometer-alt"></i> FPS: {{ fps }}</div>

        <div class="view-info">
          <span
            ><i class="fas fa-eye"></i> 视角:
            {{ selectedViewMode === 'full' ? '整体' : selectedViewMode }}</span
          >
          <span>|</span>
          <span><i class="fas fa-cube"></i> 模式: {{ isExploded ? '分解' : '组合' }}</span>
        </div>
      </div>

      <!-- 组件详细信息弹窗 -->
      <div class="component-detail-modal" v-if="selectedComponentDetail">
        <div class="modal-backdrop" @click="selectedComponentDetail = null"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3><i class="fas fa-cube"></i> {{ selectedComponentDetail.name }}</h3>
            <button class="modal-close" @click="selectedComponentDetail = null">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="detail-section">
              <h4><i class="fas fa-info-circle"></i> 组件信息</h4>
              <div class="detail-row">
                <span class="detail-label">状态:</span>
                <span class="detail-value" :class="selectedComponentDetail.status">
                  {{ getStatusText(selectedComponentDetail.status) }}
                </span>
              </div>

              <div class="detail-row">
                <span class="detail-label">ID:</span>
                <span class="detail-value">{{ selectedComponentDetail.id }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">位置:</span>
                <span class="detail-value"
                  >X:{{ componentPosition.x }}, Y:{{ componentPosition.y }}, Z:{{
                    componentPosition.z
                  }}</span
                >
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fas fa-cogs"></i> 操作</h4>
              <div class="detail-actions">
                <button
                  class="detail-action-btn"
                  @click="highlightComponent(selectedComponentDetail.id)"
                >
                  <i class="fas fa-highlighter"></i> 高亮显示
                </button>
                <button
                  class="detail-action-btn"
                  @click="isolateComponent(selectedComponentDetail.id)"
                >
                  <i class="fas fa-eye"></i> 单独查看
                </button>
                <button
                  class="detail-action-btn"
                  @click="explodeComponent(selectedComponentDetail.id)"
                >
                  <i class="fas fa-expand-alt"></i> 分解查看
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 帮助提示 -->
      <div class="help-hint" v-if="showHelpHint">
        <div class="hint-content">
          <i class="fas fa-info-circle"></i> 提示: 使用鼠标左键旋转视图，右键平移，滚轮缩放
        </div>
        <button class="hint-close" @click="showHelpHint = false">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EquipmentDisplay from './index'
let equipmentDisplay = null

export default {
  name: 'Home',
  data() {
    return {
      isExploded: false,
      showWireframe: false,
      selectedViewMode: 'full',
      showParameters: true,
      isPanelCollapsed: false,
      isParameterPanelExpanded: true,
      searchQuery: '',
      selectedComponentId: 1,
      selectedComponentDetail: null,
      autoRotate: true,
      showLabels: true,
      showGrid: true,
      showAxes: false,
      showHelpHint: true,
      coordinates: {x: 0.0, y: 0.0, z: 0.0},
      fps: 60,

      // 组件数据
      components: [
        {id: 1, name: '主控单元', status: 'online', color: '#FF6B6B'},
        {id: 2, name: '高清屏幕', status: 'online', color: '#4ECDC4'},
        {id: 3, name: '车牌识别摄像头', status: 'online', color: '#FFD166'},
        {id: 4, name: 'UPS电源系统', status: 'warning', color: '#06D6A0'},
        {id: 5, name: '温控系统', status: 'online', color: '#118AB2'},
        {id: 6, name: '网络模块', status: 'error', color: '#EF476F'},
        {id: 7, name: '道闸控制器', status: 'online', color: '#073B4C'},
        {id: 8, name: 'LED指示灯', status: 'online', color: '#7209B7'},
        {id: 9, name: '电源模块', status: 'online', color: '#F72585'},
        {id: 10, name: '散热风扇', status: 'offline', color: '#4361EE'},
        {id: 11, name: '通信模块', status: 'online', color: '#4CC9F0'},
        {id: 12, name: '触摸屏', status: 'online', color: '#3A0CA3'}
      ],

      // 设备参数
      parameters: {
        temperature: 25,
        humidity: 45,
        power: 95,
        voltage: 220,
        network: '正常',
        camera: '双摄像头在线'
      },

      // 组件位置信息
      componentPosition: {x: 0, y: 0, z: 0}
    }
  },
  computed: {
    filteredComponents() {
      if (!this.searchQuery) {
        return this.components
      }
      const query = this.searchQuery.toLowerCase()
      return this.components.filter(component => component.name.toLowerCase().includes(query))
    }
  },
  methods: {
    init() {
      const container = document.querySelector('.equipment-display-container-hook')
      // 这里您将初始化Three.js
      equipmentDisplay = new EquipmentDisplay(container)
    },

    toggleExplodeMode() {
      this.isExploded = !this.isExploded
      // 这里触发Three.js的分解/组合动画
      console.log('切换分解模式:', this.isExploded)
    },

    toggleWireframeMode() {
      this.showWireframe = !this.showWireframe
      // 这里切换Three.js模型的线框/实体显示
      console.log('切换线框模式:', this.showWireframe)
    },

    resetView() {
      // 重置Three.js视图
      console.log('重置视图')
    },

    selectComponent(componentId) {
      this.selectedComponentId = componentId
      const component = this.components.find(c => c.id === componentId)
      this.selectedComponentDetail = component

      // 模拟组件位置
      this.componentPosition = {
        x: (Math.random() * 10 - 5).toFixed(2),
        y: (Math.random() * 5).toFixed(2),
        z: (Math.random() * 10 - 5).toFixed(2)
      }

      // 这里触发Three.js中的组件高亮
      console.log('选中组件:', component)
    },

    isolateComponent(componentId) {
      // 在Three.js中单独显示此组件
      console.log('单独显示组件:', componentId)
    },

    highlightComponent(componentId) {
      // 在Three.js中高亮此组件
      console.log('高亮组件:', componentId)
    },

    explodeComponent(componentId) {
      // 在Three.js中分解查看此组件
      console.log('分解查看组件:', componentId)
    },

    togglePanelCollapse() {
      this.isPanelCollapsed = !this.isPanelCollapsed
    },

    toggleParameterPanelExpand() {
      this.isParameterPanelExpanded = !this.isParameterPanelExpanded
    },

    getStatusText(status) {
      const statusMap = {
        online: '在线',
        offline: '离线',
        warning: '警告',
        error: '故障'
      }
      return statusMap[status] || '未知'
    },

    getTemperatureStatus(temp) {
      if (temp < 20) return 'low'
      if (temp > 40) return 'high'
      return 'normal'
    },

    getHumidityStatus(humidity) {
      if (humidity < 30) return 'low'
      if (humidity > 70) return 'high'
      return 'normal'
    },

    getPowerStatus(power) {
      if (power > 80) return 'high'
      if (power > 20) return 'normal'
      return 'low'
    },

    // 模拟坐标和FPS更新
    updateCoordinates() {
      this.coordinates = {
        x: Math.sin(Date.now() * 0.001) * 3,
        y: Math.cos(Date.now() * 0.001) * 3 + 2,
        z: Math.sin(Date.now() * 0.002) * 2
      }

      this.fps = 30 + Math.floor(Math.random() * 30)
    }
  },
  mounted() {
    this.init()

    // 模拟坐标更新
    setInterval(() => {
      this.updateCoordinates()
    }, 100)

    // 5秒后隐藏帮助提示
    setTimeout(() => {
      this.showHelpHint = false
    }, 5000)
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #f8f9fa; /* 白色背景 */

  .equipment-display-container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .ui-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    & > * {
      pointer-events: auto;
    }
  }

  /* 毛玻璃效果基础样式 */
  .glass-effect {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .control-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    @extend .glass-effect;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;

    .logo-section {
      display: flex;
      flex-direction: column;

      .logo {
        font-size: 18px;
        font-weight: bold;
        background: linear-gradient(90deg, #3498db, #2c3e50);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 4px;
      }

      .device-status {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #5d6d7e;

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;

          &.online {
            background-color: #2ecc71;
            box-shadow: 0 0 8px rgba(46, 204, 113, 0.5);
          }
        }
      }
    }

    .control-buttons {
      display: flex;
      gap: 10px;
      align-items: center;

      .control-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(200, 200, 200, 0.3);
        border-radius: 8px;
        color: #2c3e50;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;

        &:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &:active {
          transform: translateY(0);
        }

        &.primary {
          background: linear-gradient(90deg, #3498db, #2980b9);
          border-color: #2980b9;
          color: white;
        }

        .btn-icon {
          font-size: 16px;
        }
      }

      .view-mode-selector {
        .mode-select {
          @extend .glass-effect;
          border-radius: 8px;
          color: #2c3e50;
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
          width: 120px;
          font-weight: 500;

          option {
            background: rgba(255, 255, 255, 0.9);
            color: #2c3e50;
          }
        }
      }
    }
  }

  .component-panel {
    position: absolute;
    top: 70px;
    left: 20px;
    width: 280px;
    @extend .glass-effect;
    border-radius: 12px;
    transition: all 0.3s ease;
    z-index: 90;

    &.collapsed {
      width: 50px;

      .panel-content {
        display: none;
      }

      .panel-header h3 {
        display: none;
      }
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;

      h3 {
        color: #2c3e50;
        font-size: 16px;
        margin: 0;
        font-weight: 600;
      }

      .collapse-icon {
        color: #7f8c8d;
        font-size: 12px;
      }
    }

    .panel-content {
      padding: 16px;

      .component-search {
        margin-bottom: 16px;

        .search-input {
          width: 100%;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(200, 200, 200, 0.3);
          border-radius: 8px;
          color: #2c3e50;
          font-size: 14px;

          &::placeholder {
            color: #95a5a6;
          }

          &:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
          }
        }
      }

      .component-list {
        max-height: 400px;
        overflow-y: auto;

        .component-item {
          display: flex;
          align-items: center;
          padding: 12px;
          margin-bottom: 8px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 8px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.9);
            border-color: rgba(52, 152, 219, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          }

          &.active {
            background: rgba(52, 152, 219, 0.1);
            border-color: #3498db;
          }

          &.online {
            border-left: 3px solid #2ecc71;
          }

          &.offline {
            border-left: 3px solid #95a5a6;
          }

          &.warning {
            border-left: 3px solid #f39c12;
          }

          &.error {
            border-left: 3px solid #e74c3c;
          }

          .component-icon {
            margin-right: 12px;

            .icon-placeholder {
              width: 24px;
              height: 24px;
              border-radius: 6px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
          }

          .component-info {
            flex: 1;

            .component-name {
              color: #2c3e50;
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 2px;
            }

            .component-status {
              font-size: 12px;

              &.online {
                color: #27ae60;
              }

              &.offline {
                color: #7f8c8d;
              }

              &.warning {
                color: #f39c12;
              }

              &.error {
                color: #c0392b;
              }
            }
          }

          .component-actions {
            .action-btn {
              background: rgba(255, 255, 255, 0.5);
              border: 1px solid rgba(200, 200, 200, 0.3);
              color: #7f8c8d;
              cursor: pointer;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 12px;
              transition: all 0.2s ease;

              &:hover {
                background: rgba(52, 152, 219, 0.1);
                color: #3498db;
                border-color: rgba(52, 152, 219, 0.3);
              }
            }
          }
        }
      }
    }
  }

  .parameter-panel {
    position: absolute;
    top: 70px;
    right: 20px;
    width: 320px;
    @extend .glass-effect;
    border-radius: 12px;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 90;

    &.visible {
      transform: translateX(0);
      opacity: 1;
    }

    &.expanded {
      width: 400px;
    }

    .parameter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);

      h3 {
        color: #2c3e50;
        font-size: 16px;
        margin: 0;
        font-weight: 600;
      }

      .parameter-controls {
        display: flex;
        gap: 8px;

        .panel-control-btn {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(200, 200, 200, 0.3);
          border-radius: 6px;
          color: #7f8c8d;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(52, 152, 219, 0.1);
            color: #3498db;
            border-color: rgba(52, 152, 219, 0.3);
          }

          &.close-btn {
            background: rgba(231, 76, 60, 0.1);
            border-color: rgba(231, 76, 60, 0.3);
            color: #e74c3c;

            &:hover {
              background: rgba(231, 76, 60, 0.2);
            }
          }
        }
      }
    }

    .parameter-content {
      padding: 16px;
      max-height: 500px;
      overflow-y: auto;

      .parameter-section {
        margin-bottom: 20px;

        h4 {
          color: #2c3e50;
          font-size: 14px;
          margin: 0 0 12px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;

          i {
            color: #3498db;
          }
        }

        .parameter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;

          .parameter-card {
            background: rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            padding: 12px;
            border: 1px solid rgba(200, 200, 200, 0.3);
            position: relative;
            transition: all 0.2s ease;

            &:hover {
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

              &.low {
                background-color: #3498db;
                box-shadow: 0 0 6px rgba(52, 152, 219, 0.5);
              }

              &.normal {
                background-color: #2ecc71;
                box-shadow: 0 0 6px rgba(46, 204, 113, 0.5);
              }

              &.high {
                background-color: #e74c3c;
                box-shadow: 0 0 6px rgba(231, 76, 60, 0.5);
              }
            }
          }
        }

        .parameter-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);

          .parameter-label {
            font-size: 13px;
            color: #5d6d7e;
            font-weight: 500;
          }

          .parameter-status {
            font-size: 13px;
            font-weight: 600;

            &.online {
              color: #27ae60;
            }
          }

          .signal-strength {
            display: flex;
            gap: 2px;
            align-items: flex-end;

            .signal-bar {
              width: 4px;
              height: 8px;
              background: rgba(155, 155, 155, 0.3);
              border-radius: 2px;

              &.active {
                background: #2ecc71;

                &:nth-child(1) {
                  height: 6px;
                }
                &:nth-child(2) {
                  height: 9px;
                }
                &:nth-child(3) {
                  height: 12px;
                }
              }
            }
          }
        }

        .control-options {
          display: flex;
          flex-direction: column;
          gap: 10px;

          .checkbox-option {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            color: #5d6d7e;
            cursor: pointer;
            font-weight: 500;

            input[type='checkbox'] {
              accent-color: #3498db;
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
  }

  .status-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    @extend .glass-effect;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #5d6d7e;
    z-index: 80;

    .coordinate-display {
      display: flex;
      gap: 16px;
      font-weight: 500;

      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .fps-display {
      color: #2ecc71;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .view-info {
      display: flex;
      gap: 12px;
      font-weight: 500;

      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  .component-detail-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;

    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(4px);
    }

    .modal-content {
      width: 90%;
      max-width: 500px;
      @extend .glass-effect;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      z-index: 201;
      border: 1px solid rgba(255, 255, 255, 0.5);

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(52, 152, 219, 0.1);

        h3 {
          color: #2c3e50;
          font-size: 18px;
          margin: 0;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(200, 200, 200, 0.3);
          border-radius: 6px;
          color: #7f8c8d;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
            border-color: rgba(231, 76, 60, 0.3);
          }
        }
      }

      .modal-body {
        padding: 20px;

        .detail-section {
          margin-bottom: 20px;

          h4 {
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

          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;

            .detail-label {
              color: #7f8c8d;
              font-size: 13px;
              font-weight: 500;
            }

            .detail-value {
              color: #2c3e50;
              font-size: 13px;
              font-weight: 600;

              &.online {
                color: #27ae60;
              }

              &.offline {
                color: #7f8c8d;
              }

              &.warning {
                color: #f39c12;
              }

              &.error {
                color: #c0392b;
              }
            }
          }

          .detail-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;

            .detail-action-btn {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 10px 16px;
              background: rgba(52, 152, 219, 0.1);
              border: 1px solid rgba(52, 152, 219, 0.3);
              border-radius: 8px;
              color: #3498db;
              font-size: 13px;
              cursor: pointer;
              transition: all 0.2s ease;
              font-weight: 500;

              &:hover {
                background: rgba(52, 152, 219, 0.2);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
              }
            }
          }
        }
      }
    }
  }

  .help-hint {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    @extend .glass-effect;
    border-radius: 8px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    z-index: 100;
    border: 1px solid rgba(52, 152, 219, 0.3);

    .hint-content {
      color: #2c3e50;
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .hint-close {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(200, 200, 200, 0.3);
      border-radius: 6px;
      color: #7f8c8d;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(231, 76, 60, 0.1);
        color: #e74c3c;
        border-color: rgba(231, 76, 60, 0.3);
      }
    }
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(155, 155, 155, 0.4);
    border-radius: 3px;

    &:hover {
      background: rgba(155, 155, 155, 0.6);
    }
  }
}
</style>
