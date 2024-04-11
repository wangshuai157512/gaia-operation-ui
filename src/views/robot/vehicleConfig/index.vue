<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item class="querySchool">
        <div class="ganged">
          <jaya-select
            type="P"
            v-model="querySelect.provinceId"
            placeholder="请选择省/市"
          ></jaya-select>
          <jaya-select
            type="C"
            v-model="querySelect.cityId"
            :parameter="querySelect.provinceId"
            placeholder="请选择市/区"
          ></jaya-select>
          <jaya-select
            type="T"
            v-model="querySelect.countyId"
            :parameter="querySelect.cityId"
            placeholder="请选择区/县"
          ></jaya-select>
        </div>
      </el-form-item>
      <el-form-item>
        <jaya-select
          type="SS"
          v-model="queryParams.id"
          :parameter="JSON.stringify(querySelect)"
          placeholder="请输入驾校"
          filterable
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.subject"
          placeholder="培训科目"
          size="small"
          clearable
        >
          <el-option
            v-for="item in kskmList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.category"
          placeholder="参数分类"
          size="small"
          clearable
        >
          <el-option
            v-for="item in csflList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.attribute"
          placeholder="参数属性"
          size="small"
          clearable
        >
          <el-option
            v-for="item in cssxList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryParams.name" placeholder="请输入" size="small">
          <template slot="prepend">参数名称</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="getTableList(1)"
          type="primary"
          >查询</el-button
        >
      </el-form-item>
    </el-form>

    <div class="table-box-con">
      <div class="table-top-btn">
        <div class="table-top-btn-l">
          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="edit"
            v-hasPermi="['car-config:update']"
            >编辑</el-button
          >
        </div>
        <div class="table-top-btn-r">
          <el-button
            v-if="!queryParams.id || !queryParams.subject"
            round
            @click="handleImportant"
            v-hasPermi="['car-config:import']"
            >导入</el-button
          >
          <jaya-upload-file
            v-else
            ref="upload"
            :http-request="handleImport"
            accept="ctk"
            fileTitle="车型文件"
            :singleBtnUpload="true"
          >
            <el-button round>导入</el-button>
          </jaya-upload-file>
        </div>
      </div>
      <jaya-table-group
        :total="total"
        :tableHeaderList="column"
        :tableList="tableData"
        @pagination="getTableList"
        :option="option"
        @handleCurrentChange="handleCurrentChange"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
      ></jaya-table-group>
    </div>

    <!-- 添加文件窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="isEdit ? '编辑' : '添加'"
      :visible.sync="openAdd"
      width="788px"
      append-to-body
      v-if="openAdd"
    >
      <el-form
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
        class="dialogForm"
      >
        <el-form-item label="参数名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="参数名称"
            :disabled="isEdit"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="参数分类" prop="category">
          <el-select
            v-model="form.category"
            placeholder="参数分类"
            :disabled="isEdit"
            size="small"
          >
            <el-option
              v-for="item in csflList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数属性" prop="attribute">
          <el-select
            v-model="form.attribute"
            placeholder="参数属性"
            :disabled="isEdit"
            size="small"
          >
            <el-option
              v-for="item in cssxList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数范围" prop="limits">
          <el-input
            v-model="form.limits"
            placeholder="参数范围"
            :disabled="isEdit"
            size="small"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="驾校名称" prop="id">
          <jaya-select
            type="SS"
            v-model="form.id"
            :parameter="JSON.stringify(querySelect)"
            placeholder="请输入驾校"
            :disabled="isEdit"
            filterable
          ></jaya-select>
        </el-form-item> -->
        <el-form-item label="驾校名称" prop="drvSchoolName">
          <el-input
            v-model="form.drvSchoolName"
            placeholder="请输入"
            :disabled="isEdit"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="培训科目" prop="trainSubject">
          <el-select
            v-model="form.trainSubject"
            :disabled="isEdit"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in kskmList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="培训车型" prop="carType">
          <jaya-select
            v-model="form.carType"
            placeholder="考试车型"
            othername="exam_car_type"
            :disabled="isEdit"
          >
          </jaya-select>
        </el-form-item>
        <el-form-item label="号码号牌" prop="trainEquipmentId">
          <el-input
            v-model="form.trainEquipmentId"
            placeholder="请输入"
            :disabled="isEdit"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input
            v-model="form.defaultValue"
            placeholder="请输入"
            :disabled="isEdit"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="参数值"
          prop="csz"
          v-if="form.value && form.value.indexOf('\\') !== -1"
        >
          <el-select v-model="form.value" placeholder="请选择" size="small">
            <el-option
              v-for="item in csfwList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数值" prop="value" v-else>
          <el-input
            v-model="form.value"
            placeholder="请输入"
            @input="$forceUpdate()"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            type="textarea"
            rows="3"
            v-model="form.remark"
            :disabled="isEdit"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEdit('form')">确 定</el-button>
        <el-button @click="openAdd = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const column = function () {
  return [
    {
      title: "驾校名称",
      prop: "drvSchoolName",
    },
    {
      title: "培训科目",
      prop: "trainSubject",
      status: () => {
        return this.kskmList;
      },
    },
    {
      title: "参数名称",
      prop: "name",
    },
    {
      title: "参数分类",
      prop: "category",
    },
    {
      title: "参数属性",
      prop: "attribute",
      status: () => this.cssxList,
    },
    {
      title: "培训车型",
      width: "150",
      prop: "carType",
      status: () => {
        return "exam_car_type";
      },
    },
    {
      title: "号牌号码",
      prop: "trainEquipmentId",
    },
    {
      title: "考车编号",
      prop: "trainEquipmentSortId",
    },
    {
      title: "参数范围",
      prop: "limits",
    },
    {
      title: "参数值",
      prop: "value",
    },
    {
      title: "默认值",
      prop: "defaultValue",
    },

    {
      title: "备注说明",
      prop: "remark",
    },
  ];
};
import {
  vehicleConfigList,
  vehicleUploadConfig,
  vehicleConfigEdit,
} from "@/api/cloud/configuration";
export default {
  name: "vehicleConfig",
  data() {
    return {
      total: 0,
      querySelect: {
        provinceId: "",
        cityId: "",
        countyId: "",
        hasSubSchool: true,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        equipType:1
      },
      kskmList: [
        {
          label: "科目二",
          value: "2",
        },
        {
          label: "科目三",
          value: "3",
        },
      ],
      csflList: [
        {
          label: "通用参数",
          value: "通用参数",
        },
        {
          label: "评判参数",
          value: "评判参数",
        },
      ],
      cssxList: [
        {
          label: "通用参数",
          value: "0",
        },
        {
          label: "车辆持有",
          value: "1",
        },
        {
          label: "车型持有",
          value: "2",
        },
      ],
      column: column.call(this),
      tableData: [],
      option: {
        isRadio: true,
      },
      activeRow: {},
      cslxList: [
        {
          label: "字符串",
          value: "0",
        },
        {
          label: "单选框",
          value: "1",
        },
        {
          label: "数字",
          value: "2",
        },
        {
          label: "IP",
          value: "3",
        },
      ],
      form: {},
      csfwList: [],
      rules: {
        value: [{ required: true, message: "必填项", trigger: "change" }],
      },
      openAdd: false,
      importFileConfig: null,
      isEdit: false,
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      vehicleConfigList(this.queryParams).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    // 点击单选获取当前行
    handleCurrentChange(row) {
      this.activeRow = row;
    },

    // 编辑
    edit() {
      if (JSON.stringify(this.activeRow) === "{}") {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      this.isEdit = true;
      this.openAdd = true;
      Object.assign(this.form, this.activeRow);
      console.log(this.form);
      let { limits } = this.activeRow;
      if (limits) {
        this.csfwList = limits.split("\\");
        let newCsfwList = [];
        this.csfwList.forEach((item, index) => {
          item = {
            label: item,
            value: item,
          };
          newCsfwList.push(item);
        });
        this.csfwList = newCsfwList;
      }
    },
    // 编辑
    handleEdit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let { id, value } = this.form;
          vehicleConfigEdit({ id, value,equipType:1, }).then((res) => {
            this.$message({
              message: "编辑成功",
              type: "success",
            });
            this.openAdd = false;
            this.getTableList();
          });
        }
      });
    },
    handleImportant() {
      this.$message({
        message: "请选择驾校和科目",
        type: "warning",
      });
    },
    //上传文件
    handleImport({ file }) {
      this.$refs.upload.clearFileName();
      this.importFileConfig = null;
      this.importFileConfig = file;
      this.handleUpload();
    },
    // 提交
    async handleUpload() {
      if (!this.queryParams.id || !this.queryParams.subject) {
        this.$message.error("请选择驾校和科目");
        return;
      }
      let formdata = new FormData();
      formdata.append("file", this.importFileConfig);
      formdata.append("id", this.queryParams.id);
      formdata.append("subject", this.queryParams.subject);
      formdata.append("equipType", 1);
      let { code } = await vehicleUploadConfig(formdata);
      this.$message({
        message: "上传成功",
        type: "success",
      });
      this.getTableList();
    },
  },
  mounted() {
    this.getTableList();
  },
};
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-input,
  .el-select {
    width: 242px;
  }
  .el-textarea {
    width: 608px;
    /deep/.el-textarea__inner {
      color: red;
    }
  }
}
.querySchool {
  .ganged {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    /deep/.jaya-select {
      width: 30%;
      .el-input,
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
