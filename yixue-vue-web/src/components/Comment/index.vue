<!--评论模块-->
<template>
  <div class="container">
    <div class="comment" v-for="item in comments" :key="item.uid">
      <div class="info">
        <el-avatar class="avatar"
                   :icon=" item.user.photoUrl == null ? 'el-icon-user-solid':''"
                   :src="item.user.photoUrl">
        </el-avatar>
        <!--                <img class="avatar" v-if="item.user" :src="item.user.photoUrl" width="36" height="36"/>-->
        <div class="right">
          <div class="name">{{ item.user.nickName }}</div>
          <div class="date">{{ item.user.createTime }}</div>
        </div>
      </div>
      <div class="content" v-html="$xss(item.content, options)"></div>
      <div class="control">
                <span class="comment-reply" @click="showCommentInput(item)">
                    <i class="iconfont icon-comment"></i>
                    <span>回复</span>
                </span>

        <span class="comment-reply" @click="report(item)">
                    <i class="iconfont icon-comment"></i>
                    <span>举报</span>
                </span>
      </div>
      <div class="reply">
        <div class="item" v-for="reply in item.replyList" :key="reply.uid">
          <div class="reply-content">
            <span class="from-name">{{ reply.user.nickName }}</span>
            <span v-if="reply.toUid != reply.firstCommentUid"
                  class="to-name">回复&ensp;@{{ reply.toUser.nickName }}</span>：
            <span v-html="$xss(reply.content, options)"></span>
          </div>
          <div class="reply-bottom">
            <span>{{ reply.createTime }}</span>
            <span class="reply-text" @click="showCommentInput(item, reply)">
              <i class="iconfont icon-comment"></i>
              <span>回复</span>
            </span>
            <span class="reply-text" @click="report(reply)">
              <i class="iconfont icon-comment"></i>
              <span>举报</span>
            </span>
          </div>
        </div>
        <div class="write-reply" v-if="item.replyList.length > 0" @click="showCommentInput(item)">
          <i class="el-icon-edit"></i>
          <span class="add-comment">添加新评论</span>
        </div>
        <transition name="fade">
          <div class="input-wrapper" v-if="showItemId === item.uid">
            <el-input class="gray-bg-input"
                      v-model="inputComment"
                      type="textarea"
                      :rows="3"
                      autofocus
                      :placeholder="placeholder">
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button class="btn" type="success" round @click="commitComment(item)">确定</el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>


import {mapMutations} from "vuex";
import {addComment, reportComment} from "@/api/comment";

export default {
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  components: {},
  data() {
    return {
      // xss白名单配置
      options: {
        whiteList: {
          a: ['href', 'title', 'target'],
          span: ['class'],
          h1: ['class'],
          h2: ['class'],
          h3: ['class'],
          h4: ['class'],
          pre: [],
          code: ['class'],
          p: ['class']
        }
      },
      inputComment: '',
      showItemId: '',
      placeholder: '',
      //回复那条评论
      toUid: '',
      //回复谁
      toUserUid: ''
    }
  },
  computed: {},
  methods: {
    //拿到vuex中的写的方法
    ...mapMutations(['setLoginMessage']),
    /**
     * 点击取消按钮
     */
    cancel() {
      this.showItemId = ''
    },

    /**
     * 提交评论
     */
    commitComment(item) {
      let params = {};
      //回复谁
      params.toUserUid = this.toUserUid;
      //回复谁的评论
      params.toUid = this.toUid
      //内容
      params.content = this.inputComment;
      //博客uid
      params.blogUid = item.blogUid
      //谁回复
      params.userUid = this.$store.state.user.userInfo.uid
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
        this.showItemId = ''
        this.$emit("submit")
      });
    },

    /**
     * 点击评论按钮显示输入框
     * item: 当前大评论
     * reply: 当前回复的评论
     */
    showCommentInput(item, reply) {
      let isLogin = this.$store.state.user.isLogin
      if (!isLogin) {
        this.$notify.error({
          title: '警告',
          message: '登录后才可以评论哦~',
          offset: 100
        });
        // 未登录，自动弹出登录框
        this.setLoginMessage(Math.random())
        return;
      }
      if (reply) {
        this.placeholder = "@" + reply.user.nickName + " "
        this.toUid = reply.uid
        this.toUserUid = reply.userUid
      } else {
        this.placeholder = '写下你的评论~'
        this.toUid = item.uid
        this.toUserUid = item.userUid
      }
      this.showItemId = item.uid

    },
    report(item) {
      let isLogin = this.$store.state.user.isLogin
      if (!isLogin) {
        this.$notify.error({
          title: '错误',
          message: "登录后才能举报评论哦~",
          offset: 100
        });
        return
      }

      let userUid = this.$store.state.user.userInfo.uid

      if (userUid == item.userUid) {
        this.$notify.error({
          title: '错误',
          message: "不能举报自己的评论哦~",
          offset: 100
        });
        return;
      }

      let params = {};
      params.uid = item.uid;
      params.userUid = userUid
      reportComment(params).then(response => {
        if (response.code == 20000) {
          this.$notify({
            title: '成功',
            message: response.data,
            type: 'success',
            offset: 100
          });
        } else {
          this.$notify.error({
            title: '错误',
            message: response.data,
            type: 'success',
            offset: 100
          });
        }
      });
    },
  },
}
</script>

<style scoped lang="scss">

@import "../../../public/scss/index";

.container {
  padding: 0 10px;
  box-sizing: border-box;

  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid $border-fourth;

    .info {
      display: flex;
      align-items: center;

      .avatar {
        border-radius: 50%;
      }

      .right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;

        .name {
          font-size: 16px;
          color: $text-main;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .date {
          font-size: 12px;
          color: $text-minor;
        }
      }
    }

    .content {
      font-size: 16px;
      color: $text-main;
      line-height: 20px;
      padding: 10px 0 10px 10px;
    }

    .control {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: $text-minor;
      padding-left: 10px;

      .comment-reply {
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          color: $text-333;
        }

        .iconfont {
          font-size: 16px;
          margin-right: 5px;
        }
      }

    }

    .reply {
      margin: 10px 0;
      border-left: 2px solid $border-first;

      .item {
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: 1px dashed $border-third;

        .reply-content {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-main;

          .from-name {
            color: $color-main;
          }

          .to-name {
            color: $color-main;
            margin-left: 5px;
            margin-right: 5px;
          }
        }

        .reply-bottom {
          display: flex;
          align-items: center;
          margin-top: 6px;
          font-size: 12px;
          color: $text-minor;

          .reply-text {
            display: flex;
            align-items: center;
            margin-left: 10px;
            cursor: pointer;

            &:hover {
              color: $text-333;
            }

            .icon-comment {
              margin-right: 5px;
            }
          }
        }
      }

      .write-reply {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: $text-minor;
        padding: 10px;
        cursor: pointer;

        &:hover {
          color: $text-main;
        }

        .el-icon-edit {
          margin-right: 5px;
        }
      }

      .fade-enter-active, fade-leave-active {
        transition: opacity 0.5s;
      }

      .fade-enter, .fade-leave-to {
        opacity: 0;
      }

      .input-wrapper {
        padding: 10px;

        .gray-bg-input, .el-input__inner {
          /*background-color: #67C23A;*/
        }

        .btn-control {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 10px;

          .cancel {
            font-size: 16px;
            color: $text-normal;
            margin-right: 20px;
            cursor: pointer;

            &:hover {
              color: $text-333;
            }
          }

          .confirm {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
