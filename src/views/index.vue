<template>
  <div class="app-container">
    <div class="nav-card">
      <div class="grid-content nav-card-item">
        <div class="card-item-title">总学员数</div>
        <div class="card-item-amount">
          <countTo class="amount-t" :endVal="total" :duration="3600" />
          <span>/人</span>
        </div>
      </div>
      <div class="grid-content nav-card-item">
        <div class="card-item-title">今日新增学员数</div>
        <div class="card-item-amount">
          <countTo class="amount-t" :endVal="orderNum" :duration="3600" />
          <span>/人</span>
        </div>
      </div>
      <div class="grid-content nav-card-item">
        <div class="card-item-title">驾校总数</div>
        <div class="card-item-amount">
          <countTo class="amount-t" :endVal="todayInCom" :duration="3600" />
          <span>/个</span>
        </div>
      </div>
      <div class="grid-content nav-card-item">
        <div class="card-item-title">设备总数</div>
        <div class="card-item-amount">
          <countTo class="amount-t" :endVal="todayStudent" :duration="3600" />
          <span>/个</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div ref="order" class="grid-content a">
          <div ref="bar" class="bar" id="bar"></div>
          <div v-if="tapList" class="tool">
            <div class="bg item">
              <progress-bar
                background="#FF7660"
                class="progress"
                :percentage="tapList[0].percent"
              />
              <div class="tool-count">
                <p class="t">
                  <countTo :endVal="tapList[0].money" :duration="2000" />
                </p>
                <p class="b">{{ tapList[0].typeName }}</p>
              </div>
            </div>
            <div class="bg item">
              <progress-bar
                background="#FFAC5A"
                class="progress"
                :percentage="tapList[1].percent"
              />
              <div class="tool-count">
                <p class="t">
                  <countTo :endVal="tapList[1].money" :duration="2000" />
                </p>
                <p class="b">{{ tapList[1].typeName }}</p>
              </div>
            </div>
            <div class="bg item">
              <div class="tool-count">
                <p class="b">{{ tapList[2].typeName }}</p>
                <p class="t">
                  <countTo :endVal="tapList[2].money" :duration="2000" />
                </p>
              </div>
              <progress-bar
                background="#35AEFE"
                class="progress"
                :percentage="tapList[2].percent"
              />
            </div>
            <div class="bg item">
              <div class="tool-count">
                <p class="b">{{ tapList[3].typeName }}</p>
                <p class="t">
                  <countTo :endVal="tapList[3].money" :duration="2000" />
                </p>
              </div>
              <progress-bar
                background="#71FF8C"
                class="progress"
                :percentage="tapList[3].percent"
              />
            </div>
            <img class="pie" src="../assets/images/pie.png" alt="" />
            <div class="pie">
              <div>
                <p>设备</p>
                <p>类型</p>
              </div>
            </div>
          </div>
        </div>
        <div class="grid-pie">
          <div class="grid-content">
            <div ref="pie" class="pie" id="pie"></div>
          </div>
          <div class="grid-content">
            <div ref="pieIncome" class="pieIncome" id="pieIncome"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import {
  getRanking,
  getTraintime,
  getSellSum,
  getOrderSum,
  getSellToday,
  getStudentToday,
  getOrderTrend,
  getReceiptsType
} from "@/api/cloud/index";
import { equipType } from "@/api/cloud/bigscreen";
export default {
  name: "Index",
  components: { countTo },
  data() {
    return {
      total: 0,
      orderNum: 0,
      todayInCom: 0,
      todayStudent: 0,
      actv: "#49bbc5",
      tapList: null
    };
  },
  mounted() {
    getSellSum().then(({ data }) => {
      this.total = data;
    });
    getOrderSum().then(({ data }) => {
      this.orderNum = data;
    });
    getSellToday().then(({ data }) => {
      this.todayInCom = data;
    });
    getStudentToday().then((res) => {
      this.todayStudent = res.data;
    });
    getOrderTrend().then((res) => {
      const date = [];
      const data = [];
      res.data.map((item) => {
        date.push(item.ym);
        data.push(item.money);
      });
      this.drawBar(date, data);
    });
    getTraintime(["20100", "20300", "20600", "20700", "20400"]).then((res) => {
      this.drawPie(
        res.data.map(({ len, trainProjectName }) => ({
          value: len,
          name: trainProjectName
        }))
      );
    });
    equipType().then((res) => {
      this.tapList = res.data.map(({ projectName, count, percent }) => ({
        typeName: projectName,
        money: count,
        percent
      }));
    });
    getReceiptsType().then((res) => {
      this.drawPieIncome(
        res.data.map(({ typeName, money }) => ({
          value: money,
          name: typeName
        }))
      );
    });
  },
  methods: {
    getRanking(data) {
      getRanking(data).then((res) => {
        this.topList = res.data;
      });
    },

    drawBar(date, data) {
      const barBox = this.$echarts.init(this.$refs.bar);
      const option = {
        title: {
          text: "订单总金额",
          left: 0
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: date,
          name: "月"
        },
        yAxis: {
          type: "value",
          name: "元"
        },
        series: [
          {
            data,
            type: "bar",
            barWidth: 16,
            label: {
              show: true,
              position: "top"
            },
            itemStyle: {
              emphasis: {
                barBorderRadius: 8
              },
              normal: {
                barBorderRadius: 8,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#0CA5EF" },
                  { offset: 1, color: "#12E0CD" }
                ])
              }
            }
          }
        ]
      };
      barBox.setOption(option, true);
    },

    drawPie(data) {
      const pieBox = this.$echarts.init(this.$refs.pie);
      const option = {
        title: {
          text: "近30天科目二五项训练时长"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          top: "20%",
          right: "2%",
          itemGap: 25,
          icon: "circle",
          formatter: function (name) {
            var data = option.series[0].data; //获取series中的data
            var total = 0;
            var tarValue;
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value;
              if (data[i].name == name) {
                tarValue = data[i].value;
              }
            }
            var p = (tarValue / total) * 100;
            return `${name}  ${!isNaN(p) ? p.toFixed(2) : 0} %`;
          }
        },

        series: [
          {
            name: "训练时长",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["30%", "50%"],
            avoidLabelOverlap: false,
            // itemStyle: {
            //   borderRadius: 10,
            //   borderColor: "#fff",
            //   borderWidth: 2,
            // },
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "22"
              }
            },
            labelLine: {
              show: false
            },
            data
          }
        ],
        color: ["#4170FB", "#F2637B", "#58B21D", "#E8BE19", "#975FE4"]
      };
      pieBox.setOption(option, true);
    },

    drawPieIncome(data) {
      const pieIncomeBox = this.$echarts.init(this.$refs.pieIncome);
      const option = {
        title: {
          text: "近30日收入分类"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          top: "20%",
          right: "2%",
          itemGap: 25,
          icon: "circle",
          formatter: function (name) {
            var data = option.series[0].data; //获取series中的data
            var total = 0;
            var tarValue;
            var val;
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value;
              if (data[i].name == name) {
                val = data[i].value;
                tarValue = data[i].value;
              }
            }
            var p = (tarValue / (total || 1)) * 100;
            return name + " " + " " + p.toFixed(2) + "%" + " " + "￥" + val;
          }
        },

        series: [
          {
            name: "收入分类",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["30%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 5
            },
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "22"
              }
            },
            labelLine: {
              show: false
            },
            data
          }
        ],
        color: ["#4170FB", "#F2637B", "#58B21D", "#E8BE19"]
      };
      pieIncomeBox.setOption(option, true);
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.app-container {
  height: calc(100vh - 70px);
  background: #f4f4f4;
  padding: 20px 0 20px 20px;
  box-sizing: border-box;
  font-family: "digital";
  .grid-content {
    background: white;
    border-radius: 6px;
  }

  .nav-card {
    display: flex;
    height: 20%;
  }
  .nav-card-item {
    flex: 1;
    height: 100%;
    padding: 0 15px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .card-item-title {
      width: 100%;
      font-size: 20px;
      font-weight: 400;
      color: #ffffff;
    }
    .card-item-amount {
      width: 100%;
      .amount-t {
        font-size: 36px;
        font-weight: 400;
        color: #ffffff;
      }
      span {
        font-size: 16px;
        font-family: Arial;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }

  .tool {
    width: 30%;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    background: #16186b;
    .pie {
      width: 35%;
      position: absolute;
      display: flex;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      z-index: 999;

      div {
        width: 100%;
        height: 2.5vh;
        display: inline-table;
        top: 0;
        bottom: 0;
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
  .content {
    height: 80%;
    display: flex;
    margin: 20px 20px 0 0;
    .left {
      width: 100%;
      height: 100%;
      > div {
        height: calc(50% - 10px);
      }
      .a {
        width: 100%;
        display: flex;
        margin-bottom: 20px;
      }
    }
    .right {
      width: 30%;
      height: 100%;
    }
  }
  .grid-pie {
    display: flex;
    > div {
      flex: 1;
    }
    > div:first-child {
      margin-right: 20px;
    }
  }

  .student-side {
    padding: 15px;
    box-sizing: border-box;
    .top-list {
      li {
        width: 100%;
        display: flex;
        height: 64px;
        padding: 15px 0;
        box-sizing: border-box;
        align-items: center;
        border-bottom: 2px solid #e2e7ed;
        > div {
          width: 100%;
          display: flex;
          align-items: center;
          .hander {
            width: 36px;
            height: 36px;
          }
          .hander-ioc {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: salmon;
            margin: 0 20px;
          }
          .name {
            font-size: 18px;
            font-weight: 400;
            color: #444444;
          }

          .amount {
            font-size: 18px;
            font-weight: 400;
            color: #444444;
          }
        }
      }
    }
    .title {
      font-size: 22px;
      font-weight: 400;
      color: #000000;
    }
    .tap {
      display: flex;
      margin: 15px 0;
      li {
        width: 50px;
        height: 25px;
        text-align: center;
        background: #e2e7ed;
        border: 1px solid #dbdbdb;
        border-radius: 12px;
        margin-right: 20px;
        cursor: pointer;
      }
      .actv {
        border: 1px solid #49bbc5;
        background: #49bbc5;
        color: white;
      }
    }

    .tap-s {
      display: flex;
      li {
        flex: 1;
        height: 40px;
        text-align: center;
        font-size: 18px;
        font-weight: 400;
        color: #444444;
        border-bottom: 2px #dbdbdb solid;
        position: relative;
        cursor: pointer;
        p {
          position: absolute;
          height: 0px;
          width: 0px;
          border-top: 8px solid transparent;
          border-bottom: 9px solid transparent;
          transform: rotate(90deg);
          bottom: -5px;
          left: 0;
          right: 0;
          margin: auto;
        }
      }
    }
  }

  .nav-card-item:nth-child(1) {
    background: url("../assets/images/card-1.png") no-repeat 100%;
    background-size: 100% 100%;
  }

  .nav-card-item:nth-child(2) {
    background: url("../assets/images/card-2.png") no-repeat 100%;
    background-size: 100%;
  }

  .nav-card-item:nth-child(3) {
    background: url("../assets/images/card-3.png") no-repeat 100%;
    background-size: 100% 100%;
  }

  .nav-card-item:nth-child(4) {
    background: url("../assets/images/card-4.png") no-repeat 100%;
    background-size: 100% 100%;
  }
}

#bar {
  width: 70%;
}
#pie,
#pieIncome {
  width: 100%;
  height: 100%;
}
</style>
