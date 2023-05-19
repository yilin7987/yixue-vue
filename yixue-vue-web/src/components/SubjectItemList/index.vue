<template>
  <el-drawer
      class="drawer"
      title="我是标题"
      :visible.sync="drawer"
      @close="beforeClose"
      direction="ltr"
      :size="drawerSize"
      :with-header="false">

    <div class="block" style="margin:10px;">
      <div style="text-align: center;font-size: 16px;" v-if="!loading && subjectItemlist.length == 0">空空如也</div>

      <div class="lds-css ng-scope" v-if="loading">
        <div style="width:100%;height:100%" class="lds-facebook">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <el-timeline>
        <div class="blogsbox">
          <div
              v-for="item in subjectItemlist"
              :key="item.uid"
              class="blogs"
          >
            <el-timeline-item :timestamp="item.blog.createTime" placement="top">
              <el-card>
                <span class="blogpic">
                  <a href="javascript:void(0);" @click="goToInfo(item.blog.uid)" title>
                    <img v-if="item.blog.picture" :src="item.blog.picture.txUrl" alt>
                  </a>
                </span>
                <p class="blogtext" style="font-weight: bold; cursor: pointer;" @click="goToInfo(item.blog.uid)">
                  {{ item.blog.title }}</p>
                <div class="bloginfo">
                  <ul>
                    <li class="author">
                      <img src="../../../statis/icons/author.svg">
                      <a href="javascript:void(0);" @click="goToAuthor(item.blog.author)">{{ item.blog.author }}</a>
                    </li>
                    <li class="lmname" v-if="item.blog.blogSort">
                      <img src="../../../statis/icons/sort.svg">
                      <a
                          href="javascript:void(0);"
                          @click="goToList(item.blog.blogSort.uid)"
                      >{{ item.blog.blogSort.sortName }}</a>
                    </li>
                    <li class="view">
                      <img src="../../../statis/icons/count.svg">
                      <span>{{ item.blog.clickCount }}</span>
                    </li>
                  </ul>
                </div>
              </el-card>
            </el-timeline-item>
          </div>
        </div>
      </el-timeline>
    </div>

  </el-drawer>
</template>

<script>
import {getSubjectItemList} from "@/api/subject";

export default {
  name: "SubjectItemList",
  props: ["visiable", "subjectUid"],
  watch: {
    visiable: function () {
      this.drawer = this.visiable;
    },
    subjectUid() {
      this.currentPage = 1
      this.subjectItemlist = []
      this.getList()
    }
  },
  data() {
    return {
      drawer: this.visiable,
      subjectItemlist: [],
      pageSize: 50,
      currentPage: 1,
      total: 0,
      loading: true,
      drawerSize: "30%"
    };
  },
  methods: {
    getList() {
      const params = {};
      params.subjectUid = this.subjectUid;
      params.pageSize = this.pageSize;
      params.currentPage = this.currentPage;
      this.loading = true
      getSubjectItemList(params).then(response => {
        if (response.code == 20000) {
          let itemList = response.data.records
          let oldItemList = this.subjectItemlist
          this.currentPage = response.data.current
          this.total = response.data.total
          this.subjectItemlist = oldItemList.concat(itemList);
        }
        this.loading = false
      })
    },
    load() {
      // console.log("加载")
      // this.currentPage = this.currentPage + 1
      // this.getList()
    },
    beforeClose() {
      //取消时，关闭侧边栏
      this.$emit("close", "");
    },
    //跳转到文章详情
    goToInfo(uid) {
      let routeData = this.$router.resolve({
        path: "/info",
        query: {blogUid: uid}
      });
      window.open(routeData.href, '_blank');
    },
    //跳转到搜索详情页
    goToList(uid) {
      this.$router.push({
        path: "/list",
        query: {sortUid: uid}
      });

    },
    //跳转到搜索详情页
    goToAuthor(author) {
      this.$router.push({
        path: "/list",
        query: {author: author}
      });
    },
  }
}
</script>

<style scoped>

/*防止出现两条滚动条*/
/deep/ .el-drawer__body {
  overflow: visible;
}

.blogsbox {
  width: 100%;
  height: 900px;
  overflow-y: scroll;
}

.blogs {
  margin-bottom: 0px;
  padding: 20px;
}

.blogs .blogtext {
  margin-top: 0px;
}

.blogs .blogpic {
  float: left;
  width: 30%;
  max-height: 170px;
  margin-right: 20px;
  display: block;
  overflow: hidden;
}

.blogs .blogpic img {
  width: 100%;
  height: auto;
  -webkit-transition: all 0.6s ease;
  -moz-transition: all 0.6s ease;
  -o-transition: all 0.6s ease;
  transition: all 0.6s ease;
  margin-bottom: 10px
}

.blogs .blogpic :hover img {
  transform: scale(1.1)
}

.bloginfo {
  overflow: hidden;
  margin-top: 30px
}

.bloginfo ul li {
  float: left;
  font-size: 12px;
  padding: 0 10px 0 0;
  color: #748594;
  line-height: 1.5;
  display: inline-block;
}

.bloginfo ul li img {
  display: inline-block;
  margin-right: 4px;
  vertical-align: -0.20em;
}

.bloginfo ul li a {
  color: #748594;
}

.bloginfo ul li a:hover {
  color: #000
}

.ng-scope {
  margin: 0 auto;
  width: 18%;
  height: 10%;
}

@keyframes lds-facebook_1 {
  0% {
    top: 0px;
    height: 200px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

@-webkit-keyframes lds-facebook_1 {
  0% {
    top: 0px;
    height: 200px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

@keyframes lds-facebook_2 {
  0% {
    top: 20px;
    height: 160px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

@-webkit-keyframes lds-facebook_2 {
  0% {
    top: 20px;
    height: 160px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

@keyframes lds-facebook_3 {
  0% {
    top: 40px;
    height: 120px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

@-webkit-keyframes lds-facebook_3 {
  0% {
    top: 40px;
    height: 120px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

.lds-facebook {
  position: relative;
}

.lds-facebook div {
  position: absolute;
  width: 20px;
}

.lds-facebook div:nth-child(1) {
  left: 40px;
  background: #1d0e0b;
  -webkit-animation: lds-facebook_1 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  animation: lds-facebook_1 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}

.lds-facebook div:nth-child(2) {
  left: 90px;
  background: #774023;
  -webkit-animation: lds-facebook_2 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  animation: lds-facebook_2 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}

.lds-facebook div:nth-child(3) {
  left: 140px;
  background: #d88c51;
  -webkit-animation: lds-facebook_3 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  animation: lds-facebook_3 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}

.lds-facebook {
  width: 90px !important;
  height: 90px !important;
  -webkit-transform: translate(-45px, -45px) scale(0.45) translate(45px, 45px);
  transform: translate(-45px, -45px) scale(0.45) translate(45px, 45px);
}
</style>
