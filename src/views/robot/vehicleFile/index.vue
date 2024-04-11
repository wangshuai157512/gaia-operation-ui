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
          v-model="queryParams.drvSchoolId"
          :parameter="JSON.stringify(querySelect)"
          placeholder="请输入驾校"
          filterable
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <jaya-select
          type="N"
          v-model="queryParams.equipmentId"
          :parameter="JSON.stringify({ id: queryParams.drvSchoolId })"
          placeholder="请选择车牌号"
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getTableList(1)" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-box-con">
      <div class="table-top-btn">
        <div class="table-top-btn-l">
          <el-button
            type="primary"
            @click="handleAdd"
            icon="el-icon-plus"
            v-hasPermi="['car-file-config:add']"
            >添加</el-button
          >
          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="edit"
            v-hasPermi="['car-file-config:update']"
            >编辑</el-button
          >
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
      width="888px"
      append-to-body
      v-if="openAdd"
    >
      <el-form
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
        class="dialogForm querySchool"
      >
        <el-form-item
          label="驾校"
          prop="countyId"
          class="querySchool all-item"
          style="width: 100%"
        >
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
        <el-form-item label="驾校名称" prop="drvSchoolId">
          <jaya-select
            type="SS"
            v-model="form.drvSchoolId"
            :parameter="JSON.stringify(querySelect)"
            placeholder="请输入驾校"
            filterable
          ></jaya-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="id">
          <jaya-select
            type="N"
            v-model="form.id"
            :parameter="JSON.stringify({ id: form.drvSchoolId })"
            placeholder="请选择车牌号"
          ></jaya-select>
        </el-form-item>
      </el-form>
      <jaya-upload-file
        ref="upload"
        @getFileList="getFileList"
        :multiple="true"
        accept="xml,ini"
        fileTitle="信号文件"
        annotation="*注：信号文件格式必须为xml,ini，示例：carinfo.xml"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportAuth"
        accept="xml"
        fileTitle="授权文件"
        annotation="*注：授权文件格式必须为xml，示例：license.xml"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportBase"
        accept="db"
        fileTitle="数据库文件"
        annotation="*注：数据库文件格式必须为db，示例：teach.db"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        :http-request="handleThreeDimensional"
        accept="txt"
        fileTitle="3D配置文件"
        annotation="*注：配置文件格式必须为txt，示例：Config.txt"
      >
      </jaya-upload-file>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUpload('form')"
          >确 定</el-button
        >
        <el-button @click="openAdd = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addVehicleFile, vehicleList } from "@/api/cloud/configuration";
export default {
  name: "vehicleFile",
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
        equipType:1,
      },
      column: [
        {
          title: "驾校名称",
          prop: "drvSchoolName",
        },
        {
          title: "号牌号码",
          width: "100",
          prop: "trainEquipmentId",
        },
        {
          title: "信号文件",
          width: "360",
          prop: "signalFileName",
        },
        {
          title: "授权文件",
          width: "360",
          prop: "licenseFileName",
        },
        {
          title: "数据库文件",
          width: "360",
          prop: "databaseFileName",
        },
        {
          title: "3D配置文件",
          width: "360",
          prop: "threeDimensionalConfigFileName",
        },
      ],
      tableData: [],
      option: {
        isRadio: true,
      },
      activeRow: {},
      form: {
        drvSchoolId: "",
        id: "",
      },
      rules: {
        id: [{ required: true, message: "必填项", trigger: "change" }],
        drvSchoolId: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      openAdd: false,
      importFileSignal: null,
      importFileAuth: null,
      importFileBase: null,
      importFileDimensional: null,
      isEdit: false,
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      vehicleList(this.queryParams).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    // 点击单选获取当前行
    handleCurrentChange(row) {
      this.activeRow = row;
    },
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.openAdd = true;
      this.form = {};
      this.resetForm("form");
    },
    // 编辑
    edit() {
      if (JSON.stringify(this.activeRow) === "{}") {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      this.isEdit = true;
      let { drvSchoolId, id } = this.activeRow;
      this.form.drvSchoolId = drvSchoolId;
      this.form.id = id;
      this.openAdd = true;
    },
    //上传文件
    // 多选
    getFileList(fileList) {
      this.importFileSignal = fileList.map((item) => {
        return item.raw;
      });
    },
    handleImportAuth({ file }) {
      this.importFileAuth = file;
    },
    handleImportBase({ file }) {
      this.importFileBase = file;
    },
    handleThreeDimensional({ file }) {
      this.importFileDimensional = file;
    },
    // 提交
    handleUpload(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (
            !this.importFileSignal &&
            !this.importFileAuth &&
            !this.importFileBase &&
            !this.importFileDimensional
          ) {
            this.$message.error("请选择文件");
            return;
          }
          let formdata = new FormData();
          let { drvSchoolId, id } = this.form;
          let params = {
            drvSchoolId,
            id,
            equipType:1,
            licenseFile: this.importFileAuth || new Blob(),
            databaseFile: this.importFileBase || new Blob(),
            threeDimensionalConfigFile:
              this.importFileDimensional || new Blob(),
          };
          // if(!this.isEdit) {
          //   id = undefined
          // }
          this.importFileSignal?.forEach((item, index) => {
            params["signalFile[" + index + "]"] = item;
          });
          for (let item in params) {
            formdata.append(item, params[item]);
          }
          let { code } = await addVehicleFile(formdata);
          if (code === 200) {
            this.$message({
              message: this.isEdit ? "编辑成功" : "添加成功",
              type: "success",
            });
            this.getTableList();
            this.openAdd = false;
          }
        }
      });
    },

    clearFile(val) {
      if (!val) {
        this.$refs.upload.clearFileName();
        this.importFileSignal = null;
        this.importFileAuth = null;
        this.importFileBase = null;
        this.importFileDimensional = null;
      }
    },
  },
  mounted() {
    this.getTableList();
  },
  watch: {
    openAdd: {
      handler: "clearFile",
    },
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
