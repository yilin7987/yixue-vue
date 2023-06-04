<template>
  <div id="table" class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div style="margin: 10px 0 10px 0;">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="button" type="primary" icon="el-icon-refresh" @click="checkAll()">{{ chooseTitle }}</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleDeleteBatch">删除选中</el-button>
    </div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      tab-position="left"
      style="height: 800px; width: 100%;"
      @tab-click="clickTab"
    >
      <el-tab-pane
        v-for="(pictureSort, index) in pictureSorts"
        :key="index"
        style="height: 800px; width: 100%; overflow:auto;"
      >
        <div slot="label" class="sortItem" style="float:left">
          <i class="el-icon-picture" />
          {{ pictureSort.name }}
        </div>

        <el-row>
          <el-col
            v-for="(picture, index) in pictureSort.photoList"
            :key="picture.uid"
            style="padding: 6px"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="6"
            :xl="4"
          >
            <el-card
              :body-style="{ padding: '0px', textAlign: 'center' }"
              shadow="always"
            >
              <input
                :id="picture.uid"
                style="position: absolute;z-index: 100;"
                type="checkbox"
                :checked="pictureUids.indexOf(picture.uid)>=0"
                @click="checked(picture)"
              >
              <el-image
                :src="picture.txUrl"
                style="cursor:pointer"
                fit="scale-down"
                @click="showPicture(picture.txUrl)"
              />
              <!--图片名字-->
              <div @click="showPicture(picture.txUrl)">
                <span v-if="picture.picOldName" class="media-title">{{ picture.picOldName }}</span>
                <span v-else class="media-title">图片 {{ index + 1 }}</span>
              </div>
              <div style="margin-bottom: 14px;">
                <el-button-group>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="复制图片地址"
                    placement="bottom-start"
                    style="margin-right: 2px"
                  >
                    <el-button
                      size="mini"
                      icon="el-icon-copy-document"
                      @click="copyUrl(picture.txUrl)"
                    />
                  </el-tooltip>

                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="复制Markdown格式图片地址"
                    placement="bottom-start"
                    style="margin-right: 2px"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-document-copy"
                      @click="copyMarkdownUrl(picture.picOldName, picture.txUrl)"
                    />
                  </el-tooltip>

                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除图片"
                    placement="bottom-start"
                    style="margin-right: 2px"
                  >
                    <el-button
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      @click="handleDelete(picture.uid)"
                    />
                  </el-tooltip>

                </el-button-group>
              </div>
            </el-card>

          </el-col>
        </el-row>

        <!--分页-->
        <div class="block">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>

    </el-tabs>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">

      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        name="file"
        :action="uploadPictureHost"
        :on-remove="handleRemove"
        :on-success="fileSuccess"
        multiple
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传图片，且不超过5MB</div>
      </el-upload>

    </el-dialog>
    <!--图片展示-->
    <el-dialog :visible.sync="dialogPictureVisible" width="60%" style="text-align: center">
      <img :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
import { getPictureSortList } from '@/api/picture/pictureSort'
import { getPictureList, deletePicture, addPicture } from '@/api/picture/picture'

