<template>
  <div id="table" class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div style="margin: 10px 0 10px 0;">
      <el-input
        v-model="keyword"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入分类名称"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFind"
      >查找
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
      >添加
      </el-button>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="selection"/>

      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题图" width="160" align="center">
        <template slot-scope="scope">
          <img
            v-if="scope.row.picture"
            :src="scope.row.picture.txUrl"
            style="width: 130px;height: 70px;"
            alt="图片加载失败"
          >
        </template>
      </el-table-column>

      <el-table-column label="分类名" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="排序" width="100" align="center">
        <template slot-scope="scope">
          <el-tag type="warning">{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="图片选择器显示" width="150" align="center">
        <template slot-scope="scope">
          <template v-for="item in yesNoDictList">
            <el-tag
              v-if="scope.row.isShow === item.dictValue"
              :key="item.uid"
              :type="item.listClass"
            >{{ item.dictLabel }}
            </el-tag>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.status == 1">
            <span>正常</span>
          </template>
          <template v-if="scope.row.status == 2">
            <span>推荐</span>
          </template>
          <template v-if="scope.row.status == 0">
            <span>已删除</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="315">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="handleManager(scope.row)">图片列表</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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

        <el-form-item label="封面" :label-width="formLabelWidth">
          <div v-if="form.picture" class="imgBody">
            <i v-show="icon" class="el-icon-error inputClass" @click="deletePhoto()" @mouseover="icon = true"/>
            <img
              :src="form.picture.txUrl"
              style="display:inline; width: 195px;height: 105px;"
              @mouseover="icon = true"
              @mouseout="icon = false"
            >
          </div>
          <div v-else class="uploadImgBody" @click="checkPhoto">
            <i class="el-icon-plus avatar-uploader-icon"/>
          </div>
        </el-form-item>

        <el-form-item label="标题" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="图片选择器显示" :label-width="formLabelWidth" prop="isShow">
          <el-radio-group v-model="form.isShow" size="small">
            <el-radio v-for="item in yesNoDictList" :key="item.uid" :label="parseInt(item.dictValue)" border>
              {{ item.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input v-model="form.sort" auto-complete="off"/>
        </el-form-item>

        <el-form-item v-if="!isEditForm" label="tip" :label-width="formLabelWidth">
          <el-tag type="success">首次创建图片分类，可以先不设置封面，待到有图片时在设置即可</el-tag>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
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

<script>
import { getPictureSortList, deletePictureSort, editPictureSort, addPictureSort } from '@/api/picture/pictureSort'
import CheckPhoto from '../../components/CheckPhoto'

export default {
  components: {
    CheckPhoto
  },
  data() {
    return {
      tableData: [],
      form: {
        uid: null,
        name: null,
        fileUid: null,
        picture: null
      },
      loading: true,
      // 控制增加框和修改框的显示
      dialogVisible: false,
      currentPage: 1,
      total: null,
      pageSize: 6,
      keyword: '',
      title: '增加分类',
      // 弹框的label边框
      formLabelWidth: '120px',
      dialogFormVisible: false,
      isEditForm: false,
      // 控制图片选择器的显示
      photoVisible: false,
      photoList: [],
      // 是否字典
      yesNoDictList: [{
        uid: '1',
        dictValue: 1,
        dictLabel: '是',
        listClass: 'success'
      }, {
        uid: '0',
        dictValue: 0,
        dictLabel: '否',
        listClass: 'warning'
      }],
      // 控制删除图标的显示
      icon: false,
      rules: {
        name: [
          { required: true, message: '标题不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1到20个字符' }
        ],
        sort: [
          { required: true, message: '排序字段不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '排序字段只能为自然数' }
        ]
      }
    }
  },
  created() {
    this.pictureSortList()
  },
  methods: {
    pictureSortList() {
      const params = {}
      params.keyword = this.keyword
      params.pageSize = this.pageSize
      params.currentPage = this.currentPage
      getPictureSortList(params).then(response => {
        this.tableData = response.data.records
        this.currentPage = response.data.current
        this.pageSize = response.data.size
        this.total = response.data.total
      })
    },
    // 查询
    handleFind() {
      this.currentPage = 1
      this.pictureSortList()
    },
    // 跳转到该分类的图片管理
    handleManager(row) {
      const uid = row.uid
      this.$router.push({
        path: 'picture',
        query: { pictureSortUid: uid }
      })
    },
    // 初始表单
    getFormObject: function() {
      const formObject = {
        uid: null,
        name: null,
        fileUid: null,
        sort: 0,
        isShow: 1
      }
      return formObject
    },
    // 弹出选择图片框
    checkPhoto() {
      this.photoVisible = true
    },
    getChooseData(data) {
      this.photoVisible = false
      this.form.picture = data
      this.form.fileUid = this.form.picture.uid
    },
    // 关闭图片选择框
    cancelModel() {
      this.photoVisible = false
    },
    deletePhoto() {
      this.form.picture = null
      this.form.fileUid = ''
    },
    // 改变页码
    handleCurrentChange(val) {
      // 改变当前所指向的页数
      this.currentPage = val
      this.pictureSortList()
    },
    // 点击新增
    handleAdd() {
      this.title = '增加分类'
      this.dialogFormVisible = true
      this.form = this.getFormObject()
      this.isEditForm = false
    },
    // 点击编辑
    handleEdit(row) {
      this.title = '编辑分类'
      this.dialogFormVisible = true
      this.isEditForm = true
      this.form = row
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将把分类删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {}
          params.uid = row.uid
          deletePictureSort(params).then(response => {
            if (response.message === '删除成功') {
              this.$message.success(response.message)
            } else {
              this.$confirm('该分类还有图片，继续会删除分类下的所有图片，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                params.isDelete = 1
                deletePictureSort(params).then(response => {
                  if (response.message === '删除成功') {
                    this.$message.success(response.message)
                  }
                  this.pictureSortList()
                })
              }).catch(() => {
                this.$message.info('已取消删除')
              })
            }
            this.pictureSortList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isEditForm) {
            editPictureSort(this.form).then(response => {
              this.$message.success(response.message)
              this.dialogFormVisible = false
              this.pictureSortList()
            })
          } else {
            addPictureSort(this.form).then(response => {
              this.$message.success(response.message)
              // this.$message.error(response.message)
              this.dialogFormVisible = false
              this.pictureSortList()
            })
          }
        } else {
          return
        }
      })
    }
  }
}
</script>
<style scoped>
.filter-item {
  margin-left: 15px;
}

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
  width: 195px;
  height: 105px;
  line-height: 105px;
  text-align: center;
}

.imgBody {
  width: 195px;
  height: 105px;
  border: solid 2px #ffffff;
  float: left;
  position: relative;
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

.inputClass {
  position: absolute;
}
</style>
