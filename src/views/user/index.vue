<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item prop="">
        <el-button
          style="margin-bottom: 6px"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddClick"
          v-hasPermi="['user:add']"
          >添加</el-button
        >
      </el-form-item>
      <el-form-item prop="">
        <el-button
          icon="el-icon-view"
          type="info"
          @click="handleReviewClick"
          v-hasPermi="['user:info']"
          >查看</el-button
        >
      </el-form-item>
      <el-form-item prop="">
        <el-button
          icon="el-icon-edit"
          type="warning"
          @click="handleEditClick"
          v-hasPermi="['user:update']"
          >编辑</el-button
        >
      </el-form-item>
      <el-form-item prop="">
        <el-button
          icon="el-icon-delete"
          type="danger"
          @click="handleDelClick"
          v-hasPermi="['user:delete']"
          >删除</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      @current-change="handleCurrentChange"
      ref="multipleTable"
      :data="data"
    >
      <el-table-column label="选择" width="55" align="center">
        <template slot-scope="scope">
          <el-radio v-model="radioValue" :label="scope.row"><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="userName"
        width="120"
        label="登录名"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="realName"
        width="120"
        label="姓名"
      ></el-table-column>
      <el-table-column
        width="160"
        align="center"
        prop="phonenumber"
        label="电话"
      ></el-table-column>
      <el-table-column
        prop="roleName"
        align="center"
        label="角色"
      ></el-table-column>
      <el-table-column
        prop="drvSchoolName"
        align="center"
        width="180"
        label="所管理驾校"
      ></el-table-column>
    </el-table>

    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="visible"
      width="680px"
      append-to-body
      disabled
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :inline="true"
        :disabled="operating == 3"
        class="dialogForm"
      >
        <el-form-item prop="userName" label="登录用户名">
          <el-input v-model="form.userName" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="form.password" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item prop="realName" label="姓名">
          <el-input v-model="form.realName" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item prop="roleId" label="角色">
          <jaya-select
            type="R"
            v-model="form.roleId"
            placeholder="请选择角色"
          ></jaya-select>
        </el-form-item>
        <el-form-item prop="phonenumber" label="联系电话">
          <el-input
            v-model="form.phonenumber"
            placeholder="请输入"
            size="small"
          />
        </el-form-item>
        <el-form-item prop="idCard" label="身份证号">
          <el-input v-model="form.idCard" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item prop="drvSchoolId" label="所属驾校">
          <jaya-select
            type="SS"
            v-model="form.drvSchoolId"
            :parameter="JSON.stringify({})"
            placeholder="请输入驾校"
            filterable
          ></jaya-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="form.status" placeholder="状态" size="small">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="width: 100%" prop="remark" label="备注">
          <el-input
            type="textarea"
            cols="50"
            rows="3"
            v-model="form.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSure">保 存</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>

    <pagination
      :total="total"
      :page-sizes="pageSizes"
      :page.sync="params.pageNum"
      :limit.sync="params.pageSize"
      @pagination="getUserPageList"
    />
  </div>
</template>

<script>
import {
  getUserPageList,
  addUser,
  delUser,
  getUserInfo,
  editUserInfo
} from "@/api/cloud/user";
const pwdCheckStrong = function (J) {
  var M = 0;
  var L = /\d/;
  var H = /[A-Z]/;
  var K = /[a-z]/;
  var I = /\W/;
  if (L.test(J)) {
    M++;
  }
  if (H.test(J)) {
    M++;
  }
  if (K.test(J)) {
    M++;
  }
  if (I.test(J)) {
    M++;
  }
  if (M >= 4) {
    M = 3;
  }
  if (M > 1 && J.length <= 7) {
    M--;
  }
  return M;
};
export default {
  name: "User",
  data() {
    return {
      visible: false,
      radioValue: null,
      operating: "",
      params: {
        pageNum: 1,
        pageSize: 10
      },
      data: [],
      pageSizes: [10, 20, 30, 50, 100],
      statusOption: [
        { value: 0, label: "正常" },
        { value: 1, label: "停用" }
      ],
      school: [],
      total: 0,
      title: "添加",
      form: {},
      rules: {
        idCard: [
          {
            required: false,
            pattern:
              /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/,
            message: "请输入正确身份证号",
            trigger: "change"
          }
        ],
        realName: [{ required: true, message: "必填项", trigger: "change" }],
        roleId: [{ required: true, message: "必填项", trigger: "change" }],
        password: [
          {
            required: true,
            validator: this.validatePwdStrong,
            trigger: "change"
          }
        ],
        userName: [{ required: true, message: "必填项", trigger: "change" }],
        phonenumber: [{ required: true, message: "必填项", trigger: "change" }],
        drvSchoolId: [{ required: true, message: "必填项", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.getUserPageList();
  },
  methods: {
    isSelect() {
      const self = this;
      return new Promise(function (resolve) {
        if (self.radioValue) {
          resolve(self.radioValue);
        } else {
          self.msgWarn("请先选择用户！");
        }
      });
    },

    handleAddClick() {
      this.visible = true;
      this.title = "添加";
      this.operating = 1;
      this.form = { status: 0 };
      this.resetForm("form");
    },

    getUserInfo() {
      return new Promise((resolve) => {
        this.isSelect().then(({ userId }) => {
          getUserInfo(userId).then((res) => {
            this.form = res.data;
            resolve(res);
          });
        });
      });
    },

    validatePwdStrong(rule, value, callback) {
      if (pwdCheckStrong(value) < 3) {
        callback(
          new Error(
            "密码长度不小于8位，且必须包含英文大小写字母、数字及特殊符号"
          )
        );
      } else {
        callback();
      }
    },

    handleReviewClick() {
      this.getUserInfo().then((res) => {
        this.visible = true;
        this.title = "详情";
        this.operating = 3;
      });
    },

    handleEditClick() {
      this.getUserInfo().then((res) => {
        this.visible = true;
        this.title = "编辑";
        this.operating = 2;
      });
    },

    handleSure() {
      if (this.operating != 1 && this.operating != 2) {
        this.visible = false;
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.operating == 1) {
            addUser(this.form).then(() => {
              this.getUserPageList();
              this.msgSuccess("新增成功");
              this.visible = false;
            });
          } else if (this.operating == 2) {
            const form = { ...this.form };
            form.userName = undefined;
            form.sex = undefined;
            editUserInfo(form).then(() => {
              this.getUserPageList();
              this.msgSuccess("修改成功");
              this.visible = false;
            });
          }
        }
      });
    },

    handleDelClick() {
      this.isSelect().then(({ userId }) => {
        delUser(userId).then((res) => {
          this.getUserPageList();
          this.msgSuccess("删除成功");
        });
      });
    },

    getUserPageList() {
      getUserPageList(this.params).then((res) => {
        this.data = res.records;
        this.total = res.total;
      });
    },

    handleCurrentChange(rows) {
      this.radioValue = rows;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog__body .el-form-item {
  width: calc(50% - 10px);
  margin-bottom: 30px;
  /deep/.el-form-item__content {
    width: calc(100% - 114px);
  }
}
</style>
