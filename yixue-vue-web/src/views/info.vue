<template>
  <article>
    <el-dialog :visible.sync="dialogPictureVisible" fullscreen>
      <img :src="dialogImageUrl" alt="dialogImageUrl" style="margin: 0 auto;"/>
    </el-dialog>
    <h1 class="t_nav">
      <a href="/" class="n1">网站首页</a>
      <a
          href="javascript:void(0);"
          v-if="blogData.blogSort.uid"
          @click="goToSortList(blogData.blogSort.uid)"
          class="n2"
      >{{ blogData.blogSort ? blogData.blogSort.sortName : "" }}</a>
    </h1>
    <div class="infosbox">
      <div class="newsview">
        <h3 class="news_title" v-if="blogData.title">{{ blogData.title }}</h3>
        <div class="bloginfo" v-if="blogData.blogSort.uid">
          <ul>
            <li class="author">
              <img src="../../statis/icons/author.svg">
              <a href="javascript:void(0);" @click="goToAuthor(blogData.author)">{{ blogData.author }}</a>
            </li>
            <li class="lmname">
              <img src="../../statis/icons/sort.svg">
              <a
                  href="javascript:void(0);"
                  @click="goToSortList(blogData.blogSort.uid)"
              >{{ blogData.blogSort ? blogData.blogSort.sortName : "" }}</a>
            </li>
            <li class="createTime">
              <img src="../../statis/icons/createTime.svg">
              {{ blogData.createTime }}
            </li>
            <li class="view">
              <img src="../../statis/icons/count.svg">
              {{ blogData.clickCount }}
            </li>
          </ul>
        </div>
        <div class="tags">
          <template v-if="blogData.tagList">
            <a
                v-for="item in blogData.tagList"
                :key="item.uid"
                href="javascript:void(0);"
                @click="goToTagList(item.uid)"
                target="_blank"
            >{{ item.content }}</a>
          </template>
        </div>
        <div class="news_about">
          <strong>版权</strong>
          <span v-html="blogData.copyright">
            {{ blogData.copyright }}
          </span>
        </div>
        <!-- 博客内容 -->
        <div id="blogContent"
             class="markdown-body"
             v-html="blogContent"
        >
        </div>
        <Praise :blogUid="blogUid"
                :praiseCount.sync="blogData.collectCount"
                :isLogin="$store.state.user.isLogin">
        </Praise>

      </div>
      <!--相关文章-->
      <div class="otherlink" v-if="sameBlogData.length > 0">
        <h2>相关文章</h2>
        <ul>
          <li v-for="item in sameBlogData" :key="item.uid">
            <a href="javascript:void(0);"
               @click="goToInfo(item.uid)"
               :title="item.title">
              {{ subText(item.title, 18) }}
            </a>
          </li>
        </ul>
      </div>
      <!--评论区-->
      <div class="news_pl">
        <h2>文章评论</h2>
        <ul>
          <CommentBox
              :userInfo="userInfo"
              @submit-box="submitBox"
          ></CommentBox>
          <div class="message_infos">
            <Comment :comments="comments"
                     :blogUid="blogUid"
                     @submit="submit"
            ></Comment>
            <div class="noComment" v-if="comments.length == 0">
              还没有评论，快来抢沙发吧！
            </div>
          </div>
        </ul>
      </div>
    </div>
    <!--目录-->
    <side-catalog :class="catalogCss" v-bind="catalogProps"></side-catalog>

  </article>
</template>

<script>
import {getBlogByUid, getSimilarityBlogUid} from "@/api/blog/blog"
import Praise from "@/components/Praise"
// import Praise from "../components/Praise";
// import {mavonEditor} from 'mavon-editor' // 引入mavon-editor组件
import "vue-side-catalog/lib/vue-side-catalog.css";
import SideCatalog from "vue-side-catalog";
import "github-markdown-css/github-markdown.css"
import Comment from "../components/Comment";
import CommentBox from "../components/CommentBox";
import {addComment, getCommentList} from "@/api/comment";
import {mapMutations} from "vuex";

