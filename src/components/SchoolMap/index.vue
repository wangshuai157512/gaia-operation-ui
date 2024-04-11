<template>
  <el-dialog
    :close-on-click-modal="false"
    title="详细地址"
    :visible.sync="openMap"
    :before-close="closeMap"
    fullscreen
    append-to-body
  >
    <div id="container"></div>
    <div id="myPageTop">
      <table>
        <tr>
          <td>
            <label>请输入关键字：</label>
          </td>
        </tr>
        <tr>
          <td>
            <input id="tipinput" />
          </td>
          <td>
            <el-button
              style="margin-left: 10px"
              size="mini"
              type="primary"
              @click="handleRight"
              >确定</el-button
            >
          </td>
        </tr>
      </table>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "SchoolMap",
  props: {
    openMap: Boolean,
  },
  data() {
    return {
      lnglat: [],
      resultArea: "",
    };
  },
  watch: {
    openMap: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.adMap();
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    closeMap() {
      this.$emit("update:openMap", false);
    },
    adMap() {
      //初始化地图
      var map = new AMap.Map("container", {
        zoom: 10, //缩放级别
        resizeEnable: true, //地图初始化加载定位到当前城市
      });
      //输入提示
      var autoOptions = {
        input: "tipinput",
        outPutDirAuto: true,
      };
      var auto = new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
        map: map,
      }); //构造地点查询类
      AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
      let that = this;
      function select(e) {
        that.resultArea = e.poi.district + e.poi.name;
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name, function (status, result) {
          var pois = result.poiList.pois;
          setTimeout(() => {
            for (let i = 0; i < pois.length; i++) {
              document
                .getElementsByClassName("amap_lib_placeSearch_poi")
                [i].addEventListener("click", function () {
                  that.resultArea =
                    pois[i].cityname + pois[i].adname + pois[i].name;
                });
            }
          });
        }); //关键字查询查询
      }

      // 初始化地理编码插件
      var geocoder = new AMap.Geocoder({});
      var marker = new AMap.Marker();
      function regeoCode() {
        map.add(marker);
        marker.setPosition(that.lnglat);
        geocoder.getAddress(that.lnglat, function (status, result) {
          if (status === "complete" && result.regeocode) {
            that.resultArea = result.regeocode.formattedAddress;
          } else {
            log.error("查询地址失败");
          }
        });
      }

      map.on("click", function (e) {
        that.lnglat = [];
        that.lnglat.push(e.lnglat.lng, e.lnglat.lat);
        regeoCode();
      });
    },

    handleRight() {
      this.$emit("result-area", this.resultArea);
      this.$emit("update:openMap", false);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__title {
  text-align: left !important;
}
#container {
  width: 100%;
  height: calc(100vh - 170px);
  margin-top: 50px;
}
#myPageTop {
  position: absolute;
  left: 20;
  top: 50px;
  #tipinput {
    width: 300px;
    height: 25px;
  }
}
.amap-marker-content {
  display: none !important;
}
</style>
