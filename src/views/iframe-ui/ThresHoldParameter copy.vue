<template>
  <div class="glass-switch-card">
    <!-- 背景装饰 -->
    <div class="bg-elements">
      <div class="bg-element"></div>
      <div class="bg-element"></div>
    </div>

    <!-- 交换机状态卡片 -->
    <div class="box" ref="cardBox" :style="cardStyle" @click="handleCardClick">
      <div class="elements bg"></div>
      <div class="card">
        <!-- 顶部标题栏 - 左右分布 -->
        <div class="header-section">
          <div class="device-name">
            <h2>{{ deviceName }}</h2>
            <div class="device-id" v-if="deviceId">ID: {{ deviceId }}</div>
          </div>

          <div class="threshold-btn">
            <button @click.stop="handleThresholdConfig">
              <i class="fas fa-sliders-h"></i> 阈值配置
            </button>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="content-section">
          <!-- 左侧状态信息 -->
          <div class="info-section">
            <!-- 温度状态 -->
            <div class="status-panel temperature-panel">
              <div class="panel-header">
                <i class="fas fa-thermometer-half panel-icon"></i>
                <h3 class="panel-title">温度状态</h3>
                <div class="panel-actions">
                  <button class="detail-btn" @click.stop="showTemperatureDetail">
                    <i class="fas fa-chart-line"></i> 详细
                  </button>
                </div>
              </div>
              <div class="panel-content">
                <div class="temperature-display">
                  <div class="temperature-value-container">
                    <span class="temperature-value">{{ temperature }}</span>
                    <span class="temperature-unit">℃</span>
                  </div>
                  <div class="temperature-gauge">
                    <div class="gauge-bg">
                      <div class="gauge-fill" :style="gaugeFillStyle"></div>
                    </div>
                    <div class="gauge-labels">
                      <span class="gauge-min">{{ tempThreshold.min }}℃</span>
                      <span class="gauge-current">当前: {{ temperature }}℃</span>
                      <span class="gauge-max">{{ tempThreshold.max }}℃</span>
                    </div>
                  </div>
                  <div class="temperature-stats">
                    <div class="stat-item">
                      <span class="stat-label">今日最高:</span>
                      <span class="stat-value">{{ todayMaxTemp }}℃</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">今日最低:</span>
                      <span class="stat-value">{{ todayMinTemp }}℃</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">平均温度:</span>
                      <span class="stat-value">{{ avgTemp }}℃</span>
                    </div>
                  </div>
                </div>
                <div class="temperature-status" :class="getTemperatureStatusClass">
                  <i :class="getTemperatureIcon" class="status-icon"></i>
                  <span class="status-text">{{ getTemperatureStatus }}</span>
                  <span class="status-desc" v-if="getTemperatureDesc">{{
                    getTemperatureDesc
                  }}</span>
                </div>
              </div>
            </div>

            <!-- 环网状态 -->
            <div class="status-panel network-panel">
              <div class="panel-header">
                <i class="fas fa-network-wired panel-icon"></i>
                <h3 class="panel-title">环网状态</h3>
                <div class="panel-actions">
                  <button class="detail-btn" @click.stop="showNetworkDetail">
                    <i class="fas fa-info-circle"></i> 详情
                  </button>
                </div>
              </div>
              <div class="panel-content">
                <div class="network-status-display">
                  <div class="network-status" :class="getNetworkStatusClass">
                    <div class="status-visual">
                      <i :class="getNetworkStatusIcon" class="status-icon-large"></i>
                      <div class="pulse-effect" v-if="networkStatus === '正常'"></div>
                    </div>
                    <div class="status-info">
                      <div class="status-main">
                        <span class="status-text">{{ networkStatus }}</span>
                        <span class="status-subtext" v-if="getNetworkStatusDesc">{{
                          getNetworkStatusDesc
                        }}</span>
                      </div>
                      <div class="last-update">
                        <i class="far fa-clock update-icon"></i>
                        <span>更新: {{ lastUpdate }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="network-metrics">
                    <div class="metric-row">
                      <div class="metric-item">
                        <div class="metric-label">CPU使用率</div>
                        <div class="metric-value">{{ cpuUsage }}%</div>
                        <div class="metric-bar">
                          <div
                            class="bar-fill"
                            :style="{width: `${cpuUsage}%`}"
                            :class="getCpuStatusClass"
                          ></div>
                        </div>
                      </div>
                      <div class="metric-item">
                        <div class="metric-label">内存使用率</div>
                        <div class="metric-value">{{ memoryUsage }}%</div>
                        <div class="metric-bar">
                          <div
                            class="bar-fill"
                            :style="{width: `${memoryUsage}%`}"
                            :class="getMemoryStatusClass"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div class="metric-row">
                      <div class="metric-item">
                        <div class="metric-label">上行流量</div>
                        <div class="metric-value">{{ upTraffic }}</div>
                        <div class="metric-trend">
                          <i class="fas fa-arrow-up trend-icon" v-if="upTrend === 'up'"></i>
                          <i class="fas fa-arrow-down trend-icon" v-else></i>
                          <span class="trend-value">{{ upTrendValue }}</span>
                        </div>
                      </div>
                      <div class="metric-item">
                        <div class="metric-label">下行流量</div>
                        <div class="metric-value">{{ downTraffic }}</div>
                        <div class="metric-trend">
                          <i class="fas fa-arrow-up trend-icon" v-if="downTrend === 'up'"></i>
                          <i class="fas fa-arrow-down trend-icon" v-else></i>
                          <span class="trend-value">{{ downTrendValue }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧设备信息 -->
          <div class="device-section">
            <!-- 设备图标区域 -->
            <div class="device-display">
              <div class="device-icon-container">
                <i :class="`fas ${deviceIcon} device-icon`"></i>
              </div>
              <div class="device-info">
                <div class="device-model">{{ deviceModel }}</div>
                <div class="device-location" v-if="deviceLocation">
                  <i class="fas fa-map-marker-alt location-icon"></i>
                  {{ deviceLocation }}
                </div>
              </div>
            </div>

            <!-- 运行时间 -->
            <div class="uptime-display">
              <div class="uptime-header">
                <i class="fas fa-history uptime-icon"></i>
                <span class="uptime-label">运行时间</span>
              </div>
              <div class="uptime-value">{{ uptime }}</div>
              <div class="uptime-details">
                <div class="detail-item">
                  <span class="detail-label">最后重启:</span>
                  <span class="detail-value">{{ lastReboot }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">可用性:</span>
                  <span class="detail-value">{{ availability }}%</span>
                </div>
              </div>
            </div>

            <!-- 端口状态 -->
            <div class="ports-status">
              <div class="ports-header">
                <i class="fas fa-ethernet ports-icon"></i>
                <span class="ports-label">端口状态</span>
              </div>
              <div class="ports-grid">
                <div class="port-status" v-for="port in portStatuses" :key="port.id">
                  <div class="port-indicator" :class="port.status"></div>
                  <div class="port-info">
                    <div class="port-name">{{ port.name }}</div>
                    <div class="port-speed">{{ port.speed }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 设备整体状态 -->
            <div class="overall-status" :class="getOverallStatusClass">
              <div class="overall-status-header">
                <i :class="getOverallStatusIcon" class="overall-status-icon"></i>
                <span class="overall-status-label">设备状态</span>
              </div>
              <div class="overall-status-value">{{ getOverallStatusText }}</div>
              <div class="overall-status-details">
                <div class="status-item" v-for="item in statusDetails" :key="item.label">
                  <span class="status-item-label">{{ item.label }}:</span>
                  <span class="status-item-value" :class="item.statusClass">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LargeGlassSwitchCard',
  props: {
    // 设备名称
    deviceName: {
      type: String,
      default: '核心交换机'
    },
    // 设备ID
    deviceId: {
      type: String,
      default: 'SW-2023-001'
    },
    // 设备型号
    deviceModel: {
      type: String,
      default: 'Cisco Catalyst 9500'
    },
    // 设备位置
    deviceLocation: {
      type: String,
      default: '数据中心-A机房-机架3'
    },
    // 当前温度
    temperature: {
      type: Number,
      default: 30
    },
    // 环网状态
    networkStatus: {
      type: String,
      default: '正常',
      validator: value => ['正常', '警告', '异常', '离线'].includes(value)
    },
    // 设备图标
    deviceIcon: {
      type: String,
      default: 'fa-server'
    },
    // 温度阈值配置
    tempThreshold: {
      type: Object,
      default: () => ({
        min: 20,
        max: 40
      })
    },
    // CPU使用率
    cpuUsage: {
      type: Number,
      default: 45,
      validator: value => value >= 0 && value <= 100
    },
    // 内存使用率
    memoryUsage: {
      type: Number,
      default: 60,
      validator: value => value >= 0 && value <= 100
    },
    // 运行时间
    uptime: {
      type: String,
      default: '15天 6小时 32分'
    },
    // 最后更新时间
    lastUpdate: {
      type: String,
      default: '14:30:25'
    },
    // 最后重启时间
    lastReboot: {
      type: String,
      default: '2023-10-01 08:00'
    },
    // 设备可用性
    availability: {
      type: Number,
      default: 99.9
    },
    // 今日最高温度
    todayMaxTemp: {
      type: Number,
      default: 35
    },
    // 今日最低温度
    todayMinTemp: {
      type: Number,
      default: 25
    },
    // 平均温度
    avgTemp: {
      type: Number,
      default: 30
    },
    // 上行流量
    upTraffic: {
      type: String,
      default: '125.4 Mbps'
    },
    // 下行流量
    downTraffic: {
      type: String,
      default: '89.7 Mbps'
    },
    // 上行趋势
    upTrend: {
      type: String,
      default: 'up',
      validator: value => ['up', 'down'].includes(value)
    },
    // 上行趋势值
    upTrendValue: {
      type: String,
      default: '+5.2%'
    },
    // 下行趋势
    downTrend: {
      type: String,
      default: 'down',
      validator: value => ['up', 'down'].includes(value)
    },
    // 下行趋势值
    downTrendValue: {
      type: String,
      default: '-2.1%'
    }
  },
  data() {
    return {
      isFlipped: false,
      cardTransform: '',
      vanillaTilt: null,
      portStatuses: [
        {id: 1, name: 'Gi0/1', status: 'up', speed: '1G'},
        {id: 2, name: 'Gi0/2', status: 'up', speed: '1G'},
        {id: 3, name: 'Gi0/3', status: 'down', speed: '1G'},
        {id: 4, name: 'Gi0/4', status: 'up', speed: '1G'},
        {id: 5, name: 'Gi0/5', status: 'up', speed: '10G'},
        {id: 6, name: 'Gi0/6', status: 'up', speed: '10G'}
      ]
    }
  },
  computed: {
    // 动态卡片样式
    cardStyle() {
      if (this.isFlipped) {
        return {transform: this.cardTransform + ' rotateY(180deg)'}
      }
      return {transform: this.cardTransform}
    },

    // 温度计填充样式
    gaugeFillStyle() {
      const range = this.tempThreshold.max - this.tempThreshold.min
      const normalizedValue = Math.min(
        Math.max(this.temperature, this.tempThreshold.min),
        this.tempThreshold.max
      )
      const percentage = ((normalizedValue - this.tempThreshold.min) / range) * 100
      return {width: `${percentage}%`}
    },

    // 温度状态计算
    getTemperatureStatus() {
      if (this.temperature < this.tempThreshold.min) {
        return '温度过低'
      } else if (this.temperature > this.tempThreshold.max) {
        return '温度过高'
      } else {
        return '温度正常'
      }
    },

    // 温度状态描述
    getTemperatureDesc() {
      if (this.temperature < this.tempThreshold.min) {
        return `低于阈值 ${this.tempThreshold.min}℃`
      } else if (this.temperature > this.tempThreshold.max) {
        return `高于阈值 ${this.tempThreshold.max}℃`
      } else {
        return '在正常范围内'
      }
    },

    // 温度状态样式类
    getTemperatureStatusClass() {
      if (this.temperature < this.tempThreshold.min) {
        return 'status-warning'
      } else if (this.temperature > this.tempThreshold.max) {
        return 'status-error'
      } else {
        return 'status-normal'
      }
    },

    // 温度图标
    getTemperatureIcon() {
      if (this.temperature < this.tempThreshold.min) {
        return 'fa-temperature-low'
      } else if (this.temperature > this.tempThreshold.max) {
        return 'fa-temperature-high'
      } else {
        return 'fa-temperature-half'
      }
    },

    // 网络状态样式类
    getNetworkStatusClass() {
      switch (this.networkStatus) {
        case '正常':
          return 'status-normal'
        case '警告':
          return 'status-warning'
        case '异常':
          return 'status-error'
        case '离线':
          return 'status-offline'
        default:
          return 'status-normal'
      }
    },

    // 网络状态图标
    getNetworkStatusIcon() {
      switch (this.networkStatus) {
        case '正常':
          return 'fa-check-circle'
        case '警告':
          return 'fa-exclamation-triangle'
        case '异常':
          return 'fa-exclamation-circle'
        case '离线':
          return 'fa-plug'
        default:
          return 'fa-question-circle'
      }
    },

    // 网络状态描述
    getNetworkStatusDesc() {
      switch (this.networkStatus) {
        case '正常':
          return '所有连接正常'
        case '警告':
          return '有轻微网络波动'
        case '异常':
          return '部分连接中断'
        case '离线':
          return '设备离线'
        default:
          return ''
      }
    },

    // CPU状态类
    getCpuStatusClass() {
      if (this.cpuUsage > 80) return 'status-error'
      if (this.cpuUsage > 60) return 'status-warning'
      return 'status-normal'
    },

    // 内存状态类
    getMemoryStatusClass() {
      if (this.memoryUsage > 80) return 'status-error'
      if (this.memoryUsage > 60) return 'status-warning'
      return 'status-normal'
    },

    // 设备整体状态
    getOverallStatusText() {
      if (
        this.temperature > this.tempThreshold.max ||
        this.networkStatus === '异常' ||
        this.networkStatus === '离线'
      ) {
        return '异常'
      } else if (
        this.temperature < this.tempThreshold.min ||
        this.networkStatus === '警告' ||
        this.cpuUsage > 80 ||
        this.memoryUsage > 80
      ) {
        return '警告'
      } else {
        return '正常'
      }
    },

    // 设备整体状态样式
    getOverallStatusClass() {
      if (this.getOverallStatusText === '正常') {
        return 'overall-status-normal'
      } else if (this.getOverallStatusText === '警告') {
        return 'overall-status-warning'
      } else {
        return 'overall-status-error'
      }
    },

    // 设备整体状态图标
    getOverallStatusIcon() {
      if (this.getOverallStatusText === '正常') {
        return 'fa-check-circle'
      } else if (this.getOverallStatusText === '警告') {
        return 'fa-exclamation-triangle'
      } else {
        return 'fa-exclamation-circle'
      }
    },

    // 状态详情
    statusDetails() {
      return [
        {
          label: '温度',
          value: `${this.temperature}℃`,
          statusClass: this.getTemperatureStatusClass
        },
        {
          label: '环网',
          value: this.networkStatus,
          statusClass: this.getNetworkStatusClass
        },
        {
          label: 'CPU',
          value: `${this.cpuUsage}%`,
          statusClass: this.getCpuStatusClass
        },
        {
          label: '内存',
          value: `${this.memoryUsage}%`,
          statusClass: this.getMemoryStatusClass
        }
      ]
    }
  },
  mounted() {
    // 初始动画
    this.$nextTick(() => {
      this.initCardAnimation()

      // 初始化vanilla-tilt
      this.initVanillaTilt()
    })
  },
  beforeDestroy() {
    // 清理vanilla-tilt实例
    if (this.vanillaTilt && this.vanillaTilt.destroy) {
      this.vanillaTilt.destroy()
    }
  },
  methods: {
    // 初始化卡片动画
    initCardAnimation() {
      const box = this.$refs.cardBox
      if (!box) return

      box.style.opacity = '0'
      box.style.transform = 'translateY(30px) rotateX(10deg)'

      setTimeout(() => {
        box.style.transition =
          'opacity 0.5s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        box.style.opacity = '1'
        box.style.transform = ''
        this.cardTransform = ''
      }, 100)
    },

    // 初始化vanilla-tilt
    initVanillaTilt() {
      // 动态加载vanilla-tilt库
      if (typeof VanillaTilt === 'undefined') {
        this.loadVanillaTiltScript()
      } else {
        this.initTilt()
      }
    },

    // 加载vanilla-tilt脚本
    loadVanillaTiltScript() {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js'
      script.integrity =
        'sha512-RX/OFugt/bkgwRQg4B22KYE79dQhwaPp2IZaA/YyU3GMo/qY7GrXkiG6Dvvwnds6/DefCfwPTgCXnaC6nAgVYw=='
      script.crossOrigin = 'anonymous'
      script.referrerPolicy = 'no-referrer'
      script.onload = () => {
        this.initTilt()
      }
      document.head.appendChild(script)
    },

    // 初始化tilt效果
    initTilt() {
      if (typeof VanillaTilt === 'undefined' || !this.$refs.cardBox) return

      this.vanillaTilt = VanillaTilt.init(this.$refs.cardBox, {
        max: 10,
        speed: 300,
        glare: true,
        'max-glare': 0.1,
        scale: 1.05
      })
    },

    // 处理卡片点击事件
    handleCardClick(e) {
      // 如果点击的是阈值配置按钮，则不触发翻转
      if (e.target.closest('button')) {
        return
      }

      this.isFlipped = !this.isFlipped
      this.$emit('card-flip', this.isFlipped)
    },

    // 处理阈值配置按钮点击
    handleThresholdConfig() {
      this.$emit('configure-threshold', {
        deviceName: this.deviceName,
        deviceId: this.deviceId,
        temperature: this.temperature,
        networkStatus: this.networkStatus,
        cpuUsage: this.cpuUsage,
        memoryUsage: this.memoryUsage,
        tempThreshold: this.tempThreshold
      })
    },

    // 显示温度详情
    showTemperatureDetail() {
      this.$emit('show-temperature-detail', {
        deviceName: this.deviceName,
        deviceId: this.deviceId,
        temperature: this.temperature,
        tempThreshold: this.tempThreshold,
        todayMaxTemp: this.todayMaxTemp,
        todayMinTemp: this.todayMinTemp,
        avgTemp: this.avgTemp
      })
    },

    // 显示网络详情
    showNetworkDetail() {
      this.$emit('show-network-detail', {
        deviceName: this.deviceName,
        deviceId: this.deviceId,
        networkStatus: this.networkStatus,
        cpuUsage: this.cpuUsage,
        memoryUsage: this.memoryUsage,
        upTraffic: this.upTraffic,
        downTraffic: this.downTraffic
      })
    }
  },
  watch: {
    // 监听温度变化
    temperature(newTemp) {
      if (newTemp > this.tempThreshold.max) {
        this.$emit('temperature-warning', {
          device: this.deviceName,
          deviceId: this.deviceId,
          temperature: newTemp,
          threshold: this.tempThreshold.max,
          status: '过高'
        })
      } else if (newTemp < this.tempThreshold.min) {
        this.$emit('temperature-warning', {
          device: this.deviceName,
          deviceId: this.deviceId,
          temperature: newTemp,
          threshold: this.tempThreshold.min,
          status: '过低'
        })
      }
    },

    // 监听网络状态变化
    networkStatus(newStatus) {
      if (newStatus !== '正常') {
        this.$emit('network-status-change', {
          device: this.deviceName,
          deviceId: this.deviceId,
          status: newStatus
        })
      }
    },

    // 监听CPU使用率
    cpuUsage(newUsage) {
      if (newUsage > 80) {
        this.$emit('cpu-warning', {
          device: this.deviceName,
          deviceId: this.deviceId,
          cpuUsage: newUsage
        })
      }
    },

    // 监听内存使用率
    memoryUsage(newUsage) {
      if (newUsage > 80) {
        this.$emit('memory-warning', {
          device: this.deviceName,
          deviceId: this.deviceId,
          memoryUsage: newUsage
        })
      }
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.glass-switch-card {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: rgba(240, 240, 240, 1);
  padding: 20px;
  overflow-x: hidden;
}

/* 卡片容器 - 大尺寸 */
.box {
  position: relative;
  width: 800px;
  height: 680px;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

/* 卡片元素通用样式 */
.elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: 0.5s;
}

/* 背景元素 */
.bg {
  background: linear-gradient(45deg, #3498db, #2ecc71);
  border-radius: 20px;
  transform: translateZ(15px);
  filter: blur(15px);
  opacity: 0.4;
}

/* 玻璃卡片 */
.card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateZ(20px);
  z-index: 0;
  display: flex;
  flex-direction: column;
  padding: 25px 30px;
  overflow: hidden;
}

/* 顶部标题栏 - 左右分布 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  z-index: 2;
  transform: translateZ(25px);
  min-height: 60px;
  flex-shrink: 0;
}

/* 设备名称 */
.device-name h2 {
  color: #fff;
  font-size: 2.4rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.device-id {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.2);
  padding: 6px 12px;
  border-radius: 12px;
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 阈值配置按钮 */
.threshold-btn button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 10px 18px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  height: 40px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.threshold-btn button:hover {
  background: rgba(52, 152, 219, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  border-color: rgba(52, 152, 219, 0.4);
}

/* 主要内容区域 - 使用flex自适应 */
.content-section {
  display: flex;
  flex: 1;
  z-index: 2;
  transform: translateZ(25px);
  min-height: 0;
  gap: 25px;
  overflow: hidden;
}

/* 左侧状态信息 - 自适应宽度 */
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 25px;
  overflow: hidden;
}

/* 状态面板通用样式 */
.status-panel {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  flex: 1;
  min-height: 0;
}

.status-panel:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

/* 面板头部 */
.panel-header {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-icon {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.4rem;
  margin-right: 12px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.panel-title {
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
  flex: 1;
  letter-spacing: 0.5px;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

.detail-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.detail-btn:hover {
  background: rgba(52, 152, 219, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 面板内容 */
.panel-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 温度显示 */
.temperature-display {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.temperature-value-container {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

.temperature-value {
  color: #fff;
  font-size: 3.5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.temperature-unit {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.8rem;
  font-weight: 600;
}

.temperature-gauge {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gauge-bg {
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.gauge-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #3498db, #e74c3c);
  border-radius: 10px;
  transition: width 1s ease-out;
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
}

.gauge-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.gauge-current {
  font-weight: 600;
  color: #fff;
}

.temperature-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.stat-value {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
}

/* 温度状态 */
.temperature-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-icon {
  font-size: 1.3rem;
}

.status-text {
  color: #fff;
  letter-spacing: 0.5px;
}

.status-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 400;
  margin-left: 5px;
}

/* 环网状态显示 */
.network-status-display {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.network-status {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-visual {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon-large {
  font-size: 3rem;
  z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.pulse-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.2;
  animation: pulse 2s infinite;
  z-index: 1;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.status-main {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-subtext {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.last-update {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.1);
  padding: 6px 10px;
  border-radius: 8px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.update-icon {
  font-size: 0.85rem;
}

/* 网络指标 */
.network-metrics {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.metric-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.metric-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
}

.metric-value {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.metric-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 5px;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #3498db);
  border-radius: 4px;
  transition: width 1s ease-out;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 5px;
  font-size: 0.85rem;
}

.trend-icon {
  font-size: 0.8rem;
}

.trend-value {
  font-weight: 600;
}

/* 右侧设备信息 */
.device-section {
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding-left: 25px;
  min-height: 0;
  overflow: hidden;
  flex-shrink: 0;
}

/* 设备显示 */
.device-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.device-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.device-icon-container:hover {
  transform: rotateY(10deg) scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.device-icon {
  font-size: 5rem;
  color: #fff;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
}

.device-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.device-model {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.device-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.location-icon {
  font-size: 0.9rem;
  color: #3498db;
}

/* 运行时间 */
.uptime-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 18px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.uptime-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.uptime-icon {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.uptime-label {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.uptime-value {
  color: #fff;
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
  margin: 5px 0;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.uptime-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 5px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

.detail-value {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
}

/* 端口状态 */
.ports-status {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 18px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.ports-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.ports-icon {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.ports-label {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.ports-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  overflow-y: auto;
  max-height: 200px;
  padding-right: 5px;
}

.ports-grid::-webkit-scrollbar {
  width: 4px;
}

.ports-grid::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.ports-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.port-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.port-status:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.port-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.port-indicator.up {
  background: #2ecc71;
  box-shadow: 0 0 8px rgba(46, 204, 113, 0.5);
  animation: pulse 2s infinite;
}

.port-indicator.down {
  background: #e74c3c;
  box-shadow: 0 0 8px rgba(231, 76, 60, 0.5);
}

.port-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.port-name {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
}

.port-speed {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

/* 设备整体状态 */
.overall-status {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  margin-top: auto;
}

.overall-status-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.overall-status-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3));
}

.overall-status-label {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.overall-status-value {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  margin: 5px 0;
}

.overall-status-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-item-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin-bottom: 3px;
}

.status-item-value {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 状态颜色 */
.status-normal {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.4);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.2);
}

.status-normal .bar-fill {
  background: linear-gradient(90deg, #2ecc71, #27ae60);
}

.status-warning {
  background: rgba(241, 196, 15, 0.2);
  color: #f1c40f;
  border: 1px solid rgba(241, 196, 15, 0.4);
  box-shadow: 0 4px 15px rgba(241, 196, 15, 0.2);
}

.status-warning .bar-fill {
  background: linear-gradient(90deg, #f1c40f, #f39c12);
}

.status-error {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.4);
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2);
}

.status-error .bar-fill {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.status-offline {
  background: rgba(149, 165, 166, 0.2);
  color: #95a5a6;
  border: 1px solid rgba(149, 165, 166, 0.4);
  box-shadow: 0 4px 15px rgba(149, 165, 166, 0.2);
}

.status-offline .bar-fill {
  background: linear-gradient(90deg, #95a5a6, #7f8c8d);
}

.overall-status-normal {
  background: rgba(46, 204, 113, 0.2);
  border: 1px solid rgba(46, 204, 113, 0.4);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.2);
}

.overall-status-warning {
  background: rgba(241, 196, 15, 0.2);
  border: 1px solid rgba(241, 196, 15, 0.4);
  box-shadow: 0 8px 20px rgba(241, 196, 15, 0.2);
}

.overall-status-error {
  background: rgba(231, 76, 60, 0.2);
  border: 1px solid rgba(231, 76, 60, 0.4);
  box-shadow: 0 8px 20px rgba(231, 76, 60, 0.2);
}

/* 悬停效果 */
.box:hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
}

.box:hover .card {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35), 0 0 20px rgba(52, 152, 219, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* 背景装饰 */
.bg-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.bg-element {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.2;
}

.bg-element:nth-child(1) {
  width: 300px;
  height: 300px;
  background: #3498db;
  top: 10%;
  left: 10%;
  animation: float 20s infinite ease-in-out;
}

.bg-element:nth-child(2) {
  width: 400px;
  height: 400px;
  background: #2ecc71;
  bottom: 10%;
  right: 10%;
  animation: float 25s infinite ease-in-out reverse;
}

/* 动画 */
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, -30px) rotate(90deg);
  }
  50% {
    transform: translate(-15px, 20px) rotate(180deg);
  }
  75% {
    transform: translate(30px, 10px) rotate(270deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 850px) {
  .glass-switch-card {
    padding: 10px;
  }

  .box {
    width: 100%;
    max-width: 750px;
    height: 650px;
  }

  .device-name h2 {
    font-size: 2.2rem;
  }

  .device-icon {
    font-size: 4.5rem;
  }

  .temperature-value {
    font-size: 3rem;
  }

  .device-section {
    width: 250px;
  }

  .metric-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .ports-grid {
    grid-template-columns: 1fr;
  }

  .overall-status-details {
    grid-template-columns: 1fr;
  }
}
</style>
