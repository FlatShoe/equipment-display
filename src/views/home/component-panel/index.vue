<!-- 
* @Description 
-->
<template>
  <div class="component-panel">
    <div class="panel-header">
      <h3>设备组件</h3>
    </div>

    <div class="panel-content">
      <div class="component-search">
        <input type="text" placeholder="搜索组件..." v-model="searchQuery" class="search-input" />
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
          @click="selectComponent(component.id, component.name)"
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
</template>

<script>
import { mapState, mapMutations } from 'vuex'
let modelsResult = null

export default {
  name: 'ComponentPanel',
  computed: {
    ...mapState('home', ['components', 'selectedComponentId', 'modelNames']),
    filteredComponents() {
      if (!this.searchQuery) {
        return this.components
      }
      const query = this.searchQuery.toLowerCase()
      return this.components.filter(component => component.name.toLowerCase().includes(query))
    }
  },
  data() {
    return {
      searchQuery: '',
    }
  },
  methods: {
    ...mapMutations('home', ['setSelectedComponentId', 'setSelectedComponentDetail']),
    getStatusText(status) {
      const statusMap = {
        online: '在线',
        offline: '离线',
        warning: '警告',
        error: '故障'
      }
      return statusMap[status] || '未知'
    },
    isolateComponent(componentId) {
      // 在Three.js中单独显示此组件
      console.log('单独显示组件:', componentId)
    },
    selectComponent(componentId, name) {
      const models = this.modelNames[name]
      if (models) {
        if (modelsResult) {
           modelsResult.restoreAll()
           modelsResult = null
        }
        modelsResult = window.equipmentDisplay.modelHighlighter.findAndHighlightMultiple(models)
      }

      this.setSelectedComponentId(componentId)
      const component = this.components.find(c => c.id === componentId)
      this.setSelectedComponentDetail(component)

      // 模拟组件位置
      this.componentPosition = {
        x: (Math.random() * 10 - 5).toFixed(2),
        y: (Math.random() * 5).toFixed(2),
        z: (Math.random() * 10 - 5).toFixed(2)
      }

      // 创建 3D 玻璃面板显示组件详情
      if (window.equipmentDisplay && window.equipmentDisplay.createGlassPanel) {
        // 先移除之前的面板
        if (this.currentGlassPanel) {
          window.equipmentDisplay.removeGlassPanel(this.currentGlassPanel)
        }
        
        // 创建新的玻璃面板
        const panelData = {
          title: component.name,
          icon: 'fas fa-server',
          status: this.getStatusText(component.status),
          temperature: '28°C',
          network: '正常',
          power: '95%'
        }
        
        this.currentGlassPanel = window.equipmentDisplay.createGlassPanel(panelData, {
          x: 3,
          y: 2,
          z: 0
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
/* 毛玻璃效果基础样式 */
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
</style>
