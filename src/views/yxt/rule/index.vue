<template>
  <div class="main">
    <div>
      <div class="tool">
        <jaya-select
          type="SS"
          :parameter="JSON.stringify({})"
          v-model="drvSchoolId"
          filterable
          placeholder="请选择驾校"
        ></jaya-select>
        <el-button
          @click="clickCount = 0"
          :type="clickCount == 0 ? 'primary' : ''"
          >收费标准设置</el-button
        >
        <el-button
          @click="clickCount = 1"
          :type="clickCount == 1 ? 'primary' : ''"
          >订单规则设置</el-button
        >
        <el-button
          @click="clickCount = 2"
          :type="clickCount == 2 ? 'primary' : ''"
          >预约规则设置</el-button
        >
        <el-button
          @click="clickCount = 3"
          :type="clickCount == 3 ? 'primary' : ''"
          >考试项目设置</el-button
        >
        <el-button
          v-if="isEdit"
          @click="handleSave"
          style="position: absolute; right: 0px"
          type="primary"
        >
          保存</el-button
        >
        <el-button
          v-else
          @click="handleEdit"
          style="position: absolute; right: 0px"
          type="primary"
        >
          编辑</el-button
        >
        <el-button
          v-if="isEdit"
          @click="handleCancel"
          style="position: absolute; right: 80px"
        >
          取消</el-button
        >
      </div>
      <!-- <div style="height:60px"></div> -->
      <div ref="components" class="components">
        <toll
          @carTypeChange="handleCarTypeChange"
          :drvSchoolId="drvSchoolId"
          :isEdit="isEdit"
          ref="component0"
        ></toll>
        <order
          :carType="carType"
          :drvSchoolId="drvSchoolId"
          :isEdit="isEdit"
          ref="component1"
        ></order>
        <reserve
          :drvSchoolId="drvSchoolId"
          :isEdit="isEdit"
          ref="component2"
        ></reserve>
        <exam
          :carType="carType"
          :drvSchoolId="drvSchoolId"
          :isEdit="isEdit"
          ref="component3"
        ></exam>
      </div>
    </div>
  </div>
</template>

<script>
import { Toll, Order, Reserve, Exam } from "./modules";
export default {
  name: "Rule",
  components: { Toll, Order, Reserve, Exam },

  Examprops: {},
  data() {
    return {
      isEdit: false,
      drvSchoolId: "",
      carType: "",
      clickCount: 0,
      commentId: Date.now()
    };
  },
  watch: {
    clickCount(value) {
      this.$refs.components.scrollTop =
        this.$refs[`component${value}`].$el.offsetTop;
    }
  },
  mounted() {
    // this.$refs.components.addEventListener("scroll", ({ target }) => {});
  },
  methods: {
    handleCarTypeChange(value) {
      this.carType = value;
    },
    handleCancel() {
      Promise.all([
        this.$refs.component0.initData(),
        this.$refs.component1.initData(),
        this.$refs.component2.initData(),
        this.$refs.component3.initData()
      ])
        .then((res) => {
          this.isEdit = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSave() {
      Promise.all([
        this.$refs.component0.rule(),
        this.$refs.component1.rule(),
        this.$refs.component2.rule(),
        this.$refs.component3.rule()
      ])
        .then((res) => {
          this.isEdit = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleEdit() {
      if (!this.drvSchoolId) return this.msgWarn("请先选择驾校");
      this.isEdit = true;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-input.is-disabled .el-input__inner {
  color: black;
  text-align: center;
}
.main {
  height: calc(100vh - 50px);
  padding: 10px 20px;
  box-sizing: border-box;
  > div {
    height: 100%;
    overflow-y: scroll;
    position: relative;
  }

  .components {
    position: relative;
    height: calc(100% - 60px);
    overflow-y: scroll;
  }
  .container {
    background: white;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  .tool {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    // position: fixed;
    top: 50px;
    // position: fixed;
    // background: white;
    z-index: 9999;
    .jaya-select {
      height: 36px;
      margin-right: 10px;
      /deep/ .el-input--small .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }
  }
}
</style>
