<!-- 
* @Description 
-->
<template>
  <div class="component-detail-modal" v-if="selectedComponentDetail">
    <div class="modal-backdrop" @click="setSelectedComponentDetail(null)"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fas fa-cube"></i> {{ selectedComponentDetail.name }}</h3>
        <button class="modal-close" @click="setSelectedComponentDetail(null)">
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
            <button class="detail-action-btn" @click="explodeComponent(selectedComponentDetail.id)">
              <i class="fas fa-expand-alt"></i> 分解查看
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex/dist/vuex.common.js';

export default {
  name: 'ParameterModal',
  computed: {
    ...mapState('home', ['selectedComponentDetail', 'componentPosition'])
  },
  methods: {
    ...mapMutations('home', ['setSelectedComponentDetail']),
    getStatusText(status) {
      const statusMap = {
        online: '在线',
        offline: '离线',
        warning: '警告',
        error: '故障'
      }
      return statusMap[status] || '未知'
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
.component-detail-modal {
  position: absolute;
  bottom: 20px;
  left: 20px;
  // width: 100%;
  // height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;

  .modal-backdrop {
    // position: absolute;
    // top: 0;
    // left: 0;
    // width: 100%;
    // height: 100%;
    // background: rgba(0, 0, 0, 0.3);
    // backdrop-filter: blur(4px);
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
          width: 250px;
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
</style>
