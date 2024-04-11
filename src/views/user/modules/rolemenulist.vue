<template>
  <div>
    <div class="rml" v-for="(item, index) in temList" :key="index">
      <div class="rml-title">
        <el-checkbox
          v-model="item.selected"
          @change="itemChange(arguments, index)"
        ></el-checkbox
        >&nbsp;&nbsp;&nbsp;&nbsp;{{ item.label }}
      </div>
      <div class="rml-content" v-if="item.children && item.children.length > 0">
        <div
          class="rml-content-item"
          v-for="(item1, index1) in item.children"
          :key="item1.id"
        >
          <el-checkbox
            v-model="item1.selected"
            @change="item1Change(arguments, index, index1)"
          >
            <span>{{ item1.label }}</span>
          </el-checkbox>
          <div
            class="item1-item2"
            v-if="item1.children && item1.children.length > 0"
          >
            <template v-for="(item2, index2) in item1.children">
              <el-checkbox
                :key="item2.id"
                v-model="item2.selected"
                @change="item2Change(arguments, index, index1, index2)"
              >
                <span> {{ item2.label }}</span>
              </el-checkbox>

              <div
                :key="index2 + 'lv3'"
                class="item2-item3"
                v-if="item2.children && item2.children.length > 0"
              >
                <template v-for="(item3, index3) in item2.children">
                  <el-checkbox
                    :key="item3.id"
                    v-model="item3.selected"
                    @change="
                      item3Change(arguments, index, index1, index2, index3)
                    "
                  >
                    {{ item3.label }}
                  </el-checkbox>
                </template>
              </div>
            </template>
          </div>
          <!-- <el-tree
            v-if="item1.children && item1.children.length > 0"
            :default-expand-all="true"
            :props="props"
            :data="item1.children"
            show-checkbox
            @check-change="handleCheckChange"
          >
          </el-tree> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoleMenuList",
  props: {
    menuList: {
      default() {
        return [
          {
            id: "1000000000000000021",
            label: "首页",
            selected: false,
            children: [
              {
                id: "1000000000000000022",
                label: "首页2",
                selected: false,
              },
            ],
          },
        ];
      },
    },
  },

  data() {
    return {
      props: {
        label: "label",
        children: "children",
      },
      temList: [],
    };
  },
  watch: {
    temList: {
      handler(nval, oval) {
        this.$emit("update:newMenuData", nval);
      },
      immediate: true,
    },
  },

  created() {
    this.temList = this.menuList;
  },
  methods: {
    itemChange(args, index) {
      if (
        this.temList[index].children &&
        this.temList[index].children.length > 0
      ) {
        this.temList[index].children = this.temList[index].children.map(
          (item) => {
            item.selected = args[0];
            if (item.children && item.children.length > 0) {
              item.children = this.setAll3(item.children, args[0]);
            }
            return item;
          }
        );
      }
    },
    item1Change(args, index, index1) {
      // 子项有选择默认选择父项
      if (true) {
        let flag = false;
        this.temList[index].children.forEach((element) => {
          if (element.selected) {
            flag = true;
            return;
          }
        });
        this.temList[index].selected = flag;
      }
      // 子项的下级处理
      if (
        this.temList[index].children[index1].children &&
        this.temList[index].children[index1].children.length > 0
      ) {
        this.temList[index].children[index1].children = this.setAll3(
          this.temList[index].children[index1].children,
          args[0]
        );
      }
    },
    item2Change(args, index, index1, index2) {
      // 子项有选择默认选择父项
      if (true) {
        let flag1 = false;
        this.temList[index].children[index1].children.forEach((element) => {
          if (element.selected) {
            flag1 = true;
            return;
          }
        });
        this.temList[index].children[index1].selected = flag1;
         let flag = false;
        this.temList[index].children.forEach((element) => {
          if (element.selected) {
            flag = true;
            return;
          }
        });
        this.temList[index].selected = flag;
      }
      // 子项的下级处理
      if (
        this.temList[index].children[index1].children[index2].children &&
        this.temList[index].children[index1].children[index2].children.length >
          0
      ) {
        this.temList[index].children[index1].children[index2].children =
          this.setAll3(
            this.temList[index].children[index1].children[index2].children,
            args[0]
          );
      }
    },
    item3Change(args, index, index1, index2, index3) {
      if (true) {
        // 子项有选择默认选择父项
        let flag2 = false;
        this.temList[index].children[index1].children[index2].children.forEach(
          (element) => {
            if (element.selected) {
              flag2 = true;
              return;
            }
          }
        );
        this.temList[index].children[index1].children[index2].selected = flag2;
        let flag1 = false;
        this.temList[index].children[index1].children.forEach((element) => {
          if (element.selected) {
            flag1 = true;
            return;
          }
        });
        this.temList[index].children[index1].selected = flag1;
         let flag = false;
        this.temList[index].children.forEach((element) => {
          if (element.selected) {
            flag = true;
            return;
          }
        });
        this.temList[index].selected = flag;
        
      }
      // 子项的下级处理
      if (
        this.temList[index].children[index1].children[index2].children[index3]
          .children &&
        this.temList[index].children[index1].children[index2].children[index3]
          .children.length > 0
      ) {
        this.temList[index].children[index1].children[index2].children[
          index3
        ].children = this.setAll3(
          this.temList[index].children[index1].children[index2].children[index3]
            .children,
          args[0]
        );
      }
    },
    setAll3(ls, seltd) {
      return ls.map((item) => {
        item.selected = seltd;
        if (item.children && item.children.length > 0) {
          item.children = this.setAll3(item.children, seltd);
        }
        return item;
      });
    },
    // handleCheckChange() {},
  },
};
</script>

<style lang="scss" scoped>
.rml {
  width: 660px;
  margin-bottom: 10px;
}
.rml-title {
  width: 100%;
  line-height: 40px;
  padding: 0 10px;
  background: #e0e0e0;
  border-radius: 5px;
}
.rml-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  // padding: 0 10px;
  width: 100%;
}
.rml-content-item {
  margin: 10px;
  width: calc(33% - 20px);
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  overflow: auto;
}
.item1-item2 {
  display: flex;
  // justify-content: flex-start;
  // align-items: center;
  flex-direction: column;
  margin-left: 20px;
}
.item2-item3 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  // margin-left: 10px;
}
</style>
