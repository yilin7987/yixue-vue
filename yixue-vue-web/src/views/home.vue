<template>
  <div>
    <header
        :class="isVisible?'header-navigation slideDown':'header-navigation slideUp'"
        id="header"
    >
      <nav>
        <!--logo-->
        <div class="logo">
          <router-link to="/">
            <a href="javascript:void(0);">易学博客</a>
          </router-link>
        </div>
        <!-- 标签栏-->
        <ul id="starlist">
          <li>
            <router-link to="/">
              <a href="javascript:void(0);" :class="[saveTitle == '/' ? 'title' : '']">首页</a>
            </router-link>
          </li>
          <li>
            <router-link to="/archive">
              <a href="javascript:void(0);" :class="[saveTitle == '/archive' ? 'title' : '']">归档</a>
            </router-link>
          </li>
          <li>
            <router-link to="/sort">
              <a href="javascript:void(0);" :class="[saveTitle == '/sort' ? 'title' : '']">分类</a>
            </router-link>
          </li>
          <li>
            <router-link to="/tag">
              <a href="javascript:void(0);" :class="[saveTitle == '/tag' ? 'title' : '']">标签</a>
            </router-link>
          </li>
          <li>
            <router-link to="/subject">
              <a href="javascript:void(0);" :class="[saveTitle == '/subject' ? 'title' : '']">专题</a>
            </router-link>
          </li>
          <li v-if="openComment=='1'">
            <router-link to="/messageBoard">
              <a href="javascript:void(0);"
                 :class="[saveTitle == '/messageBoard' ? 'title' : '']">留言板</a>
            </router-link>
          </li>
          <li>
            <router-link to="/about">
              <a href="javascript:void(0);" :class="[saveTitle == '/about' ? 'title' : '']">关于我</a>
            </router-link>
          </li>
        </ul>
        <!--搜索框-->
        <div class="searchbox">
          <input
              :class="(showSearch || keyword.length > 0)?'input_open':''"
              ref="searchInput"
              placeholder="想搜点什么呢.."
              type="text"
              name="keyboard"
              v-model="keyword"
              @keyup.enter="search"
          >
          <img src="../../statis/icons/sousuo.svg" @click="clickSearchIco">
        </div>
        <!--头像-->
        <el-dropdown @command="handleCommand" class="userInfoAvatar">
          <el-badge
              :value="userReceiveCommentCount"
              class="item"
              :hidden="!isLogin || userReceiveCommentCount === 0">
            <el-avatar
                class="avatar"
                :icon=" userInfo.photoUrl == null ? 'el-icon-user-solid':''"
                size="medium"
                :src="userInfo.photoUrl">
            </el-avatar>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="login" v-show="!isLogin">登录</el-dropdown-item>
            <el-dropdown-item command="goUserInfo" v-show="isLogin">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout" v-show="isLogin">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </nav>
    </header>
    <!--登录框-->
    <LoginBox v-if="showLogin" @closeLoginBox="showLogin = false;"></LoginBox>
    <el-drawer
        :show-close="true"
        :visible.sync="drawer"
        size="30%"
        :with-header="false">

      <el-tabs type="border-card" tab-position="left" v-model="activeName" style="margin-top: 0px; height: 100%;"
               @tab-click="handleClick">
        <el-tab-pane label="个人中心" name="0">
          <span slot="label"><i class="el-icon-user-solid"></i> 个人中心</span>
          <el-form label-position="left" :model="userInfo" label-width="100px" :rules="rules" ref="userInfo">
            <el-form-item label="用户头像" :label-width="labelWidth">

              <div class="imgBody" v-if="userInfo.photoUrl">
                <i class="el-icon-error inputClass" v-show="icon" @click="deletePhoto"
                   @mouseover="icon = true"></i>
                <img @mouseover="icon = true" @mouseout="icon = false" v-bind:src="userInfo.photoUrl"/>
              </div>

              <div v-else class="uploadImgBody" @click="checkPhoto">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-form-item>

            <el-form-item label="昵称" :label-width="labelWidth">
              <el-input v-model="userInfo.nickName" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item label="性别" :label-width="labelWidth">
              <el-radio-group v-model="userInfo.gender">
                <el-radio border size="medium" label="1">男</el-radio>
                <el-radio border size="medium" label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="生日" :label-width="labelWidth">
              <el-date-picker
                  v-model="userInfo.birthday"
                  type="date"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="邮箱" :label-width="labelWidth" prop="email">
              <el-input v-model="userInfo.email" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item label="QQ号" :label-width="labelWidth" prop="qqNumber">
              <el-input v-model="userInfo.qqNumber" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item label="职业" :label-width="labelWidth" prop="occupation">
              <el-input v-model="userInfo.occupation" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item label="简介" :label-width="labelWidth" prop="summary">
              <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请输入内容"
                  style="width: 100%"
                  v-model="userInfo.summary">
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="editUser">保 存</el-button>
            </el-form-item>

          </el-form>
        </el-tab-pane>

        <el-tab-pane label="我的评论" name="1">
          <span slot="label"><i class="el-icon-message-solid"></i> 我的评论</span>
          <div style="width: 100%; height: 840px;overflow:auto;">
            <el-timeline>
              <el-timeline-item v-for="comment in commentList"
                                :key="comment.uid"
                                :timestamp="timeAgo(comment.createTime)"
                                placement="top">
                <el-card>
                  <div class="commentList">
                    <div class="left p1">
                      <el-avatar size="small"
                                 :icon=" comment.user.photoUrl == null ? 'el-icon-user-solid':''"
                                 :src="comment.user.photoUrl">
                      </el-avatar>
                    </div>
                    <div class="right p1">
                      <div class="rightTop">
                        <el-link class="userName" :underline="false">
                          {{ comment.user.nickName }}
                        </el-link>
                        <el-tag style="cursor: pointer;"
                                @click.native="goSource(comment)">详细
                        </el-tag>
                      </div>

                      <div class="rightCenter">
                        <p v-html="comment.content"></p>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-timeline-item>

              <el-timeline-item v-if="commentList.length == 0" placement="top">
                <el-card>
                  <span style="font-size: 16px">空空如也~</span>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>

        <el-tab-pane label="我的回复" name="2">
          <div slot="label">
            <el-badge :value="userReceiveCommentCount" class="item"
                      :hidden="!isLogin || userReceiveCommentCount == 0">
              <i class="el-icon-s-promotion"></i> 我的回复
            </el-badge>
          </div>
          <div style="width: 100%; height: 840px;overflow:auto">
            <el-timeline>
              <el-timeline-item v-for="reply in replyList" :key="reply.uid"
                                :timestamp="timeAgo(reply.createTime)"
                                placement="top">
                <el-card>
                  <div class="commentList">
                    <div class="left p1">
                      <el-avatar size="small"
                                 :icon=" reply.user.photoUrl == null ? 'el-icon-user-solid':''"
                                 :src="reply.user.photoUrl">
                      </el-avatar>
                    </div>

                    <div class="right p1">
                      <div class="rightTop">
                        <el-link class="userName" :underline="false">
                          {{ reply.user.nickName }}
                        </el-link>
                        <el-tag style="cursor: pointer;"
                                @click.native="goSource(reply)">
                          详细
                        </el-tag>
                      </div>

                      <div class="rightCenter">
                        <p v-html="reply.content"></p>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-timeline-item>

              <el-timeline-item v-if="replyList.length == 0" placement="top">
                <el-card>
                  <span style="font-size: 16px">空空如也~</span>
                </el-card>
              </el-timeline-item>

            </el-timeline>
          </div>
        </el-tab-pane>

        <el-tab-pane label="我的点赞" name="3">
          <span slot="label"><i class="el-icon-star-on"></i> 我的点赞</span>
          <div style="width: 100%; height: 840px;overflow:auto">
            <el-timeline>
              <el-timeline-item v-for="praise in praiseList" :key="praise.uid"
                                :timestamp="timeAgo(praise.createTime)"
                                placement="top">
                <el-card>
                  <span>点赞</span>
                  <el-tag type="warning" style="cursor: pointer" v-if="praise.blog"
                          @click.native="goToInfo(praise.blog.uid)">{{ praise.blog.title }}
                  </el-tag>
                </el-card>
              </el-timeline-item>

              <el-timeline-item v-if="praiseList.length == 0" placement="top">
                <el-card>
                  <span style="font-size: 16px">空空如也~</span>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>

        <el-tab-pane label="修改密码" name="4">
          <span slot="label"><i class="el-icon-s-tools"></i> 修改密码</span>
          <el-form ref="userInfoForm" label-position="left" :model="userInfo" label-width="100px"
                   :rules="userInfoRules">
            <el-form-item label="旧密码" label-width="80px" prop="oldPwd">
              <el-input type="password" v-model="userInfo.oldPwd" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item label="新密码" label-width="80px" prop="newPwd">
              <el-input type="password" v-model="userInfo.newPwd" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item label="重复密码" label-width="80px" prop="newPwd2">
              <el-input type="password" v-model="userInfo.newPwd2" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="changePwd">提 交</el-button>
            </el-form-item>
          </el-form>

        </el-tab-pane>

      </el-tabs>
    </el-drawer>
    <!--头像裁剪-->
    <avatar-cropper
        v-show="imagecropperShow"
        :key="imagecropperKey"
        :width="300"
        :height="300"
        :url="url"
        lang-type="zh"
        @close="close"
        @crop-upload-success="cropSuccess"
    />
    <div>
      <router-view/>
    </div>
    <!--回到顶部-->
    <el-backtop :visibility-height=550></el-backtop>
    <footer>
      <p>
        Copyright <a href="https://gitee.com/moxi159753/mogu_blog_v2"> &nbsp;易学博客&nbsp;</a>
        <a href="https://beian.miit.gov.cn/">xxxxxxx</a>
      </p>
    </footer>
  </div>
