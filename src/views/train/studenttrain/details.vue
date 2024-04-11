<template>
  <div class="app-container">
    <div v-if="info">
      <el-button
        type="primary"
        @click="$router.back()"
        icon="el-icon-arrow-left"
        >返回</el-button
      >
      <div class="nav-title">
        {{ info.trainEquipmentType == 0 ? "简安行模拟器" : "机器人教练" }}
        {{ $route.query.trainSubject == 2 ? "(科目二)" : "(科目三)" }}
        <span>{{ info.startTime }} - {{ info.finishTime }}</span>
      </div>
      <div>
        <div class="column-title">>>基本信息</div>
        <div class="content">
          <ul class="content-nav">
            <li>
              <img src="@/assets/images/sc.png" alt="" />
              <div>
                <p>训练时长(分钟)</p>
                <p>{{ info.trainTimeDuration }}</p>
              </div>
            </li>
            <li>
              <img src="@/assets/images/cs.png" alt="" />
              <div>
                <p>训练次数</p>
                <p>{{ info.trainNum }}</p>
              </div>
            </li>
            <li>
              <img src="@/assets/images/tgcs.png" alt="" />
              <div>
                <p>通过次数</p>
                <p>{{ info.passNum }}</p>
              </div>
            </li>
            <li>
              <img src="@/assets/images/tgl.png" alt="" />
              <div>
                <p>通过率</p>
                <p>
                  {{ parseInt((info.passNum / info.trainNum) * 100) || 0 }}%
                </p>
              </div>
            </li>
          </ul>
          <div class="remark-container">
            <div>
              <p>教练</p>
              <p>评语</p>
            </div>
            {{ info.trainComments }}
          </div>
        </div>
        <ul class="nav-slider">
          <li
            :class="navIndex == index ? 'actv' : ''"
            v-for="(item, index) in info.trainDetails"
            :key="index"
            @click="handleClick(index)"
          >
            {{ item.trainProjectName }}
          </li>
        </ul>
        <div class="column-title">>>训练记录</div>
        <ul class="record-list">
          <li v-for="(item, index) in trainErrors" @click="getCarTrack(item.id)" :key="item.id">
            <div class="map"><img src="@/assets/images/play.png" alt="" /></div>
            <div class="entry">
              <div class="title">
                {{ `第${index + 1}次训练` }}
                <!-- 错误操作次数：{{
                  trainErrors.length
                }}次 -->
              </div>
              <!-- <div
                @click="getCarTrack(jtem.id)"
                v-for="jtem in item.trainErrors"
                :key="jtem.id"
                class="item"
              >
                <span></span>{{ jtem.trainProjectName }}
              </div> -->
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getStudentTrainInfo, getInfoProject } from "@/api/cloud/train";
export default {
  name: "StudentDetils",
  data() {
    return {
      info: null,
      navIndex: 0,
      navTapList: [{}],
      trainErrors: []
    };
  },
  watch: {
    navIndex(val) {
      console.log(val);
    }
  },
  methods: {
    handleChange(val) {},
    getCarTrack(id) {
      this.$router.push({
        name: "OlMap",
        query: { id }
      });
    },
    handleClick(index) {
      this.navIndex = index;
      this.trainErrors = this.info.trainDetails[index].trainErrors;
    }
  },
  mounted() {
    const { id } = this.$route.query;
    if (id) {
      getStudentTrainInfo({ id }).then(({ data }) => {
        this.info = data;
        this.trainErrors = data.trainDetails[0].trainErrors;
      });
      getInfoProject({ id }).then((res) => {
        // this.navTapList = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.app-container {
  height: calc(100vh - 50px);
  overflow-y: scroll;
  > div {
    background: #ffffff;
    border-radius: 6px;
    padding: 15px 10px;
    .nav-title {
      margin-left: 20px;
      display: inline-block;
      font-size: 22px;
      color: #000000;
      span {
        font-size: 16px;
        color: #444444;
      }
    }
  }
}
.nav-slider {
  display: flex;
  flex-wrap: wrap;
  li {
    min-width: 120px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px rgb(242, 242, 242) solid;
    cursor: pointer;
    font-size: 16px;
  }
}

.column-title {
  height: 40px;
  background: #eff0f1;
  box-sizing: border-box;
  padding: 0 4px;
  line-height: 40px;
  color: #444444;
  font-size: 22px;
  margin: 10px 0;
}

.content {
  box-sizing: border-box;
  padding: 4px;
  .content-nav {
    width: 50%;
    display: flex;
    li {
      display: flex;
      flex: 1;
      align-items: center;
      > div {
        margin-left: 15px;
      }
      img {
        height: 46px;
      }
      p {
        font-size: 16px;
        color: #444444;
      }
    }
  }
  span {
    margin-right: 20px;
    font-size: 14px;
  }
  div {
    font-size: 14px;
    padding: 10px 0;
  }

  .remark-container {
    border: 1px dashed #c9cdd2;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    font-size: 16px;
    color: #444444;
    > div {
      width: 60px;
      border-right: 2px solid #c9cdd2;
      margin-right: 10px;
      p {
        color: #444444;
        font-size: 22px;
      }
    }
  }
}

.record-list {
  li {
    display: flex;
    border-bottom: 1px solid #c9cdd2;
    padding: 10px 0;
    .entry {
      height: 120px;
      width: calc(100% - 240px);
      overflow-y: scroll;
      .title {
        width: 100%;
        height: 30px;
        font-size: 16px;
        color: #000000;
      }
      .item {
        width: calc(25% - 20px);
        height: 20px;
        margin-right: 20px;
        display: inline-block;
        line-height: 20px;
        font-size: 16px;
        color: #444444;
        white-space: nowrap;
        cursor: pointer;
        span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
          border: 1px solid #e3a379;
          box-sizing: border-box;
          margin-top: 6px;
          margin-right: 6px;
        }
      }

      p:last-child {
        margin-right: 0;
      }
    }

    .map {
      width: 220px;
      height: 120px;
      background: #eff0f1;
      border-radius: 4px;
      margin-right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      img {
        width: 50px;
      }
    }
  }
  li:last-child {
    border-bottom: none;
  }
}
.track {
  background-color: rgb(242, 242, 242);
}

.actv {
  background-color: rgb(242, 242, 242);
}
</style>
