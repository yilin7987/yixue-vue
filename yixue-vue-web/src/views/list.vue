<template>
    <div>
        <div class="pagebg sh"></div>
        <div class="container">
            <h1 class="t_nav">
                <span>慢生活，不是懒惰，放慢速度不是拖延时间，而是让我们在生活中寻找到平衡。</span>
                <a href="/" class="n1">网站首页</a>
                <a href="/" class="n2">搜索</a>
            </h1>

            <!--blogsbox begin-->
            <div class="blogsbox">
                <div
                        v-for="item in blogData"
                        :key="item.uid"
                        class="blogs"
                        data-scroll-reveal="enter bottom over 1s"
                >
                    <h3 class="blogtitle">
                        <a
                                href="javascript:void(0);"
                                @click="goToInfo(item)"
                                v-html="item.title"
                        >{{ item.title }}</a>
                    </h3>
                    <span class="blogpic">
            <a href="javascript:void(0);" @click="goToInfo(item)" title>
              <img v-if="item.picture" :src="item.picture.txUrl" alt>
            </a>
          </span>
                    <p class="blogtext" v-html="item.summary">{{ item.summary }}</p>
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
                    <div
                            class="loadContent"
                            @click="loadContent"
                            v-if="!isEnd && !loading && totalPages>0"
                    >点击加载更多
                    </div>

                    <div class="lds-css ng-scope" v-if="!isEnd && loading">
                        <div style="width:100%;height:100%" class="lds-facebook">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>

                    <span v-if="blogData.length >= 0 && isEnd &&!loading && totalPages>0">我也是有底线的~</span>

                    <span v-if="totalPages == 0 && !loading">空空如也~</span>
                </div>
            </div>
            <!--blogsbox end-->

            <div class="sidebar">
                <!-- 三级推荐 -->
                <ThirdRecommend></ThirdRecommend>
                <!--标签云-->
                <TagCloud></TagCloud>
                <!--四级推荐-->
                <FourthRecommend></FourthRecommend>
                <!--点击排行-->
                <HotBlog></HotBlog>
                <!--关注我们-->
                <FollowUs></FollowUs>
            </div>
        </div>
    </div>
</template>

<script>
import ThirdRecommend from "../components/ThirdRecommend";
import FourthRecommend from "../components/FourthRecommend";
import TagCloud from "../components/TagCloud";
import HotBlog from "../components/HotBlog";
import FollowUs from "../components/FollowUs";
import {searchBlog} from "@/api/search";

export default {
    components: {
        FourthRecommend,
        ThirdRecommend,
        TagCloud,
        HotBlog,
        FollowUs,
    },
    data() {
        return {
            blogData: [],
            keywords: "",
            currentPage: 1,
            totalPages: 0,
            pageSize: 10,
            total: 0, //总数量
            tagUid: "",
            searchBlogData: [], //搜索出来的文章
            sortUid: "",
            isEnd: false, //是否到底底部了
            loading: false //内容是否正在加载
        }
    },
    created() {
        this.keywords = this.$route.query.keyword;
        this.tagUid = this.$route.query.tagUid;
        this.sortUid = this.$route.query.sortUid;
        this.author = this.$route.query.author;

        if (
            this.keywords == undefined &&
            this.tagUid == undefined &&
            this.sortUid == undefined &&
            this.author == undefined
        ) {
            return;
        }

        this.search();
    },
    watch: {
        $route() {
            this.keywords = this.$route.query.keyword;
            this.tagUid = this.$route.query.tagUid;
            this.sortUid = this.$route.query.sortUid;
            this.searchBlogData = [] // 清空查询出来的博客
            this.search();
        }
    },
    methods: {
        //跳转到文章详情
        goToInfo(blog) {
            if (blog.type == "0") {
                let routeData = this.$router.resolve({
                    path: "/info",
                    query: {blogUid: blog.uid}
                });
                window.open(routeData.href, '_blank');
            } /*else if(blog.type == "1") {
        const params = new URLSearchParams();
        params.append("uid", blog.uid);
        getBlogByUid(params).then(response => {
          // 记录一下用户点击日志
        });
        window.open(blog.outsideLink, '_blank');
      }*/
        },
        // 加载内容
        loadContent() {
            this.currentPage = this.currentPage + 1;
            this.search();
        },
        convertSearchData(response) {
            if (response.code == 20000 && response.data.records.length > 0) {
                this.isEnd = false;
                //获取总页数
                this.totalPages = response.data.total;

                let blogData = response.data.records;
                this.total = response.data.total;
                this.pageSize = response.data.size;
                this.currentPage = response.data.current;

                //全部加载完毕
                if (blogData.length < this.pageSize) {
                    this.isEnd = true;
                }

                blogData = this.searchBlogData.concat(blogData);
                this.searchBlogData = blogData;
                this.blogData = blogData;
                this.loading = false;

            } else {
                this.isEnd = true;
                this.loading = false;
            }
        },
        search() {
            let params;
            this.loading = true;
            if (this.keywords != undefined) {
                let params = new URLSearchParams();
                params.append("currentPage", this.currentPage);
                params.append("pageSize", this.pageSize);
                params.append("keywords", this.keywords);
                searchBlog(params).then(response => {
                    this.convertSearchData(response)
                });
            } else if (this.tagUid != undefined) {
                params = new URLSearchParams();
                params.append("tagUid", this.tagUid);
                params.append("currentPage", this.currentPage);
                params.append("pageSize", this.pageSize);

                searchBlog(params).then(response => {
                    this.convertSearchData(response)
                });
            } else if (this.sortUid != undefined) {
                params = new URLSearchParams();

                params.append("blogSortUid", this.sortUid);
                params.append("currentPage", this.currentPage);
                params.append("pageSize", this.pageSize);

                searchBlog(params).then(response => {
                    this.convertSearchData(response)
                });
            } else if (this.author != undefined) {
                params = new URLSearchParams();
                params.append("author", this.author);
                params.append("currentPage", this.currentPage);
                params.append("pageSize", this.pageSize);
                searchBlog(params).then(response => {
                    this.convertSearchData(response)
                });
            }
        },
        //点击了分类
        goToList(uid) {
            let routeData = this.$router.resolve({
                path: "/list",
                query: {sortUid: uid}
            });
            window.open(routeData.href, '_blank');
        },
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
.pagebg {
    margin-top: 50px;
    padding: 10px 0;
    text-align: center;
    width: 100%;
}

.sh {
    background-size: cover;
    background-position: top center;
}

.container {
    width: 1140px;
    margin: 20px auto
}

h1.t_nav {
    border-bottom: #bfbfbf 1px solid;
    font-size: 14px;
    font-weight: normal;
    line-height: 40px;
    width: 100%;
    overflow: hidden;
    margin-bottom: 20px
}

h1.t_nav span {
    float: right;
    color: #000;
}

.n1, .n2 {
    width: 100px;
    display: block;
    text-align: center;
    float: left;
    color: #fff;
}

.n1 {
    background: #000;
}

.n2 {
    background: #3a6ab5;
}

.blogsbox {
    width: 66%;
    overflow: hidden;
    float: left
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
    margin-top: 20px
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

.ng-scope {
    margin: 0 auto;
    width: 18%;
    height: 10%;
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
</style>
