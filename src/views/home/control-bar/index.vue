<!-- 
* @Description 控制面板
-->
<template>
  <div class="control-bar">
    <div class="logo-section">
      <div class="device-status">
      </div>
    </div>

    <div class="control-buttons">
      <button class="control-btn" @click="toggleExplodeMode">
        <span class="btn-icon">⚡</span>
        <span class="btn-text">{{ isExploded ? '组合视图' : '分解视图' }}</span>
      </button>

      <button class="control-btn" @click="resetView">
        <span class="btn-icon">↺</span>
        <span class="btn-text">重置视图</span>
      </button>

      <div class="view-mode-selector">
        <select :value="selectedViewMode" class="mode-select" @change="setSelectedViewMode($event.target.value)">
          <option value="front">正面视图</option>
          <option value="top">顶部视图</option>
          <option value="side">侧面视图</option>
        </select>
      </div>

      <button class="control-btn primary" @click="setShowParameters()">
        <span class="btn-icon">📊</span>
        <span class="btn-text">参数面板</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex/dist/vuex.common.js';
export default {
  name: 'ControlBar',
  computed: {
    ...mapState('home', ['selectedViewMode'])
  },
  data() {
    return {
      isExploded: false
    }
  },
  methods: {
    ...mapMutations('home', ['setSelectedViewMode', 'setShowParameters']),
    toggleExplodeMode() {
      this.isExploded = !this.isExploded
      // 这里触发Three.js的分解/组合动画
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
  },
  watch: {
    selectedViewMode(value) {
      window.equipmentDisplay.setView(value)
    }
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
</style>
