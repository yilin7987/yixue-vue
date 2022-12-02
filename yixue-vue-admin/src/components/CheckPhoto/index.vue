<template>
  <div id="body-loading" class="app-container calendar-list-container">
    <el-dialog title="请选择图片" :visible.sync="dialogVisible" width="80%" :before-close="before_close">
      <el-tabs
        v-model="activeName"
        type="border-card"
        tab-position="left"
        style="height: 600px; width: 100%;"
        @tab-click="clickTab"
      >
        <el-tab-pane
          v-for="(pictureSort, index) in pictureSorts"
          :key="index"
          style="height: 570px; width: 100%; overflow:auto;"
        >
          <div slot="label" class="sortItem" style="float:left">
            <i class="el-icon-picture"/>
            {{ submitText(pictureSort.name) }}
          </div>
          <div style="clear:both;"/>
          <div>
            <template v-for="picture in pictureSort.photoList">
              <img
                :key="picture.uid"
                class="showPicture"
                :src="picture.txUrl"
                @click="checked(picture)"
              >
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getPictureSortList } from '@/api/picture/pictureSort'
import { getPictureList } from '@/api/picture/picture'

export default {
  props: ['photoVisible'],

  data() {
    return {
      // 图片
      picture: {},
      // 对话框显示开关
      dialogVisible: this.photoVisible,
      pictureSorts: [], // 分类列表
      activeName: 0
    }
  },
  watch: {
    photoVisible: function() {
      this.dialogVisible = this.photoVisible
    }
  },
  created() {
    this.dialogVisible = this.photoVisible

    const params = {}
    // 全部把分类加载出来，如果分类很多的话，不能这么做
    params.pageSize = 500
    params.currentPage = 1
    params.isShow = 1
    getPictureSortList(params).then(response => {
      if (response.code === 20000) {
        this.pictureSorts = response.data.records
        if (this.pictureSorts.length > 0) {
          const params = {}
          params.picSortUid = this.pictureSorts[0].uid
          params.pageSize = 24
          params.currentPage = 1
          // 获取图片
          getPictureList(params).then(response => {
            if (response.code === 20000) {
              this.pictureSorts[0].photoList = response.data.records
            } else {
              this.$message.error('图片加载失败')
            }
          })
        }
      } else {
        this.$message.error(response.message)
      }
    })
  },
  methods: {
    // 切换分类
    clickTab() {
      const index = this.activeName
      if (this.pictureSorts[index].photoList == null) {
        const params = {}
        params.picSortUid = this.pictureSorts[index].uid
        params.pageSize = 24
        params.currentPage = 1
        // 获取图片
        getPictureList(params).then(response => {
          if (response.code === 20000) {
            this.pictureSorts[index].photoList = response.data.records
          } else {
            this.$message.error('图片加载失败')
          }
        })
      }
    },
    checked(picture) {
      this.$emit('choose_data', picture)
    },
    // 缩写分类名字
    submitText: function(str) {
      let result = ''
      if (str.length > 6) {
        result = str.substring(0, 6) + '...'
      } else {
        result = str
      }
      return result
    },
    // 关闭对话框
    before_close(done) {
      // 取消时，开始状态
      this.$emit('cancelModel', '')
      done()
    }
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  min-height: 400px;
}

.sortItem {
  height: 38px;
  font-size: 16px;
}

.showPicture {
  width: 195px;
  height: 105px;
  float: left;
  margin: 30px 10px 0 10px;
  border: solid 1px #c7aeae;
}

.ChooseBody {
  width: 195px;
  height: 105px;
  float: left;
  margin-left: 10px;
  margin-top: 20px;
  border: solid 1px #c7aeae;
}

.inputClass {
  position: absolute;
}

.addPicture {
  width: 195px;
  height: 105px;
  float: left;
  margin-left: 10px;
  margin-top: 30px;
  border: solid 1px #c7aeae;
  line-height: 105px;
  text-align: center;
  cursor: pointer;
}

.addPicture span {
  font-size: 30px;
  color: #97a8be;
  height: 60px;
  margin: 0 auto;
}

.pagination {
  position: absolute;
  bottom: 5%;
  left: 38%;
}
</style>
