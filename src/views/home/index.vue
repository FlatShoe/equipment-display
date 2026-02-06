<!-- 
* @Description 首页
-->
<template>
  <div class="home">
    <div class="equipment-display-container equipment-display-container-hook"></div>
  </div>
</template>

<script>
import EquipmentDisplay from './index'
window.equipmentDisplay = null
import ControlBar from './control-bar/index.vue'
import ParameterPanel from './parameter-panel/index.vue'
import ComponentPanel from './component-panel/index.vue'
import ParameterPanelTexture from './parameter-panel-texture/index.vue'
import ParameterModal from './parameter-modal/index.vue'
export default {
  name: 'Home',
  components: {
    ControlBar,
    ParameterPanel,
    ComponentPanel,
    ParameterPanelTexture,
    ParameterModal
  },
  data() {
    return {}
  },
  methods: {
    init() {
      const container = document.querySelector('.equipment-display-container-hook')
      equipmentDisplay = new EquipmentDisplay(container)
      equipmentDisplay.onLoad(display => {
        display.on('click', data => {
          console.log('点击了设备:', data.point)
        })
      })
    },
    // 添加参数面板到3D场景
    async addParameterPanelTo3D() {
      if (!window.equipmentDisplay || !window.equipmentDisplay) {
        console.error('Three.js场景未初始化')
        return
      }

      try {
        // 调用参数面板组件的方法创建纹理平面
        await this.$refs.parameterTextureRef.createTexturePlane(
          window.equipmentDisplay.scene.getScene(),
          {
            x: 3,
            y: 2,
            z: 0,
            rotationY: -0.3
          }
        )

        console.log('参数面板已添加到3D场景')
      } catch (error) {
        console.error('添加参数面板失败:', error)
      }
    }
  },
  mounted() {
    queueMicrotask(() => {
      this.init()
    })
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .equipment-display-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
