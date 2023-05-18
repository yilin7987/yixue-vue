<template>
    <article>
        <div class="picsbox">
            <!--一级推荐-->
            <FirstRecommend></FirstRecommend>

            <!-- 二级推荐 -->
            <div class="toppic">
                <li v-for="item in secondData" :key="item.uid" @click="goToInfo(item)">
                    <a href="javascript:void(0);">
                        <i>
                            <img v-if="item.picture" :src="item.picture.txUrl">
                        </i>
                        <h2>{{ item.title }}</h2>
                        <span>{{ item.blogSort.sortName }}</span>
                    </a>
                </li>
            </div>
        </div>
        <!-- 博客 -->
        <div class="blogsbox">
            <div
                    v-for="item in newBlogData"
                    :key="item.uid"
                    class="blogs"
                    data-scroll-reveal="enter bottom over 1s"
            >
                <h3 class="blogtitle">
                    <a href="javascript:void(0);" @click="goToInfo(item)">{{ item.title }}</a>
                </h3>

                <span class="blogpic">
          <a href="javascript:void(0);" @click="goToInfo(item)" title>
            <img v-if="item.picture" :src="item.picture.txUrl" alt>
          </a>
        </span>

                <p class="blogtext">{{ item.summary }}</p>
                <div class="bloginfo">
                    <ul>
                        <li class="author">
                            <img src="../../statis/icons/author.svg">
                            <a href="javascript:void(0);" @click="goToAuthor(item.author)">{{ item.author }}</a>
                        </li>
                        <li class="lmname" v-if="item.blogSort">
                            <img src="../../statis/icons/sort.svg">
                            <a
                                    href="javascript:void(0);"
                                    @click="goToList(item.blogSort.uid)"
                            >{{ item.blogSort.sortName }}</a>
                        </li>
                        <li class="view">
                            <img src="../../statis/icons/count.svg">
                            <span>{{ item.clickCount }}</span>
                        </li>
                        <li class="createTime">
                            <img src="../../statis/icons/createTime.svg">
                            {{ item.createTime }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="isEnd">
                <!-- <span v-if="!isEnd">正在加载中~</span> -->

                <div class="loadContent" @click="loadContent" v-if="!isEnd && !loading">点击加载更多</div>
                <span v-if="isEnd">我也是有底线的~</span>
            </div>
        </div>
        <div class="sidebar">
            <!--标签云-->
            <TagCloud></TagCloud>

            <!-- 三级推荐 -->
            <ThirdRecommend></ThirdRecommend>

            <!--四级推荐-->
            <FourthRecommend></FourthRecommend>

            <!--点击排行-->
            <HotBlog></HotBlog>

            <!--关注我们-->
            <FollowUs></FollowUs>

            <!-- 友情链接-->
            <Link></Link>
        </div>
    </article>
</template>

<script>
import FirstRecommend from "../components/FirstRecommend";
import TagCloud from "../components/TagCloud";
import ThirdRecommend from "../components/ThirdRecommend";
import FourthRecommend from "../components/FourthRecommend";
import HotBlog from "../components/HotBlog";
import FollowUs from "../components/FollowUs";
import Link from "../components/Link";
import {getBlogByLevel, getNewBlog} from "@/api/blog/blog"
import {Loading} from "element-ui";
import {recorderVisitPage} from "@/api";

export default {
    components: {FirstRecommend, TagCloud, ThirdRecommend, FourthRecommend, HotBlog, FollowUs, Link},
    created() {
        // 获取二级推荐
        const params = new URLSearchParams();
        params.append("level", 2);
        getBlogByLevel(params).then(response => {
            if (response.code === 20000) {
                this.secondData = response.data;
            }
        })
        //获取最新文章
        this.newBlogList()
        // 访客
        // eslint-disable-next-line no-unused-vars
        recorderVisitPage().then(response => {
        });
        // const secondParams = new URLSearchParams();
        // secondParams.append("level", 2);
        // // 是否排序
        // secondParams.append("useSort", 1);
        // getBlogByLevel(secondParams).then(response => {
        //   if(response.code == this.$ECode.SUCCESS) {
        //     this.secondData = response.data.records;
        //   }
        // });
    },
    data() {
        return {
            // 最新文章
            newBlogData: [],
            // 一级推荐数据
            //firstData: [],
            // 二级级推荐数据
            secondData: [],
            isEnd: false, //是否到底底部了
            loading: false, //是否正在加载
            currentPage: 1, //当前页
            pageSize: 10, // 页数量
            total: 0, //总数量
        }
    },
    methods: {
        loadContent() {
            this.loading = false;
            this.currentPage = this.currentPage + 1;
            const params = {}
            params.currentPage = this.currentPage
            params.pageSize = this.pageSize;
            getNewBlog(params).then(response => {
                if (response.code == 20000 && response.data.records.length > 0) {
                    this.isEnd = false;
                    const newData = this.newBlogData.concat(response.data.records);
                    this.newBlogData = newData;
                    this.total = response.data.total;
                    this.pageSize = response.data.size;
                    this.currentPage = response.data.current;

                    //全部加载完毕
                    if (newData.length < this.pageSize) {
                        this.isEnd = true;
                    }
                } else {
                    this.isEnd = true;
                }
                this.loading = false;
            });
        },
        newBlogList() {
            this.loadingInstance = Loading.service({
                lock: true,
                text: '正在努力加载中……',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            const params = {}
            params.currentPage = this.currentPage
            params.pageSize = this.pageSize;
            getNewBlog(params).then(response => {
                if (response.code === 20000) {
                    this.newBlogData = response.data.records;
                    this.total = response.data.total;
                    this.pageSize = response.data.size;
                    this.currentPage = response.data.current;
                }
                this.loadingInstance.close();
            }, () => {
                this.loadingInstance.close();
            })
        },
        //跳转到文章详情
        goToInfo(blog) {
            if (blog.type == "0") {
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
        //点击了分类
        goToList(uid) {
            let routeData = this.$router.resolve({
                path: "/list",
                query: {sortUid: uid}
            });
            window.open(routeData.href, '_blank');
        },
        //点击作者
        goToAuthor(author) {
            let routeData = this.$router.resolve({
                path: "/list",
                query: {author: author}
            });
            window.open(routeData.href, '_blank');
        },

    }
}
</script>

<style scoped>

article {
    width: 1200px;
    margin: 80px auto 0;
    overflow: hidden;
}

.picsbox {
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-bottom: 20px;
}

/*toppic*/
.toppic {
    width: 32%;
    float: right;
    overflow: hidden;
    position: relative;
}

.toppic li {
    width: 100%;
    background: #000;
    position: relative;
    overflow: hidden;
}

.toppic li i {
    display: block;
    opacity: 0.7;
    -moz-transition: all .5s ease;
    -webkit-transition: all .5s ease;
    -ms-transition: all .5s ease;
    -o-transition: all .5s ease;
    transition: all .5s ease;
    overflow: hidden
}

.toppic li i img {
    width: 100%;
    height: 216px;
}

.toppic li h2 {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 20px;
    color: #fff;
    display: block;
    font-weight: normal;
    font-size: 16px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.7);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.toppic li span {
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 6px 10px;
    background: rgba(0, 0, 0, .7);
    font-size: 12px;
    display: block;
    color: #FFF;
    border-radius: 3px;
}

.toppic li:hover i {
    opacity: 1;
}

.toppic li:last-child {
    margin-top: 19px
}

.blogsbox {
    width: 66%;
    overflow: hidden;
    float: left;
}

.blogs {
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;
    padding: 20px;
    background: #FFF;
    -webkit-box-shadow: 0 2px 5px 0 rgba(146, 146, 146, .1);
    -moz-box-shadow: 0 2px 5px 0 rgba(146, 146, 146, .1);
    box-shadow: 0 2px 5px 0 rgba(146, 146, 146, .1);
    -webkit-transition: all 0.6s ease;
    -moz-transition: all 0.6s ease;
    -o-transition: all 0.6s ease;
    transition: all 0.6s ease;
}

.blogs .blogpic {
    float: left;
    width: 30%;
    max-height: 170px;
    margin-right: 20px;
    display: block;
    overflow: hidden;
}

.blogs .blogpic img {
    width: 100%;
    height: auto;
    -webkit-transition: all 0.6s ease;
    -moz-transition: all 0.6s ease;
    -o-transition: all 0.6s ease;
    transition: all 0.6s ease;
    margin-bottom: 10px
}

.blogs .blogpic :hover img {
    transform: scale(1.1)
}

.blogs .blogtitle {
    margin: 0 0 10px 0;
    font-size: 20px;
    overflow: hidden;
}

.blogs .blogtitle a:hover {
    color: #337ab7;
}

.blogs .blogtext {
    font-size: 14px;
    color: #566573;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    margin: 20px 0;
}

.bloginfo {
    position: absolute;
    right: 0;
    bottom: 20px;
}

.bloginfo ul {
}

.bloginfo ul li {
    float: left;
    font-size: 12px;
    padding: 0 20px 0 0;
    color: #748594;
    line-height: 1;
    display: inline-block;
}

.bloginfo ul li img {
    display: inline-block;
    margin-right: 4px;
    vertical-align: -0.20em;
}

.bloginfo ul li a {
    color: #748594;
}

.bloginfo ul li a:hover {
    color: #000
}

.isEnd {
    float: left;
    width: 100%;
    height: 80px;
    text-align: center;
}

.loadContent {
    width: 120px;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    margin: 0 auto;
    color: aliceblue;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.8);
}

/* sidebar */
.sidebar {
    width: 32%;
    overflow: hidden;
    float: right
}

.sidebar div {
    padding: 35px 30px;
    margin-bottom: 20px;
    background: #FFF;
    -webkit-box-shadow: 0 2px 5px 0 rgba(146, 146, 146, .1);
    -moz-box-shadow: 0 2px 5px 0 rgba(146, 146, 146, .1);
    box-shadow: 0 2px 5px 0 rgba(146, 146, 146, .1);
}

.sidebar div:hover ::after {
    width: 70px;
}
</style>