export default {
  name: "info",
  components: {SideCatalog, CommentBox, Comment, Praise},
  data() {
    return {
      // 目录列表数
      catalogSum: 0,
      //目录css
      catalogCss: 'catalog',
      showSideCatalog: true,
      showSidebar: true, //是否显示侧边栏
      blogContent: '',
      catalogProps: {
        // 内容容器selector(必需)
        container: "#blogContent",
        watch: true,
        levelList: ["h1", "h2", "h3"], // 使h1作为一级目录
      },
      loadingInstance: null, // loading对象
      showCancel: false,
      submitting: false,
      comments: [],
      currentPage: 1,
      pageSize: 10,
      total: 0, //总数量
      toInfo: {},
      userInfo: {},
      blogUid: null, //传递过来的博客uid
      blogOid: 0, // 传递过来的博客oid
      blogData: {
        blogSort: {}
      },
      sameBlogData: [], //相关文章数据
      dialogPictureVisible: false,
      dialogImageUrl: "",
    };
  },
  created() {
    this.blogUid = this.$route.query.blogUid;
    const params = new URLSearchParams();
    if (this.blogUid) {
      params.append("blogUid", this.blogUid);
    }
    getBlogByUid(params).then((response) => {
      if (response.code === 20000) {
        this.blogData = response.data;
        this.blogUid = response.data.uid;
        document.title = response.data.title;
        // this.blogContent = this.blogData.content
        this.getSameBlog();
        // this.getCommentDataList();
      }
    });
    //获取评论列表
    this.getCommentDataList();
  },
  mounted() {

    setTimeout(() => {
      this.blogContent = this.blogData.content
    }, 600);

    window.addEventListener('scroll', () => {
      const winScrollHeight = document.documentElement.scrollTop; // 获取滚动条滚动的距离(移动距离)
      if (winScrollHeight < 40) {
        this.catalogCss = 'catalog'
      } else {
        this.catalogCss = 'catalog2'
      }
    });

  },
  methods: {
    //拿到vuex中的写的方法
    ...mapMutations(["setCommentList"]),
    //在列表中回复信息后，刷新列表
    submit() {
      this.getCommentDataList();
    },
    //获取相关文章
    getSameBlog() {
      const blogParams = new URLSearchParams();
      blogParams.append("blogUid", this.blogUid);
      getSimilarityBlogUid(blogParams).then((response) => {
        if (response.code === 20000) {
          this.sameBlogData = response.data;
        }
      });
    },
    //发表评论
    submitBox(content) {
      let params = {};
      params.userUid = this.$store.state.user.userInfo.uid;
      params.content = content;
      params.blogUid = this.blogUid
      addComment(params).then(response => {
        if (response.code == 20000) {
          this.$notify({
            title: "成功",
            message: "发表成功~",
            type: "success",
            offset: 100
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: response.message,
            offset: 100
          });
        }
        this.getCommentDataList();
      });
    },
    //获取评论列表
    getCommentDataList() {
      let params = {};
      // 留言板的uid
      params.blogUid = this.blogUid;
      params.currentPage = this.currentPage;
      params.pageSize = this.pageSize;
      getCommentList(params).then(response => {
        if (response.code == 20000) {
          this.comments = response.data.records;
          this.setCommentList(this.comments);
          this.currentPage = response.data.current;
          this.pageSize = response.data.size;
          this.total = response.data.total;
        }
      });
    },
    //标签
    goToTagList(uid) {
      let routeData = this.$router.resolve({
        path: "/list",
        query: {tagUid: uid},
      });
      window.open(routeData.href, "_blank");
    },
    //分类
    goToSortList(uid) {
      let routeData = this.$router.resolve({
        path: "/list",
        query: {sortUid: uid},
      });
      window.open(routeData.href, "_blank");
    },
    //作者
    goToAuthor(author) {
      let routeData = this.$router.resolve({
        path: "/list",
        query: {author: author},
      });
      window.open(routeData.href, "_blank");
    },
    //跳转到文章详情
    goToInfo(uid) {
      let routeData = this.$router.resolve({
        path: "/info",
        query: {blogUid: uid},
      });
      window.open(routeData.href, "_blank");
    },
    //切割字符串
    subText(str, index) {
      if (str.length < index) {
        return str;
      }
      return str.substring(0, index) + "...";
    },
  }
}
</script>

