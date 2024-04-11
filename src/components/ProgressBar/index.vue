<template>
  <div ref="rate" class="rate-container">
    <ul class="rate-gap">
      <li
        :style="{ width: `${hasItemWidth}px`, background }"
        v-for="i in 20"
        :key="i"
      ></li>
    </ul>
    <div ref="rateStrip" class="rate-strip">0%</div>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
export default {
  name: "ProgressBar",
  props: {
    duration: {
      type: Number,
      required: false,
      default: 3000
    },
    percentage: {
      type: Number,
      required: false,
      default: 100
    },
    background: {
      type: String,
      required: false,
      default: "salmon"
    }
  },
  data() {
    return {
      hasItemWidth: null
    };
  },
  methods: {},

  mounted() {
    const slef = this;
    const rateWidth = this.$refs.rate.offsetWidth;
    this.hasItemWidth = Math.ceil((Math.floor(rateWidth / 3) * 2) / 20);
    anime({
      targets: this.$refs.rateStrip,
      width: `${100 - this.percentage}%`,
      easing: "cubicBezier(0,.97,.66,.9)",
      direction: "normal",
      duration: this.duration,
      update: function (anim) {
        if (slef.percentage === 0) return;
        slef.$refs.rateStrip.innerHTML = `${Math.round(
          ((rateWidth - slef.$refs.rateStrip.offsetWidth) / rateWidth) * 100
        )}%`;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.rate-container {
  width: 100%;
  height: 100%;
  padding: 2px;
  position: relative;
  background: #0e0f3f;
  .rate-strip {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    right: 0;
    top: 0;
    z-index: 999;
    background: #0e0f3f;
    font-size: 2vh;
    font-family: "digital";
    color: white;
  }
  .rate-gap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
