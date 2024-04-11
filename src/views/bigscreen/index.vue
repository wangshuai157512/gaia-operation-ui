<template>
  <div class="screen-container">
    <div class="screen-head-nav">精英智通大数据运营平台</div>
    <div class="screen-content">
      <div class="slide-left">
        <div class="nav-number mar-bot-15">
          <div class="bg">
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <countTo
              class="num"
              separator=""
              :startVal="0"
              :endVal="schoolNumber"
              :duration="2000"
            />
            <div class="name">驾校数量</div>
          </div>
          <div class="bg">
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <countTo
              class="num"
              separator=""
              :startVal="0"
              :endVal="studentNumber"
              :duration="2000"
            />
            <div class="name">学员数量</div>
          </div>
          <div class="bg">
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <countTo
              class="num"
              separator=""
              :startVal="0"
              :endVal="loginNumber"
              :duration="2000"
            />
            <div class="name">今日登录人数</div>
          </div>
        </div>
        <div class="nav-order mar-bot-15 bg">
          <div>
            <p>订单累计：</p>
            <p>
              <countTo
                class="num"
                :startVal="0"
                :endVal="orderNumber"
                :duration="2000"
              />
            </p>
          </div>
          <div>
            <p>总金额：</p>
            <p style="color: #ff7d7d">
              <countTo
                class="num"
                :startVal="0"
                :endVal="sellNumber"
                :duration="2000"
              />.
              <countTo
                class="num"
                :startVal="0"
                :endVal="sellFloat"
                :duration="2000"
              />
            </p>
          </div>
        </div>
        <div class="day-order mar-bot-15 bg">
          <div ref="orderDay7" id="order-line"></div>
        </div>
        <div v-if="equipType && equipType.length" class="tool">
          <div class="bg item">
            <progress-bar
              background="#FF7660"
              class="progress"
              :percentage="equipType[0].percent"
            />
            <div class="tool-count">
              <p class="t">
                <countTo
                  :startVal="0"
                  :endVal="equipType[0].count"
                  :duration="2000"
                />
              </p>
              <p class="b">{{ equipType[0].projectName }}</p>
            </div>
          </div>
          <div class="bg item">
            <progress-bar
              background="#FFAC5A"
              class="progress"
              :percentage="equipType[1].percent"
            />
            <div class="tool-count">
              <p class="t">
                <countTo
                  :startVal="0"
                  :endVal="equipType[1].count"
                  :duration="2000"
                />
              </p>
              <p class="b">{{ equipType[1].projectName }}</p>
            </div>
          </div>
          <div class="bg item">
            <div class="tool-count">
              <p class="b">{{ equipType[2].projectName }}</p>
              <p class="t">
                <countTo
                  :startVal="0"
                  :endVal="equipType[2].count"
                  :duration="2000"
                />
              </p>
            </div>
            <progress-bar
              background="#35AEFE"
              class="progress"
              :percentage="equipType[2].percent"
            />
          </div>
          <div class="bg item">
            <div class="tool-count">
              <p class="b">{{ equipType[3].projectName }}</p>
              <p class="t">
                <countTo
                  :startVal="0"
                  :endVal="equipType[3].count"
                  :duration="2000"
                />
              </p>
            </div>
            <progress-bar
              background="#71FF8C"
              class="progress"
              :percentage="equipType[3].percent"
            />
          </div>
          <img class="pie" src="../../assets/images/pie.png" alt="" />
          <div class="pie">
            <div>
              <p>设备</p>
              <p>类型</p>
            </div>
          </div>
        </div>
      </div>
      <div class="slide-center">
        <div class="top-center">
          <p>全国设备分布统计</p>
          <div class="nav-total">
            <div>
              <p class="label">智能模拟器数量</p>
              <countTo
                class="num"
                separator=""
                :startVal="0"
                :endVal="national.simulatorNum"
                :duration="2000"
              />
            </div>
            <div>
              <p class="label">机器人教练数量</p>
              <countTo
                class="num"
                separator=""
                :startVal="0"
                :endVal="national.goldcoachNum"
                :duration="2000"
              />
            </div>
            <div>
              <p class="label">易学通数量</p>
              <countTo
                class="num"
                separator=""
                :startVal="0"
                :endVal="national.yxtNum"
                :duration="2000"
              />
            </div>
          </div>
          <div class="globe">
            <img class="globe-img" src="../../assets/images/globe.png" alt="" />
            <div
              v-if="schoolList.length"
              style="left: 4vh; top: 6vh"
              class="globe-tip"
            >
              <div>
                <img src="../../assets/images/tip.png" alt="" />
                <div>
                  <ul>
                    <li>{{ schoolList[0].name }}</li>
                    <li>
                      <p class="mark"></p>
                      智能模拟器数量：{{ schoolList[0].simulatorNum }}台
                    </li>
                    <li>
                      <p class="mark"></p>
                      机器人教练数量：{{ schoolList[0].goldcoachNum }}辆
                    </li>
                    <li>
                      <p class="mark"></p>
                      易学通数量：{{ schoolList[0].yxtNum }}辆
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              v-if="schoolList.length"
              style="left: 10vh; bottom: 10vh"
              class="globe-tip"
            >
              <div>
                <img src="../../assets/images/tip.png" alt="" />
                <div>
                  <ul>
                    <li>{{ schoolList[1].name }}</li>
                    <li>
                      <p class="mark"></p>
                      智能模拟器数量：{{ schoolList[1].simulatorNum }}台
                    </li>
                    <li>
                      <p class="mark"></p>
                      机器人教练数量：{{ schoolList[1].goldcoachNum }}辆
                    </li>
                    <li>
                      <p class="mark"></p>
                      易学通数量：{{ schoolList[1].yxtNum }}辆
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              v-if="schoolList.length"
              style="right: 4vh; top: 15vh"
              class="globe-tip"
            >
              <div>
                <img src="../../assets/images/tip.png" alt="" />
                <div>
                  <ul>
                    <li>{{ schoolList[2].name }}</li>
                    <li>
                      <p class="mark"></p>
                      智能模拟器数量：{{ schoolList[2].simulatorNum }}台
                    </li>
                    <li>
                      <p class="mark"></p>
                      机器人教练数量：{{ schoolList[2].goldcoachNum }}辆
                    </li>
                    <li>
                      <p class="mark"></p>
                      易学通数量：{{ schoolList[2].yxtNum }}辆
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="total-order bg">
          <div id="orderTotal" ref="orderTotal"></div>
        </div>
      </div>
      <div class="slide-right">
        <div class="mar-bot-15 bg">
          <div ref="sub2de" id="sub2de"></div>
        </div>
        <div class="mar-bot-15 bg">
          <div ref="sub2via" id="sub2via"></div>
        </div>
        <div class="mar-bot-15 bg">
          <div ref="sub3via" id="sub3via"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import {
  schoolNumber,
  studentNumber,
  loginNumber,
  orderNumber,
  sellNumber,
  orderNumTrend,
  equipNumber,
  subTwoDeduct,
  subTwoPass,
  subThreePass,
  equipType,
  orderTypeTrend,
  randomSchool
} from "@/api/cloud/bigscreen";
const COLOR_VIA = "#FFFFFF";
var time;
export default {
  name: "BigScreen",
  components: { countTo },
  data() {
    return {
      schoolNumber: 0,
      studentNumber: 0,
      loginNumber: 0,
      orderNumber: 0,
      sellNumber: 0,
      sellFloat: 0,
      national: { simulatorNum: 0, goldcoachNum: 0, yxtNum: 0 },
      equipType: [],
      schoolList: []
    };
  },
  methods: {
    // 七日订单折线图
    orderDay7(data) {
      const option = {
        title: {
          text: "近7日订单趋势图",
          left: 10,
          top: 10,
          textStyle: { color: COLOR_VIA }
        },
        xAxis: {
          type: "category",
          data: data.map((item) => item.label),
          axisLabel: {
            color: COLOR_VIA
          },
          axisTick: {
            show: false
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: COLOR_VIA,
            formatter: "{value} 单"
          },
          minInterval: 1,
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: [COLOR_VIA]
            }
          }
        },
        series: [
          {
            color: "#FF7D7D",
            data: data.map((item) => Number(item.value)),
            type: "line",
            smooth: true,
            symbolSize: 0,
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#ffbcbc"
                    },
                    {
                      offset: 1,
                      color: "rgba(255,125,125,0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(255,125,125, 0)",
                shadowBlur: 5
              }
            }
          }
        ]
      };
      this.$echarts.init(this.$refs.orderDay7).setOption(option, true);
    },

    // 订单
    orderTotal(data) {
      const option = {
        title: {
          text: "订单趋势图",
          left: 10,
          top: 10,
          textStyle: { color: COLOR_VIA }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        legend: {
          data: ["智能模拟器", "机器人教练", "易学通"],
          textStyle: {
            color: COLOR_VIA
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.goldCoachList.map((item) => item.label),
          axisLabel: {
            color: COLOR_VIA
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: COLOR_VIA,
            formatter: "{value} 单"
          },
          minInterval: 1,
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: [COLOR_VIA]
            }
          }
        },
        series: [
          {
            name: "智能模拟器",
            type: "line",
            smooth: true,
            symbolSize: 0,
            color: "#F3E005",
            data: data.simulatorList.map((item) => Number(item.value)),
            areaStyle: {
              normal: {
                opacity: 0.8,
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#fff68f"
                    },
                    {
                      offset: 1,
                      color: "rgba(255,246,143,0)"
                    }
                  ],
                  false
                ),
                // shadowColor: "rgba(255,246,143, 0)",
                shadowBlur: 5
              }
            }
          },
          {
            name: "机器人教练",
            type: "line",
            smooth: true,
            symbolSize: 0,
            color: "#FF00F6",
            data: data.goldCoachList.map((item) => Number(item.value)),
            areaStyle: {
              normal: {
                opacity: 0.8,
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#ff7dfa"
                    },
                    {
                      offset: 1,
                      color: "rgba(255,125,250,0)"
                    }
                  ],
                  false
                ),
                // shadowColor: "rgba(255,125,250, 0)",
                shadowBlur: 5
              }
            }
          },
          {
            name: "易学通",
            type: "line",
            smooth: true,
            symbolSize: 0,
            color: "#09FFBE", //#7cffdc
            data: data.yxtList.map((item) => Number(item.value)),
            areaStyle: {
              normal: {
                opacity: 0.8,
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#7cffdc"
                    },
                    {
                      offset: 1,
                      color: "rgba(124,255,220,0)"
                    }
                  ],
                  false
                ),
                // shadowColor: "rgba(124,255,220, 0)",
                shadowBlur: 5
              }
            }
          }
        ]
      };
      this.$echarts.init(this.$refs.orderTotal).setOption(option, true);
    },

    // 通用柱状图
    drawBar({ name, data, node, title, color }) {
      const option = {
        title: {
          text: title,
          left: 10,
          top: 10,
          textStyle: { color: COLOR_VIA }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: name,
          axisLabel: {
            interval: 0,
            color: COLOR_VIA
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: COLOR_VIA,
            formatter: "{value} %"
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: [COLOR_VIA]
            }
          }
        },
        series: [
          {
            data,
            type: "bar",
            barWidth: "15vh",
            itemStyle: {
              emphasis: {
                barBorderRadius: "10vh"
              },
              normal: {
                barBorderRadius: 10000,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: color[0] },
                  { offset: 1, color: color[1] }
                ])
              }
            }
          }
        ]
      };

      this.$echarts.init(node).setOption(option, true);
    },

    // 科目二扣分统计
    sub2deduc(data) {
      const option = {
        title: {
          text: "科目二扣分项目统计",
          left: 10,
          top: 10,
          textStyle: { color: COLOR_VIA }
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        yAxis: {
          type: "category",
          axisLabel: {
            color: COLOR_VIA,
            align: "right"
          },
          offset: 15,
          data: data.map((item) => {
            var s = "";
            for (let i = 0; i < item.deductType.length; i++) {
              s += item.deductType[i];
              if (i && i % 12 === 0 && i < item.deductType.length - 1) {
                s += "\n";
              }
            }
            return {
              value: s
            };
          }),
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        xAxis: {
          show: false
        },
        series: [
          {
            data: data.map((item) => item.deductNum),
            type: "bar",
            barWidth: "15vh",
            label: {
              show: true,
              position: "left",
              color: COLOR_VIA
            },
            itemStyle: {
              emphasis: {
                barBorderRadius: "10vh"
              },
              normal: {
                barBorderRadius: 10000,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#A14B75" },
                  { offset: 1, color: "#7C73F3" }
                ])
              }
            }
          }
        ]
      };

      this.$echarts.init(this.$refs.sub2de).setOption(option, true);
    }
  },
  mounted() {
    // 驾校数量
    schoolNumber().then((res) => {
      this.schoolNumber = Number(res.data);
    });
    // 学员数量
    studentNumber().then((res) => {
      this.studentNumber = Number(res.data);
    });
    // 今日登录人数
    loginNumber().then((res) => {
      this.loginNumber = Number(res.data);
    });
    // 订单累计数量
    orderNumber().then((res) => {
      this.orderNumber = Number(res.data);
    });
    // 订单总金额
    sellNumber().then((res) => {
      this.sellNumber = Number(res.data);
      this.sellFloat = Number(String(res.data).split(".")[1] || "00");
    });
    // 近7日订单趋势图
    orderNumTrend().then((res) => {
      this.orderDay7(res.data);
    });
    // 近一年订单数量按设备类型趋势统计
    orderTypeTrend().then((res) => {
      this.orderTotal(res.data);
    });
    // 科目二扣分统计
    subTwoDeduct().then((res) => {
      this.sub2deduc(res.data.sort((a, b) => a.deductNum - b.deductNum));
    });
    // 科二通过率
    subTwoPass().then((res) => {
      this.drawBar({
        name: res.data.map((item) => item.projectName),
        data: res.data.map((item) => item.count),
        node: this.$refs.sub2via,
        title: "科目二项目通过率",
        color: ["#98E05F", "#0DE3AC"]
      });
    });
    // 科目三项目通过率（前5项）
    subThreePass().then((res) => {
      this.drawBar({
        name: res.data.map((item) => item.projectName),
        data: res.data.map((item) => item.count),
        node: this.$refs.sub3via,
        title: "科目三项目通过率（前5项）",
        color: ["#015EEA", "#00C0FA"]
      });
    });
    // 全国设备分布统计
    equipNumber({ provinceId: 0, schoolId: 0 }).then((res) => {
      const { simulatorNum, goldcoachNum, yxtNum } = res.data;
      this.national = {
        simulatorNum: Number(simulatorNum),
        goldcoachNum: Number(goldcoachNum),
        yxtNum: Number(yxtNum)
      };
    });
    // 设备类型统计
    equipType().then((res) => {
      this.equipType = res.data;
    });
    // 随机3条驾校信息
    randomSchool().then((res) => {
      this.schoolList = res.data;
      time = setInterval(() => {
        randomSchool().then((res) => {
          this.schoolList = res.data;
        });
      }, 30000);
    });
  },
  destroyed() {
    clearInterval(time);
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.screen-container {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/images/banner.png") no-repeat center 100%;
  // background-size: 100%;
  box-sizing: border-box;
  padding: 20px;
  font-family: "digital";
  //   font-size: 120px;
  //   text-align: center;
  .bg {
    background: #16186b;
    opacity: 0.9;
  }
  .screen-head-nav {
    height: 54px;
    background: url("../../assets/images/bg.png") no-repeat 100% 100%;
    background-size: 100%;
    background-position: 0 27px;
    display: flex;
    font-size: 3vh;
    font-family: "HYLingXinJ";
    font-weight: 400;
    color: #ffffff;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    // background: red;
  }

  .screen-content {
    display: flex;
    height: calc(100% - 84px);
    .slide-left,
    .slide-right {
      width: 26%;
    }
    .slide-center {
      width: 48%;
      margin: 0 20px;
      .total-order {
        height: calc(33.33333% - 10px);
      }

      .top-center {
        position: relative;
        height: calc(66.66666% + 10px);
        > p {
          position: absolute;
          font-size: 1.75vh;
          font-family: "Microsoft YaHei";
          font-weight: bold;
          color: #ffffff;
        }
        .nav-total {
          width: 65%;
          margin: auto;
          height: 12%;
          display: flex;
          justify-content: space-evenly;
          > div {
            width: 30%;
            .label {
              font-size: 1.75vh;
              font-family: "Microsoft YaHei";
              font-weight: 400;
              color: #3a8cff;
            }
            .num {
              font-size: 4.5vh;
              font-weight: bold;
              color: #3699ff;
            }
          }
        }

        .globe {
          height: 88%;
          position: relative;
          .globe-img {
            height: 100%;
            display: block;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
          }
          .globe-tip {
            width: 20%;
            position: absolute;
            > div {
              width: 100%;
              position: relative;
              img {
                width: 100%;
                display: block;
              }
              div {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                ul {
                  height: 100%;
                  display: flex;
                  flex-wrap: wrap;
                  flex-direction: column;
                  justify-content: space-evenly;
                  box-sizing: border-box;
                  padding: 0 15px;
                  li {
                    width: 100%;
                    font-size: 1vh;
                    font-family: "Microsoft YaHei";
                    font-weight: 400;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    .mark {
                      width: 0.8vh;
                      height: 0.8vh;
                      background: #f3e005;
                      transform: rotate(45deg);
                      margin-right: 10px;
                      filter: blur(0.2vh);
                    }
                  }
                  li:nth-child(1) {
                    border-bottom: 1px #69c4fe solid;
                  }
                }
              }
            }

            // background: url("../../assets/images/tip.png") no-repeat center;
            // background-size: 100%;
          }
        }
      }
    }

    .mar-bot-15 {
      margin-bottom: 15px;
    }
    .slide-left {
      .nav-number {
        display: flex;
        justify-content: space-between;
        height: 15%;
        > div:nth-child(1) {
          color: #54f7fe;
        }
        > div:nth-child(2) {
          color: #39ff5e;
        }
        > div:nth-child(3) {
          color: #fd69b0;
        }

        > div {
          width: 15vh;
          height: 100%;
          position: relative;
          text-align: center;

          display: flex;
          justify-content: space-evenly;
          flex-direction: column;
          .num {
            display: block;
            font-size: 5vh;
            font-weight: 400;
          }
          .name {
            font-size: 1.5vh;
            color: #ffffff;
            text-align: center;
          }
          p {
            width: 15%;
            height: 15%;
            position: absolute;
            margin: 0;
          }
          p:nth-child(1) {
            border-top: 1px #00f6ff solid;
            border-left: 1px #00f6ff solid;
            left: 0;
            top: 0;
          }
          p:nth-child(2) {
            border-top: 1px #00f6ff solid;
            border-right: 1px #00f6ff solid;
            right: 0;
            top: 0;
          }
          p:nth-child(3) {
            border-bottom: 1px #00f6ff solid;
            border-left: 1px #00f6ff solid;
            left: 0;
            bottom: 0;
          }
          p:nth-child(4) {
            border-bottom: 1px #00f6ff solid;
            border-right: 1px #00f6ff solid;
            bottom: 0;
            right: 0;
          }
        }
      }
    }

    .nav-order {
      display: flex;
      height: 12%;
      padding: 20px;
      box-sizing: border-box;
      div {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        p:nth-child(1) {
          font-family: "Microsoft YaHei";
          font-size: 2vh;
          color: #ffffff;
        }
        p:nth-child(2) {
          font-size: 4vh;
          font-weight: bold;
          color: #54f7fe;
        }
      }
    }

    .day-order {
      height: 28%;
    }

    .tool {
      height: calc(45% - 45px);
      display: flex;
      flex-wrap: wrap;
      position: relative;
      .pie {
        width: 35%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 999;
        display: flex;

        div {
          width: 100%;
          height: 2.5vh;
          display: inline-table;
          margin: auto;
          padding: 0;
        }
        p {
          width: 100%;
          text-align: center;
          font-size: 27px;
          font-family: "Microsoft YaHei";
          font-weight: bold;
          color: #ffffff;
        }
      }
      .item {
        width: calc(50% - 7.5px);
        height: calc(50% - 7.5px);
        margin-right: 15px;
        margin-bottom: 15px;
        box-sizing: border-box;
        padding: 5%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .progress {
          height: 15%;
        }
        .tool-count {
          height: 50%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .b {
            font-family: "Microsoft YaHei";
            color: #ffffff;
            font-size: 1.5vh;
          }
          .t {
            font-weight: bold;
            font-size: 3.5vh;
          }
        }
      }
      .item:nth-child(2),
      .item:nth-child(4) {
        margin-right: 0;
      }
      .item:nth-child(3),
      .item:nth-child(4) {
        margin-bottom: 0;
      }
      .item:nth-child(1) {
        .tool-count {
          .t {
            color: #ff7660;
          }
        }
      }
      .item:nth-child(2) {
        .tool-count {
          .t {
            color: #ffac5a;
          }
        }
      }
      .item:nth-child(3) {
        .tool-count {
          .t {
            color: #35aefe;
          }
        }
      }
      .item:nth-child(4) {
        .tool-count {
          .t {
            color: #71ff8c;
          }
        }
      }
      .item:nth-child(2),
      .item:nth-child(4) {
        .tool-count {
          .b,
          .t {
            text-align: right;
          }
        }
      }
    }

    .slide-right {
      div {
        height: calc(33.33333% - 10px);
      }
      div:nth-child(3) {
        margin-bottom: 0;
      }
    }
  }
}

#order-line,
#orderTotal,
#sub2via,
#sub3via,
#sub2de {
  width: 100%;
  height: 100%;
}
</style>
