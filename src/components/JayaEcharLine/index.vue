<template>
  <div class="line" id="line"></div>
</template>

<script>
export default {
  name: "JayaEcharLine",
  //接收从父组件传回的值
  props: ["getData"],
  data() {
    return {};
  },
  //实时监听父组件传过来的值，进而执行drawBar方法，重绘柱状图
  watch: {
    getData: {
      handler(value) {
        this.drawBar(value);
      },
      deep: true,
    },
  },
  mounted() {
    this.drawBar(this.getData);
  },
  methods: {
    drawBar({
      textTitle = "",
      nameArray = [],
      dataArray = [],
      options = {},
    } = {}) {
      const lineBox = this.$echarts.init(document.getElementById("line"));
      const option = {
        title: {
          text: textTitle,
          right: "right",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: nameArray,
          offset: 50,
        },
        yAxis: {
          type: "value",
          offset: 20,
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        legend: {
          orient: "vertical",
          left: "right",
          itemGap: 30,
        },
        series: [
          {
            name: nameArray[0],
            data: [],
            type: "line",
            stack: "Total",
            smooth: true,
          },
        ],
      };
      Object.assign(option, options);
      if (typeof dataArray[0] == "number") {
        option.series[0].data = dataArray;
      } else {
        option.series = dataArray;
      }
      lineBox.setOption(option, true);
    },
  },
};
</script>
<style scoped>
.line {
  height: 420px;
}
</style>
