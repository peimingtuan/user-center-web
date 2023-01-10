<template>
  <div class="dialog-authorize-body">
    <el-tree
        show-checkbox
        ref="tree"
        :node-key="nodeKey"
        :highlight-current="true"
        :data="treeData"
        :props="defaultProps"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        :current-node-key="currentNodeKey">
    </el-tree>
  </div>
</template>

<script>
import * as systemManagementApi from "../../../api/system-management-api.js"

export default {
  name: "DialogAuthBody",
  data() {
    return {
      treeData: [],
      nodeKey: 'id',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandedKeys: null,
      defaultCheckedKeys: null,
      currentNodeKey: null,
      iUserId: '',
      checked:''
    }
  },
  watch: {},
  created() {
    document.addEventListener('click', this.queryHide);
    document.addEventListener('click', this.queryHide2);
    document.addEventListener('click', this.queryHide3);
  },
  mounted() {
  },
  updated() {
  },
  beforeDestroy() {
    document.removeEventListener('click', this.queryHide);
    document.removeEventListener('click', this.queryHide2);
    document.removeEventListener('click', this.queryHide3);
  },
  methods: {
    show(iUserId) {
      this.iUserId = iUserId
      this.search();
    },
    //查询数据并展示
    async search() {
      let appTree = await systemManagementApi.searchAppAndIntTree()
      if (appTree.body) {
        this.treeData = this.apps2tree(appTree.body)
      }
      let old = await systemManagementApi.searchAuth(this.iUserId)
      if (old.body) {
        this.defaultCheckedKeys = this.searchDefaultChecked(old.body)
      }
    },
    apps2tree(body) {
      let tree = []
      if (body) {
        for (let i = 0; i < body.length; i++) {
          let app = body[i]
          tree[i] = {id: app.appId, name: app.appName, type: 'app', children: []}
          if (app.interfaces) {
            let interfaces = []
            for (let j = 0; j < app.interfaces.length; j++) {
              interfaces[j] = {id: app.interfaces[j].id, name: app.interfaces[j].interfaceName, type: 'int'}
            }
            tree[i].children = interfaces
          }
        }
      }
      return tree;
    },
    searchDefaultChecked(body) {
      console.log(body)
      let defaultChecked = []
      for (let i = 0; i < body.length; i++) {
        defaultChecked[i] = body[i].interfaceId
      }
      return defaultChecked;
    },

    //选中\取消选中
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
  }
}
</script>

<style lang="less" scoped>
.dialog-authorize-body {
  width: 100%;
  height: 400px;
  text-align: center;
}
</style>
<style lang="less">
.dialog-authorize-body {

}
</style>