<template>
  <div ref="bar" class="bar" id="bar"></div>
</template>

<script>
export default {
  name: "JayaEcharBar",
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
      roomCar = "",
      textTitle = "",
      nameArray = [],
      dataArray = [],
      options = {},
    } = {}) {
      const barBox = this.$echarts.init(this.$refs.bar);
      const option = {
        color: [
          "#ff4db4",
          "#c16df6",
          "#3cd5b8",
          "#17e3ff",
          "#ffb000",
          "#e4d354",
          "#8085e8",
          "#8d4653",
          "#91e8e1",
        ],
        xAxis3D: {
          type: "category",
          data: ["1", "2", "3", "4", "5", "6"],
          axisLine: {
            lineStyle: {
              color: "yellow",
              width: 2,
            },
          },
        },
        yAxis3D: {
          type: "category",
          data: [""],
          axisLine: {
            // lineStyle: {
            //   color: 'yellow',
            //   width: 2
            // }
          },
        },
        zAxis3D: {
          type: "value",
          show: true,
          axisLine: {
            // lineStyle: {
            //   color: 'yellow',
            //   width: 2
            // }
          },
        },
        grid3D: {
          show: false,
          boxWidth: 200,
          boxDepth: 20,
          axisPointer: {
            show: false,
          },
          light: {
            main: {
              intensity: 1.2,
            },
            ambient: {
              intensity: 0.3,
            },
          },
          viewControl: {
            alpha: 30, //控制场景平移旋转
            beta: 30,
            minAlpha: 45,
            maxAlpha: 240,
            minBeta: 45,
            maxBeta: 30,
            distance: 250,
          },
        },
        series: [180000, 110000, 100000, 90000, 80000, 2000].map(
          (item, index) => {
            return {
              type: "bar3D",
              label: {
                show: true,
                distance: 10,
              },
              name: index,
              barSize: 15,
              data: [[index, 0, item]],
              shading: "lambert",
              emphasis: {
                label: {
                  show: true,
                },
              },
              labelLine: {
                show: true,
                lineStyle: {
                  color: "#7BC0CB",
                },
              },
            };
          }
        ),
      };

      // Object.assign(option, options);
      // if (typeof dataArray[0] == "number") {
      //   console.log(option)
      //   option.series[0].data = dataArray;
      // } else {
      //   option.series = dataArray.map((item) => {
      //     return {
      //       ...option.series[0],
      //       data: item.data,
      //       name: item.name,
      //     };
      //   });
      // }

      barBox.setOption(option, true);
    },
  },
};
</script>
<style scoped>
.bar {
  height: 420px;
}
</style>
