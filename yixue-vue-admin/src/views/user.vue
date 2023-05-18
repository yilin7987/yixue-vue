<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div style="margin: 10px 0 10px 0;">
      <el-input
        v-model="keyword"
        clearable
        placeholder="请输入用户名"
        style="width: 200px;margin-right: 20px"
        @keyup.enter.native="handleFind"
      />

      <el-button icon="el-icon-search" type="primary" @click="handleFind">查找</el-button>

      <el-button type="primary" icon="el-icon-edit" @click="handleAdd">添加用户</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'createTime', order: 'descending'}"
      @sort-change="changeSort"
    >
      <el-table-column type="selection"/>

      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="头像" width="120">
        <template slot-scope="scope">
          <img
            :src="scope.row.avatar ? scope.row.photoUrl:defaultAvatar"
            onerror="onerror=null;src=defaultAvatar"
            style="width: 100px;height: 100px;"
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="昵称" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="登录次数"
        width="100"
        prop="loginCount"
        sortable="custom"
        :sort-by="['loginCount']"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.loginCount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录IP" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginIp }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="最后登录时间"
        width="160"
        prop="lastLoginTime"
        sortable="custom"
        :sort-by="['lastLoginTime']"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.status == 1">
            <span>正常</span>
          </template>
          <template v-if="scope.row.status == 2">
            <span>冻结</span>
          </template>
          <template v-if="scope.row.status == 0">
            <span>已删除</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" min-width="250">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" type="primary" @click="handleUpdatePassword(scope.row)">重置密码
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div>
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="用户头像">
          <div v-if="form.avatar" class="imgBody">
            <i v-show="icon" class="el-icon-error inputClass" @click="deletePhoto()" @mouseover="icon = true"/>
            <img :src="form.photoUrl" @mouseout="icon = false" @mouseover="icon = true">
          </div>

          <div v-else class="uploadImgBody" @click="checkPhoto">
            <i class="el-icon-plus avatar-uploader-icon"/>
          </div>
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="9">
            <el-form-item :label-width="formLabelWidth" label="用户名" prop="userName">
              <el-input v-model="form.userName"/>
            </el-form-item>
          </el-col>

          <el-col :span="9">
            <el-form-item :label-width="formLabelWidth" label="昵称" prop="nickName">
              <el-input v-model="form.nickName"/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="24">
          <el-col :span="9">
            <el-form-item :label-width="formLabelWidth" label="QQ号" prop="qqNumber">
              <el-input v-model="form.qqNumber" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item :label-width="formLabelWidth" label="职业">
              <el-input v-model="form.occupation" auto-complete="off"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="9">
            <el-form-item :label-width="formLabelWidth" label="邮箱" prop="email">
              <el-input v-model="form.email" auto-complete="off"/>
            </el-form-item>
          </el-col>

          <el-col :span="9">
            <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
              <el-radio
                v-for="gender in genderDictList"
                :key="gender.uid"
                v-model="form.gender"
                :label="gender.dictValue"
                border
                size="medium"
              >{{ gender.dictLabel }}
              </el-radio>
            </el-form-item>
          </el-col>

        </el-row>

        <el-form-item :label-width="formLabelWidth" label="简介">
          <el-input
            v-model="form.summary"
            :autosize="{ minRows: 3, maxRows: 10}"
            placeholder="请输入内容"
            style="width: 70%"
            type="textarea"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <avatar-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :height="300"
      :url="url"
      :width="300"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>
<script>
import {addUser, deleteUser, editUser, getUserList, resetUserPassword} from '@/api/user/user'
import AvatarCropper from '@/components/AvatarCropper'

