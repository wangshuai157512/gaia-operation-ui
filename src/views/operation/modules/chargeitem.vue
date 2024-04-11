<template>
  <div>
    <div class="jaya-select-body">
      <el-radio
        v-model="tempData.chargeType"
        v-for="item in chargeTypeList"
        :key="item.value"
        :label="item.value"
        @input="$forceUpdate()"
        @change="CTChange"
      >
        {{ item.label }}
      </el-radio>
      <el-input
        v-model="tempData.freeTime"
        style="width: 100px; margin-left: 5px"
        placeholder="请输入"
        v-show="tempData.chargeType==2"
      />
      <el-select
        placeholder="选择时间"
        filterable
        size="small"
        v-model="tempData.freeTimeUnit"
        style="width: 100px"
        v-show="tempData.chargeType==2"
      >
        <el-option
          v-for="time in timeNoLimitOption"
          :key="time.value"
          :value="time.value"
          :label="time.label"
        >
        </el-option>
      </el-select>
    </div>

    <ul class="list-title" v-show="tempData.chargeType==2">
      <li>收费标准</li>
      <li>是否启用</li>
      <li>有无折扣</li>
      <li>折扣配置</li>
      <li>折扣时间</li>
    </ul>
    <ul v-for="(item, index) in tempData.list" :key="index" class="list-data" v-show="tempData.chargeType==2">
      <li>
        套餐{{
          index == 0
            ? "一"
            : index == 1
            ? "二"
            : index == 2
            ? "三"
            : index == 3
            ? "四"
            : ""
        }}：<el-input-number
          v-model="tempData.list[index].setmealPay"
          placeholder="请输入"
          style="width: 60px"
          :precision="2"
          :controls="false"
          :min="0"
        />元/
        <el-input-number
          v-model="tempData.list[index].setmealQuantity"
          placeholder="请输入"
          style="width: 60px"
          :disabled="tempData.list[index].setmealUnit==='5'"
          :precision="0"
          :controls="false"
          :min="0"
        />
        <el-select
          placeholder="选择时间"
          filterable
          size="small"
          style="width: 100px"
          v-model="tempData.list[index].setmealUnit"
          @change="$forceUpdate()"
        >
          <el-option
            v-for="time in timeOption"
            :key="time.value"
            :value="time.value"
            :label="time.label"
          >
          </el-option>
        </el-select>
      </li>
      <li>
        <el-switch
          v-model="tempData.list[index].setmealStatus"
          active-text="是"
          inactive-text="否"
          :active-value="0"
          :inactive-value="1"
          @change="$forceUpdate()"
        >
        </el-switch>
      </li>
      <li>
        <el-switch
          v-model="tempData.list[index].setmealDiscount"
          active-text="有"
          inactive-text="无"
          :active-value="0"
          :inactive-value="1"
          @change="setmealDiscountChange(arguments, index)"
        >
        </el-switch>
      </li>
      <li>
        <template v-if="tempData.list[index].setmealDiscount == '0'">
          <el-input-number
            :controls="false"
            :min="0"
            :max="10"
            :precision="2"
            v-model="tempData.list[index].setmealCount"
            placeholder="请输入"
            style="width: 70px"
            @change="setzkyuan(arguments, index)"
            @blur="setzkyuan('', index)"
          />折
          <el-input-number
            :controls="false"
            :precision="2"
            disabled
            v-model="tempData.list[index].setmealPayDiscount"
            placeholder="请输入"
            style="width: 70px"
          />元
        </template>
      </li>
      <li>
        <template v-if="tempData.list[index].setmealDiscount == '0'">
          <el-date-picker
            v-model="tempData.list[index].setmealStartEnd"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 320px"
            @input="$forceUpdate()"
            @change="dateChange(arguments, index)"
          >
          </el-date-picker>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ChargeItem",
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
    index: {
      default() {
        return 0;
      },
    },
    itemData: {
      default() {
        return {
          id: "", // 主键
          drvSchoolId: "", // 驾校ID
          chargeType: 0, // 整体优惠【0 无 1 全部免费 2 限时免费】
          carModel: "",
          carTypeListCheck: [],
          freeTime: "", // 免费时长--分钟
          freeTimeUnit: "", // 免费时长--分钟
          operationId: "", // 运营管理主表id
          type: "1", //整体优惠【0 本校 1 外校】
          // 套餐详细参数
          list: [
            {
              id: 0, //主键
              setmealDiscount: 0, // 折扣状态 【0启用 1停用】
              setmealEnd: "", // 折扣结束时间
              setmealPay: 0, // 收费 【单位 ：分】
              setmealPayDiscount: 0, // 折扣收费【单位 ：分】
              setmealCount: "",
              setmealStartEnd: [],
              setmealStart: "", // 折扣起始时间
              setmealStatus: "0", //  状态 【0启用 1停用】
              setmealUnit: 0, // 单位 【0分钟 1小时 2天 5不限时】
              type: 0, // 收费方式【0 本校 1 外校】
            },
          ],
        };
      },
    },
  },
  data() {
    return {
      tempData: {
        id: "", // 主键
        drvSchoolId: "", // 驾校ID
        chargeType: 0, // 整体优惠【0 无 1 全部免费 2 限时免费】
        carModel: "",
        carTypeListCheck: [],
        freeTime: "", // 免费时长--分钟
        freeTimeUnit: "", // 免费时长--分钟
        operationId: "", // 运营管理主表id
        type: "1", //整体优惠【0 本校 1 外校】
        // 套餐详细参数
        list: [],
      },
    };
  },
  watch: {
    tempData: {
      handler(newObj) {
        this.$emit("update:newObj", { index: this.index, ...newObj });
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    let erere = JSON.parse(JSON.stringify(this.itemData));
    erere.list = erere.list.map((item) => {
      item.setmealUnit = String(item.setmealUnit);
      // item.setmealDiscount = String(item.setmealDiscount);
      // item.setmealStatus = String(item.setmealStatus);
      item.setmealStartEnd =
        item.setmealStart && item.setmealEnd
          ? [item.setmealStart, item.setmealEnd]
          : [];
      return item;
    });
    Object.assign(this.tempData, erere);
  },
  methods: {
    dateChange(agrs, index) {
      let dr = agrs[0];
      this.tempData.list[index].setmealStart = dr[0] ? dr[0] : "";
      this.tempData.list[index].setmealEnd = dr[1] ? dr[1] : "";
    },
    CTChange(val) {
      this.$forceUpdate();
      if (val == 1) {
        this.tempData.freeTime = "";
        this.tempData.freeTimeUnit = "";
        this.tempData.list.forEach(item=> {
          item.setmealStatus = 1
          item.setmealDiscount = 1
          item.setmealPay = 0
          item.setmealQuantity = 0
          item.setmealCount = null
          item.setmealStart = null
          item.setmealEnd = null
          item.setmealStartEnd = []
        })
      } else if (val == 2) {
        this.tempData.freeTime = this.tempData.freeTime;
        this.tempData.freeTimeUnit = this.timeOption[0].value || "";
      }
    },
    setmealDiscountChange(ars, index) {
      this.$forceUpdate();
      if (this.tempData.list[index].setmealDiscount == 1) {
        this.tempData.list[index].setmealPayDiscount = "";
        this.tempData.list[index].setmealCount = "";
        this.tempData.list[index].setmealStart = "";
        this.tempData.list[index].setmealEnd = "";
        this.tempData.list[index].setmealStartEnd = "";
      }
    },
    setzkyuan(arg, index) {
      this.tempData.list[index].setmealPay = this.tempData.list[index]
        .setmealPay
        ? this.tempData.list[index].setmealPay
        : 0;
      this.tempData.list[index].setmealCount = this.tempData.list[index]
        .setmealCount
        ? this.tempData.list[index].setmealCount
        : 0;
      let rz =
        (this.tempData.list[index].setmealPay *
          this.tempData.list[index].setmealCount) /
        10;
      if (!isNaN(rz)) {
        this.tempData.list[index].setmealPayDiscount = rz;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.jaya-select-body {
  width: 700px;
  display: flex;
  align-items: center;
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
    width: 30%;
  }
  li:nth-child(2) {
    width: 11%;
  }
  li:nth-child(3) {
    width: 11%;
  }
  li:nth-child(4) {
    width: 16%;
  }
  li:nth-child(5) {
    width: 30%;
    display: flex;
    justify-content: center;
  }
}
</style>
