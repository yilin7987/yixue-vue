<template>
  <div class="zhuanti" v-if="thirdData.length > 0">
    <h2 class="hometitle">特别推荐</h2>
    <ul>
      <li v-for="item in thirdData" :key="item.uid" style="cursor: pointer" @click="goToInfo(item)"><i><img
          v-if="item.picture" :src="item.picture.txUrl"></i>
        <p @click="goToInfo(item)" style="cursor: pointer">{{ splitStr(item.title, 30) }}<span><a
            href="javascript:void(0);">阅读</a></span></p>
      </li>
    </ul>
  </div>
</template>

<script>

import {getBlogByLevel} from "@/api/blog/blog";

export default {
  name: 'ThirdRecommend',
  data() {
    return {
      slideList: [],
      thirdData: [], //；三级级推荐数据
    }
  },
  created() {
    const params = new URLSearchParams();
    params.append("level", 3);
    //获取blog
    getBlogByLevel(params).then(response => {
      if(response.code === 20000) {
        this.thirdData = response.data;
      }
    });
    // const thirdParams = new URLSearchParams();
    // thirdParams.append("currentPage", 0);
    // thirdParams.append("pageSize", 3);
    // thirdParams.append("level", 3);
    // thirdParams.append("useSort", 1);
    // getBlogByLevel(thirdParams).then(response => {
    //   if (response.code == this.$ECode.SUCCESS) {
    //     this.thirdData = response.data.records;
    //   }
    // });
  },
  methods: {
    goToInfo(blog) {
      if(blog.type == "0") {
        let routeData = this.$router.resolve({
          path: "/info",
          query: {blogUid: blog.uid}
        });
        window.open(routeData.href, '_blank');
      } /*else if(blog.type == "1") {
        var params = new URLSearchParams();
        params.append("uid", blog.uid);
        getBlogByUid(params).then(response => {
          // 记录一下用户点击日志
        });
        window.open(blog.outsideLink, '_blank');
      }*/
    },
    splitStr(str, flagCount) {
      if (str == null || str == '') {
        return ""
      } else if (str.length > flagCount) {
        return str.substring(0, flagCount) + "..."
      } else {
        return str
      }
    }
  }
}

</script>

<style scoped>
/* zhuanti */
.zhuanti {
  overflow: hidden
}

.zhuanti ul {
  width: 100%;
  overflow: hidden;
  display: block;
  clear: both;
}

.zhuanti li {
  margin: 0 0 20px 0;
  overflow: hidden;
  height: 200px;
  position: relative;
}

.zhuanti li i {
  background: #000;
  display: block
}

.zhuanti img {
  width: 100%;
  -moz-transition: all .5s ease;
  -webkit-transition: all .5s ease;
  -ms-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
  opacity: 0.5
}

.zhuanti p {
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  color: #FFF;
  text-align: center;
  font-size: 15px;
  overflow: hidden;
  margin-top: 5px;
  padding: 0 40px;
}

.zhuanti p a {
  color: #fff;
}

.zhuanti span {
  width: 80px;
  margin: 10px auto;
  background: transparent;
  font-size: 12px;
  border: 1px solid #FFF;
  border-radius: 40px;
  padding: 4px 0;
  color: #FFF;
  display: block;
  clear: both;
  -webkit-transition: all .3s ease;
  -moz-transition: all .3s ease;
  -ms-transition: all .3s ease;
  -o-transition: all .3s ease;
  transition: all .3s ease;
}

.zhuanti li:hover img {
  opacity: 0.6
}

.zhuanti li:hover span {
  background: #FFF;
}

.zhuanti li:hover span a {
  color: #333
}

/* 重复代码 */
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
</style>
