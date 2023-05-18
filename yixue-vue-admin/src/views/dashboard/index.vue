<template>
  <div class="dashboard-container">
    <!-- 顶部内容 -->
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money" @click="btnClick('1')">
            <svg-icon icon-class="eye" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日浏览数：</div>
            <count-to class="card-panel-num" :start-val="0" :end-val="visitTotal" :duration="3200" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people" @click="btnClick('2')">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户数:</div>
            <count-to class="card-panel-num" :start-val="0" :end-val="userTotal" :duration="2600" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message" @click="btnClick('3')">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">评论数：</div>
            <count-to class="card-panel-num" :start-val="0" :end-val="commentTotal" :duration="3000" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shoppingCard" @click="btnClick('4')">
            <svg-icon icon-class="form" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">文章数:</div>
            <count-to class="card-panel-num" :start-val="0" :end-val="blogTotal" :duration="3600" />
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 分类图-->
    <el-row type="flex" justify="space-around" :gutter="32" >
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart
            v-if="showPieBlogSortChart"
            ref="blogSortPie"
            :value="blogCountByBlogSort"
            :tag-name="blogSortNameArray"
            @clickPie="clickBlogSortPie"
          />
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart
            v-if="showPieChart"
            :value="blogCountByTag"
            :tag-name="tagNameArray"
            @clickPie="clickBlogTagPie"
          />
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import PieChart from '@/components/PieChart'
import {getBlogCountByBlogSort, getBlogCountByTag, init} from '@/api'

export default {
  components: {
    CountTo, PieChart
  },
  data() {
    return {
      // 浏览数
      visitTotal: 0,
      // 用户数
      userTotal: 0,
      // 评论数
      commentTotal: 0,
      // 博客数
      blogTotal: 0,
      // 博客分类图
      showPieBlogSortChart: false,
      blogCountByBlogSort: [],
      blogSortNameArray: [],
      // 标签分类图
      showPieChart: false,
      blogCountByTag: [],
      tagNameArray: [],
    }
  },
  created() {
    init().then(response => {
      if (response.code === 20000) {
        this.blogTotal = response.data.blogCount
        this.commentTotal = response.data.commentCount
        this.userTotal = response.data.userCount
        this.visitTotal = response.data.visitCount
      }
    })

    // 通过标签获取博客数目
    getBlogCountByTag().then(response => {
      if (response.code === 20000) {
        this.blogCountByTag = response.data
        const tagList = this.blogCountByTag
        for (let a = 0; a < this.blogCountByTag.length; a++) {
          this.tagNameArray.push(tagList[a].name)
        }
        this.showPieChart = true
      }
    })

    // 通过博客分类获取博客数目
    getBlogCountByBlogSort().then(response => {
      if (response.code === 20000) {
        this.blogCountByBlogSort = response.data
        // blogCountByBlogSort:[{name,value,BlogSortUid}]
        const blogSortList = this.blogCountByBlogSort
        for (let a = 0; a < this.blogCountByBlogSort.length; a++) {
          this.blogSortNameArray.push(blogSortList[a].name)
        }
        this.showPieBlogSortChart = true
      }
    })
  },
  methods: {
    clickBlogTagPie(index) {
      const tag = this.blogCountByTag[index]
      this.$router.push({
        path: '/blog/blog',
        query: { tag: tag }
      })
    },
    clickBlogSortPie(index) {
      const blogSort = this.blogCountByBlogSort[index]
      this.$router.push({
        path: '/blog/blog',
        query: { blogSort: blogSort }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 20px;
  }
}

.btn {
  width: 80px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  display: inline-block;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.btnClick {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.statistics-item {
  width: 600px;
  height: 400px;
  float: left;
  margin: 20px auto;
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shoppingCard {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shoppingCard {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px 0 0 70px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
