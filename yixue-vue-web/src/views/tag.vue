<template>
    <div>
        <div class="pagebg tagPage"></div>
        <div class="container">
            <!--      <h1 class="t_nav">-->
            <!--        <span>内心没有阳光的人温暖不了别人。用心写博客，知识不是高谈阔论，是现实点点滴滴的积累。</span>-->
            <!--        <a href="/" class="n1">网站首页</a>-->
            <!--        <a href="javascript:void(0);" class="n2">标签</a>-->
            <!--      </h1>-->

            <div class="sortBox">
                <div class="time">
                    <div class="block">
                        <div class="radio" style="margin-bottom:20px;"></div>
                        <el-timeline :reverse="reverse">
                            <el-timeline-item v-for="(activity, index) in activities" hide-timestamp :key="index">
                                <span
                                        @click="getBlogTagList(activity.uid)"
                                        :class="[activity.uid == selectBlogUid ? 'sortBoxSpan sortBoxSpanSelect' : 'sortBoxSpan']">
                                        {{ activity.tagName }}
                                </span>
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div>

                <div class="article">
                    <div class="block" v-infinite-scroll="load">
                        <el-timeline>
                            <el-timeline-item
                                    v-for="item in itemByDate"
                                    :key="item.uid"
                                    :timestamp="item.createTime"
                                    placement="top">
                                <el-card>
                                    <h4 @click="goToList('blogContent', item)" class="itemTitle">{{ item.title }}</h4>
                                    <br>
                                    <el-tag class="elTag" v-if="item.isOriginal==1" type="danger">原创</el-tag>
                                    <el-tag class="elTag" v-if="item.isOriginal==0" type="info">转载</el-tag>

                                    <el-tag class="elTag"
                                            v-if="item.author"
                                            @click="goToList('author', item)">
                                        {{ item.author }}
                                    </el-tag>

                                    <el-tag class="elTag"
                                            type="success"
                                            v-if="item.blogSort != null"
                                            @click="goToList('blogSort', item)">
                                        {{ item.blogSort.sortName }}
                                    </el-tag>
                                    <template v-for="tagItem in item.tagList">
                                        <el-tag class="elTag"
                                                v-if="tagItem != null"
                                                :key="tagItem.uid"
                                                style="margin-left: 3px;"
                                                @click="goToList('tag', tagItem)"
                                                type="warning">
                                            {{ tagItem.content }}
                                        </el-tag>
                                    </template>
                                </el-card>
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getBlogByTagUid, getTagList} from "@/api/blog/tag";

export default {
    data() {
        return {
            selectBlogUid: "",
            reverse: false,
            activities: [],
            itemByDate: [],
            articleByDate: {},
            count: 0,
            currentPage: 1,
            pageSize: 10
        };
    },
    created() {
        getTagList().then(response => {
            if (response.code == 20000) {
                const activities = response.data;
                const result = [];
                for (let a = 0; a < activities.length; a++) {
                    const dataForDate = {
                        tagName: activities[a].content,
                        uid: activities[a].uid
                    };
                    result.push(dataForDate);
                }
                this.activities = result;
                // 默认选择第一个
                this.getBlogTagList(activities[0].uid);
            }
        });
    },
    methods: {
        getBlogTagList(tagUid) {
            this.selectBlogUid = tagUid;
            const params = new URLSearchParams();
            params.append("tagUid", tagUid);
            getBlogByTagUid(params).then(response => {
                if (response.code == 20000) {
                    this.itemByDate = response.data.records;
                    this.currentPage = response.data.current;
                    this.pageSize = response.data.size;
                }
            });
        },
        //跳转到搜索详情页
        goToList(type, entity) {
            switch (type) {
                case "tag": {
                    // 标签uid
                    let routeData = this.$router.resolve({
                        path: "/list",
                        query: {tagUid: entity.uid}
                    });
                    window.open(routeData.href, "_blank");
                }
                    break;
                case "blogSort": {
                    let routeData = this.$router.resolve({
                        path: "/list",
                        query: {sortUid: entity.blogSort.uid}
                    });
                    window.open(routeData.href, "_blank");
                }
                    break;
                case "author": {
                    let routeData = this.$router.resolve({
                        path: "/list",
                        query: {author: entity.author}
                    });
                    window.open(routeData.href, "_blank");
                }
                    break;
                case "blogContent": {
                    let routeData = this.$router.resolve({
                        path: "/info",
                        query: {blogUid: entity.uid}
                    });
                    window.open(routeData.href, "_blank");
                }
                    break;
            }
        }
    }
}
</script>

<style scoped>
.tagPage {
    background-size: cover;
    background-position: top center;
}

.pagebg {
    margin-top: 50px;
    padding: 10px 0;
    text-align: center;
    width: 100%;
}

.container {
    width: 1140px;
    margin: 20px auto;
}

.sortBox {
    color: #555;
}

/*归档页面*/

.sortBox .time {
    float: left;
    width: 17%;
    height: 817px;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto;
}

.sortBox .article {
    float: left;
    width: 78%;
    height: 800px;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto;
}

.sortBoxSpan {
    cursor: pointer;
}

.sortBoxSpan:hover {
    color: #409eff;
}

.sortBoxSpanSelect {
    color: #409eff;
}

.itemTitle {
    cursor: pointer;
}

.itemTitle:hover {
    color: #409eff;
}

.elTag {
    cursor: pointer;
    margin-right: 8px;
}
</style>
