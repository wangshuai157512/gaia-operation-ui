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
          v-model="queryParams.carType"
          placeholder="培训车型"
          othername="exam_car_type"
          multiple
          sty="width:200px"
        >
        </jaya-select>
      </el-form-item>
      <el-form-item>
        <jaya-select
          v-model="queryParams.trainSubject"
          othername="course"
          placeholder="培训科目"
        ></jaya-select>
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
            type="primary"
            @click="handleAdd"
            icon="el-icon-plus"
            v-hasPermi="['car-type-file-config:add']"
            >添加</el-button
          >
          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="edit"
            v-hasPermi="['car-type-file-config:update']"
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
        <el-form-item label="培训科目" prop="trainSubject">
          <jaya-select
            v-model="form.trainSubject"
            :disabled="isEdit"
            othername="course"
          ></jaya-select>
        </el-form-item>
        <el-form-item label="培训车型" prop="carType">
          <jaya-select
            v-model="form.carType"
            placeholder="请选择"
            othername="exam_car_type"
            :disabled="isEdit"
          >
          </jaya-select>
        </el-form-item>
        <el-form-item label="车辆品牌" prop="carTypeBrand">
          <el-select
            v-model="form.carTypeBrand"
            placeholder="请选择"
            size="small"
            :disabled="isEdit"
          >
            <el-option
              v-for="item in carTypeBrandList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportModel"
        accept="ini"
        fileTitle="车型文件"
        annotation="*注：车型文件格式必须为ini，示例：car.ini"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        @getFileList="getFileList"
        accept="gst,dat,id,map,tab,mdb"
        :multiple="true"
        fileTitle="地图文件"
        annotation="*注：科目二：gst,dat,id,map,tab，科目三：mdb 示例：map.gst"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportElectronic"
        accept="js"
        fileTitle="电子车型文件"
        annotation="*注：电子车型文件格式必须为js，示例：C1.js"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportTrack"
        accept="dbf,shp,shx"
        :multiple="true"
        fileTitle="轨迹地图文件"
        annotation="*注：轨迹地图文件格式必须为dbf,shp,shx，示例：sensor_region.shx"
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
import {
  addModelFile,
  modelList,
  brandSelect,
} from "@/api/cloud/configuration";
export default {
  name: "modelFile",
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
        carType:"",
        equipType:1,
      },
      column: [
        {
          title: "驾校名称",
          prop: "drvSchoolName",
        },
        {
          title: "车型品牌",
          prop: "carTypeBrand",
        },
        {
          title: "培训科目",
          prop: "trainSubject",
          status: () => {
            return "course";
          },
        },
        {
          title: "车型文件",
          prop: "carTypeFileName",
        },
        {
          title: "地图文件",
          prop: "mapFileName",
        },
        {
          title: "电子车型文件",
          prop: "electronCarTypeFileName",
        },
        {
          title: "轨迹地图文件",
          prop: "gpsTrackMapFileName",
        },
      ],
      tableData: [],
      option: {
        isRadio: true,
      },
      activeRow: {},
      form: {},
      carTypeBrandList: [],
      rules: {
        trainSubject: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        carType: [{ required: true, message: "必填项", trigger: "change" }],
        carTypeBrand: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        drvSchoolId: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      openAdd: false,
      importFileModel: null,
      importFileMap: null,
      importFileElectronic: null,
      importFileTrack: null,
      isEdit: false,
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      let queryCarType = this.queryParams.carType + "";
      modelList({ ...this.queryParams, carType: queryCarType }).then((res) => {
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
      this.getBrandSelect();
      this.resetForm("form");
    },
    // 车辆品牌
    getBrandSelect() {
      let { carType, drvSchoolId, trainSubject } = this.form;
      brandSelect({ carType, drvSchoolId, trainSubject }).then((res) => {
        this.carTypeBrandList = res.data;
      });
    },
    // 编辑
    edit() {
      if (JSON.stringify(this.activeRow) === "{}") {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      this.isEdit = true;
      this.openAdd = true;
      let { drvSchoolId, carType, trainSubject, carTypeBrand, id } =
        this.activeRow;
      this.form.drvSchoolId = drvSchoolId;
      this.form.carType = carType;
      this.form.trainSubject = trainSubject;
      this.form.carTypeBrand = carTypeBrand;
      this.form.id = id;
    },
    //上传文件
    handleImportModel({ file }) {
      this.importFileModel = file;
    },
    getFileList(fileList) {
      this.importFileMap = fileList.map((item) => {
        return item.raw;
      });
    },
    handleImportElectronic({ file }) {
      this.importFileElectronic = file;
    },
    handleImportTrack({ file }) {
      this.importFileTrack = file;
    },
    // 提交
    handleUpload(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (
            !this.importFileModel &&
            !this.importFileMap &&
            !this.importFileElectronic &&
            !this.importFileTrack
          ) {
            this.$message.error("请选择文件");
            return;
          }
          let formdata = new FormData();

          let params = {
            ...this.form,
            equipType:1,
            carTypeFile: this.importFileModel || new Blob(),
            electronCarTypeFile: this.importFileElectronic || new Blob(),
            gpsTrackMapFile: this.importFileTrack || new Blob(),
          };
          this.importFileMap?.forEach((item, index) => {
            params["mapFiles[" + index + "]"] = item;
          });
          for (let item in params) {
            formdata.append(item, params[item]);
          }

          let { code } = await addModelFile(formdata);
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
        this.importFileModel = null;
        this.importFileMap = null;
        this.importFileElectronic = null;
        this.importFileTrack = null;
        this.fileList = [];
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
    "form.carType": {
      handler: "getBrandSelect",
    },
    "form.drvSchoolId": {
      handler: "getBrandSelect",
    },
    "form.trainSubject": {
      handler: "getBrandSelect",
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
