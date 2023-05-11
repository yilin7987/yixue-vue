<template>
  <div v-if="hotBlogData.length > 0">
    <h2 class="hometitle">点击排行</h2>
    <ul class="tjpic" v-if="hotBlogData[0]">
      <i
      ><img
          style="cursor: pointer"
          v-if="hotBlogData[0].picture"
          :src="hotBlogData[0].picture.txUrl"
          @click="goToInfo(hotBlogData[0])"
      /></i>
      <p>
        <a href="javascript:void(0);" @click="goToInfo(hotBlogData[0])">{{
            hotBlogData[0].title
          }}</a>
      </p>
    </ul>
    <ul class="sidenews">
      <template v-for="(item, index) in sideNews">
        <li v-if="index != 0" :key="item.uid">
          <i
          ><img
              style="cursor: pointer"
              v-if="item.picture"
              :src="item.picture.txUrl"
              @click="goToInfo(item)"
          /></i>
          <p>
            <a href="javascript:void(0);" @click="goToInfo(item)">{{
                item.title
              }}</a>
          </p>
          <span>{{ item.createTime }}</span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import {getHotBlog} from "@/api/blog/blog"
export default {
  name: "TagCloud",
  data() {
    return {
      hotBlogData: [] //热门博客列表
    };
  },
  created() {
    getHotBlog().then((response) => {
      if (response.code === 20000) {
        if (response.data != null){
          this.hotBlogData = response.data;
        }
      }
    });
  },
  computed: {
    //添加一个计算属性用于简单过滤掉数组中第一个数据
    sideNews() {
      return this.hotBlogData.filter(
          (blog) => this.hotBlogData.indexOf(blog) != 0
      );
    },
  },
  methods: {
    //跳转到文章详情【或推广链接】
    goToInfo(blog) {
      if (blog.type == "0") {
        let routeData = this.$router.resolve({
          path: "/info",
          query: {blogUid: blog.uid},
        });
        window.open(routeData.href, "_blank");
      } /*else if (blog.type == "1") {
        var params = new URLSearchParams();
        params.append("uid", blog.uid);
        getBlogByUid(params).then((response) => {
          // 记录一下用户点击日志
        });
        window.open(blog.outsideLink, "_blank");
      }*/
    },
  },
};
</script>

<style scoped>
.hometitle {
  font-size: 18px;
  color: #282828;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  padding-bottom: 15px;
  margin-bottom: 25px;
  position: relative;
}

.hometitle:after {
  content: "";
  background-color: #282828;
  left: 0;
  width: 50px;
  height: 2px;
  bottom: 0;
  position: absolute;
  -webkit-transition: 0.5s;
  -moz-transition: 0.5s;
  -ms-transition: 0.5s;
  -o-transition: 0.5s;
  transition: 0.5s;
}

/*tjpic */
.tjpic {
  width: 100%;
  height: 170px;
  background: #000;
  margin-bottom: 20px;
  overflow: hidden;
  display: block;
  clear: both;
  position: relative;
}

.tjpic img {
  width: 100%;
  min-height: 170px;
  -moz-transition: all .5s ease;
  -webkit-transition: all .5s ease;
  -ms-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
}

.tjpic p {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 20px;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
}

.tjpic p a {
  color: #fff;
}

.tjpic:hover img {
  transform: scale(1.1)
}

/*sidenews*/
.sidenews {
}

.sidenews li {
  margin: 0 0 20px 0;
  overflow: hidden
}

.sidenews li p {
  line-height: 24px;
  color: #888;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
}

.sidenews li a {
  color: #48494d;
}

.sidenews li a:hover {
  color: #00A7EB;
}

.sidenews i {
  width: 100px;
  height: 75px;
  overflow: hidden;
  display: block;
  border: #efefef 1px solid;
  float: left;
  margin-right: 10px
}

.sidenews img {
  height: 100%;
  max-height: 75px;
  margin: auto;
  -moz-transition: all .5s ease;
  -webkit-transition: all .5s ease;
  -ms-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
  transition: all 0.5s;
}

.sidenews li:hover i img {
  transform: scale(1.1)
}

.sidenews span {
  font-size: 12px;
  color: #9A9A9A;
  margin-top: 10px;
  display: block
}
</style>
