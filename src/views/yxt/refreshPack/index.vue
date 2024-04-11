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
          v-model="queryParams.trainSubject"
          othername="course"
          placeholder="培训科目"
        ></jaya-select>
      </el-form-item>
      <el-form-item prop="fileName">
        <el-input
          size="small"
          v-model="queryParams.fileName"
          placeholder="请输入文件名"
          style="width: 300px !important"
          clearable
        >
          <template slot="prepend">文件名</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getTableList(1)" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-box-con">
      <div class="table-top-btn">
        <div class="table-top-btn-l">
          <el-button type="primary" @click="handleAdd" icon="el-icon-plus"
            >添加</el-button
          >
          <el-button icon="el-icon-edit" type="warning" @click="edit"
            >编辑</el-button
          >
          <el-button icon="el-icon-delete" type="danger" @click="remove">
            删除
          </el-button>
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
              :disabled="isEdit"
            ></jaya-select>
            <jaya-select
              type="C"
              v-model="querySelect.cityId"
              :parameter="querySelect.provinceId"
              placeholder="请选择市/区"
              :disabled="isEdit"
            ></jaya-select>
            <jaya-select
              type="T"
              v-model="querySelect.countyId"
              :parameter="querySelect.cityId"
              placeholder="请选择区/县"
              :disabled="isEdit"
            ></jaya-select>
          </div>
        </el-form-item>
        <el-form-item label="驾校名称" prop="drvSchoolId">
          <jaya-select
            type="SS"
            v-model="form.drvSchoolId"
            :parameter="JSON.stringify(querySelect)"
            placeholder="请输入驾校"
            :disabled="isEdit"
            filterable
          ></jaya-select>
        </el-form-item>
        <el-form-item
          class="version"
          label="软件版本号(例：V1.2.8)"
          prop="version"
        >
          <el-input
            size="small"
            v-model="form.version"
            placeholder="请输入软件版本号"
            clearable
             @input="$forceUpdate()"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="培训科目" prop="trainSubject">
          <jaya-select
            v-model="form.trainSubject"
            othername="course"
            placeholder="培训科目"
            :disabled="isEdit"
          ></jaya-select>
        </el-form-item>

        <jaya-upload-file
          class="refrshUpload"
          ref="upload"
          :http-request="handleImportAuth"
          accept="zip"
          fileTitle="更新包文件"
          annotation="*注：更新包文件格式必须为zip，示例：pack.zip"
        >
        </jaya-upload-file>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            rows="3"
            placeholder="请输入备注"
            v-model="form.remark"
          ></el-input>
        </el-form-item>
      </el-form>
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
  addRefreshPack,
  refreshPackList,
  updateRefreshPack,
  removeRefreshPack,
} from "@/api/yxt/refreshPack";
export default {
  name: "refreshPack",
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
        equipType: 2,
      },
      column: [
        {
          title: "驾校名称",
          prop: "drvSchoolName",
        },
        {
          title: "科目",
          width: "100",
          prop: "trainSubject",
          status: () => {
            return "course";
          },
        },
        {
          title: "软件版本号",
          width: "360",
          prop: "version",
        },
        {
          title: "文件名",
          width: "360",
          prop: "fileName",
        },
        {
          title: "文件大小",
          width: "360",
          prop: "fileSize",
        },
        {
          title: "文件上传时间",
          width: "360",
          prop: "uploadTime",
        },
        {
          title: "备注",
          width: "360",
          prop: "remark",
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
        trainSubject: [{ required: true, message: "必填项", trigger: "blur" }],
        version: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      openAdd: false,
      importFileAuth: null,
      isEdit: false,
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      refreshPackList(this.queryParams).then((res) => {
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
      let { drvSchoolId, id, trainSubject, version } = this.activeRow;
      this.form.drvSchoolId = drvSchoolId;
      this.form.id = id;
      this.form.trainSubject = trainSubject + "";
      this.form.version = version;
      this.openAdd = true;
    },
    //上传文件
    handleImportAuth({ file }) {
      this.importFileAuth = file;
    },
    // 提交
    handleUpload(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!this.importFileAuth) {
            this.$message.error("请选择文件");
            return;
          }
          let formdata = new FormData();
          let { drvSchoolId, id, trainSubject, version, remark } = this.form;
          let params = {
            drvSchoolId,
            // id:this.isEdit?id:undefined,
            trainSubject,
            version,
            equipType: 2,
            file: this.importFileAuth || new Blob(),
            remark:remark?remark:'',
          };
          if (this.isEdit) {
            params = { ...params, id };
          }
          for (let item in params) {
            formdata.append(item, params[item]);
          }
          let { code } = this.isEdit
            ? await updateRefreshPack(formdata)
            : await addRefreshPack(formdata);
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
        this.importFileAuth = null;
      }
    },

    // 删除
    remove() {
      if (JSON.stringify(this.activeRow) === "{}" || !this.activeRow) {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      let { id } = this.activeRow;
      this.$confirm(`确定要删除此更新包信息`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let { data } = await removeRefreshPack({ id });
        this.getTableList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
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
    width: 692px;
    margin-top: 10px;
    /deep/.el-textarea__inner {
      color: red;
    }
  }
  .version {
    /deep/.el-form-item__label {
      width: 200px;
    }
  }
  .refrshUpload {
    display: inline-block;
    /deep/.uploadFile {
      margin-top: 0;
    .defaultUpload {
        margin-top: 0;
        .default-upload-container {
          width: 348px!important;
        }
      }
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
