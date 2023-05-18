<template>
  <div id="table" class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div style="margin: 10px 0 10px 0;">
      <el-input v-model="keyword" clearable style="width: 200px; margin-right: 20px" placeholder="请输入专题名称" />
      <el-button type="primary" icon="el-icon-search" @click="handleFind">查找</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="checkAll">{{ chooseTitle }}</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="handleDeleteBatch">删除选中</el-button>
    </div>
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
          style="position: relative"
          shadow="always"
        >
          <div class="subjectName">{{ item.subjectName }}</div>
          <input
            :id="item.uid"
            style="position: absolute;z-index: 100;"
            type="checkbox"
            :checked="selectUids.indexOf(item.uid)>=0"
            @click="checked(item)"
          >
          <el-image
            v-if="item.picture"
            :src="item.picture.txUrl"
            style="cursor:pointer"
            fit="scale-down"
            @click="goSubjectItem(item)"
          />
          <div>
            <span v-if="item.subjectName" class="media-title">{{ item.summary }}</span>
          </div>
          <div style="margin-bottom: 14px;">
            <el-button-group>
              <el-tooltip
                class="item"
                effect="dark"
                content="专题Item"
                placement="bottom-start"
                style="margin-right: 2px"
              >
                <el-button
                  size="mini"
                  icon="el-icon-copy-document"
                  @click="goSubjectItem(item)"
                />
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="编辑专题"
                placement="bottom-start"
                style="margin-right: 2px"
              >
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-document-copy"
                  @click="handleEdit(item)"
                />
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="删除专题"
                placement="bottom-start"
                style="margin-right: 2px"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDelete(item)"
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="封面图" :label-width="formLabelWidth" prop="fileUid">
          <div v-if="form.picture" class="imgBody">
            <i v-show="icon" class="el-icon-error inputClass" @click="deletePhoto()" @mouseover="icon = true" />
            <img
              :src="form.picture.txUrl"
              style="display:inline; width: 195px;height: 105px;"
              @mouseover="icon = true"
              @mouseout="icon = false"
            >
          </div>
          <div v-else class="uploadImgBody" @click="checkPhoto">
            <i class="el-icon-plus avatar-uploader-icon" />
          </div>
        </el-form-item>

        <el-form-item label="专题名" :label-width="formLabelWidth" prop="subjectName">
          <el-input v-model="form.subjectName" auto-complete="off" />
        </el-form-item>

        <el-form-item label="专题简介" :label-width="formLabelWidth">
          <el-input v-model="form.summary" type="textarea" auto-complete="off" />
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input v-model="form.sort" auto-complete="off" />
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <CheckPhoto
      :photo-visible="photoVisible"
      @choose_data="getChooseData"
      @cancelModel="cancelModel"
    />

  </div>
</template>

<script setup>
import { addSubject, deleteBatchSubject, editSubject, getSubjectList } from '@/api/subject'
import CheckPhoto from '@/components/CheckPhoto/index.vue';

