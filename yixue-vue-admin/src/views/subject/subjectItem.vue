<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div style="margin: 10px 0 10px 0;">
      <el-button type="info" icon="el-icon-document" @click="handleSortByCreateTime(true)">按创建时间倒排</el-button>
      <el-button type="info" icon="el-icon-document" @click="handleSortByCreateTime(false)">按创建时间正排</el-button>
    </div>

    <aside>
      在博客管理添加专题元素，通过拖拽实现专题内列表的排序
    </aside>

    <el-table ref="dragTable" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column label="标题图" width="180px" align="center">
        <template slot-scope="{row}">
          <img
            v-if="row.blog.picture"
            :src="row.blog.picture.txUrl"
            style="width: 130px;height: 70px;"
          >
        </template>
      </el-table-column>

      <el-table-column width="250px" label="标题" align="center">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" :content="row.blog.title" placement="top" @click.native="onClick(row)">
            <span style="cursor:pointer;">{{ strSubstring(row.blog.title, 20) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="作者" align="center">
        <template slot-scope="{row}">
          <span>{{ row.blog.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="是否原创" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.blog.isOriginal==1" type="success">原创</el-tag>
          <el-tag v-if="row.blog.isOriginal==0" type="info">转载</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="分类" align="center">
        <template slot-scope="{row}">
          <span>{{ row.blog.blogSort.sortName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" label="标签" align="center">
        <template slot-scope="{row}">
          <template v-for="(item, index) in row.blog.tagList">
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

      <el-table-column label="排序" width="100" align="center">
        <template slot-scope="scope">
          <el-tag type="warning">{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="danger" size="small" @click="handleDelete(row)">删除
          </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="拖拽" width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {deleteBatchSubjectItem, editSubjectItem, getSubjectItemList, sortByCreateTime} from '@/api/subjectItem'
import Sortable from 'sortablejs'

export default {
  name: 'DragTable',
  data() {
    return {
      list: [],
      // 专题uid
      subjectUid: '',
      sortable: null
    }
  },
  created() {
    // 传递过来的pictureSordUid
    this.subjectUid = this.$route.query.subjectUid
    this.getList()
  },
  methods: {
    getList() {
      const params = {}
      params.subjectUid = this.subjectUid
      params.pageSize = 100
      params.currentPage = 1
      getSubjectItemList(params).then(response => {
        if (response.code === 20000) {
          this.list = response.data.records
          this.subjectUid = response.data.records[0].subjectUid
          this.$nextTick(() => {
            this.setSort()
          })
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将把博客移除该专辑, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {}
          params.uid = row.uid
          const subjectItemList = [params]
          deleteBatchSubjectItem(subjectItemList).then(response => {
            if (response.code === 20000) {
              this.$message.success(response.message)
            } else {
              this.$message.error(response.message)
            }
            this.getList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    strSubstring(str, count) {
      // eslint-disable-next-line eqeqeq
      if (str == null || str == '') {
        return ''
      } else if (str.length > count) {
        return str.substring(0, count) + '...'
      } else {
        return str
      }
    },
    // 跳转到该博客详情
    onClick(row) {
      window.open('http://localhost:9527/#/info?blogUid=' + row.blog.uid)
    },
    // 根据创建时间对专题进行排序
    handleSortByCreateTime(isDesc) {
      if (this.list.length === 0) {
        this.$message.error('没有专题元素，无法进行排序')
        return
      }
      this.$confirm(
        '此操作将根据博客创建时间对所有的专题元素进行升序&降序排列, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const params = new URLSearchParams()
          params.append('subjectUid', this.subjectUid)
          params.append('isDesc', isDesc)
          sortByCreateTime(params).then(response => {
            if (response.code === 20000) {
              this.$message.success(response.message)
              this.getList()
            } else {
              this.$message.error(response.message)
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消批量排序')
        })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const list = this.list
          const targetRow = list.splice(evt.oldIndex, 1)[0]
          list.splice(evt.newIndex, 0, targetRow)
          const subjectList = []
          for (let a = list.length - 1; a >= 0; a--) {
            const params = {}
            params.uid = list[a].uid
            params.blogUid = list[a].blogUid
            params.subjectUid = list[a].subjectUid
            params.sort = list.length - a
            subjectList.push(params)
          }
          editSubjectItem(subjectList).then(response => {
            if (response.code === 20000) {
              this.$message.success(response.message)
              // 刷新当前页面
              this.$router.go(0)
            }
          })
        }
      })
    }
  }
}

</script>

<style lang="scss">
.sortable-ghost {
  opacity: .8;
  color: #fff !important;
  background: #42b983 !important;
}

aside {
  background: #eef1f6;
  padding: 8px 24px;
  margin-bottom: 20px;
  border-radius: 2px;
  display: block;
  line-height: 32px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  a {
    color: #337ab7;
    cursor: pointer;

    &:hover {
      color: rgb(32, 160, 255);
    }
  }
}
</style>

<style scoped>
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
