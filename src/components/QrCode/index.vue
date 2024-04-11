<template>
  <canvas></canvas>
</template>

<script>
import QRCode from "qrcode";
export default {
  name: "QrCode",
  props: {
    width: {
      type: Number,
      default: 234
    },
    height: {
      type: Number,
      default: 234
    },
    code: String
  },
  mounted() {
    const { width, height, code, $el } = this;

    QRCode.toCanvas($el, code, {
      width,
      height
    });
  }
};
</script>

<style></style>