<style scoped>
article {
  width: 1200px;
  margin: 80px auto 0;
  overflow: hidden
}

h1.t_nav span {
  float: right;
  color: #000;
}

h1.t_nav {
  border-bottom: #bfbfbf 1px solid;
  font-size: 14px;
  font-weight: normal;
  line-height: 40px;
  width: 100%;
  overflow: hidden;
  margin-bottom: 20px
}

h1.t_nav span {
  display: none
}

.n1, .n2 {
  width: 100px;
  display: block;
  text-align: center;
  float: left;
  color: #fff;
}

.n1 {
  background: #000;
}

.n2 {
  background: #3a6ab5;
}

/*infosbox*/
.infosbox {
  float: left;
  width: 74%;
  overflow: hidden;
  background: #FFF;
}

.infosbox .news_con {
  line-height: 1.8;
  font-size: 16px;
  text-align: justify;
}

.infosbox .news_con p {
  margin-bottom: 25px
}

.infosbox .news_con img {
  max-width: 740px;
  height: auto;
}

.infosbox .news_con video {
  max-width: 740px;
  height: auto;
}

.infosbox .share {
  padding: 20px;
}

.infosbox .news_con img {
  vertical-align: middle;
  width: 270px;
  text-align: center;
  border: 1px solid #eee;
}

.newsview {
  padding: 0 30px
}

.news_title {
  font-size: 24px;
  font-weight: normal;
  padding: 30px 0 0 0;
  color: #333;
}

.bloginfo {
  overflow: hidden;
  margin-top: 30px
}

.bloginfo ul li {
  float: left;
  font-size: 12px;
  padding: 0 0 0 20px;
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

.tags a {
  background: #F4650E;
  padding: 3px 8px;
  margin: 0 5px 0 0;
  color: #fff;
}

.tags {
  margin: 30px 0;
}

.news_about {
  color: #888888;
  border: 1px solid #F3F3F3;
  padding: 10px;
  margin: 20px auto 15px auto;
  line-height: 23px;
  background: none repeat 0 0 #F6F6F6;
}

.news_about strong {
  color: #38485A;
  font-weight: 400 !important;
  font-size: 13px;
  padding-right: 8px;
}

.catalog {
  position: fixed;
  left: 1050px;
}

.catalog2 {
  position: fixed;
  left: 1050px;
  top: 70px;
}


.otherlink, .xzsm, .ffsm {
  width: 100%;
  background: #FFF;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0
}

.otherlink h2 {
  border-bottom: #a7a7a7 2px dashed;
  line-height: 40px;
  font-size: 14px;
  background: url(../../statis/images/5794.png) left 10px center no-repeat;
  padding-left: 40px;
  color: #000
}

.otherlink ul {
  margin: 10px 0
}

.otherlink li {
  line-height: 24px;
  height: 24px;
  display: block;
  width: 290px;
  float: left;
  overflow: hidden;
  margin-right: 30px;
  padding-left: 10px;
}

.otherlink li a:hover {
  text-decoration: underline;
  color: #000
}

.news_pl {
  margin: 10px 0;
  width: 100%;
  background: #FFF;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
  min-height: 360px
}

.news_pl h2 {
  background: url(../../statis/images/newsbg03.png) no-repeat left 10px center;
  border-bottom: #a7a7a7 2px dashed;
  line-height: 40px;
  font-size: 14px;
  padding-left: 30px;
  margin-bottom: 20px;
  color: #000
}

.noComment {
  width: 100%;
  text-align: center;
}
</style>
