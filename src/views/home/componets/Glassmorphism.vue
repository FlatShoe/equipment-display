<!-- Glassmorphism.vue -->
<template>
  <div class="glassmorphism-card" :style="computedStyles" :class="[shadowClass, borderClass]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Glassmorphism',

  props: {
    /**
     * 模糊强度
     * @type {number}
     * @default 10
     */
    blur: {
      type: Number,
      default: 20
    },
    /**
     * 透明度
     * @type {number}
     * @default 0.2
     */
    opacity: {
      type: Number,
      default: 0.5
    },
    /**
     * 背景色
     * @type {string}
     * @default 'rgba(255, 255, 255, 0.4)'
     */
    backgroundColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.5)'
    },
    /**
     * 边框颜色
     * @type {string}
     * @default 'rgba(255, 255, 255, 0.5)'
     */
    borderColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.7)'
    },
    /**
     * 边框宽度
     * @type {number}
     * @default 1
     */
    borderWidth: {
      type: Number,
      default: 2
    },
    /**
     * 圆角大小
     * @type {number}
     * @default 20
     */
    borderRadius: {
      type: Number,
      default: 20
    },
    /**
     * 阴影强度
     * @type {string}
     * @default 'soft'
     */
    shadow: {
      type: String,
      default: 'strong',
      validator: function (value) {
        return ['none', 'soft', 'medium', 'strong'].includes(value)
      }
    },
    /**
     * 边框样式
     * @type {string}
     * @default 'solid'
     */
    borderStyle: {
      type: String,
      default: 'solid',
      validator: function (value) {
        return ['none', 'solid', 'gradient'].includes(value)
      }
    },
    /**
     * 内边距
     * @type {string}
     * @default '24px'
     */
    padding: {
      type: String,
      default: '24px'
    },
    /**
     * 是否显示悬浮效果
     * @type {boolean}
     * @default true
     */
    hoverEffect: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    computedStyles() {
      return {
        '--glass-blur': `${this.blur}px`,
        '--glass-opacity': this.opacity,
        '--glass-bg-color': this.backgroundColor,
        '--glass-border-color': this.borderColor,
        '--glass-border-width': `${this.borderWidth}px`,
        '--glass-border-radius': `${this.borderRadius}px`,
        '--glass-padding': this.padding
      }
    },

    shadowClass() {
      const shadows = {
        none: 'no-shadow',
        soft: 'shadow-soft',
        medium: 'shadow-medium',
        strong: 'shadow-strong'
      }
      return shadows[this.shadow]
    },

    borderClass() {
      const borders = {
        none: 'no-border',
        solid: 'border-solid',
        gradient: 'border-gradient'
      }
      return borders[this.borderStyle]
    },

    hoverClass() {
      return this.hoverEffect ? 'has-hover' : ''
    }
  }
}
</script>

<style scoped>
.glassmorphism-card {
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  background: var(--glass-bg-color);
  border-radius: var(--glass-border-radius);
  padding: var(--glass-padding);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-sizing: border-box;
}

/* 毛玻璃效果层 */
.glassmorphism-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: var(--glass-opacity);
  z-index: -1;
  border-radius: inherit;
}

/* 阴影效果 */
.shadow-soft {
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.07), inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.shadow-medium {
  box-shadow: 0 15px 35px rgba(31, 38, 135, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.shadow-strong {
  box-shadow: 0 20px 50px rgba(31, 38, 135, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.no-shadow {
  box-shadow: none;
}

/* 边框样式 */
.border-solid {
  border: var(--glass-border-width) solid var(--glass-border-color);
}

.border-gradient {
  border: var(--glass-border-width) solid transparent;
  background-clip: padding-box, border-box;
  background-origin: border-box;
  background-image: linear-gradient(to bottom right, var(--glass-bg-color), var(--glass-bg-color)),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
}

.no-border {
  border: none;
}

/* 悬浮效果 */
.has-hover:hover {
  transform: translateY(-2px);
  backdrop-filter: blur(calc(var(--glass-blur) + 2px));
  -webkit-backdrop-filter: blur(calc(var(--glass-blur) + 2px));
  box-shadow: 0 20px 40px rgba(31, 38, 135, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .glassmorphism-card {
    padding: calc(var(--glass-padding) * 0.8);
    border-radius: calc(var(--glass-border-radius) * 0.8);
  }
}

/* 适配移动端触摸 */
@media (hover: none) {
  .has-hover:hover {
    transform: none;
  }
}

/* 针对不支持 backdrop-filter 的浏览器提供备用样式 */
@supports not (backdrop-filter: blur(10px)) {
  .glassmorphism-card {
    background: rgba(255, 255, 255, 0.9);
  }
}
</style>
