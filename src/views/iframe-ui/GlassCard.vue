<template>
  <div class="glass-card-container">
    <!-- 背景装饰 -->
    <div class="bg-elements">
      <div class="bg-element"></div>
      <div class="bg-element"></div>
    </div>

    <!-- 卡片容器 -->
    <div class="box" ref="cardBox" :style="cardStyle" @click="handleCardClick">
      <!-- 移除模糊背景元素，改为在卡片上使用内阴影 -->
      <div class="card">
        <!-- 顶部标题栏 - 左右分布 -->
        <div class="header-section">
          <div class="device-info">
            <!-- 设备标题插槽 -->
            <slot name="title">
              <h2>{{ deviceName }}</h2>
              <div class="device-id" v-if="deviceId">ID: {{ deviceId }}</div>
            </slot>
          </div>

          <!-- 操作按钮区域 -->
          <div class="action-buttons">
            <!-- 阈值配置按钮插槽 -->
            <slot name="actions">
              <button class="threshold-btn" @click.stop="handleThresholdConfig">
                <i class="fas fa-sliders-h"></i> 阈值配置
              </button>
            </slot>

            <!-- 扩展操作按钮插槽 -->
            <slot name="extra-actions"></slot>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="content-section">
          <!-- 左侧内容插槽 -->
          <div class="left-section">
            <slot name="left-content"></slot>
          </div>

          <!-- 右侧内容插槽 -->
          <div class="right-section">
            <slot name="right-content"></slot>
          </div>
        </div>

        <!-- 底部内容插槽 -->
        <div class="footer-section">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlassCard',
  props: {
    // 设备名称
    deviceName: {
      type: String,
      default: ''
    },
    // 设备ID
    deviceId: {
      type: String,
      default: ''
    },
    // 是否可翻转
    flipEnabled: {
      type: Boolean,
      default: true
    },
    // 是否启用3D倾斜效果
    tiltEnabled: {
      type: Boolean,
      default: true
    },
    // 卡片尺寸
    size: {
      type: String,
      default: 'large', // 'small', 'medium', 'large', 'xlarge'
      validator: value => ['small', 'medium', 'large', 'xlarge'].includes(value)
    },
    // 自定义宽度
    customWidth: {
      type: String,
      default: ''
    },
    // 自定义高度
    customHeight: {
      type: String,
      default: ''
    },
    // 霓虹光晕颜色
    neonColor: {
      type: String,
      default: '#3498db'
    },
    // 是否显示背景光晕
    showGlow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isFlipped: false,
      cardTransform: '',
      vanillaTilt: null
    }
  },
  computed: {
    // 动态卡片样式
    cardStyle() {
      const styles = {}

      if (this.isFlipped && this.flipEnabled) {
        styles.transform = this.cardTransform + ' rotateY(180deg)'
      } else {
        styles.transform = this.cardTransform
      }

      // 应用尺寸
      if (this.customWidth) {
        styles.width = this.customWidth
      } else {
        switch (this.size) {
          case 'small':
            styles.width = '400px'
            break
          case 'medium':
            styles.width = '600px'
            break
          case 'large':
            styles.width = '800px'
            break
          case 'xlarge':
            styles.width = '1000px'
            break
        }
      }

      if (this.customHeight) {
        styles.height = this.customHeight
      } else {
        switch (this.size) {
          case 'small':
            styles.height = '280px'
            break
          case 'medium':
            styles.height = '400px'
            break
          case 'large':
            styles.height = '500px'
            break
          case 'xlarge':
            styles.height = '600px'
            break
        }
      }

      return styles
    },

    // 霓虹光晕样式
    neonGlowStyle() {
      if (!this.showGlow) return {}
      return {
        background: `radial-gradient(circle at center, ${this.neonColor}20 0%, transparent 70%)`,
        boxShadow: `0 0 60px ${this.neonColor}40, 0 0 120px ${this.neonColor}20, inset 0 0 20px ${this.neonColor}10`
      }
    }
  },
  mounted() {
    // 初始动画
    this.$nextTick(() => {
      this.initCardAnimation()

      // 初始化vanilla-tilt
      if (this.tiltEnabled) {
        this.initVanillaTilt()
      }
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
      box.style.transform = 'translateY(30px) rotateX(10deg) scale(0.95)'

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
      // 如果点击的是按钮，则不触发翻转
      if (e.target.closest('button')) {
        return
      }

      if (this.flipEnabled) {
        this.isFlipped = !this.isFlipped
        this.$emit('card-flip', this.isFlipped)
      }
    },

    // 处理阈值配置按钮点击
    handleThresholdConfig() {
      this.$emit('threshold-config', {
        deviceName: this.deviceName,
        deviceId: this.deviceId
      })
    }
  },
  emits: ['card-flip', 'threshold-config']
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.glass-card-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: rgba(240, 240, 240, 1);
  padding: 20px;
  overflow-x: hidden;
}

/* 卡片容器 */
.box {
  position: relative;
  width: 800px;
  height: 500px;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
  /* 添加外部光晕效果 */
  box-shadow: 0 0 40px rgba(52, 152, 219, 0.3);
}

/* 玻璃卡片 */
.card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    /* 内阴影 */ inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1), /* 外阴影 */ 0 20px 40px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  padding: 25px 30px;
  overflow: hidden;
  /* 渐变边框效果 */
  position: relative;
  z-index: 1;
}

/* 添加渐变边框 */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 30%,
    rgba(255, 255, 255, 0.1) 70%,
    rgba(255, 255, 255, 0.4) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 0;
}

/* 顶部标题栏 - 左右分布 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  z-index: 2;
  min-height: 60px;
  flex-shrink: 0;
  position: relative;
}

/* 设备信息 */
.device-info h2 {
  color: #fff;
  font-size: 2.4rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 8px;
  line-height: 1.2;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #fff, #3498db);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
}

.device-info h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, transparent);
  border-radius: 2px;
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
  backdrop-filter: blur(5px);
}

/* 操作按钮区域 */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.threshold-btn {
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
  position: relative;
  overflow: hidden;
}

.threshold-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.threshold-btn:hover {
  background: rgba(52, 152, 219, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  border-color: rgba(52, 152, 219, 0.4);
}

.threshold-btn:hover::before {
  left: 100%;
}

/* 主要内容区域 */
.content-section {
  display: flex;
  flex: 1;
  min-height: 0;
  gap: 25px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* 左侧内容区域 */
.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* 右侧内容区域 */
.right-section {
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding-left: 25px;
  min-height: 0;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

/* 底部内容区域 */
.footer-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}

/* 悬停效果 */
.box:hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
}

.box:hover .card {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.2),
    0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.box:hover .threshold-btn {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
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

/* 科技感线条装饰 */
.tech-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  border-radius: 20px;
}

.tech-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
}

.tech-line:nth-child(1) {
  top: 20%;
  left: 0;
  width: 100%;
  height: 1px;
  animation: line-glow 3s infinite alternate;
}

.tech-line:nth-child(2) {
  top: 0;
  left: 20%;
  width: 1px;
  height: 100%;
  animation: line-glow 4s infinite alternate-reverse;
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

@keyframes line-glow {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

/* 响应式设计 */
@media (max-width: 850px) {
  .glass-card-container {
    padding: 10px;
  }

  .box {
    width: 100%;
    max-width: 750px;
  }

  .device-info h2 {
    font-size: 2.2rem;
  }

  .right-section {
    width: 250px;
  }

  .threshold-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>
