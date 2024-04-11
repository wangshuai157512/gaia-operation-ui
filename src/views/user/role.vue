<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item>
        <el-input
          size="small"
          placeholder="请输入角色名称"
          v-model="queryParams.roleName"
          clearable
          style="width: 280px !important"
        >
          <template slot="prepend">角色名称</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          size="small"
          clearable
          v-model="queryParams.clientId"
          placeholder="请选择平台"
          style="width: 280px !important"
        >
          <el-option
            v-for="type in clientRoleTypeList"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          size="small"
          v-model="queryParams.status"
          placeholder="请选择角色状态"
          style="width: 280px !important"
          clearable
        >
          <el-option
            v-for="type in statusList"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-button
        class="fun-btn-right"
        @click="getTableList(null)"
        type="primary"
      >
        查询
      </el-button>
    </el-form>
    <div class="table-box-con">
      <div class="branch-school">
        <div>
          <el-button
            icon="el-icon-plus"
            @click="actionBtn(1)"
            type="primary"
            v-hasPermi="['role:add']"
          >
            添加
          </el-button>

          <el-button
            icon="el-icon-view"
            type="info"
            @click="actionBtn(2)"
            v-hasPermi="['role:info']"
          >
            查看
          </el-button>

          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="actionBtn(3)"
            v-hasPermi="['role:update']"
          >
            编辑
          </el-button>

          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="actionBtn(4)"
            v-hasPermi="['role:delete']"
          >
            删除
          </el-button>
        </div>
        <jaya-table-group
          ref="jayaCurrent"
          :total="total"
          :tableHeaderList="column"
          :tableList="tableData"
          @pagination="getTableList"
          @handleCurrentChange="handleCurrentChange"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          :option="option"
        ></jaya-table-group>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="dialogTitle + '角色'"
      :visible="dialogVisible"
      width="850px"
      append-to-body
      @close="cancel"
    >
      <el-form
        :model="formModel"
        ref="formModel"
        :inline="true"
        style="width: 800px"
        :disabled="dialogTitle == '查看'"
      >
        <el-form-item label="角色名称：">
          <el-input
            v-model="formModel.roleName"
            placeholder="请输入角色名称"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="角色编码：">
          <el-input
            v-model="formModel.roleKey"
            placeholder="请输入角色编码"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="角色状态：">
          <el-select
            size="small"
            v-model="formModel.status"
            placeholder="请选择设备状态"
            style="width: 180px"
          >
            <el-option
              v-for="type in statusList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色备注：">
          <el-input
            v-model="formModel.remark"
            placeholder="请输入角色备注"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="权限分配：">
          <div class="menu-row">
            <el-button size="small" type="primary" @click="checkAll">
              全选
            </el-button>
            <el-button size="small" type="primary" @click="resetCheck">
              重置
            </el-button>
          </div>
          <role-menu-list
            v-if="dialogVisible"
            :menuList="menuTreeData"
            :newMenuData.sync="newMenuData"
          />
          <!-- <div class="menu-row">
            <el-button size="small" type="primary" @click="checkAll">
              全选
            </el-button>
            <el-button size="small" type="primary" @click="resetCheck">
              重置
            </el-button>
          </div>
          <el-tree
            ref="menuTree"
            :default-expand-all="true"
            :data="menuTreeData"
            show-checkbox
            node-key="id"
            :default-checked-keys="defaultCheckedKeys"
            :props="defaultProps"
          >
          </el-tree> -->
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" v-if="dialogTitle != '查看'"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  rolePageList,
  updateRoleApi,
  addRoleApi,
  getRoleInfoApi,
  removeRoleApi,
  menuListApi
} from "@/api/cloud/user";
import { RoleMenuList } from "./modules";
import { getDictSelect } from "@/api/param/select";
const column = function () {
  return [
    {
      title: "角色名称",
      prop: "roleName",
      width: "200"
    },
    {
      title: "角色编码",
      prop: "roleKey",
      width: "200"
    },
    {
      title: "角色状态",
      prop: "status",
      status: () => {
        return this.statusList;
      },
      width: "100"
    },
    {
      title: "角色备注",
      prop: "remark"
    }
  ];
};
export default {
  name: "Role",
  components: { RoleMenuList },
  data() {
    return {
      // 客户端角色类型 字典
      clientRoleTypeList: [],
      // 角色状态  字典
      statusList: [
        { label: "正常", value: "0" },
        { label: "停用", value: "1" }
      ],
      // 查询参数
      queryParams: {
        clientId: "",
        roleName: "",
        status: "",
        pageNum: 1,
        pageSize: 20
      },
      // 列表数据总数
      total: 0,
      // 列表字段
      column: column.call(this),
      //列表配置项
      option: {
        isRadio: true
      },
      // 列表数据
      tableData: [],
      multipleSelection: null,
      // 弹窗控制
      dialogVisible: false,
      // 弹窗标题
      dialogTitle: "",
      formModel: {
        clientId: "",
        menuIds: [],
        remark: "",
        roleKey: "",
        roleName: "",
        status: "0"
      },
      //弹窗菜单数据
      menuTreeData: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      btnallkeys: [],
      newMenuData: [],
      newMenuSaveData: []
    };
  },

  async mounted() {
    await this.getDictList();
    this.getTableList(null);
  },

  methods: {
    // 获取可选客户端
    async getDictList() {
      let { data } = await getDictSelect("role_type");
      this.clientRoleTypeList = data;
      // this.queryParams.clientId = data[0].value;
    },
    // 获取列表数据
    getTableList(page) {
      this.queryParams.pageNum = page ? page.page : this.queryParams.pageNum;
      this.queryParams.pageSize = page ? page.limit : this.queryParams.pageSize;
      rolePageList(this.queryParams).then((res) => {
        this.tableData = res.records;
        this.total = Number(res.total);
      });
    },
    //选择所在行
    handleCurrentChange(val) {
      this.multipleSelection = val;
    },
    //  按钮事件
    async actionBtn(flag) {
      if (
        (flag == 1 && !this.queryParams.clientId) ||
        (!this.multipleSelection && flag != 1)
      ) {
        this.$message({ message: "请选择平台", type: "warning" });
        return;
      }
      // 获取菜单里列表
      if (flag == 1 || flag == 2 || flag == 3) {
        let { data } = await menuListApi({
          clientId:
            flag == 1
              ? this.queryParams.clientId
              : this.multipleSelection.clientId,
          roleId:
            flag == 1
              ? ""
              : this.multipleSelection
              ? this.multipleSelection.roleId
              : ""
        });
        this.menuTreeData = data;
        // this.checkdefault();  // tree 用
      }

      switch (flag) {
        case 1:
          this.dialogTitle = "添加";
          this.formModel.clientId = this.queryParams.clientId;
          this.dialogVisible = true;
          break;
        case 2:
          this.dialogTitle = "查看";
          this.getRoleInfo(this.multipleSelection.roleId);
          this.dialogVisible = true;
          break;
        case 3:
          this.dialogTitle = "编辑";
          this.getRoleInfo(this.multipleSelection.roleId);
          this.dialogVisible = true;
          break;
        case 4:
          this.$confirm(`确定要删除该角色`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            let { data } = await removeRoleApi({
              id: this.multipleSelection.roleId
            });
            this.getTableList(null);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
          break;
        default:
          this.cancel();
          break;
      }
    },
    async getRoleInfo(id) {
      let { data } = await getRoleInfoApi({ id: id });
      this.formModel = data;
      this.formModel.clientId = this.queryParams.clientId;
    },
    // 默认选中
    checkdefault() {
      this.checkOutDefault(this.menuTreeData);
    },
    checkOutDefault(list) {
      list.forEach((item) => {
        var defaultTrue = 0;
        if (item.children && item.children.length > 0) {
          item.children.forEach((itemD) => {
            if (itemD.selected) {
              defaultTrue = defaultTrue + 1;
            }
          });
          if (defaultTrue && item.selected)
            this.defaultCheckedKeys.push(item.id);
        } else {
          if (item.selected) this.defaultCheckedKeys.push(item.id);
        }
        this.checkOutAll(item.children);
      });
    },
    // 全部选中
    // checkAll() {
    //   // tree 用
    //   this.checkOutAll(this.menuTreeData);
    //   this.$refs.menuTree.setCheckedKeys(this.btnallkeys);
    // },
    checkOutAll(list) {
      // tree 用
      list.forEach((item) => {
        this.btnallkeys.push(item.id);
        if (item.children && item.children.length > 0)
          this.checkOutAll(item.children);
      });
    },
    checkAll() {
      this.menuTreeData = this.selectedAllMenu(this.menuTreeData, true);
    },
    selectedAllMenu(list, blp) {
      return list.map((item) => {
        item.selected = blp;
        if (item.children && item.children.length > 0)
          item.children = this.selectedAllMenu(item.children, blp);
        return item;
      });
    },
    // 重置选择
    resetCheck() {
      // this.$refs.menuTree.setCheckedKeys([]); // tree 用
      this.menuTreeData = this.selectedAllMenu(this.menuTreeData, false); // 自定义组件 用
    },
    findoutids(list) {
      list.forEach((item) => {
        if (item.children && item.children.length > 0) {
          var selecTrue = 0;
          item.children.forEach((itemC) => {
            if (itemC.selected && item.selected) {
              selecTrue = selecTrue + 1;
            }
          });
          if (selecTrue && item.selected) {
            this.newMenuSaveData.push(item.id);
          }
          this.findoutids(item.children);
        } else {
          if (item.selected) {
            this.newMenuSaveData.push(item.id);
          }
        }
      });
    },
    // 保存
    save() {
      this.findoutids(this.newMenuData);
      this.formModel.menuIds = this.newMenuSaveData;
      // this.formModel.menuIds = this.$refs.menuTree.getCheckedKeys(); // tree 用
      let saveApi = null;
      switch (this.dialogTitle) {
        case "添加":
          saveApi = addRoleApi;
          this.formModel.clientId = this.queryParams.clientId;
          break;
        case "编辑":
          saveApi = updateRoleApi;
          this.formModel.clientId = this.multipleSelection.clientId;
          break;
        default:
          break;
      }
      saveApi(this.formModel)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(this.dialogTitle + "成功！");
            this.cancel();
            this.getTableList(null);
          }
        })
        .catch((e) => {});
    },
    cancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.formModel = {
        clientId: "",
        menuIds: [],
        remark: "",
        roleKey: "",
        roleName: "",
        status: "0"
      };
      this.defaultCheckedKeys = [];
      this.menuTreeData = [];
      this.btnallkeys = [];
      this.newMenuData = [];
      this.newMenuSaveData = [];
      // this.multipleSelection = null;
    }
  },

  watch: {
    dialogVisible: {
      handler(val) {
        if (!val) {
          this.$refs.jayaCurrent.current("setCurrent")();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
.menu-row {
  margin-bottom: 20px;
}
</style>
