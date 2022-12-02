<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div style="margin: 10px 0 10px 0;">
      <el-input
        v-model="keyword"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入标签名"
        @keyup.enter.native="handleFind"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFind">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleAdd">添加标签</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleDeleteBatch">删除选中</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'sort', order: 'descending'}"
      @selection-change="handleSelectionChange"
      @sort-change="changeSort"
    >
      <el-table-column type="selection"/>

      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标签名" width="100" align="center">
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

      <el-table-column
        label="排序"
        width="100"
        align="center"
        prop="sort"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
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
        :sort-by="['createTime']"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="更新时间"
        width="160"
        align="center"
        prop="updateTime"
        sortable="custom"
        :sort-by="['updateTime']"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
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
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除
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

        <el-form-item label="标签名" :label-width="formLabelWidth" prop="content">
          <el-input v-model="form.content"/>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input v-model="form.sort"/>
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
import { getTagList, addTag, editTag, deleteTag } from '@/api/blog/tag'

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
      title: '增加标签',
      // 控制弹出框
      dialogFormVisible: false,
      formLabelWidth: '120px',
      isEditForm: false,
      // 降序字段
      orderByDescColumn: '',
      // 升序字段
      orderByAscColumn: '',
      form: {
        content: '',
        sort: null
      },
      rules: {
        content: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在1到12个字符' }
        ],
        sort: [
          { required: true, message: '排序字段不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '排序字段只能为自然数' }
        ]
      }
    }
  },
  created() {
    this.tagList()
  },
  methods: {
    // 初始化表单
    getFormObject() {
      const formObject = {
        uid: null,
        content: null,
        clickCount: 0,
        sort: null
      }
      return formObject
    },
    // 添加按钮事件
    handleAdd() {
      this.title = '增加标签'
      this.dialogFormVisible = true
      this.form = this.getFormObject()
      this.isEditForm = false
    },
    // 查找
    handleFind() {
      this.currentPage = 1
      this.tagList()
    },
    // 获取数据
    tagList() {
      const params = {}
      params.keyword = this.keyword
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.orderByDescColumn = this.orderByDescColumn
      params.orderByAscColumn = this.orderByAscColumn
      getTagList(params).then(response => {
        this.tableData = response.data.records
        this.currentPage = response.data.current
        this.pageSize = response.data.size
        this.total = response.data.total
      })
    },
    // 添加或者编辑标签
    submitForm: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isEditForm) {
            editTag(this.form).then(response => {
              if (response.code === 20000) {
                this.$message.success(response.message)
                this.dialogFormVisible = false
                this.tagList()
              } else {
                this.$message.error(response.message)
              }
            })
          } else {
            addTag(this.form).then(response => {
              if (response.code === 20000) {
                this.$message.success(response.message)
                this.dialogFormVisible = false
                this.tagList()
              } else {
                this.$message.error(response.message)
              }
            })
          }
        } else {
          return
        }
      })
    },
    // 分页
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.tagList()
    },
    // 批量删除
    handleDeleteBatch() {
      this.handleDelete(this.multipleSelection)
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将把标签删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const tagUidList = []
          if (!(row instanceof Array)) {
            tagUidList.push(row.uid)
          } else {
            for (let i = 0; i < row.length; i++) {
              tagUidList.push(row[i].uid)
            }
          }
          deleteTag(tagUidList).then(response => {
            if (response.message === '删除成功') {
              this.$message.success(response.message)
            } else {
              this.$message.error(response.message)
            }
            this.tagList()
          })
        })
        .catch(() => {
          this.$message('已取消删除')
        })
    },
    // 编辑按钮
    handleEdit: function(row) {
      this.title = '编辑标签'
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
      this.tagList()
    },
    // 多选改变触发
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
