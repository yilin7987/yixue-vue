<template>
  <div class="app-container">
    <div style="margin: 10px 0 10px 0;">
      <el-form
        :inline="true"
        label-width="68px"
        style="margin-bottom: 8px;"
      >
        <el-input
          v-model="queryParams.keyword"
          clearable
          class="filter-item conditionForm"
          style="width: 150px;"
          placeholder="请输入博客名"
          @keyup.enter.native="handleFind"
        />

        <el-select
          v-model="queryParams.sortKeyword"
          style="width: 140px"
          filterable
          clearable
          remote
          reserve-keyword
          class="conditionForm"
          placeholder="请输入分类名"
          :remote-method="sortRemoteMethod"
          :loading="loading"
          @keyup.enter.native="handleFind"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.uid"
            :label="item.sortName"
            :value="item.uid"
          />
        </el-select>

        <el-select
          v-model="queryParams.tagKeyword"
          value-key="uid"
          filterable
          clearable
          remote
          reserve-keyword
          class="conditionForm"
          placeholder="请输入标签名"
          :remote-method="tagRemoteMethod"
          :loading="loading"
          style="width:140px"
          @keyup.enter.native="handleFind"
        >
          <el-option
            v-for="item in tagOptions"
            :key="item.uid"
            :label="item.content"
            :value="item"
          />
        </el-select>

        <el-select
          v-model="queryParams.levelKeyword"
          clearable
          placeholder="推荐等级"
          style="width:110px"
          class="conditionForm"
        >
          <el-option
            v-for="item in blogLevel"
            :key="item.uid"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="queryParams.publishKeyword"
          clearable
          placeholder="是否发布"
          style="width:110px"
          class="conditionForm"
        >
          <el-option
            v-for="item in blogPublish"
            :key="item.uid"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="queryParams.originalKeyword"
          clearable
          placeholder="是否原创"
          style="width:110px"
          class="conditionForm"
        >
          <el-option
            v-for="item in blogOriginal"
            :key="item.uid"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="queryParams.typeKeyword"
          clearable
          placeholder="文章类型"
          style="width:110px"
          class="conditionForm"
        >
          <el-option
            v-for="item in blogType"
            :key="item.uid"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-button
          style="margin-left: 10px;"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFind"
        >查找
        </el-button>

      </el-form>
      <el-row :gutter="10" style="margin-bottom: 8px;">
        <el-col :span="1.5">
          <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleAdd">添加博客</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleDeleteBatch">删除选中
          </el-button>
        </el-col>

        <el-col :span="1.5">
          <div style="margin-bottom: 10px;"/>
          操作栏
          <el-switch
            v-model="isOperation"
            class="filter-item"
            active-text="显示"
          />
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="articleTable"
      :data="tableData"
      :default-sort="{prop: 'createTime', order: 'descending'}"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="changeSort"
    >
      <el-table-column type="selection"/>

      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题图" width="160" align="center">
        <template slot-scope="scope">
          <img
            v-if="scope.row.picture"
            :src="scope.row.picture.txUrl"
            style="width: 130px;height: 90px;"
          >
        </template>
      </el-table-column>

      <el-table-column label="标题" width="110" align="center">
        <template slot-scope="scope">
          <span style="cursor:pointer;">{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="作者" width="70" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="是否原创"
        width="100"
        align="center"
        prop="isOriginal"
        sortable="custom"
        :sort-by="['isOriginal']"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isOriginal==1" type="success">原创</el-tag>
          <el-tag v-if="scope.row.isOriginal==0" type="info">转载</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="分类" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.blogSort.sortName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标签" width="100" align="center">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.tagList">
            <el-tag
              v-if="item"
              :key="index"
              style="margin-left: 3px"
              type="warning"
            >{{ item.content }}
            </el-tag>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="推荐等级" width="100" align="center" prop="level" sortable="custom" :sort-by="['level']">
        <template slot-scope="scope">
          <template v-for="item in blogLevel">
            <el-tag
              v-if="scope.row.level == item.value"
              :key="item.uid"
            >{{ item.label }}
            </el-tag>
          </template>
        </template>
      </el-table-column>

      <el-table-column
        label="点击数"
        width="90"
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
        label="开启评论"
        width="100"
        align="center"
        prop="openComment"
        sortable="custom"
        :sort-by="['openComment']"
      >
        <template slot-scope="scope">
          <template v-for="item in open">
            <el-tag
              v-if="scope.row.openComment === item.value"
              :key="item.uid"
            >{{ item.label }}
            </el-tag>
          </template>
        </template>
      </el-table-column>

      <el-table-column
        label="发布状态"
        width="100"
        align="center"
        prop="isPublish"
        sortable="custom"
        :sort-by="['isPublish']"
      >
        <template slot-scope="scope">
          <template v-for="item in blogPublish">
            <el-tag
              v-if="scope.row.isPublish === item.value"
              :key="item.uid"
            >{{ item.label }}
            </el-tag>
          </template>
        </template>
      </el-table-column>

      <el-table-column
        v-if="!isOperation"
        label="创建时间"
        width="150"
        align="center"
        prop="createTime"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="isOperation" align="center" label="操作" min-width="150">
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
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      :before-close="closeDialog"
      width="92% "
    >
      <el-form ref="form" :model="form" :rules="rules">

        <el-row>
          <el-col :span="16">
            <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
              <el-input v-model="form.title"/>
            </el-form-item>

            <el-form-item label="简介" :label-width="formLabelWidth">
              <el-input v-model="form.summary"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="标题图" :label-width="formLabelWidth">
              <div v-if="form.picture" class="imgBody">
                <i
                  v-show="icon"
                  class="el-icon-error inputClass"
                  @click="deletePhoto()"
                  @mouseover="icon = true"
                />
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
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6.5">
            <el-form-item label="分类" :label-width="formLabelWidth" prop="blogSortUid">
              <el-select
                v-model="form.blogSortUid"
                size="small"
                placeholder="请选择"
                style="width:150px"
              >
                <el-option
                  v-for="item in sortOptions"
                  :key="item.uid"
                  :label="item.sortName"
                  :value="item.uid"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6.5">
            <el-form-item label="标签" label-width="80px" prop="tagList">
              <el-select
                v-model="form.tagList"
                value-key="uid"
                multiple
                size="small"
                placeholder="请选择"
                style="width:210px"
                filterable
              >
                <el-option
                  v-for="item in tagOptions"
                  :key="item.uid"
                  :label="item.content"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6.5">
            <el-form-item label="推荐等级" :label-width="maxLineLabelWidth" prop="level">
              <el-select v-model="form.level" size="small" placeholder="请选择" style="width:210px">
                <el-option
                  v-for="item in blogLevel"
                  :key="item.uid"
                  :label="item.label"
                  :value="parseInt(item.value)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6.5">
            <el-form-item label="是否原创" :label-width="formLabelWidth" prop="isOriginal">
              <el-radio-group v-model="form.isOriginal" size="small">
                <el-radio v-for="item in blogOriginal" :key="item.uid" class="radio" :label="item.value" border>
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="6.5">
            <el-form-item label="文章类型" :label-width="formLabelWidth" prop="openComment">
              <el-radio
                v-for="item in blogType"
                :key="item.uid"
                v-model="form.type"
                class="radio"
                :label="item.value"
                border
                size="small"
              >{{ item.label }}
              </el-radio>
            </el-form-item>
          </el-col>

          <el-col :span="6.5">
            <el-form-item label="文章评论" :label-width="formLabelWidth" prop="openComment">
              <el-radio
                v-for="item in open"
                :key="item.uid"
                v-model="form.openComment"
                class="radio"
                :label="item.value"
                border
                size="small"
              >{{ item.label }}
              </el-radio>
            </el-form-item>
          </el-col>

          <el-col :span="4.5">
            <el-form-item label="是否发布" :label-width="lineLabelWidth" prop="isPublish">
              <el-radio-group v-model="form.isPublish" size="small">
                <el-radio v-for="item in blogPublish" :key="item.uid" class="radio" :label="item.value" border>
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="form.isOriginal==0" label="作者" :label-width="formLabelWidth" prop="author">
          <el-input v-model="form.author" auto-complete="off"/>
        </el-form-item>

        <el-form-item v-if="form.isOriginal==0" label="文章出处" :label-width="formLabelWidth">
          <el-input v-model="form.articlesPart" auto-complete="off"/>
        </el-form-item>

        <el-form-item v-if="form.type == 1" label="外链" :label-width="formLabelWidth" prop="outsideLink">
          <el-input v-model="form.outsideLink" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="内容" :label-width="formLabelWidth" prop="content">

          <mavon-editor
            ref="md"
            v-model="form.content"
            style="min-height: 400px; width: 1100px"
            @change="change"
          />
        </el-form-item>

        <el-form-item style="float: right; margin-right: 20px;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button @click="$refs.form.resetFields()">重置</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <CheckPhoto
      :photo-visible="photoVisible"
      @choose_data="getChooseData"
      @cancelModel="cancelModel"
    />
  </div>
</template>

<script>
import { getBlogList, addBlog, editBlog, deleteBlog } from '@/api/blog/blog'
import { getBlogSortList } from '@/api/blog/blogSort'
import { getTagList } from '@/api/blog/tag'
import { mavonEditor } from 'mavon-editor' // 引入mavon-editor组件
import 'mavon-editor/dist/css/index.css' // 引入组件的样式
import CheckPhoto from '../../components/CheckPhoto'

export default {
  components: {
    mavonEditor,
    CheckPhoto
  },
  data() {
    return {
      // 是否是修改操作
      isEditBlog: false,
      // 控制图片选择器的显示
      photoVisible: false,
      // 控制图片删除图标的显示
      icon: false,
      lineLabelWidth: '120px', // 一行的间隔数
      maxLineLabelWidth: '100px',
      formLabelWidth: '120px',
      // 弹出框标题
      title: '增加博客',
      // 控制弹出框显示(添加或者修改)
      dialogFormVisible: false,
      // 多选，用于批量删除
      multipleSelection: [],
      // 搜索条件
      queryParams: {
        keyword: '',
        tagKeyword: null, // 标签搜索
        sortKeyword: '', // 分类搜索
        levelKeyword: '', // 等级搜索
        publishKeyword: '', // 发布 搜索
        originalKeyword: '', // 原创 搜索
        typeKeyword: '' // 文章类型
      },
      // 第几页
      currentPage: 1,
      // 几条
      pageSize: 10,
      // 标签候选框
      tagOptions: [],
      // 分类候选框
      sortOptions: [],
      // 搜索框加载状态
      loading: false,
      // 博客推荐等级
      // region
      blogLevel: [{
        uid: 0,
        value: '0',
        label: '正常'
      }, {
        uid: 1,
        value: '1',
        label: '一级推荐'
      }, {
        uid: 2,
        value: '2',
        label: '二级推荐'
      }, {
        uid: 3,
        value: '3',
        label: '三级推荐'
      }, {
        uid: 4,
        value: '4',
        label: '四级推荐'
      }],
      // endregion
      // 博客是否发布
      // region
      blogPublish: [{
        uid: 1,
        value: '1',
        label: '发布'
      }, {
        uid: 0,
        value: '0',
        label: '下架'
      }],
      // endregion
      // 文章类型
      // region
      blogType: [{
        uid: 0,
        value: '0',
        label: '博客'
      }, {
        uid: 1,
        value: '1',
        label: '推广'
      }],
      // endregion
      // 博客原创默认值
      // region
      blogOriginal: [{
        uid: 1,
        value: '1',
        label: '原创'
      }, {
        uid: 0,
        value: '0',
        label: '转载'
      }],
      // endregion
      // 是否启动评论
      // region
      open: [{
        uid: 1,
        value: '1',
        label: '开启'
      }, {
        uid: 0,
        value: '0',
        label: '关闭'
      }],
      // endregion
      // 降序字段
      orderByDescColumn: '',
      // 升序字段
      orderByAscColumn: '',
      // 博客数据
      tableData: [],
      // 总数量
      total: 0,
      // 操作栏开关
      isOperation: false,
      // 初始表单
      initform: {
        uid: '',
        title: '',
        summary: '',
        content: '',
        tagList: [],
        picture: null,
        // 是否原创
        isOriginal: '1',
        isPublish: '1',
        // 是否开启评论
        openComment: '1',
        // 作者
        author: '',
        type: '0',
        clickCount: 0,
        // 文章出处
        articlesPart: '',
        // 外链
        outsideLink: ''
      },
      // 表单数据
      form: {
        uid: '',
        title: '',
        summary: '',
        content: '',
        tagList: [],
        picture: null,
        // 是否原创
        isOriginal: '1',
        isPublish: '1',
        // 是否开启评论
        openComment: '1',
        // 作者
        author: '',
        type: '0',
        clickCount: 0,
        // 文章出处
        articlesPart: '',
        // 外链
        outsideLink: ''
      },
      // 表单验证规则
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        blogSortUid: [
          { required: true, message: '分类不能为空', trigger: 'blur' }
        ],
        tagList: [
          { required: true, message: '标签不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '推荐等级不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '推荐等级只能为自然数' }
        ],
        isPublish: [
          { required: true, message: '发布字段不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '发布字段只能为自然数' }
        ],
        isOriginal: [
          { required: true, message: '原创字段不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '原创字段只能为自然数' }
        ],
        openComment: [
          { required: true, message: '网站评论不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '网站评论只能为自然数' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        outsideLink: [
          { required: true, message: '外链地址不能为空', trigger: 'blur' },
          { pattern: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/, message: '请输入有效的URcreatedL' }
        ]
      }
    }
  },
  created() {
    this.sortRemoteMethod()
    this.tagRemoteMethod()
    this.blogList()
  },
  methods: {
    // 关闭图片选择框
    cancelModel() {
      this.photoVisible = false
    },
    getChooseData(data) {
      this.photoVisible = false
      this.form.picture = data
    },
    change(value, render) { // value为编辑器中的实际内容，即markdown的内容，render为被解析成的html的内容
    },
    // 操作blog（添加或者修改）
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 添加博客操作
          if (!this.isEditBlog) {
            addBlog(this.form).then(response => {
              if (response.message === '添加成功') {
                this.$message.success(response.message)
                this.form = this.initform
                this.dialogFormVisible = false
                this.blogList()
              } else {
                this.$message.error(response.message)
                this.dialogFormVisible = false
              }
            })
            // console.log(this.form)
          } else {
            editBlog(this.form).then(response => {
              if (response.message === '修改成功') {
                this.$message.success(response.message)
                this.$refs.form.resetFields()
                this.dialogFormVisible = false
                this.blogList()
              } else {
                this.$message.error(response.message)
                this.$refs.form.resetFields()
                this.dialogFormVisible = false
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 选择图片框
    checkPhoto() {
      this.photoVisible = true
    },
    deletePhoto: function() {
      this.form.picture = null
    },
    // 关闭窗口
    closeDialog(done) {
      if (this.isEditBlog) {
        this.form = this.initform
      }
      done()
    },
    // 删除选中
    handleDeleteBatch() {
      this.handleDelete(this.multipleSelection)
    },
    // 添加博客按钮点击事件
    handleAdd() {
      this.title = '增加博客'
      this.dialogFormVisible = true
      this.isEditBlog = false
    },
    // 页面改变时触发
    handleCurrentChange(val) {
      this.currentPage = val
      this.blogList()
    },
    // 编辑blog按钮
    handleEdit(row) {
      this.title = '修改博客'
      this.dialogFormVisible = true
      this.isEditBlog = true
      this.form = row
      // console.log(this.form)
    },
    // 删除blog
    handleDelete(row) {
      this.$confirm('此操作将把博客删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const blogUidList = []
        if (!(row instanceof Array)) {
          blogUidList.push(row.uid)
        } else {
          for (let i = 0; i < row.length; i++) {
            blogUidList.push(row[i].uid)
          }
        }
        deleteBlog(blogUidList).then(response => {
          if (response.message === '删除成功') {
            this.$message.success(response.message)
            this.blogList()
          } else {
            this.$message.error(response.message)
          }
        })
      })
        .catch(() => {
          this.$message('已取消删除')
        })
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
      this.blogList()
    },
    // 改变多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFind: function() {
      this.currentPage = 1
      this.blogList()
    },
    // 获取博客列表
    blogList() {
      const params = {}
      params.keyword = this.queryParams.keyword
      params.blogSortUid = this.queryParams.sortKeyword
      let tagList = null
      // console.log(this.queryParams.tagKeyword)
      if (this.queryParams.tagKeyword !== null && this.queryParams.tagKeyword !== '') {
        tagList = []
        tagList.push(this.queryParams.tagKeyword)
      }
      params.tagList = tagList
      params.levelKeyword = this.queryParams.levelKeyword
      params.isPublish = this.queryParams.publishKeyword
      params.isOriginal = this.queryParams.originalKeyword
      params.type = this.queryParams.typeKeyword
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.orderByDescColumn = this.orderByDescColumn
      params.orderByAscColumn = this.orderByAscColumn
      getBlogList(params).then(response => {
        if (response.code === 20000) {
          this.tableData = response.data.records
          this.currentPage = response.data.current
          this.pageSize = response.data.size
          this.total = response.data.total
        }
      })
      // console.log(params)
    },
    // 分类远程搜索函数
    sortRemoteMethod: function(query) {
      const params = {}
      params.pageSize = 10
      params.currentPage = 1
      if (query !== '') {
        params.keyword = query
        getBlogSortList(params).then(response => {
          this.sortOptions = response.data.records
        })
      } else {
        getBlogSortList(params).then(response => {
          this.sortOptions = response.data.records
        })
      }
    },
    // 标签远程搜索函数
    tagRemoteMethod: function(query) {
      const params = {}
      params.pageSize = 10
      params.currentPage = 1
      if (query !== '') {
        params.keyword = query
        getTagList(params).then(response => {
          this.tagOptions = response.data.records
        })
      } else {
        getTagList(params).then(response => {
          this.tagOptions = response.data.records
        })
      }
    }
  }
}
</script>

<style>
.radio {
  margin-right: 10px;
}

.conditionForm {
  margin-right: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
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