export default {
  components: {
    CheckPhoto
  },
  data() {
    return {
      keyword: '',
      // 控制删除图标的显示
      icon: false,
      // 弹框的label边框
      formLabelWidth: '120px',
      chooseTitle: '全选',
      // 数据
      tableData: [],
      // 是否全选
      isCheckedAll: false,
      // 专题uid集合
      selectUids: [],
      // 页码
      currentPage: 1,
      pageSize: 18,
      total: null,
      title: '增加专题',
      // 弹框显示
      dialogFormVisible: false,
      form: {},
      rules: {
        fileUid: [
          { required: true, message: '封面图片不能为空', trigger: 'blur' }
        ],
        subjectName: [
          { required: true, message: '专题名不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1到20个字符' }
        ],
        sort: [
          { required: true, message: '排序字段不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '排序字段只能为自然数' }
        ]
      },
      // 控制图片选择器的显示
      photoVisible: false,
      isEditForm: false
    }
  },
  created() {
    this.subjectList()
  },
  methods: {
    getChooseData(data) {
      this.photoVisible = false
      this.form.picture = data
      this.form.fileUid = this.form.picture.uid
    },
    // 关闭图片选择框
    cancelModel() {
      this.photoVisible = false
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isEditForm) {
            // 编辑
            editSubject(this.form).then(response => {
              if (response.code === 20000) {
                this.$message.success(response.message)
                this.dialogFormVisible = false
                this.subjectList()
              } else {
                this.$message.error(response.message)
              }
            })
          } else {
            // 新增
            addSubject(this.form).then(response => {
              if (response.code === 20000) {
                this.$message.success(response.message)
                this.dialogFormVisible = false
                this.subjectList()
              } else {
                this.$message.error(response.message)
              }
            })
          }
        }
      })
    },
    // 弹出选择图片框
    checkPhoto() {
      this.photoVisible = true
    },
    // 获取专题列表
    subjectList() {
      const params = {}
      params.keyword = this.keyword
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      getSubjectList(params).then(response => {
        this.tableData = response.data.records
        this.currentPage = response.data.current
        this.pageSize = response.data.size
        this.total = response.data.total
      })
    },
    // 查找专题
    handleFind() {
      this.currentPage = 1
      this.subjectList()
    },
    // 初始化表单
    getFormObject() {
      const formObject = {
        uid: null,
        subjectName: null,
        summary: null,
        fileUid: null,
        sort: 0
      }
      return formObject
    },
    // 点击新增
    handleAdd() {
      this.title = '增加专题'
      this.dialogFormVisible = true
      // 初始化表单
      this.form = this.getFormObject()
      this.isEditForm = false
    },
    checkAll() {
      // 如果是全选
      if (this.isCheckedAll) {
        this.selectUids = []
        this.isCheckedAll = false
        this.chooseTitle = '全选'
      } else {
        this.selectUids = []
        this.tableData.forEach(function(picture) {
          this.selectUids.push(picture.uid)
        }, this)
        this.isCheckedAll = true
        this.chooseTitle = '取消全选'
      }
    },
    // 删除选中
    handleDeleteBatch() {
      if (this.selectUids.length <= 0) {
        this.$message.error('请先选中需要删除的内容！')
        return
      }
      this.$confirm('此操作将把选中的专题删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const deleteList = []
          for (let i = 0; i < this.selectUids.length; i++) {
            const params = {}
            params.uid = this.selectUids[i]
            deleteList.push(params)
          }
          deleteBatchSubject(deleteList).then(response => {
            if (response.code === 20000) {
              this.$message.success(response.message)
            } else {
              this.$message.error(response.message)
            }
            this.subjectList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 点击单选
    checked(data) {
      const idIndex = this.selectUids.indexOf(data.uid)
      if (idIndex >= 0) {
        // 选过了
        this.selectUids.splice(idIndex, 1)
      } else {
        this.selectUids.push(data.uid)
      }
    },
    // 跳转
    goSubjectItem(row) {
      const uid = row.uid
      this.$router.push({
        path: 'subjectItem',
        query: { subjectUid: uid }
      })
    },
    // 点击编辑
    handleEdit(row) {
      this.title = '编辑专题'
      this.dialogFormVisible = true
      this.isEditForm = true
      this.form = row
    },
    // 点击删除
    handleDelete(row) {
      this.$confirm('此操作将会把该专题删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = []
          params.push(row)
          deleteBatchSubject(params).then(response => {
            if (response.code === 20000) {
              this.$message.success(response.message)
            } else {
              this.$message.error(response.message)
            }
            this.subjectList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 改变页码
    handleCurrentChange(val) {
      this.currentPage = val
      this.subjectList()
    },
    deletePhoto() {
      this.form.picture = null
      this.form.fileUid = ''
    }
  }
}
</script>

<style scoped>
.el-image {
  width: 100%;
  height: 160px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 195px;
  height: 105px;
  line-height: 105px;
  text-align: center;
}
.uploadImgBody {
  margin-left: 5px;
  width: 195px;
  height: 105px;
  border: dashed 1px #c0c0c0;
  float: left;
  position: relative;
}

.uploadImgBody :hover {
  border: dashed 1px #00ccff;
}
.imgBody {
  width: 195px;
  height: 105px;
  border: solid 2px #ffffff;
  float: left;
  position: relative;
}
.subjectName {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 2;
  /*top: 15px;*/
  background: rgba(232, 40, 74, .8);
  color: #FFF;
  padding: 3px 8px;
  font-size: 12px;
  border-radius: 3px;
}

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
.inputClass {
  position: absolute;
}
</style>
