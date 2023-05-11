<template>
  <div class="app-container">
    <div style="margin: 10px 0 10px 0;">
      <el-input
        v-model="keyword"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入分类名"
        @keyup.enter.native="handleFind"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFind">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleAdd">添加分类</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleDeleteBatch">删除选中</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'createTime', order: 'ascending'}"
      @selection-change="handleSelectionChange"
      @sort-change="changeSort"
    >
      <el-table-column type="selection"/>
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="分类名" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sortName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="分类介绍" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="点击数"
        width="100"
        align="center"
        prop="clickCount"
        sortable="custom"
        :sort-by="['clickCount']"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.clickCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="排序" width="100" align="center" prop="sort" sortable="custom" :sort-by="['sort']">
        <template slot-scope="scope">
          <el-tag type="warning">{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="创建时间"
        width="160"
        align="center"
        prop="createTime"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
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

      <el-table-column label="操作" fixed="right" min-width="230">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑
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
        <el-form-item label="分类名" :label-width="formLabelWidth" prop="sortName">
          <el-input v-model="form.sortName" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="分类介绍" :label-width="formLabelWidth" prop="content">
          <el-input v-model="form.content" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input v-model="form.sort" auto-complete="off"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBlogSortList, addBlogSort, deleteBlogSort, editBlogSort } from '@/api/blog/blogSort'

export default {
  data() {
    return {
      // 多选，用于批量删除
      multipleSelection: [],
      tableData: [],
      keyword: '',
      currentPage: 1,
      pageSize: 6,
      // 总数量
      total: 0,
      title: '增加分类',
      // 控制弹出框
      dialogFormVisible: false,
      formLabelWidth: '120px',
      isEditForm: false,
      orderByDescColumn: '',
      orderByAscColumn: '',
      form: {
        uid: null,
        content: '',
        sortName: ''
      },
      rules: {
        sortName: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在1到10个字符' }
        ],
        sort: [
          { required: true, message: '排序字段不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '排序字段只能为自然数' }
        ]
      }
    }
  },
  created() {
    this.blogSortList()
  },
  methods: {
    blogSortList() {
      const params = {}
      params.keyword = this.keyword
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.orderByDescColumn = this.orderByDescColumn
      params.orderByAscColumn = this.orderByAscColumn
      getBlogSortList(params).then(response => {
        this.tableData = response.data.records
        this.currentPage = response.data.current
        this.pageSize = response.data.size
        this.total = response.data.total
      })
    },
    // 提交表单（添加或者修改）
    submitForm: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isEditForm) {
            editBlogSort(this.form).then(response => {
              if (response.message === '修改成功') {
                this.$message.success(response.message)
                this.dialogFormVisible = false
                this.blogSortList()
              } else {
                this.$message.error(response.message)
              }
            })
          } else {
            addBlogSort(this.form).then(response => {
              if (response.message === '添加成功') {
                this.$message.success(response.message)
                this.dialogFormVisible = false
                this.blogSortList()
              } else {
                this.$message.error(response.message)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 分页
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.blogSortList()
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将把分类删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const blogSortUidList = []
          if (!(row instanceof Array)) {
            blogSortUidList.push(row.uid)
          } else {
            for (let i = 0; i < row.length; i++) {
              blogSortUidList.push(row[i].uid)
            }
          }
          deleteBlogSort(blogSortUidList).then(response => {
            if (response.message === '删除成功') {
              this.$message.success(response.message)
            } else {
              this.$message.error(response.message)
            }
            this.blogSortList()
          })
        })
        .catch(() => {
          this.$message('已取消删除')
        })
    },
    // 编辑
    handleEdit: function(row) {
      this.title = '编辑分类'
      this.dialogFormVisible = true
      this.isEditForm = true
      this.form = row
    },
    // 从后台获取数据,重新排序
    changeSort(val) {
      // 根据当前排序重新获取后台数据,一般后台会需要一个排序的参数
      if (val.order === 'ascending') {
        this.orderByAscColumn = val.prop
        this.orderByDescColumn = ''
      } else {
        this.orderByAscColumn = ''
        this.orderByDescColumn = val.prop
      }
      this.blogSortList()
    },
    // 初始化表单
    getFormObject: function() {
      const formObject = {
        uid: null,
        content: null,
        sortName: null,
        sort: null
      }
      return formObject
    },
    // 添加按钮
    handleAdd() {
      this.title = '增加分类'
      this.dialogFormVisible = true
      this.form = this.getFormObject()
      this.isEditForm = false
    },
    // 查询
    handleFind: function() {
      this.currentPage = 1
      this.blogSortList()
    },
    // 删除选中
    handleDeleteBatch() {
      this.handleDelete(this.multipleSelection)
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
.filter-item {
  margin-right: 12px;
}
</style>
