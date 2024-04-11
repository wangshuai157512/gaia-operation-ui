<template>
  <div class="app-container">
    <el-button @click="$router.go(-1)" type="primary">返回</el-button>
    <iframe v-if="src" ref="iframe" :src="src" frameborder="0"></iframe>
    <div class="btn-bottom">
      <el-button @click="paly" type="primary">再次播放</el-button>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  name: "OlMap",
  data() {
    return {
      src: null
    };
  },
  methods: {
    paly() {
      this.$refs.iframe.contentWindow.location.reload(true);
    }
  },
  mounted() {
    const { id } = this.$route.query;

    this.src = `/ol.html?id=${id}&env=${
      process.env.NODE_ENV
    }&token=Bearer${getToken()}`;
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 50px);
  background: #efead7;

  iframe {
    width: 100%;
    height: calc(100% - 100px);
  }

  .btn-bottom {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
