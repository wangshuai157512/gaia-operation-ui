<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="!topNav"
    />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />
    <div class="rightSet">
      <!-- <el-input
        class="searchVal"
        placeholder="找不到？搜索一下吧"
        v-model="searchVal"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input> -->
        <!-- 消息 -->
      <!-- <div class="el-icon-message-solid">
      </div> -->
      <div class="el-icon-s-custom">
        {{ user.name }}
      </div>
      <!-- <div @click="open = true" class="el-icon-lock">修改密码</div> -->
      <div class="" @click="logout" style="font-size: 16px;">退出</div>
    </div>
    <!-- 修改密码 -->
    <reset-password :visible.sync="open" />
    <!-- <div class="right-menu">
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
  },
  data() {
    return {
      open: false,
      searchVal: "",
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
    ...mapState(["user"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.href = "/index";
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // margin-bottom: 10px;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .rightSet {
    height: 50px;
    line-height: 50px;
    display: flex;
    float: right;
    margin-right: 20px;
    .searchVal {
      /deep/.el-input__inner {
        width: 400px;
        height: 33px;
        line-height: 33px;
        background: #e2e7ed;
        border: 1px solid #e8eff0;
        border-radius: 16px;
        font-size: 16px;
        color: #999999;
        padding-left: 35px;
      }
      /deep/.el-input__icon {
        margin: 4px;
        font-size: 18px;
        line-height: 33px;
      }
    }
    div {
      margin-left: 15px;
      line-height: 50px;
      font-size: 16px;
      cursor: pointer;
      color: #000;
      &:hover {
        color: #011528;
      }
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
