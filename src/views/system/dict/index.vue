<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item prop="dictName">
        <el-input
          v-model="queryParams.dictName"
          placeholder="请输入字典名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="dictType">
        <el-input
          v-model="queryParams.dictType"
          placeholder="请输入字典类型"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="字典状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 220px !important"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          @click="handleQuery"
          >查询</el-button
        >
      </el-form-item>

      <!-- <el-form-item>
        <el-button
          type="danger"
          plain
          icon="el-icon-refresh"
          size="small"
          @click="handleRefreshCache"
          >刷新缓存</el-button
        >
      </el-form-item> -->

      <el-form-item class="fun-btn-right">
        <el-button
          @click="handleAdd"
          icon="el-icon-plus"
          type="primary"
          v-hasPermi="['dict:type:add']"
          >添加</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="typeList">
      <el-table-column label="字典编号" align="center" prop="dictId" />
      <el-table-column
        label="字典名称"
        align="center"
        prop="dictName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="字典类型"
        align="center"
        prop="dictType"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <router-link
            :to="'/dict/type/data/' + scope.row.dictId"
            class="link-type"
          >
            <span>{{ scope.row.dictType }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-hasPermi="['dict:type:update']"
            type="text"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            v-hasPermi="['dict:type:info']"
            @click="detilUpdate(scope.row)"
            >详情</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加、编辑、详情 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        :disabled="opendetil"
      >
        <el-form-item label="字典名称" prop="dictName" style="margin: 20px">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType" style="margin: 20px">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status" style="margin: 20px">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="margin: 20px">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!opendetil">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listType,
  getType,
  delType,
  addType,
  updateType,
  exportType,
  refreshCache,
  getDicts,
} from "@/api/system/dict/type";

export default {
  name: "Dict",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      opendetil: false,
      // 状态数据字典
      statusOptions: [
        { dictLabel: "正常", dictValue: "0" },
        { dictLabel: "停用", dictValue: "1" },
      ],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        dictName: undefined,
        dictType: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      listType(this.queryParams).then((response) => {
        this.typeList = response.records;
        this.total = Number(response.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.opendetil = false;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.opendetil = false;
      this.form = {};
      this.resetForm("form");
      this.title = "添加字典类型";
      this.open = true;
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.opendetil = false;
      this.resetForm("form");
      const dictId = row.dictId || this.ids;
      getType({ id: dictId }).then((response) => {
        this.form = response.data;
        this.title = "修改字典类型";
        this.open = true;
      });
    },
    //详情
    detilUpdate(row) {
      this.opendetil = true;
      let { dictId } = row;
      getType({ id: dictId }).then((response) => {
        this.form = response.data;
        this.title = "字典管理详情";
        this.open = true;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.dictId != undefined) {
            let { dictId, dictName, dictType, remark, status } = this.form;
            let queryForm = { dictId, dictName, dictType, remark, status };
            updateType(queryForm).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    // handleDelete(row) {
    //   const dictIds = row.dictId || this.ids;
    //   this.$confirm(
    //     '是否确认删除字典编号为"' + dictIds + '"的数据项?',
    //     "警告",
    //     {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning",
    //     }
    //   )
    //     .then(function () {
    //       return delType(dictIds);
    //     })
    //     .then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     })
    //     .catch(() => {});
    // },
    /** 导出按钮操作 */
    // handleExport() {
    //   const queryParams = this.queryParams;
    //   this.$confirm("是否确认导出所有类型数据项?", "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.exportLoading = true;
    //       return exportType(queryParams);
    //     })
    //     .then((response) => {
    //       this.download(response.msg);
    //       this.exportLoading = false;
    //     })
    //     .catch(() => {});
    // },
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.msgSuccess("刷新成功");
      });
    },
  },
};
</script>
