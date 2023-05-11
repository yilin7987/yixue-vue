<template>
    <div>
        <div class="commentBox">
            <el-avatar class="avatar"
                       :icon=" getUserPhoto == null ? 'el-icon-user-solid':''"
                       :src="getUserPhoto">
            </el-avatar>
            <el-input
                    class="input"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 4}"
                    placeholder="既然来了，那就留下些什么吧~"
                    v-model="value"
                    @input="vaildCount">
            </el-input>

        </div>
        <div class="bottom">
            <el-button class="submit p2" type="primary" @click="handleSubmit">发送评论</el-button>
            <el-button class="cancel p2" type="info" @click="handleCancle">取消评论</el-button>
            <span class="allow p2" >还能输入{{ count }}个字符</span>
        </div>
    </div>

</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
    name: 'CommentBox',
    data() {
        return {
            comments: [],
            submitting: false,
            value: '',
            ifIcon: '',
            user: {},
            count: 1024,
        }
    },
    computed: {
        //获取头像地址
        ...mapGetters(['getUserPhoto']),
    },
    methods: {
        //拿到vuex中的写的方法
        ...mapMutations(['setLoginMessage']),
        //还能输入count个字符
        vaildCount() {
            const count = 1024 - this.value.length;
            if (count <= 0) {
                this.count = 0
            } else {
                this.count = count;
            }
        },
        //发送评论
        handleSubmit() {
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

            if (this.value == "") {
                this.$notify.error({
                    title: '警告',
                    message: '评论内容不能为空哦~',
                    offset: 100
                });
                return;
            }
            //触发父组件的事件，发送请求
            this.$emit("submit-box", this.value)
        },
        handleCancle() {
            this.value = '';
            this.count = 1024;

            // if (this.toInfo) {
            //   this.$emit("cancel-box", this.toInfo.commentUid)
            // }

        },
    },
};
</script>


<style>
.commentBox {

}

.commentBox .avatar {
    margin:0 0 10px 10px;
}


.commentBox .input {
    display: inline-block;
    color: #606266;
    margin-left: 10px;
    width: 90%;
}

.commentBox .input textarea {
    resize: none;
}

.bottom {
    position: relative;
    width: 98%;
    height: 60px;
    line-height: 40px;
    margin-top: 10px;
}

.bottom .p2 {
    float: right;
    margin-top: 5px;
    margin-right: 10px;
}

.emoji-panel-btn img {
    height: 35px;
    width: 35px;
}


@media only screen and (min-width: 300px) and (max-width: 767px) {
    .commentBox .right {
        display: inline-block;
        margin: 5px 2px 0 0;
        width: 99%;
        height: 100%;
    }


}

</style>
