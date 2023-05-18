<template>
  <div id="" class="app-container">
    <el-dialog title="请选择需要添加的专题" :visible.sync="dialogVisible" fullscreen :before-close="before_close">

      <el-row>
        <el-col
          v-for="(item) in tableData"
          :key="item.uid"
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
              :id="item.uid"
              style="position: absolute;z-index: 100;"
              type="checkbox"
              :checked="selectUids.indexOf(item.uid)>=0"
              @click="checked(item)"
            >
            <el-image
              :src="item.picture.txUrl"
              style="cursor:pointer;"
              fit="scale-down"
              @click="checked(item)"
            />
            <div>
              <span v-if="item.subjectName" class="media-title">{{ item.subjectName }}</span>
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

      <span slot="footer">
        <el-button @click="before_close">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import {
  getSubjectList
} from '@/api/subject'

export default {
  props: ['subjectVisible'],
  data() {
    return {
      // 弹框是否显示
      dialogVisible: this.subjectVisible,
      // 专题列表
      tableData: [],
      // 选择的专题uid
      selectUids: [],
      currentPage: 1,
      pageSize: 18,
      total: null,
    }
  },
  watch: {
    subjectVisible() {
      this.dialogVisible = this.subjectVisible
    }
  },
  created() {
    this.subjectList()
  },
  methods: {
    subjectList() {
      const params = {}
      params.pageSize = this.pageSize
      params.currentPage = this.currentPage
      getSubjectList(params).then(response => {
        if (response.code === 20000) {
          this.tableData = response.data.records
          this.currentPage = response.data.current
          this.pageSize = response.data.size
          this.total = response.data.total
        } else {
          this.$message({
            type: 'error',
            message: response.data
          })
        }
      })
    },
    before_close(done) {
      // 取消时，开始状态
      this.$emit('cancelModel', '')
      done()
    },
    // 点击单选
    checked(data) {
      // 单选
      this.selectUids = []
      this.selectUids.push(data.uid)
    },
    // 改变页码
    handleCurrentChange(val) {
      this.currentPage = val // 改变当前所指向的页数
      this.subjectList()
    },
    commit() {
      if (this.selectUids.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选中需要加入的专题!'
        })
        return
      }
      this.$emit('selectData', this.selectUids)
    }
  }
}
</script>

<style scoped>
.media-title {
  color: #8492a6;
  font-size: 14px;
  padding: 14px;
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
