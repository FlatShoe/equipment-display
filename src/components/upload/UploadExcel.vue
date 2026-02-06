<!-- 
* @Description 上传解析excel
-->
<template>
  <div class="upload-excel">
    <el-form ref="form" label-width="80px">
      <!-- <el-form-item>
        <el-button type="primary" size="mini" @click="download">下载模版</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-upload
          drag
          action=""
          :auto-upload="false"
          accept=".xls, .xlsx"
          :on-change="handleChange"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as XLSL from 'xlsx'
import {getHeaderRow} from '@/utils/upload-excel'
export default {
  name: 'UploadExcel',
  props: {
    template: {
      type: String,
      default: '/public/模版.xlsx'
    },
    onSuccess: {
      type: Function
    }
  },
  methods: {
    download() {
      const a = document.createElement('a')
      a.href = this.template
      a.download = '模版.xlsx'
      a.target = '_blank'
      a.click()
    },
    /*
     * @Description 添加触发
     */
    handleChange(file) {
      const raw = file.raw
      if (!raw) return
      this.readerData(file.name, raw)
    },
    readerData(name, file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSL.read(data, {type: 'array'})
          const firstSheetName = workbook.SheetNames[0]
          const workSheet = workbook.Sheets[firstSheetName]
          const header = getHeaderRow(workSheet)
          const results = XLSL.utils.sheet_to_json(workSheet)
          this.generateData(name, {header, results})
          resolve()
        }
        reader.readAsArrayBuffer(file)
      })
    },
    generateData(name, excelData) {
      this.onSuccess(name, excelData)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-excel {
  display: flex;
}
</style>