</template>

<script>
import AvatarCropper from '@/components/AvatarCropper'
import LoginBox from "@/components/LoginBox";
import {delCookie, getCookie, setCookie} from "@/utils/cookieUtils";
import {authVerify, deleteToken, editUser, updateUserPwd} from "@/api/user";
import {mapMutations} from "vuex";
import {
  getCommentListByUser,
  getPraiseListByUser,
  getUserReceiveCommentCount,
  readUserReceiveCommentCount
} from "@/api/comment";
import {getUrlVars, timeAgo} from "@/utils/webUtils";

export default {
  name: "home",
  components: {
    LoginBox, AvatarCropper
  },
  created() {
    this.getToken()
    this.getCurrentPageTitle()
  },
  mounted() {
    let after = 0;
    window.addEventListener("scroll", () => {
      let scrollTop = document.documentElement.scrollTop; //当前的的位置
      // let scrollHeight = document.documentElement.scrollHeight; //最高的位置
      if (scrollTop > after) {
        this.isVisible = false;
      } else {
        this.isVisible = true;
      }
      after = scrollTop;
      console.log()
    });
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      url: process.env.VUE_APP_WEB_API + "/avatar/upload",
      // 激活的标签
      activeName: "0",
      //个人中心显示
      drawer: false,
      // 用户信息
      userInfo: {},
      isLogin: false,
      // 用户收到的评论数
      userReceiveCommentCount: 0,
      // 搜索关键字
      keyword: '',
      //显示登录框
      showLogin: false,
      //控制搜索框的弹出
      showSearch: false,
      saveTitle: "/",
      info: {},
      //是否开启评论
      openComment: "1",
      //控制导航栏的隐藏和显示
      isVisible: true,
      //控制导航栏的弹出
      showHead: false,
      rules: {
        qqNumber: [
          {pattern: /[1-9]([0-9]{5,11})/, message: '请输入正确的QQ号码'},
        ],
        email: [
          {pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '请输入正确的邮箱'},
        ],
        summary: [
          {min: 0, max: 200, message: '长度在0到200个字符'},
        ],
      },
      userInfoRules: {
        oldPwd: [
          {required: true, message: '旧密码不能为空', trigger: 'blur'},
          {min: 5, max: 20, message: '密码长度在5到20个字符'},
        ],
        newPwd: [
          {required: true, message: '新密码不能为空', trigger: 'blur'},
          {min: 5, max: 20, message: '密码长度在5到20个字符'},
        ],
        newPwd2: [
          {required: true, message: '新密码不能为空', trigger: 'blur'},
          {min: 5, max: 20, message: '密码长度在5到20个字符'},
        ]
      },
      labelWidth: "70px",
      //控制删除图标的显示
      icon: false,
      //我的评论
      commentList: [],
      //我的回复
      replyList: [],
      //我的点赞
      praiseList: [],
    }
  },
  watch: {
    $route() {
      this.getCurrentPageTitle()
    },
    // 判断登录状态位是否改变（用于控制弹框）
    '$store.state.app.loginMessage': function () {
      this.showLogin = true
    }
  },
  methods: {
    //拿到vuex中的写的方法
    ...mapMutations(['setUserInfo', 'setLoginState']),
    close() {
      this.imagecropperShow = false
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1

      this.userInfo.photoUrl = resData.avatarUrl
      this.userInfo.avatar = resData.uid

    },
    // 获取点赞列表
    getPraiseList() {
      let params = {}
      params.pageSize = 10;
      params.currentPage = 1;
      getPraiseListByUser(params).then(response => {
        if (response.code == 20000) {
          this.praiseList = response.data.records;
        }
      })
    },
    // 跳转到资源详情
    goSource(comment) {
      if ('1' == comment.blogUid) {
        //留言板
        let routeData = this.$router.resolve({
          path: "/messageBoard"
        });
        window.open(routeData.href, '_blank');
      } else {
        //博客
        let routeData = this.$router.resolve({
          path: "/info",
          query: {blogUid: comment.blogUid}
        });
        window.open(routeData.href, '_blank');
      }
      // let routeData = this.$router.resolve({
      //     path: "/about"
      // });
      // window.open(routeData.href, '_blank');
    },
    // 标签选择
    handleClick(tab) {
      switch (tab.index) {
        case "2": {
          // console.log("点击我的回复")
          // 判断用户是否未读的回复
          if (this.userReceiveCommentCount > 0) {
            // 设置已阅读
            readUserReceiveCommentCount().then(response => {
              if (response.code == 20000) {
                // 阅读成功
                this.userReceiveCommentCount = 0
              }
            })
          }
        }
          break;
      }
    },
    //获取当前所在页面的标题
    getCurrentPageTitle() {
      const test = window.location.href;
      let start = 0;
      let end = test.length;
      for (let i = 0; i < test.length; i++) {
        if (test[i] == "#") {
          start = i;
        }
        if (test[i] == "?" && i > start) {
          end = i;
        }
      }
      const result = test.substring(start + 1, end);
      this.saveTitle = result;
    },
    deletePhoto() {
      this.userInfo.photoUrl = null;
      this.userInfo.avatar = "";
      this.icon = false;
    },
    // 获取用户的评论数
    setUserReceiveCommentCount() {
      getUserReceiveCommentCount().then(response => {
        if (response.code == 20000) {
          this.userReceiveCommentCount = response.data
        }
      });
    },
    //弹出选择图片框
    checkPhoto() {
      this.imagecropperShow = true
    },
    //获取token，判定是否登录
    getToken() {
      let token = getUrlVars()["token"];
      // 判断url中是否含有token
      if (token != undefined) {
        // 设置token七天过期
        setCookie("token-web", token, 7)
      } else {
        // 从cookie中获取token
        token = getCookie("token-web")
      }
      if (token != undefined && token != '' && token != '') {
        authVerify(token).then(response => {
          if (response.code === 20000) {
            this.isLogin = true;
            this.userInfo = response.data;
            this.setUserInfo(this.userInfo)
            // 获取用户的评论数
            this.setUserReceiveCommentCount()
          } else {
            this.isLogin = false;
            delCookie("token-web");
          }
          this.setLoginState(this.isLogin);
        });
      } else {
        this.isLogin = false;
        this.setLoginState(this.isLogin);
      }
    },
    //时间转换
    timeAgo(dateTimeStamp) {
      return timeAgo(dateTimeStamp)
    },
    //跳转到文章详情
    goToInfo(uid) {
      let routeData = this.$router.resolve({
        path: "/info",
        query: {blogUid: uid}
      });
      window.open(routeData.href, '_blank');
    },
    // 点击头像触发的动作
    handleCommand(command) {
      // console.log(command)
      switch (command) {
        case "logout" : {
          this.userLogout();
        }
          break;
        case "login" : {
          this.showLogin = true;
        }
          break;
        case "goUserInfo" : {
          // 打开抽屉
          this.drawer = true;
          // 获取评论列表
          this.getCommentList();
          // // 获取点赞列表
          this.getPraiseList()
          // // 获取反馈列表
          // this.getFeedback()
        }
          break;
      }
    },
    // 获取评论列表
    getCommentList() {
      let params = {}
      params.pageSize = 10;
      params.currentPage = 1;
      getCommentListByUser(params).then(response => {
        if (response.code == 20000) {
          if(response.data != null) {
            this.commentList = response.data.commentList
            this.replyList = response.data.replyList
          }
        }
      })
    },
    //退出登录
    userLogout() {
      deleteToken(getCookie("token-web"));
      delCookie("token-web");
      let url = window.parent.location.href;
      let haveToken = url.indexOf("?token")
      if (haveToken != -1) {
        let list = url.split("?token");
        this.isLogin = false;
        window.location.href = list[0]
        let userInfo = {};
        this.setUserInfo(userInfo)
        window.location.reload()
      } else {
        window.location.reload()
      }
    },
    clickSearchIco() {
      if (this.keyword != "") {
        this.search();
      }
      this.showSearch = !this.showSearch;
      //获取焦点
      this.$refs.searchInput.focus();
    },
    // 搜索
    search() {
      if (this.keyword == "" || this.keyword.trim() == "") {
        this.$notify.error({
          title: '错误',
          message: "关键字不能为空",
          type: 'success',
          offset: 100
        });
        return;
      }
      this.$router.push({path: "/list", query: {keyword: this.keyword}});
    },
    //修改个人信息
    editUser() {
      console.log(this.userInfo)
      this.$refs.userInfo.validate((valid) => {
        if (valid) {
          editUser(this.userInfo).then(response => {
            if (response.code === 20000) {
              this.$message({
                type: "success",
                message: response.message
              })
            } else {
              this.$message({
                type: "error",
                message: response.message
              })
            }
          });
        } else {
          console.log("校验失败")
        }
      })
    },
    //修改密码
    changePwd() {
      let newPwd = this.userInfo.newPwd
      let newPwd2 = this.userInfo.newPwd2
      let oldPwd = this.userInfo.oldPwd
      if (newPwd != newPwd2) {
        this.$message({
          type: "error",
          message: "两次密码不一致"
        })
        return
      }
      if (newPwd == oldPwd) {
        this.$message({
          type: "error",
          message: "新旧密码相同"
        })
        return
      }
      let params = new URLSearchParams()
      params.append("oldPwd", oldPwd)
      params.append("newPwd", newPwd)
      updateUserPwd(params).then(response => {
        if (response.code == 20000) {
          this.$message({
            type: "success",
            message: response.message
          })
          //退出登录
          this.userLogout()
          // this.drawer = false;
        } else {
          this.$message({
            type: "error",
            message: response.message
          })
        }
        // 重置表单
        this.$refs.userInfoForm.resetFields()
      })
    }
  },
}
</script>

