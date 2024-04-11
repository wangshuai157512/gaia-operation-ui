import Vue from "vue";

import Cookies from "js-cookie";

import Element from "element-ui";
import "./assets/styles/element-variables.scss";
import "@/assets/fonts/font.scss";

import * as echarts from "echarts";
import "echarts-gl";

import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/jaya.scss"; // jaya css
import "nprogress/nprogress.css";
import App from "./App";
import store from "./store";
import router from "./router";
import directive from "./directive"; //directive
import jayaComponents from "./components"; //全局组件
import Print from 'vue-print-nb'

import "./assets/icons"; // icon
import "./permission"; // permission control

import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import VueAMap from "vue-amap"; //地图组件

import {
    parseTime,
    resetForm,
    addDateRange,
    selectDictLabel,
    selectDictLabels,
    download,
    handleTree,
    deepClone,
    verifyAccept
} from "@/utils/jaya";
// 头部标签组件
import VueMeta from "vue-meta";
import getStaticFile from "@/utils/static";

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.deepClone = deepClone;
Vue.prototype.verifyAccept = verifyAccept;
Vue.prototype.$event = new Vue();
Vue.prototype.$echarts = echarts;

Vue.prototype.msgSuccess = function(msg) {
    this.$message({ showClose: true, message: msg, type: "success" });
};

Vue.prototype.msgError = function(msg) {
    this.$message({ showClose: true, message: msg, type: "error" });
};

Vue.prototype.msgWarn = function(msg) {
    this.$message({ showClose: true, message: msg, type: "warning" });
};

Vue.prototype.msgInfo = function(msg) {
    this.$message.info(msg);
};

Vue.prototype.$getStaticFile = getStaticFile;

// 全局组件挂载
Vue.use(directive);
Vue.use(VueMeta);
Vue.use(jayaComponents);
Vue.use(Print)
// Vue.use(VueAMap);
// VueAMap.initAMapApiLoader({
//   key: "9fe0507459f508944760d27eac45c2f4",
//   // 插件集合 （插件按需引入）
//   plugin: [
//     "AMap.PolyEditor", //编辑 折线多，边形
//     "AMap.Autocomplete",
//     "AMap.PlaceSearch"
//   ]
// });

Vue.use(Element, {
    size: Cookies.get("size") || "medium" // set element-ui default size
});

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App)
});