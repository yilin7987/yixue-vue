<template>
    <div class="share">
        <a href="javascript:void(0);" @click="praiseBlog(blogUid)">
            <svg-icon icon-class="praise" :class="isPraise? 'icon color':'icon'"></svg-icon>
        </a>
        <span>{{ praiseCount }}</span>

        <a href="javascript:void(0)" @click="copyLink">
            <svg-icon icon-class="share" class="icon"></svg-icon>
        </a>
    </div>
</template>

<script>

import {mapMutations} from "vuex";
import {isPraiseByUser, praiseBlogByUid} from "@/api/comment";

export default {
    name: "Praise",
    computed: {
        isLogin() {
            return this.$store.state.user.isLogin
        }
    },
    watch: {
        isLogin(nVal){
            if (nVal) {
                const params = new URLSearchParams();
                params.append("blogUid", this.blogUid);
                isPraiseByUser(params).then(response => {
                    if (response.code === 20000 && response.message == "已点赞") {
                        this.isPraise = true
                    }
                })
            }
        }
    },
    props: {
        praiseCount: {
            type: Number,
            default: 0
        },
        blogUid: {
            type: String
        },
    },
    data() {
        return {
            //是否点赞
            isPraise: false,
        };
    },
    methods: {
        //拿到vuex中的写的方法
        ...mapMutations(['setLoginMessage']),
        //复制链接
        copyLink(){
            let link = location.href;
            let oInput = document.createElement("input");
            oInput.value = link;
            document.body.appendChild(oInput);
            oInput.select();
            document.execCommand("Copy");
            this.$message({
                message: "链接已复制",
                type: "success"
            });
            oInput.remove();
        },
        //博客点赞
        praiseBlog(blogUid) {
            // 判断用户是否登录
            let isLogin = this.$store.state.user.isLogin
            if (!isLogin) {
                this.$notify.error({
                    title: '警告',
                    message: '登录后才可以点赞哦~',
                    offset: 100
                });
                // 未登录，自动弹出登录框
                this.setLoginMessage(Math.random())
                return;
            }
            const params = new URLSearchParams();
            params.append("blogUid", blogUid);
            praiseBlogByUid(params).then(response => {
                if (response.code == 20000) {
                    this.$notify({
                        title: '成功',
                        message: "点赞成功",
                        type: 'success',
                        offset: 100
                    });
                    this.$emit('update:praiseCount', response.data);
                    this.isPraise = true
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: response.message,
                        offset: 100
                    });
                }
            });
        },
    }
};
</script>

<style scoped>
.share {
    position: relative;
    overflow: hidden;
    /*垂直居中 */
    vertical-align: middle;
    /*水平居中*/
    text-align: center;
    margin-top: 10px;
}

.share a {
    margin: 0 100px;
}

.share span {
    font-size: 18px;
    position: absolute;
    top: 28px;
    left: 320px;
}

.share .icon {
    width: 36px;
    height: 36px;
    display: inline-block;
    color: #5D5D5D;
}

.share .color {
    color: #007cb0;
}

.share .icon:hover {
    color: #007cb0;
}
</style>
