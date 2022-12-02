<template>
  <div>
    <aside>
      首先在博客管理中，设置推荐等级。然后通过拖动列表，调节推荐博客的显示的优先级<br/>
      一级推荐：轮播图<br/>
      二级推荐：轮播图右侧<br/>
      三级推荐：特别推荐<br/>
      四级推荐：推荐文章
    </aside>
    <div class="components-container board">
      <Kanban :key="1" level="1" :list="list1" class="kanban first" header-text="一级推荐" @change="change"/>
      <Kanban :key="2" level="1" :list="list2" class="kanban second" header-text="二级推荐" @change="change"/>
      <Kanban :key="3" level="1" :list="list3" class="kanban third" header-text="三级推荐" @change="change"/>
      <Kanban :key="4" level="1" :list="list4" class="kanban fourth" header-text="四级推荐" @change="change"/>
    </div>
  </div>
</template>
<script>
import Kanban from '@/components/Recommend'
import { getBlogList, editRecommendBlog } from '@/api/blog/blog'

export default {
  name: 'DragKanbanDemo',
  components: {
    Kanban
  },
  data() {
    return {
      group: 'mission',
      list1: [],
      list2: [],
      list3: [],
      list4: []
    }
  },
  created() {
    this.blogList(1)
    this.blogList(2)
    this.blogList(3)
    this.blogList(4)
  },
  methods: {
    blogList(level) {
      const params = {}
      params.levelKeyword = level
      params.currentPage = 1
      params.pageSize = 10
      params.useSort = 1
      getBlogList(params).then(response => {
        if (response.code === 20000) {
          switch (level) {
            case 1: {
              this.list1 = response.data.records
              break
            }
            case 2: {
              this.list2 = response.data.records
              break
            }
            case 3: {
              this.list3 = response.data.records
              break
            }
            case 4: {
              this.list4 = response.data.records
              break
            }
          }
        }
      })
    },
    change(list, level) {
      for (let i = 0; i < list.length; i++) {
        list[i].sort = list.length - i
      }
      editRecommendBlog(list).then(response => {
        if (response.message !== '拖拽成功') {
          this.$message.error(response.message)
          this.blogList(parseInt(level))
        }
      })
    }
  }
}
</script>
<style lang="scss">

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

.board {
  width: 100%;
  margin-left: 3px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}

.kanban {
  &.first {
    .board-column-header {
      background: #409EFF;
    }
  }

  &.second {
    .board-column-header {
      background: #E6A23C;
    }
  }

  &.third {
    .board-column-header {
      background: #F56C6C;
    }
  }

  &.fourth {
    .board-column-header {
      background: #67C23A;
    }
  }
}
</style>
