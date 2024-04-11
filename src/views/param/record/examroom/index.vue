<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcmc">
        <el-input
          size="small"
          v-model="queryParams.kcmc"
          placeholder="考场名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="kcdddh">
        <el-input
          size="small"
          v-model="queryParams.kcdddh"
          placeholder="考试地点"
        ></el-input>
      </el-form-item>
      <el-form-item prop="kczt">
        <jaya-select
          placeholder="考场状态"
          @getOptions="getOptions"
          othername="exam_room_status"
          v-model="queryParams.kczt"
        />
      </el-form-item>
      <el-form-item prop="">
        <el-button
          @click="getTableList(1)"
          icon="el-icon-search"
          size="small"
          type="primary"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="fun-btn-right" prop="">
        <el-button
          @click="handleAddVisible"
          v-hasPermi="['record:examroom:add']"
          icon="el-icon-plus"
          size="small"
          type="primary"
          >添加</el-button
        >
        <!-- <el-button
          @click="handleDownload"
          icon="el-icon-download"
          size="small"
          type="primary"
          >下载</el-button
        > -->
      </el-form-item>
    </el-form>
    <jaya-table-group
      :total="total"
      :tableList="tableList"
      :tableHeaderList="column"
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="visible"
      width="680px"
      append-to-body
    >
      <el-form
        class="dialogForm"
        :disabled="operating == 3"
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
      >
        <el-form-item label="考场序号" prop="kcxh">
          <el-input
            :disabled="operating == 2"
            v-model="form.kcxh"
            placeholder="请输入考场序号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考场名称" prop="kcmc">
          <el-input
            v-model="form.kcmc"
            placeholder="请输入考场名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考场简称" prop="kcjc">
          <el-input
            v-model="form.kcjc"
            placeholder="请输入考场简称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考试科目" prop="kskm">
          <jaya-select
            :disabled="operating == 2"
            sty="width:194px"
            placeholder="请选择"
            @getOptions="getOptions"
            othername="course"
            v-model="form.kskm"
          />
          <!-- <el-select
            clearable
            v-model="form.kkcx"
            placeholder="请选择"
            multiple
            size="small"
          >
            <el-option
              v-for="item in cartype"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="考试地点" prop="kcdddh">
          <el-input
            :disabled="operating == 2"
            v-model="form.kcdddh"
            placeholder="请输入考试地点"
            size="small"
          />
        </el-form-item>
        <el-form-item label="管理部门" prop="glbm">
          <jaya-select type="B" v-model="form.glbm" />
        </el-form-item>
        <el-form-item label="可考车型" prop="kkcx">
          <jaya-select
            multiple
            sty="width:398px"
            placeholder="可考车型"
            @getOptions="getOptions"
            othername="exam_car_type"
            v-model="form.kkcx"
          />
        </el-form-item>

        <el-form-item label="状态" prop="kczt">
          <jaya-select
            othername="exam_room_status"
            placeholder="状态"
            v-model="form.kczt"
          />
        </el-form-item>
        <el-form-item label="开始考试时间" prop="startexamtime">
          <el-time-picker
            value-format="HH:mm:00"
            size="small"
            v-model="form.startexamtime"
          />
        </el-form-item>

        <el-form-item label="结束考试时间" prop="endexamtime">
          <el-time-picker
            value-format="HH:mm:00"
            size="small"
            v-model="form.endexamtime"
          />
        </el-form-item>
        <el-form-item label="系统版本号" prop="sysVersion">
          <el-input
            v-model="form.sysVersion"
            placeholder="请输入系统版本号"
            size="small"
          />
        </el-form-item>
        <el-form-item v-if="operating != 3">
           <el-button type="primary" size="small" @click="handleRoom">选择考场坐标</el-button>
        </el-form-item>
        <el-form-item label="纬度" prop="wd" v-if="operating == 3">
          <el-input
            v-model="form.wd"
            placeholder="请输入"
            size="small"
          />
        </el-form-item>
        <el-form-item label="经度" prop="jd" v-if="operating == 3">
          <el-input
            v-model="form.jd"
            placeholder="请输入"
            size="small"
          />
        </el-form-item>
        <div v-if="!imageUrl && operating == 3" class="">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <div class="upPhoto">暂无考场示意图</div>
        </div>
        <div v-else>
          <jaya-upload-file ref="upload" :base64Img="true" @getImageUrl="getImageUrl" accept="png,jpeg" type="images" fileTitle="考场示意图" style="display:inline-block">
              <div v-if="imageUrl">
                <img :src="'data:image/jpeg;base64,' + imageUrl" class="avatar">
                <div class="upPhoto">{{operating == 3?'考场示意图':'点击修改考场示意图'}}</div>
              </div>
             
              <div v-else class="">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <div class="upPhoto">点击上传考场示意图</div>
              </div>
          </jaya-upload-file>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSure">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  examRoomNewAdd,
  examRoomDownLoad,
  examRoomInfo,
  examRoomPageList,
  examRoomUpdate,
} from "@/api/param/record";
const column = function () {
  return [
    {
      title: "考场序号",
      width: "90",
      prop: "kcxh",
    },
    {
      title: "考场名称",
      width: "150",
      prop: "kcmc",
    },
    {
      title: "考场简称",
      width: "150",
      prop: "kcjc",
    },
    {
      title: "考试科目",
      width: "100",
      prop: "kskm",
      status: () => "course",
    },
    {
      title: "考试地点",
      prop: "kcdddh",
    },
    {
      title: "可考车型",
      width: "200",
      prop: "kkcx",
    },
    {
      title: "考场状态",
      width: "100",
      prop: "kczt",
      status: () => this.statusOption,
    },
    {
      title: "开始考试时间",
      width: "150",
      prop: "startexamtime",
    },
    {
      title: "结束考试时间",
      width: "150",
      prop: "endexamtime",
    },
    {
      title: "纬度",
      width: "150",
      prop: "wd",
    },
    {
      title: "经度",
      width: "150",
      prop: "jd",
    },
    {
      title: "操作",
      width: "150",
      type: "buttons",
      prop: "roleId",
      butList: [
        {
          title: "详情",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleDetail,
          auth: ["record:examroom:detail"],
        },
        {
          title: "修改",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleUpdate,
          auth: ["record:examroom:edit"],
        },
      ],
    },
  ];
};
export default {
  name: "ExamRoom",
  data() {
    return {
      total: 0,
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      statusOption: [],
      sujectOption: [],
      rules: {
        kcxh: [
          { pattern: /^\d{1,8}$/, message: "请输入8位以内数字", trigger: "change" },
          { required: true, trigger: "change", message: "必填项" },
        ],
        kcmc: [{ required: true, trigger: "change", message: "必填项" }],
        kcjc: [{ required: true, trigger: "change", message: "必填项" }],
        kskm: [{ required: true, trigger: "change", message: "必填项" }],
        kcdddh: [{ required: true, trigger: "change", message: "必填项" }],
        glbm: [{ required: true, trigger: "change", message: "必填项" }],
        kkcx: [{ required: true, trigger: "change", message: "必填项" }],
        kczt: [{ required: true, trigger: "change", message: "必填项" }],
        sysVersion: [{ required: true, trigger: "change", message: "必填项" }],
      },
      cartype: [],
      form: {},
      imageUrl:'',
      visible: false,
      tableList: [],
      operating: 1, // 新增 1 修改 2 详情3
      title: "新增",
      tableLoading: true,
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    getOptions({ data, type }) {
      if (type == "exam_room_status") {
        this.statusOption = data;
      } else if (type == "exam_car_type") {
        this.cartype = data;
      }
      this[type] = data;
    },

    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      this.tableLoading = true;
      examRoomPageList(this.queryParams).then((res) => {
        this.tableLoading = false;
        this.tableList = res.rows;
        this.total = res.total;
      });
    },

    // 新增
    handleAddVisible() {
      this.operating = 1;
      this.title = "新增";
      this.form = { kkcx: []};
      this.imageUrl = ''
      localStorage.setItem('latitude','')
      localStorage.setItem('longitude','')
      this.resetForm("form");
      this.visible = true;
    },

    // 修改
    handleUpdate(row) {
      this.imageUrl = row.photo
      const rows = { ...row };
      this.operating = 2;
      this.title = "修改";
      this.form = rows;
      this.form.kkcx = rows.kkcx.split(",");
      this.visible = true;
    },
     // 选择考场
    handleRoom() {
       const { href } = this.$router.resolve({
        name: "mapCom",
      });

      window.open(
        `${href}`,
        "_blank",
      );
    },

    // 详情
    handleDetail(row) {
      this.imageUrl = row.photo
      const rows = { ...row };
      this.operating = 3;
      this.title = "详情";
      this.form = rows;
      this.form.kkcx = rows.kkcx.split(",");
      this.visible = true;
    },

    // 下载
    handleDownload() {
      const { ksdd } = this.queryParams;
      if (!ksdd) {
        return this.msgWarn("请输入考试地点");
      }
      examRoomDownLoad({ ksdd }).then((res) => {
        this.msgSuccess(res.msg);
      });
    },
     // 上传考场示意图回显
    getImageUrl(url) {
      this.imageUrl = url
    },
    handleSure() {
      this.visible = true;
      let wd = localStorage.getItem('latitude')
      let jd = localStorage.getItem('longitude')
      let photo = this.imageUrl
      // if(!wd || !jd) {
      //   this.$message({ showClose: true, message: '请选择经纬度', type: "warning" });
      //   return
      // }
      if (this.operating !== 3) {
        // 新增，修改 逻辑
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.operating == 1) {
              examRoomNewAdd({
                ...this.form,
                wd,jd,photo,
                kkcx: this.form.kkcx.join(),
              }).then(() => {
                this.getTableList();
                this.msgSuccess("新增成功");
                this.visible = false;
              });
            } else {
              const params = {};
              const field = [
                "kcmc",
                "kcjc",
                "glbm",
                "kkcx",
                "kczt",
                "kcxh",
                "jd",
                "wd",
                "sysVersion",
                "startexamtime",
                "endexamtime",
              ];
              field.map((k) => {
                if (!this.form[k]) return;
                params[k] = k == "kkcx" ? this.form.kkcx.join() : this.form[k];
              });
              examRoomUpdate({...params,jd,wd,photo}).then(() => {
                this.getTableList();
                this.msgSuccess("修改成功");
                this.visible = false;
              });
            }
          }
        });
      } else {
        this.visible = false;
      }
    },
  }

};
</script>
<style lang="scss" scoped>
.el-dialog__wrapper {
  /deep/ .el-select--small input {
    width: 100%;
  }

  .jaya-select {
    /deep/ .el-select {
      width: 194px;
    }
  }
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 194px;
    height: 194px;
    line-height: 194px;
    text-align: center;
    border: 1px dashed #8c939d;
  }
  .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }
  .upPhoto {
    margin-top: 10px;
    font-size: 16px;
    text-align: center;
    width: 194px;
  }
  .avatar {
    width: 194px;
    height: 194px;
    display: block;
  }
</style>
