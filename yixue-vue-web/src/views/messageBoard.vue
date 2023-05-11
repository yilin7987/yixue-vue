<template>
    <div>
        <div class="pagebg sorts"></div>
        <div class="container">
            <!--      <h1 class="t_nav">-->
            <!--        <span>每个人都有自己故事，只是演绎的方式不同。</span>-->
            <!--        <a href="/" class="n1">网站首页</a>-->
            <!--        <a href="javascript:void(0);" class="n2">留言</a>-->
            <!--      </h1>-->

            <CommentBox
                    :userInfo="userInfo"
                    @submit-box="submitBox"
            ></CommentBox>

            <div class="message_infos">
                <Comment class="com" :comments="comments" @submit="submit"></Comment>
                <div class="noComment" v-if="comments.length == 0">还没有评论，快来抢沙发吧！</div>
            </div>

        </div>
    </div>

</template>

<script>
import Comment from '../components/Comment'
import CommentBox from "../components/CommentBox";
import {addComment, getCommentList} from "@/api/comment";
import {mapMutations} from "vuex";

export default {
    components: {Comment, CommentBox},
    data() {
        return {
            showCancel: false,
            userInfo: {},
            comments: [],
            currentPage: 1,
            pageSize: 10,
        }
    },
    created() {
        this.getCommentDataList();
    },
    methods: {
        //拿到vuex中的写的方法
        ...mapMutations(["setCommentList"]),
        submit(){
            this.getCommentDataList();
        },
        submitBox(content) {
            let params = {};
            params.userUid = this.$store.state.user.userInfo.uid;
            params.content = content;
            params.blogUid = '1'
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
        getCommentDataList() {
            let params = {};
            // 留言板的uid
            params.blogUid = "1";
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
    }
}
</script>
<style>
.com {
    margin-top: 100px;
}

/*pagebg*/
.pagebg {
    margin-top: 50px;
    padding: 10px 0;
    text-align: center;
    width: 100%;
}

.sorts {
    background-size: cover;
    background-position: top center;
}

.container {
    width: 1140px;
    margin: 20px auto
}

.message_infos {
    min-height: 20px;
}

.noComment {
    width: 100%;
    text-align: center;
}
</style>
