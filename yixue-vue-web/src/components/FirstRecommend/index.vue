<template>
  <div class="banner">
    <el-carousel class="bannerBox" indicator-position="outside">
      <el-carousel-item v-for="(blog,index) in firstData" :key="index">
        <img
            style="width:100%; height:100%; display:block;cursor:pointer;"
            v-if="blog.picture"
            :src="blog.picture.txUrl"
            :alt="blog.title"
            @click="goToInfo(blog)">
        <div class="carousel-title" @click="goToInfo(blog)">
          <span>{{ blog.title }}</span>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import {getBlogByLevel} from "@/api/blog/blog"
export default {
  name: "FirstRecommend",
  data() {
    return {
      // 一级推荐数据
      firstData: []
    };
  },
  created() {
    const params = new URLSearchParams();
    params.append("level", 1);
    //获取blog
    getBlogByLevel(params).then(response => {
      if(response.code === 20000) {
        this.firstData = response.data;
      }
    });
  },
  methods: {
    //跳转到文章详情【或推广链接】
    goToInfo(blog) {
      if (blog.type == "0") {
        let routerData = this.$router.resolve({
          path: "/info",
          query: {blogUid: blog.uid}
        });
        window.open(routerData.href, '_blank');
      } else if (blog.type == "1") {
        alert("推广")
        /*var params = new URLSearchParams();
        params.append("uid", blog.uid);
        getBlogByUid(params).then(response => {
          // 记录一下用户点击日志
        });
        window.open(blog.outsideLink, '_blank');*/
      }
    },
  }
}
</script>

<style >
.banner {
  width: 66%;
  overflow: hidden;
  float: left
}
.el-carousel__container {
  height: 450px !important;;
  width: 792px;
}
.carousel-title span {
  color: white;
  font-size: 22px;
  display: inline-block;
}

@media only screen and (max-width: 1200px) {
  .el-carousel__container {
    height: 360px !important;;
  }
}
@media only screen and (max-width: 1000px) {
  .el-carousel__container {
    height: 340px !important;;
  }
}

@media only screen and (max-width: 960px) {
  .el-carousel__container {
    height: 280px !important;;
  }
}

@media only screen and (max-width: 500px) {
  .el-carousel__container {
    height: 200px !important;;
  }
}

.carousel-title {
  cursor: pointer;
  position: absolute;
  z-index: 10;
  bottom: 40px;
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
