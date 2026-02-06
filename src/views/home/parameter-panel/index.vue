<!-- 
* @Description 
-->
<template>
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
          <i :class="isParameterPanelExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
        </button>
        <button
          class="panel-control-btn close-btn"
          @click="setShowParameters"
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
            <div class="parameter-indicator" :class="getHumidityStatus(parameters.humidity)"></div>
          </div>

          <div class="parameter-card">
            <div class="parameter-name"><i class="fas fa-battery-three-quarters"></i> 电池电量</div>
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
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations} from 'vuex'

export default {
  name: 'parameterPanel',
  computed: {
    ...mapState('home', ['showParameters', 'isParameterPanelExpanded', 'parameters'])
  },
  methods: {
    ...mapMutations('home', ['setIsParameterPanelExpanded', 'setShowParameters']),
    toggleParameterPanelExpand() {
      this.setIsParameterPanelExpanded()
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
</style>
