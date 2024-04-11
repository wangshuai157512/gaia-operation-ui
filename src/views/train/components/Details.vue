<template>
  <el-dialog
    v-if="option"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :show-close="false"
    :visible.sync="visible"
    width="1300px"
    append-to-body
    disabled
  >
    <div slot="title" class="dialog-title">
      <span style="font-size: 20px; margin-right: 10px">训练详情</span>
      <span v-if="option"
        >{{ typeName[option.trainEquipmentType] }} |
        {{ option.trainEquipmentId }}</span
      >
      <span
        style="float: right; cursor: pointer; font-size: 28px"
        @click="cancel"
        >×</span
      >
    </div>
    <div>
      <div v-if="topTime" class="top-info">
        <div>
          训练时间：{{ topTime.loginTime }}—{{
            topTime.logoutTime ? topTime.logoutTime.split(" ")[1] : ""
          }}({{ parseTimes(topTime.loginTimeDuration) }})
        </div>
        <div>训练地点：{{ topTime.schoolName }}</div>
      </div>
      <div class="dialog-content">
        <ul class="item-tap">
          <li
            v-for="(item, index) in tapList"
            :key="index"
            @click="tapIndex = index"
            :class="[tapIndex == index ? 'activ' : '']"
            v-html="sad(item.label)"
          ></li>
        </ul>
        <div
          v-if="info && info.subjectList && info.subjectList.length"
          class="details0"
        >
          <div v-for="(item, index) in info.subjectList" :key="index">
            <div class="title">总用时{{ info.trainTimeDuration }}分钟</div>
            <ul>
              <li>
                <p>{{ index + 1 }}</p>
                <span class="name">{{ item.projectName }}</span>
                <span>训练了{{ item.trainNum }}次</span>
                <span>共用时{{ item.trainTimeDuration }}分钟</span>
              </li>
              <!-- <li>
                  <p>1</p>
                  <span class="name">手刹</span>
                  <span>训练了1次</span>
                  <span>共用时2分50秒</span>
                </li> -->
            </ul>
          </div>
        </div>
        <div
          v-if="info && info.projectList && info.projectList.length"
          class="details1"
        >
          <ul class="content-nav">
            <li>
              <img src="@/assets/images/sc.png" alt="" />
              <div>
                <p>训练时长</p>
                <p>{{ parseTimes(info.trainTimeDuration) }}</p>
              </div>
            </li>
            <li>
              <img src="@/assets/images/cs.png" alt="" />
              <div>
                <p>训练次数</p>
                <p>{{ info.trainNum }}次</p>
              </div>
            </li>
            <li>
              <img src="@/assets/images/tgcs.png" alt="" />
              <div>
                <p>通过次数</p>
                <p>{{ info.passCount }}次</p>
              </div>
            </li>
            <li>
              <img src="@/assets/images/tgl.png" alt="" />
              <div>
                <p>通过率</p>
                <p>{{ info.passRate }}</p>
              </div>
            </li>
          </ul>
          <div class="map-container">
            <div class="left">
              <iframe
                v-if="src"
                :src="src"
                style="width: 100%; height: 100%"
                ref="iframe"
                frameborder="0"
              ></iframe>
              <div v-else class="map">
                <img src="@/assets/images/play.png" alt="" />
              </div>
            </div>
            <div class="right">
              <div v-for="(item, index) in info.projectList" :key="index">
                <div class="title">
                  第{{ index + 1 }}次训练
                  <span class="fraction">{{ item.trainScore }}分</span>
                  <span class="date">
                    {{ item.startTime?item.startTime.split(" ")[1]:'' }}—{{
                      item.finishTime?item.finishTime.split(" ")[1]:""
                    }}{{ item.trainTimeDuration&&item.trainTimeDuration!=='0'?'('+parseTimes(item.trainTimeDuration)+')':'' }}</span
                  >
                </div>
                <ul v-if="item.judgeList">
                  <li v-for="(jtem, jndex) in item.judgeList" :key="jndex">
                    <div
                      v-if="jtem.projectName"
                      style="
                        display: flex;
                        width: 30%;
                        height: 20px;
                        align-items: center;
                      "
                    >
                      <p>{{ jndex + 1 }}</p>
                      <span class="name">{{ jtem.projectName }}</span>
                    </div>
                    <div v-else style="display: flex">
                      <p>{{ jndex + 1 }}</p>
                    </div>
                    <div style="display: flex; width: 70%">
                      <span style="width: calc(100% - 110px)">{{
                        jtem.trainProjectName
                      }}</span>
                      <span class="fraction"
                        >(-{{ jtem.trainJudgeScore }}分)</span
                      >
                      <img
                        @click="play(jtem.id)"
                        class="play"
                        src="@/assets/images/plays.png"
                        alt=""
                      />
                    </div>
                  </li>
                  <!-- <li>
                      <p>1</p>
                      <span class="name">手刹</span>
                      <span>训练了1次</span>
                      <span>共用时2分50秒</span>
                      <span class="fraction">(-6分)</span>
                      <img class="play" src="@/assets/images/play.png" alt="" />
                    </li> -->
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
function parseTimes(t) {
  const val = t / 1000;

  if (val < 60) {
    return val + "秒";
  } else {
    var min_total = Math.floor(val / 60); // 分钟
    var sec = Math.floor(val % 60); // 余秒
    if (min_total < 60) {
      return min_total + "分钟" + sec + "秒";
    } else {
      var hour_total = Math.floor(min_total / 60); // 小时数
      var min = Math.floor(min_total % 60); // 余分钟
      return hour_total + "小时" + min + "分钟" + sec + "秒";
    }
  }
}
import { getInfoProject, getStudentTrainInfo } from "@/api/cloud/train";
import { getToken } from "@/utils/auth";
export default {
  name: "Details",
  props: {
    visible: Boolean,
    option: Object
  },
  data() {
    return {
      topTime: null,
      tapList: [],
      info: null,
      src: "",
      loginId: null,
      tapIndex: 0,
      key: 0,
      typeName: ["智能模拟器", "机器人教练", "易学通"]
    };
  },
  watch: {
    tapIndex(val) {
      const { loginId } = this;
      getStudentTrainInfo({
        loginId,
        projectId: this.tapList[val].value
      }).then((res) => {
        this.info = res.data;
      });
    },
    option(val) {
      if (val) {
        const {
          id,
          trainSubject,
          loginTime,
          logoutTime,
          schoolName,
          loginTimeDuration
        } = this.option;

        getInfoProject({ id }).then((res) => {
          this.$emit("update:visible", true);
          this.tapList = res.data;
          this.tapIndex = 0;
          this.topTime = {
            loginTime,
            logoutTime,
            schoolName,
            loginTimeDuration
          };
          if (this.tapList.length) {
            getStudentTrainInfo({
              loginId: id,
              projectId: this.tapList[0].value
            }).then((res) => {
              this.info = res.data;
            });
          }
        });
      }
    }
  },
  created() {},
  methods: {
    parseTimes,
    play(id) {
      this.src = `/ol.html?id=${id}&env=${
        process.env.NODE_ENV
      }&VUE_APP_BASE_API=${
        process.env.VUE_APP_BASE_API
      }&token=Bearer${getToken()}`;
    },
    sad(s) {
      const n = s.length / 2;
      const start = s.substr(0, Math.floor(n));
      const end = s.substr(Math.floor(n), Math.ceil(n));

      return `<p>${start}</p>
              <p>${end}</p>`;
    },
    // 取消
    cancel() {
      this.info = null;
      this.tapList = [];
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.top-info {
  width: 100%;
  height: 86px;
  background: #ffffff;
  border: 1px dashed #c9cdd2;
  box-sizing: border-box;
  padding: 15px;
  margin-bottom: 20px;
}

.top-info > div {
  margin-bottom: 8px;
  font-size: 16px;
  color: #444444;
}

.dialog-content {
  height: 650px;
  border: 2px solid #eff0f1;
  border-radius: 0px 0px 2px 2px;
  background: #ffffff;
}

.item-tap {
  display: flex;
  height: 85px;
  background: #eff0f1;
  padding: 12px 12px 0;
}

.item-tap > li {
  height: 60px;
  background: #eafdff;
  border-radius: 2px;
  padding: 10px 15px;
  cursor: pointer;
  margin-right: 12px;
}

/deep/.item-tap > .activ > p {
  color: white;
}
/deep/.item-tap > .activ {
  height: 72px;
  background: #2da7b2;
  transition: all 0.4s;
}

/deep/.item-tap > li > p {
  color: #333333;
  font-size: 16px;
  margin: 0;
  text-align: center;
}

.details0 {
  height: 565px;
  padding: 0 12px;
  > div {
    min-height: 112px;
    border-bottom: 1px dashed #c9cdd2;
    box-sizing: border-box;
    padding: 12px 0;
    .title {
      font-size: 16px;
      color: #000000;
      font-weight: 600;
      margin: 12px 0;
    }
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 50%;
        display: flex;
        align-items: center;
        p {
          margin: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #dbdbdb;
          font-size: 10px;
          color: #333333;
          text-align: center;
          margin-right: 6px;
          line-height: 16px;
        }
        .name {
          margin-right: 70px;
          margin-left: 0;
          font-size: 16px;
          color: #2da7b2;
        }
        span {
          margin-left: 50px;
          color: #444444;
          font-size: 16px;
        }
      }
    }
  }
}
.details1 {
  height: 565px;
  padding: 0 12px;
  .content-nav {
    width: 60%;
    display: flex;
    margin: 25px 0;
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
  .map-container {
    display: flex;
    width: 100%;
    .left {
      width: 45%;
      .map {
        width: 100%;
        height: 380px;
        background: #eff0f1;
        border-radius: 6px;
        margin-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: url("../../../assets/images/gj.jpg") no-repeat center 100%
          100%;
        img {
          width: 50px;
        }
      }
    }
    .right {
      width: 55%;
      height: 460px;
      overflow-y: scroll;
      box-sizing: border-box;
      padding: 0 10px;
      > div {
        // min-height: 112px;
        border-bottom: 1px dashed #c9cdd2;
        box-sizing: border-box;
        padding: 12px 0;
        .title {
          font-size: 16px;
          color: #000000;
          font-weight: 600;
          margin: 12px 0;
          .fraction {
            margin: 0 20px;
          }
          .date {
            font-size: 16px;
            color: #666666;
            font-weight: 400;
          }
        }
        ul {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          :last-child {
            margin-bottom: 0;
          }
          li {
            width: 100%;
            display: flex;
            margin-bottom: 20px;
            // align-items: center;
            .fraction {
              display: block;
              width: 60px;
              margin-left: 10px;
              color: red;
              margin-left: 2px;
            }
            .play {
              width: 18px;
              height: 18px;
              margin-left: 6px;
              margin-top: 4px;
              cursor: pointer;
            }
            p {
              margin: 0;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #dbdbdb;
              font-size: 10px;
              color: #333333;
              text-align: center;
              margin-right: 6px;
              line-height: 16px;
              display: inline-block;
            }
            .name {
              width: calc(100% - 21px);
              margin-left: 0;
              font-size: 16px;
              color: #2da7b2;
            }
            span {
              margin-left: 20px;
              color: #444444;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