<style scoped>

.el-tag {
  height: 25px;
  line-height: 25px;
  margin-left: 6px;
}

.header-navigation {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: hsla(0, 0%, 100%, .9);
  text-align: center;
  z-index: 99;
}

/* 导航栏的显示和隐藏 */
.slideUp {
  -webkit-transform: translateY(-100px);
  -ms-transform: translateY(-100px);
  -o-transform: translateY(-100px);
  transform: translateY(-100px);
  -webkit-transition: transform .5s ease-out;
  -o-transition: transform .5s ease-out;
  transition: transform .5s ease-out;
}

.slideDown {
  -webkit-transform: translateY(0);
  -ms-transform: translateY(0);
  -o-transform: translateY(0);
  transform: translateY(0);
  -webkit-transition: transform .5s ease-out;
  -o-transition: transform .5s ease-out;
  transition: transform .5s ease-out;
}

.logo {
  float: left;
  font-size: 22px;
  font-weight: bold;
}

.logo a {
  color: #006cff;
}

#starlist {
  float: left;
  margin-left: 100px;
  overflow: hidden;
  max-width: 1000px;
}

#starlist li {
  float: left;
  display: block;
  font-size: 16px;
  padding: 0 25px;
}

#starlist li a {
  color: #71777c;
}

#starlist li .title {
  color: #00a7eb;
}

