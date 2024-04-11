<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      vnodes.push(
        icon.includes("@") ? (
          <img
            class="icons"
            src={require(`@/assets/icons/menu/${icon.slice(1)}.png`)}
          />
        ) : (
          <svg-icon icon-class={icon} />
        )
      );
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>);
    }
    return vnodes;
  }
};
</script>
<style lang="scss" scoped>
.icons {
  width: 14px;
  height: 14px;
}
.el-menu {
  .icons {
    margin-right: 16px;
  }
}
.el-menu--collapse {
  .icons {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .el-submenu__title {
    position: relative;
  }
}
</style>
