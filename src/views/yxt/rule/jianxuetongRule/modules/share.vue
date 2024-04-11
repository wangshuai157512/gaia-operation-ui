<template>
  <el-form
    ref="reserveForm"
    :model="reserveForm"
    label-width="200px"
    :inline="false"
    :rules="rules"
  >
    <el-form-item label="驾校:">
      <el-input
        v-model="reserveForm.drvSchoolName"
        disabled
        style="width: 240px"
      ></el-input>
    </el-form-item>
    <br />
    <el-form-item label="分成比例:" prop="shareallplusrules">
      <el-input v-show="false" v-model="reserveForm.shareallplusrules" />
      <span>精英智通：</span>
      <el-input-number
        v-model="reserveForm.shareOther"
        :min="0"
        :max="100"
        step-strictly
        style="width: 160px"
        placeholder="请输入分成比例"
      />%
      <span style="margin-left: 30px"> 驾校：</span>
      <el-input-number
        v-model="reserveForm.shareDrv"
        :min="0"
        :max="100"
        step-strictly
        style="width: 160px"
        placeholder="请输入分成比例"
      />%
      <span style="margin-left: 30px">合作方：</span>
      <el-input-number
        v-model="reserveForm.sharePartner"
        :min="0"
        :max="100"
        step-strictly
        style="width: 160px"
        placeholder="请输入分成比例"
      />%
    </el-form-item>
    <br />
    <el-form-item label="驾校银行账号：" prop="drvBankCard">
      <el-input
        v-model="reserveForm.drvBankCard"
        style="width: 240px"
        :maxlength="19"
        placeholder="请输入驾校银行账号"
      />
    </el-form-item>
    <br />
    <el-form-item label="驾校银行开户行：">
      <el-input
        v-model="reserveForm.drvBankName"
        style="width: 240px"
        placeholder="请输入驾校银行开户行"
      />
    </el-form-item>
    <br />
    <el-form-item label="合作方银行账号：" prop="partnerBankCard">
      <el-input
        v-model="reserveForm.partnerBankCard"
        style="width: 240px"
        :maxlength="19"
        placeholder="请输入合作方银行账号"
      />
    </el-form-item>
    <br />
    <el-form-item label="合作方银行开户行：">
      <el-input
        v-model="reserveForm.partnerBankName"
        style="width: 240px"
        placeholder="请输入合作方银行开户行"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Share",
  props: {
    reserveForm: {
      default() {
        return {
          id: shareId, //	主键	integer(int64)
          drvSchoolId: "", //	驾校id	integer(int64)
          drvBankCard: null, //驾校银行账号	string
          drvBankName: "", //	驾校银行开户行	string
          partnerBankCard: null, //	合作方银行账号	string
          partnerBankName: "", //	合作方银行开户行	string
          shareDrv: 0, //	分成--驾校	integer(int32)
          shareallplusrules: "",
          shareOther: 0, //	分成--其他	integer(int32)
          sharePartner: 0, //	分成--合作方	integer(int32)
        };
      },
    },
  },
  data() {
    var validateshareallplusrules = (rule, value, callback) => {
      let allplus =
        this.reserveForm.shareOther +
        this.reserveForm.shareDrv +
        this.reserveForm.sharePartner;
      if (allplus > 100) {
        callback(new Error("分成比例超出100%限制，请重新分配"));
      } else if (allplus < 100) {
        callback(new Error("分成比例不足100%，请重新分配"));
      } else {
        callback();
      }
    };
    var validatenumber1 = (rule, value, callback) => {
      let re = Number(value);
      if (isNaN(re)) {
        callback(new Error("驾校银行账号仅可输入数字"));
      } else {
        callback();
      }
    };
    var validatenumber2 = (rule, value, callback) => {
      let re = Number(value);
      if (isNaN(re)) {
        callback(new Error("合作方银行账号仅可输入数字"));
      } else {
        callback();
      }
    };
    return {
      provinceId: "",
      cityId: "",
      countyId: "",
      rules: {
        shareallplusrules: [
          {
            required: true,
            validator: validateshareallplusrules,
            trigger: "change",
          },
        ],
        drvBankCard: [
          {
            validator: validatenumber1,
            trigger: "blur",
          },
        ],
        partnerBankCard: [
          {
            validator: validatenumber2,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.setAllCount();
  },
  watch: {
    reserveForm: {
      handler(nval) {
        this.setAllCount();
        this.$emit("update:newObj", nval);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    validatorall() {
      return new Promise((resolve, reject) => {
        this.$refs.reserveForm.validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    setAllCount() {
      this.reserveForm.shareallplusrules = `${
        this.reserveForm.shareOther || ""
      },${this.reserveForm.shareDrv || ""},${
        this.reserveForm.sharePartner || ""
      }`;
    },
  },
};
</script>