.searchbox {
  position: absolute;
  right: 50px;
  top: 0
}

.searchbox input {
  position: absolute;
  font-size: 16px;
  height: 35px;
  top: 13px;
  right: 0;
  border: none;
  outline: none;
  border-bottom: 1px solid #dcdfe6;
  background: #fff;
  width: 0;
  transition: width 0.4s;
}

.searchbox .input_open {
  padding-left: 10px;
  width: 250px;
}

.searchbox img {
  cursor: pointer;
  position: absolute;
  top: 18px;
  width: 25px;
  height: 25px;
}

.userInfoAvatar {
  top: 0;
  width: 35px;
  height: 35px;
  position: absolute;
  right: -77px;
}

.userInfoAvatar /deep/ .el-badge__content {
  top: 12px
}

.avatar {
  margin-top: 10px;
}

/*footer*/
footer {
  width: 100%;
  background: #333;
  color: #a5a4a4;
  text-align: center;
  padding: 20px 0;
  clear: both;
}

footer p {
  padding: 0 30px;
}

footer a {
  color: #a5a4a4;
}

footer a:hover {
  color: #00a7eb
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.imgBody {
  width: 100px;
  height: 100px;
  border: solid 2px #ffffff;
  float: left;
  position: relative;
}

.imgBody img {
  width: 100px;
  height: 100px;
}

.uploadImgBody {
  margin-left: 5px;
  width: 100px;
  height: 100px;
  border: dashed 1px #c0c0c0;
  float: left;
  position: relative;
}

.uploadImgBody :hover {
  border: dashed 1px #00ccff;
}

.inputClass {
  position: absolute;
}

.commentList {
  width: 100%;
  margin: 0 auto;
}

.commentList .p1 {
  float: left;
}

.commentList .left {
  display: inline-block;
  width: 10%;
  height: 100%;
}

.commentList .left img {
  margin: 0 auto;
  width: 100%;
  border-radius: 50%;
}

.commentList .right {
  display: inline-block;
  width: 85%;
  margin-left: 5px;
}

.commentList .rightTop {
  height: 30px;
}

.commentList .rightTop .userName {
  color: #303133;
  margin-left: 10px;
  font-size: 16px;
  font-weight: bold;
}

.commentList .rightTop .timeAgo {
  color: #909399;
  margin-left: 10px;
  font-size: 15px;
}

.commentList .rightCenter {
  margin-left: 15px;
  line-height: 30px;
  min-height: 60px;
}

.commentList .rightCenter p {
  margin: 12px 0;
}
</style>
