<template>
  <div class="public-tree-box" @mousewheel="mousewheel($event)">
    <el-input class="filter-box" placeholder="输入关键字查询" v-model="filterText"></el-input>
    <el-tree
            ref="tree"
            accordion
            :node-key="nodeKey"
            :highlight-current="true"
            :show-checkbox="showCheckbox"
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :default-expanded-keys="defaultExpandedKeys"
            :current-node-key="currentNodeKey"
            :filter-node-method="filterNode"
            @node-expand="handleNodeClick"
            @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :class="currentNodeKey === data.id ? 'active' : ''">
            <i :class="data.type === 0 ? 'el-icon-s-home' : 'el-icon-s-custom'"></i> {{ data.name }}
          </span>              
        </span>
    </el-tree>
  </div>
</template>
<script>
  export default {
    name:'ScrollTreeBox',
    props:{
      treeData: {},
      nodeKey: {},
      defaultProps: {},
      defaultExpandedKeys: {},
      currentNodeKey: '',
      showCheckbox: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scrollLeft: 0,
        filterText: ''
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    mounted() {
      this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.currentNodeKey);
      })
    },
    methods: {
      mousewheel(e) {
        let dom = document.getElementsByClassName('public-tree-box')[0];
        if (e.deltaY > 0) {
          dom.scrollLeft = dom.scrollLeft + 10;
        } else {
          dom.scrollLeft = dom.scrollLeft - 10;
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleNodeClick(val) {
        this.$emit("treeClick", val);
      }
    }
  }
</script>
<style lang="less" scoped>
    .filter-box {
      margin:5px;
    }
    .active {
      color: #5598FF;
    }
</style>
