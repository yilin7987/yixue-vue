<template>
  <div class="guanzhu" id="follow-us" ref="follow" v-if="isShow">
    <h2 class="hometitle">联系我</h2>
    <ul>
      <!-- <li class="sina"><a href="/" target="_blank"><span>新浪微博</span>蘑菇博客</a></li>         -->
      <!--<li class="qqGroup" v-if="contact.qqGroup"><a href="javascript:void(0);"><span>QQ群</span>{{contact.qqGroup}}</a></li>-->
      <li class="qq" v-if="contact.qqNumber"><a
          :href="'tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=' + contact.qqNumber"
          target="_blank"><span>QQ号</span>{{ contact.qqNumber }}</a></li>
      <li class="email" v-if="contact.email"><a href="javascript:void(0);"><span>邮箱帐号</span>{{ contact.email }}</a>
      </li>
      <li class="wxgzh" v-if="contact.weChat"><a href="javascript:void(0);"><span>微信号</span>{{ contact.weChat }}</a>
      </li>
      <!-- <li class="github" v-if="contact.github">
              <a :href="contact.github"
                 target="_blank">
                <span>Github</span>
                {{ contact.github }}
              </a>
            </li>
            <li class="gitee" v-if="contact.gitee"><a :href="contact.gitee"
                                                      target="_blank">
              <span>Gitee</span>
              {{ contact.gitee }}
            </a>
            </li>-->
      <!-- <li class="wx"><img src="../../../static/images/wx.jpg"></li> -->
    </ul>
  </div>
</template>

<script>
export default {
  name: "FollowUs",
  data() {
    return {
      contact: {qqNumber: "1178990518", email: "1178990518@qq.com", weChat: "18775587987"},
      isShow: true
    };
  },
}
</script>

<style scoped>
/*guanzhu*/
.guanzhu ul li {
  font-size: 12px;
  margin-bottom: 10px;
  background: #fff;
  color: #525252;
  line-height: 40px;
  padding: 0 0 0 34px;
  border: 1px solid #DDD;
  border-radius: 2px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.guanzhu .sina {
  border: #ec3d51 1px solid;
  background: url(../../assets/images/gzbg.jpg) no-repeat 0 10px
}

.guanzhu .tencent {
  border: #68a6d6 1px solid;
  background: url(../../assets/images/gzbg.jpg) no-repeat 0 -43px
}

.guanzhu .qq {
  border: #2ab39a 1px solid;
  background: url(../../assets/images/gzbg.jpg) no-repeat 0 -98px
}

.guanzhu .qqGroup {
  border: #EB6841 1px solid;
  background: url(../../assets/images/qqGroup.png) no-repeat;
  background-size: 22px;
  background-position-y: 47%;
}

.guanzhu .email {
  border: #12aae8 1px solid;
  background: url(../../assets/images/gzbg.jpg) no-repeat 0 -150px
}

.guanzhu .wxgzh {
  border: #199872 1px solid;
  background: url(../../assets/images/gzbg.jpg) no-repeat 0 -200px
}

.guanzhu .github {
  border: #000000 1px solid;
  background: url(../../assets/images/github.jpg) no-repeat;
  background-size: 25px;
  background-position-y: 47%;
}

.guanzhu .gitee {
  border: #E93B3C 1px solid;
  background: url(../../assets/images/gitee.jpg) no-repeat;
  background-size: 25px;
  background-position-y: 47%;
}

.guanzhu .wx {
  overflow: hidden;
  padding: 0
}

.guanzhu .wx img {
  width: 100%;
}

.guanzhu ul li span {
  float: right;
  text-align: center;
  width: 85px;
  -moz-transition: all .5s ease;
  -webkit-transition: all .5s ease;
  -ms-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
  transition: all 0.5s;
}

.guanzhu .sina span {
  background: #ec3d51;
}

.guanzhu .tencent span {
  background: #68a6d6;
}

.guanzhu .qq span {
  background: #2ab39a;
}

.guanzhu .qqGroup span {
  background: #EB6841;
}

.guanzhu .email span {
  background: #12aae8;
}

.guanzhu .wxgzh span {
  background: #199872;
}

.guanzhu .github span {
  background: #000000;
}

.guanzhu .gitee span {
  background: #E93B3C;
}

.guanzhu a span {
  color: #FFF
}

.guanzhu ul li:hover span {
  width: 100px;
}

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
