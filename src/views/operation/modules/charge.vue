<template>
  <div style="width:100%">
    <el-form :inline="true">
      <el-form-item label="驾校：">
        <el-input
          v-model="drvSchoolName"
          disabled
          style="width: 240px"
        ></el-input>
      </el-form-item>
      <br />
      <template v-if="carTypeList && carTypeList.length > 0">
        <el-form-item label="车型：">
          <el-radio-group v-model="radio" @change="$forceUpdate()">
            <el-radio :label="item" v-for="item in carTypeList" :key="item">
              {{ item }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <br />
        <el-form-item label="收费方式：" class="charge-item-type-item">
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <template v-for="(item, index) in allList">
              <el-tab-pane
                v-if="item.carModel == radio"
                :key="index"
                :label="item.type == 0 ? '校内' : '校外'"
                :name="item.type"
              >
                <charge-item
                  v-if="item.type == activeName"
                  :itemData="item"
                  :index="index"
                  :timeOption="timeOption"
                  :timeNoLimitOption="timeNoLimitOption"
                  :chargeTypeList="chargeTypeList"
                  :newObj.sync="newObj"
                />
              </el-tab-pane>
            </template>
          </el-tabs>
        </el-form-item>
      </template>
      <div v-else class="s-s-s-nodata">驾校车型没有配置</div>
    </el-form>
  </div>
</template>

<script>
import ChargeItem from "./chargeitem.vue";
export default {
  name: "Charge",
  components: { ChargeItem },
  props: {
    timeOption: {
      default() {
        return [];
      },
    },
    timeNoLimitOption: {
      default() {
        return [];
      },
    },
    chargeTypeList: {
      default() {
        return [];
      },
    },
    carTypeList: {
      default() {
        return [];
      },
    },
    drvSchoolName: {
      default: "",
    },
    reserveForm: {
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      provinceId: "",
      cityId: "",
      countyId: "",
      allList: [],
      activeName: "0",
      radio: "",
      newObj: {},
    };
  },
  watch: {
    allList: {
      handler(newList, oldList) {
        this.$emit("update:newList", newList);
      },
      immediate: true,
      deep: true,
    },
    newObj: {
      handler(nv, ov) {
        if (nv && String(nv.index) && nv.list && nv.list.length > 0) {
          this.allList = this.allList.map((item, index) => {
            if (index == nv.index) item = nv;
            return item;
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.radio = this.carTypeList[0] || "";
    let tempallist = [];
    this.reserveForm.forEach((item) => {
      let temobj = item;
      let temobjlist = item.list ? item.list : [];
      if (!temobjlist || temobjlist.length < 4) {
        while (temobjlist.length < 4) {
          temobjlist.push({
            id: "", //主键
            carModel: item.carModel,
            type: item.type, // 收费方式【0 本校 1 外校】
            setmealPay: "0", // 收费 【单位 ：分】
            setmealQuantity: "",
            setmealUnit: "0", // 单位 【0分钟 1小时 2天 5不限时】
            setmealDiscount: "1", // 折扣状态 【0启用 1停用】
            setmealPayDiscount: "0", // 折扣收费【单位 ：分】
            setmealCount: "",
            setmealStart: "", // 折扣起始时间
            setmealEnd: "", // 折扣结束时间
            setmealStatus: "1", //  状态 【0启用 1停用】
          });
        }
      }

      temobj.type = String(temobj.type);
      temobj.chargeType = String(temobj.chargeType);
      temobj.freeTimeUnit = String(temobj.freeTimeUnit);
      temobj.list = temobjlist;
      tempallist.push(temobj);
    });
    this.allList = tempallist;
  },
  methods: {
    tabClick(val) {
      this.activeName = val.index;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.charge-item-type-item {
  .el-form-item__content {
    width: 1000px;
  }
}
.jaya-select-body {
  width: 700px;
  display: flex;
}
.list-title,
.list-data {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  li {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  li:nth-child(1) {
    width: 25%;
  }
  li:nth-child(2) {
    width: 12%;
  }
  li:nth-child(3) {
    width: 12%;
  }
  li:nth-child(4) {
    width: 16%;
  }
  li:nth-child(5) {
    width: 30%;
  }
}
.s-s-s-nodata {
  width: 100%;
  text-align: center;
}
</style>
