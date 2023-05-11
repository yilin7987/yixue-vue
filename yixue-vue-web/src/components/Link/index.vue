<template>
  <div class="links" v-if="linkData.length > 0">
    <h2 class="hometitle">友情链接</h2>
    <ul>
      <li v-for="item in linkData" :key="item.uid">
        <a href="javascript:void(0);" @click="goLink(item)">{{ item.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Link",
  data() {
    return {
      linkData: [{uid: 1, title: "百度",url:"https://www.baidu.com"},
        {uid: 2, title: "哔哩哔哩",url:"https://www.bilibili.com/"}], //友情链接
    };
  },
  methods: {
    goLink(item) {
      window.open(item.url, "_blank")
      /*var params = new URLSearchParams();
      params.append("uid", item.uid);
      addLinkCount(params).then(response => {
        if(response.code == this.$ECode.SUCCESS) {
          window.open(item.url, "_blank")
        }
      })*/
    }
  }
}
</script>

<style scoped>
/*links*/
.links ul {
  overflow: hidden
}

.links ul li {
  line-height: 24px;
  margin: 0 10px 10px 0;
  display: block;
  float: left
}

.links ul a:hover {
  text-decoration: underline;
  color: #000
}

.hometitle {
  font-size: 18px;
  color: #282828;
  font-weight: 600;
  margin: 0 0 25px;
  text-transform: uppercase;
  padding-bottom: 15px;
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