export default {
  data() {
    return {
      // 图片显示地址
      dialogImageUrl: '',
      // 图片展示框开关
      dialogPictureVisible: false,
      // 图片上传地址
      uploadPictureHost: process.env.VUE_APP_ADMIN_API + '/picture/upload',
      // 当前选中的图片分类uid
      pictureSortUid: undefined,
      // 当前选中的图片分类
      pictureSort: {},
      // 图片uid集合
      pictureUids: [],
      chooseTitle: '全选',
      // 是否全选
      isCheckedAll: false,
      // 显示的图片列表
      tableData: [],
      // 计数器，用于记录上传次数
      count: 0,
      loading: true,
      currentPage: 1,
      pageSize: 12,
      total: null,
      title: '增加图片',
      // 添加框开关
      dialogFormVisible: false,
      // 是否刷新组件
      activeName: '0',
      pictureSorts: [],
      // 是否加载完图片分类
      havePictureSorts: false
    }
  },
  created() {
    // 传递过来的pictureSordUid
    this.pictureSortUid = this.$route.query.pictureSortUid
    this.initPictureSortList()
  },
  methods: {
    initPictureSortList() {
      const params = {}
      params.pageSize = 100
      params.currentPage = 1
      getPictureSortList(params).then((response) => {
        if (response.code === 20000) {
          const pictureSorts = response.data.records
          this.pictureSorts = pictureSorts
          if (pictureSorts.length > 0) {
            const pictureSortUid = this.pictureSortUid
            // 判断是否通过图片分类跳转的
            if (pictureSortUid === undefined) {
              // 当没有被定义的时候，默认加载第一个
              this.pictureSortUid = pictureSorts[0].uid
              // 设置默认选中的图片分类
              this.pictureSort = pictureSorts[0]
            } else {
              // 如果不为空，说明是通过图片分类跳转的，找出当前id所在的角标
              for (let i = 0; i < pictureSorts.length; i++) {
                if (pictureSorts[i].uid === pictureSortUid) {
                  // 设置选中的分类和激活的index
                  this.activeName = '' + i
                  this.pictureSort = pictureSorts[i]
                }
              }
            }
            this.clickTab()
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 点击单选
    checked(data) {
      const idIndex = this.pictureUids.indexOf(data.uid)
      if (idIndex >= 0) {
        // 选过了，去掉
        this.pictureUids.splice(idIndex, 1)
      } else {
        // 没有添加
        this.pictureUids.push(data.uid)
      }
      // console.log('选择列表', this.pictureUids)
    },
    // 添加按钮
    handleAdd() {
      this.dialogFormVisible = true
    },
    // 全选
    checkAll() {
      // 如果是全选
      if (this.isCheckedAll) {
        this.pictureUids = []
        this.isCheckedAll = false
        this.chooseTitle = '全选'
      } else {
        this.pictureUids = []
        this.tableData.forEach(function(picture) {
          this.pictureUids.push(picture.uid)
        }, this)
        this.isCheckedAll = true
        this.chooseTitle = '取消全选'
      }
    },
    // 删除选中
    handleDeleteBatch() {
      if (this.pictureUids.length <= 0) {
        this.$message.error('请先选中图片！')
        return
      }
      this.handleDelete(null)
    },
    handleDelete(uid) {
      this.$confirm('是否删除选中图片？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ary = []
        if (uid !== null) {
          ary.push(uid)
        } else {
          ary = this.pictureUids
        }
        deletePicture(ary).then(response => {
          if (response.message === '删除成功') {
            this.$message.success('删除成功')
            // TODO 刷新
            // 清空选中的列表
            // this.pictureUids = []
            // this.checkedPicture = []
            this.handleCurrentChange(1)
          } else {
            this.$message.error(response.message)
          }
        })
      })
    },
    // 复制图片地址
    copyUrl(url) {
      const oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('Copy')
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    // 复制markdown格式的地址
    copyMarkdownUrl(name, url) {
      const text = '![' + name + '](' + url + ')'
      const oInput = document.createElement('input')
      oInput.value = text
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('Copy')
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    clickTab() {
      const index = this.activeName
      const pictureSortUid = this.pictureSorts[index].uid
      // 当前pictureSortUid
      this.pictureSortUid = pictureSortUid
      // 当前图片分类
      this.pictureSort = this.pictureSorts[index]
      const params = {}
      params.currentPage = 1
      params.picSortUid = pictureSortUid
      params.pageSize = this.pageSize
      getPictureList(params).then((response) => {
        if (response.code === 20000) {
          if (response.data.records.length > 0) {
            this.pictureSort.photoList = response.data.records
            this.pageSize = response.data.size
            this.currentPage = response.data.current
            this.total = response.data.total
            this.tableData = response.data.records
          } else {
            this.pictureSort.photoList = []
            this.total = 0
            this.tableData = []
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 图片显示
    showPicture(url) {
      this.dialogPictureVisible = true
      this.dialogImageUrl = url
    },
    // 分页
    handleCurrentChange(val) {
      // 取消全选
      this.isCheckedAll = true
      this.checkAll()

      const pictureSort = this.pictureSort
      const params = {}
      params.picSortUid = this.pictureSortUid
      params.currentPage = val
      params.pageSize = this.pageSize
      getPictureList(params).then((response) => {
        if (response.code === 20000) {
          pictureSort.photoList = response.data.records
          this.pageSize = response.data.size
          this.currentPage = response.data.current
          this.total = response.data.total
          this.tableData = response.data.records
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 移除上传
    handleRemove() {

    },
    // 图片添加
    fileSuccess(response, file, fileList) {
      if (response.code === 20000) {
        const file = response.data
        const params = {}
        params.picUid = file.uid
        params.picSortUid = this.pictureSortUid
        addPicture(params).then(response => {
          if (response.code === 20000) {
            this.$message.success(response.message)
            this.handleCurrentChange(this.currentPage)
          } else {
            this.$message.error(response.message)
          }
          this.$refs.upload.clearFiles()
        })
      } else {
        this.$message.error(response.message)
      }
    }
  }
}
</script>

<style scoped>
.filter-item {
  margin-left: 15px;
}

.media-title {
  color: #8492a6;
  font-size: 15px;
  padding: 4px;
  display: inline-block;
  white-space: nowrap;
  width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-image {
  width: 100%;
  height: 160px;
}
</style>
