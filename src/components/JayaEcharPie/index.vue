<template>
  <div ref="pie" class="pie" id="pie"></div>
</template>

<script>
export default {
  name: "JayaEcharPie",
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
      nameTitle = "",
      nameArray = [],
      dataArray = [],
    } = {}) {
      const data = dataArray.map((item, index) => ({
        value: item,
        name: nameArray[index],
      }));
      const pieBox = this.$echarts.init(this.$refs.pie);
      const option = {
        title: {
          text: textTitle,
          right: "right",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)", //{a} <br/>{b} : {c} ({d}%)
        },
        // legend: {
        //   orient: "vertical",
        //   left: "left",
        // },
        series: [
          {
            name: nameTitle,
            type: "pie",
            radius: "80%",
            data,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{c}",
                },
              },
            },
          },
        ],
      };
      pieBox.setOption(option, true);
    },
  },
};
</script>
<style scoped>
.pie {
  height: 420px;
}
</style>