export default {
  components: { AvatarCropper },
  data() {
    return {
      genderDictList: [{ uid: 1, dictLabel: '男', dictValue: '1' }, { uid: 2, dictLabel: '女', dictValue: '2' }],
      // 控制删除图标的显示
      icon: false,
      // 头像框显示
      imagecropperShow: false,
      imagecropperKey: 0,
      url: process.env.VUE_APP_ADMIN_API + '/avatar/upload',
      tableData: [],
      keyword: '',
      currentPage: 1,
      pageSize: 10,
      // 总数量
      total: 0,
      title: '增加用户',
      // 控制弹出框
      dialogFormVisible: false,
      formLabelWidth: '120px',
      isEditForm: false,
      form: {
        uid: null
      },
      // 默认头像
      defaultAvatar: 'https://gitee.com/moxi159753/wx_picture/raw/master/picture/favicon.png',
      // 降序字段
      orderByDescColumn: '',
      // 升序字段
      orderByAscColumn: '',
      rules: {
        userName: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 5, max: 30, message: '长度在5到30个字符'}
        ],
        nickName: [
          {required: true, message: '昵称不能为空', trigger: 'blur'},
          {min: 1, max: 30, message: '长度在1到30个字符'}
        ],
        gender: [
          {required: true, message: '性别不能为空', trigger: 'blur'}
        ],
        email: [
          {pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '请输入正确的邮箱'}
        ],
        qqNumber: [
          {pattern: /[1-9]([0-9]{5,11})/, message: '请输入正确的QQ号码'}
        ]
      }
    }
  },
  created() {
    const nickName = this.$route.query.nickName
    if (nickName !== undefined) {
      this.keyword = nickName
    }
    this.userList()
  },
  methods: {
    // 从后台获取数据,重新排序
    changeSort(val) {
      // 根据当前排序重新获取后台数据,一般后台会需要一个排序的参数
      if (val.order == 'ascending') {
        this.orderByAscColumn = val.prop
        this.orderByDescColumn = ''
      } else {
        this.orderByAscColumn = ''
        this.orderByDescColumn = val.prop
      }
      this.userList()
    },
    userList() {
      const params = {}
      params.keyword = this.keyword
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.orderByDescColumn = this.orderByDescColumn
      params.orderByAscColumn = this.orderByAscColumn
      getUserList(params).then(response => {
        if (response.code === 20000) {
          this.tableData = response.data.records
          console.log(this.tableData)
          this.currentPage = response.data.current
          this.pageSize = response.data.size
          this.total = response.data.total
        }
      })
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.form.photoUrl = resData.avatarUrl
      this.form.avatar = resData.uid
    },
    // 关闭显示框
    close() {
      this.imagecropperShow = false
    },
    // 删除图片
    deletePhoto() {
      this.form.photoUrl = null
      this.form.avatar = ''
      this.icon = false
    },
    // 弹出选择图片框
    checkPhoto() {
      this.imagecropperShow = true
    },
    getFormObject() {
      const formObject = {
        uid: null
      }
      return formObject
    },
    // 查找
    handleFind() {
      this.currentPage = 1
      this.userList()
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form = this.getFormObject()
      this.isEditForm = false
    },
    handleEdit(row) {
      this.title = '编辑用户'
      this.dialogFormVisible = true
      this.isEditForm = true
      this.form = row
    },
    handleDelete(row) {
      this.$confirm('此操作将把用户删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {}
          params.uid = row.uid
          deleteUser(params).then(response => {
            if (response.code === 20000) {
              this.$message.success(response.message)
              this.userList()
            } else {
              this.$message.error(response.message)
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handleUpdatePassword(row) {
      this.$confirm('此操作将把用户密码重置为初始密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {}
          params.uid = row.uid
          resetUserPassword(params).then(response => {
            if (response.code === 20000) {
              this.$message.success(response.message)
              this.userList()
            } else {
              this.$message.success(response.message)
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消重置')
        })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.userList()
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isEditForm) {
            editUser(this.form).then(response => {
              if (response.code === 20000) {
                this.$notify({
                  title: '成功',
                  message: response.message,
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.userList()
              } else {
                this.$notify.error({
                  title: '失败',
                  message: response.message
                })
              }
            })
          } else {
            addUser(this.form).then(response => {
              if (response.code === 20000) {
                this.$notify({
                  title: '成功',
                  message: response.message,
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.userList()
              } else {
                this.$notify.error({
                  title: '失败',
                  message: response.message
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  margin: 0 0 0 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.imgBody {
  width: 100px;
  height: 100px;
  border: solid 2px #ffffff;
  float: left;
  position: relative;
}

.uploadImgBody {
  margin-left: 5px;
  width: 100px;
  height: 100px;
  border: dashed 1px #c0c0c0;
  float: left;
  position: relative;
}

.uploadImgBody :hover {
  border: dashed 1px #00ccff;
}

.inputClass {
  position: absolute;
}

img {
  width: 100px;
  height: 100px;
}
</style>
