<template>
  <div>
    <Jaya-refer v-bind="$attrs" v-on="$listeners"></Jaya-refer>
    <Jaya-table ref="jayaTableGroup" v-bind="$attrs" v-on="$listeners">
      <template #chart>
        <slot name="chart"></slot>
      </template>
    </Jaya-table>
    <Pagination v-bind="$attrs" v-on="$listeners"></Pagination>
  </div>
</template>
<script>
export default {
  name: "JayaTableGroup",
  props: {},
  methods: {
    current(name) {
      return this.$refs.jayaTableGroup[name];
    },
  },
};
</script>
