<template>
  <div class="map-box">
    <el-form :inline="true" :model="form" class="demo-form-inline" disabled>
      <el-form-item> <template> 点击地图选择考场 </template> </el-form-item>
      <el-form-item label="纬度">
        <el-input v-model="form.latitude"></el-input>
      </el-form-item>
      <el-form-item label="经度">
        <el-input v-model="form.longitude"></el-input>
      </el-form-item>
    </el-form>
    <div class="map" id="container"></div>
  </div>
</template>

<script>
export default {
  name: "mapCom",
  data() {
    return {
      map: null,
      marker: null,
      form: {
        latitude: "", //纬度
        longitude: "", //经度
      },
      center: [116.414014, 39.905516], //纬度-经度
    };
  },
  mounted() {
    this.$nextTick(()=> {
      this.adMap();
    })
  },
  methods: {
    adMap() {
      //初始化地图
      this.map = new AMap.Map("container", {
        zoom: 10, //缩放级别
        center: this.center, //设置地图中心点
        // resizeEnable: true, //地图初始化加载定位到当前城市
      });
      let that = this;
      this.map.on("click", function (e) {
        that.form.latitude = e.lnglat.getLat();
        that.form.longitude = e.lnglat.getLng();
        localStorage.setItem("latitude", that.form.latitude);
        localStorage.setItem("longitude", that.form.longitude);
        that.addMarker(e.lnglat.getLng(), e.lnglat.getLat());
      });
    },
    // 标记点
    addMarker(longitude, latitude) {
      if (this.marker) {
        this.marker.setPosition([longitude, latitude]);
      } else {
        this.marker = new AMap.Marker({
          icon: require("../../../../assets/images/poi-marker-default.png"),
          position: [longitude, latitude],
          offset: new AMap.Pixel(-25, -60),
        });
        this.marker.setMap(this.map);
      }
    },
  },
};
</script>

<style scoped>
#container {
  height: calc(100vh - 58px);
}
.el-form {
  margin: 20px 20px 0 20px;
}
.el-form--inline /deep/.el-form-item__label {
  display: inline;
}
</style>