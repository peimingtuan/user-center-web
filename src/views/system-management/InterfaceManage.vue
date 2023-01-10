<template>
  <div class="interface-manage">
    <dialog-show
        ref="dialogShow"
        class="dialogShow"
        v-bind:title="option"
        @saveInfo="doOption">
      <dialog-interface-body ref="DialogInterfaceBody" slot="main-body"/>
    </dialog-show>

    <!-- 应用树 -->
    <scroll-tree-box
        :treeData="treeData"
        :nodeKey="nodeKey"
        filterKey="appName"
        :defaultProps="appProps"
        :defaultExpandedKeys="defaultExpandedKeys"
        :currentNodeKey="currentNodeKey"
        @treeClick="treeClick">
    </scroll-tree-box>
    <!-- 右部 -->
    <div class="public-tree-right-content">
      <head-box class="public-header-option" @add="add" :btnList="btnList">
        <el-col :offset="1" style="text-align: right;font-size:16px;">接口查询：</el-col>
        <el-input placeholder="请输入接口名称" v-model="searchName" @keyup.enter.native="search()">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search()"></i>
        </el-input>
      </head-box>
      <table-box
          class="public-table-box-scroll"
          :selection="false"
          :tableKey="tableKey"
          :tableData="tableData"
      >
        <el-table-column slot="valid" label="是否有效">
          <template slot-scope="scope">
            <div>{{ scope.row.valid === 1 ? '是' : '否' }}</div>
          </template>
        </el-table-column>
        <el-table-column slot="operate" label="操作" width="200">
          <template slot-scope="scope">
            <div class="isedit">
              <span @click="edit(scope.$index, scope.row)">修改</span>
              <span @click="delInfo(scope.$index, scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </table-box>
      <!-- 分页 -->
      <paging-box
          :pageIndex="pageIndex"
          :pageSize="pageSize"
          :total="total"
          @handleCurrentChange="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {MessageBox} from "element-ui"
import {errorMsg} from "../../ui"
import * as systemManagementApi from "../../api/system-management-api.js"

export default {
  name: "InterfaceManage",
  components: {
    scrollTreeBox: () => import('@/components/tree-box/ScrollTreeBox'),
    headBox: () => import("@/components/head-box"),
    tableBox: () => import('@/components/table-box'),
    pagingBox: () => import('@/components/paging-box'),
    dialogShow: () => import("../../components/dialog"),
    DialogInterfaceBody: () => import("./interface-manage-dialog/DialogInterfaceBody"),
  },
  data() {
    return {
      // 树
      treeData: [],
      nodeKey: 'appId',
      appProps: {
        children: 'children',
        label: 'appName'
      },
      defaultExpandedKeys: [''],
      currentNodeKey: null,
      appInfo: null,

      searchName: '',
      btnList: [{name: '添加', event: 'add', icon: 'el-icon-plus'}],
      tableKey: [{prop: 'interfaceName', label: '接口名称', tooltip: true},
        {prop: 'interfaceCode', label: '接口编码', tooltip: true},
        {prop: 'url', label: '接口地址', tooltip: true, width: 100},
        {prop: 'method', label: '请求方式', tooltip: true},
        {prop: 'desc', label: '接口描述', tooltip: true},
        {slot: 'operate'}],
      tableData: [],
      option: '',

      // 分页
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    }
  },
  mounted() {
    this.treeData = [{appId: '', appName: '应用', children: []}]
    this.appInfo = {appId: '', appName: '应用'}
    this.search();
    this.loadTree();
  },
  methods: {
    treeClick(val) {
      this.appInfo = val;
      this.search();
    },
    doOption() {
      if (this.option === '添加信息') {
        this.saveInfo();
      } else if (this.option === '修改信息') {
        this.changeInfo();
      }
    },
    //添加
    add() {
      if (this.appInfo.appId != null && this.appInfo.appId !== '') {
        this.option = "添加信息"
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.DialogInterfaceBody.show({appId: this.appInfo.appId, appName: this.appInfo.appName});
        })
      } else {
        errorMsg("请先选择应用系统")
      }
    },
    saveInfo() {
      if (!this.$refs.DialogInterfaceBody.submitForm()) {
        errorMsg("请输入完整信息")
        return
      }
      let info = this.$refs.DialogInterfaceBody.form
      // info.appId = this.appInfo.appId
      // info.appName = this.appInfo.appName
      systemManagementApi.insertInterface([info]).then(() => {
        this.$refs.dialogShow.dialogFormVisible = false
        this.search();
      })
    },
    //查询数据并展示
    async search() {
      let result = await systemManagementApi.searchInterface({
        appId: this.appInfo.appId,
        search: this.searchName,
        page: this.pageIndex,
        pageSize: this.pageSize
      })
      this.tableData = result.body;
      this.total = result.count;
    },
    //修改
    edit(index, row) {
      this.option = "修改信息"
      this.$refs.dialogShow.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.DialogInterfaceBody.show(row)
      })
    },
    changeInfo() {
      if (!this.$refs.DialogInterfaceBody.submitForm()) {
        errorMsg("请输入完整信息")
        return
      }
      let info = this.$refs.DialogInterfaceBody.form
      console.log(info)
      systemManagementApi.updateInterface(info).then(() => {
        this.$refs.dialogShow.dialogFormVisible = false
        this.search();
      })
    },
    //删除
    delInfo(index, row) {
      MessageBox.confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await systemManagementApi.delInterface(row.id).then(() => {
          this.search()
        })
      }).catch(console.error);
    },
    handleCurrentChange(page) {
      this.pageIndex = page;
      this.search();
    },
    async loadTree() {
      let result = await systemManagementApi.searchApp()
      this.treeData[0].children = result.body;
    }
  },
}
</script>

<style lang="less" scoped>
.interface-manage {

}
</style>
<style lang="less">
.interface-manage {
  .dialogInterfaceShow {
    .el-dialog {
      width: 800px;
    }
  }

  .dialogInterfaceMoreShow {
    .el-dialog {
      width: 1200px;
    }
  }
}
</style>