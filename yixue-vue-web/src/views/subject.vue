<template>
  <div>
    <div class="pagebg sh"></div>
    <div class="container">
      <div class="share">
        <ul>
          <li v-for="item in dataList" :key="item.uid">
            <div class="shareli" @click="showSubjectItemList(item.uid)">
              <a href="javascript:void(0);">
                <i>
                  <img v-if="item.picture" class="resImg" :src="item.picture.txUrl" lazy>
                  <el-image class="resImg" v-else>
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </i>
                <h2>
                  <b>{{ item.summary }}</b>
                </h2>
                <span>{{ item.subjectName }}</span>
              </a>
            </div>
          </li>
        </ul>
      </div>

      <!--分页-->
      <div class="block" style="text-align: center;">
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>

    <SubjectItemList :visiable="visiable" @close="closeSubjectItemList"
                     :subjectUid="selectSubjectUid"></SubjectItemList>

  </div>
</template>

<script>
// import {getSubjectList} from "@/api/subject";
import SubjectItemList from "../components/SubjectItemList";
import {getSubjectList} from "@/api/subject";

export default {
  name: "share",
  data() {
    return {
      dataList: [],
      currentPage: 1,
      pageSize: 16,
      total: 0, //总数量
      visiable: false, //是否显示专辑item侧边栏
      selectSubjectUid: "", // 选中的SubjectUid
    };
  },
  components: {
    //注册组件
    SubjectItemList
  },
  created() {
    this.subjectList()
  },
  methods: {
    subjectList() {
      const params = {};
      params.pageSize = this.pageSize
      params.currentPage = this.currentPage
      getSubjectList(params).then(response => {
        if (response.code == 20000) {
          this.dataList = response.data.records;
          this.total = response.data.total;
          this.pageSize = response.data.size;
          this.currentPage = response.data.current;
        }
      });
    },
    //改变页码
    handleCurrentChange(val) {
      this.currentPage = val; //改变当前所指向的页数
      this.subjectList();
    },
    showSubjectItemList(selectSubjectUid) {
      this.selectSubjectUid = selectSubjectUid
      this.visiable = !this.visiable
    },
    closeSubjectItemList() {
      this.visiable = !this.visiable
    }
  }
};
</script>

<style scoped>

/*pagebg*/
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

.share {
  min-height: 550px;
}

/*share*/
.share {
  overflow: hidden;
  padding-top: 10px
}

.shareli {
  margin: 0 15px;
  padding-bottom: 10px
}

.share ul li {
  width: 25%;
  float: left;
  overflow: hidden;
  position: relative;
  margin-bottom: 30px;
  -webkit-transition: all .3s ease;
  -moz-transition: all .3s ease;
  -ms-transition: all .3s ease;
  -o-transition: all .3s ease;
  transition: all .3s ease;
}

.share ul li i {
  display: block;
  overflow: hidden;
}

.share ul li i img {
  width: 100%;
  height: 160px;
  margin: auto
}

.share ul li h2 {
  height: 38px;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  background: #fff;
  padding: 15px 13px;
  font-weight: normal;
  -webkit-box-shadow: 0 5px 10px 0 rgba(146, 146, 146, .1);
  -moz-box-shadow: 0 5px 10px 0 rgba(146, 146, 146, .1);
  box-shadow: 0 5px 10px 0 rgba(146, 146, 146, .1);
}

.share ul li h2 b {
  height: 38px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  font-weight: normal
}

.share ul li:hover {
  transform: translateY(-6px);
  -webkit-transform: translateY(-6px);
  -moz-transform: translateY(-6px);
}

.share ul li span {
  position: absolute;
  right: 30px;
  top: 15px;
  background: rgba(232, 40, 74, .8);
  color: #FFF;
  padding: 3px 8px;
  font-size: 12px;
  border-radius: 3px;
}

.resImg {
  width: 100%;
  height: 160px;
  vertical-align: middle;
}

.el-drawer {
  min-width: 400px;
}
</style>
