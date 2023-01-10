<template>
  <div class="fast-way">
    <dialog-show ref="dialogShow" @saveInfo="saveInfo" :title="updateFlag ? '修改信息' : '添加信息'">
      <dialog-fast-body ref="DialogFastBody" slot="main-body"/>
    </dialog-show>
    <head-box class="public-header-option" :btnList="btnList" @add="add">
      <el-col :offset="1"></el-col>
      <el-input v-model="search" placeholder="输入应用名称" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchFastWayData">查询</el-button>
    </head-box>
    <table-box
              class="public-table-box-scroll"
              :selection="false"
              :tableKey="tableKey"
              :tableData="tableData">
      <el-table-column slot="operate" label="操作" width="150">
        <template slot-scope="scope">
          <div class="isedit">
            <span @click="edit(scope.row)">修改</span>
            <span @click="delInfo(scope.row.id)">删除</span>
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
</template>

<script>
  import {MessageBox} from "element-ui"
  import {successMsg, warningMsg, errorMsg} from "@/ui"
  import * as systemManagementApi from "@/api/system-management-api.js"
  
  export default {
    name: "FastWay",
    components: {
      headBox: () => import("@/components/head-box"),
      tableBox: () => import('@/components/table-box'),
      pagingBox: () => import('@/components/paging-box'),
      dialogShow: () => import("@/components/dialog"),
      DialogFastBody: () => import("./dialog/DialogFastBody"),
    },
    data() {
      return {
        btnList:[{name: '添加', event: 'add', icon: 'el-icon-plus'}],
        tableKey:[{prop: 'appId', label: '应用标识', tooltip: true},
                  {prop: 'appName', label: '应用名称', tooltip: true},
                  {prop: 'name', label: '名称', tooltip: true},
                  {prop: 'accessUrl', label: '链接地址', tooltip: true},
                  {prop: 'lnkDesc', label:'描述', tooltip: true},
                  {slot: 'operate'}],
        tableData: [],
        updateFlag: false,
        search: '',
        pageIndex: 1,
        pageSize: 9,
        total: 0
      }
    },
    mounted() {
      this.searchFastWayData();
    },
    methods: {
      add() {
        this.search = '';
        this.updateFlag = false;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.DialogFastBody.authPicFile = '';
          this.$refs.DialogFastBody.show();
        });
      },
      //查询数据并展示
      searchFastWayData() {
        const params = {'page': this.pageIndex, 'pageSize': this.pageSize, 'search': this.search};
        systemManagementApi.getFastWayData(params).then(res => {
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.tableData = res.body;
          this.total = res.count;
        });
      },
      //保存数据
      saveInfo() {
        //校验必填字段
        const successValidate = this.$refs.DialogFastBody.submitForm();
        if (successValidate) {
          const form = this.$refs.DialogFastBody.form;
          let params = new FormData();
          for (let key in form) {
            if (form[key] !== null) {
              params.append(key,form[key]);
            }
          }
          //更新
          if (this.updateFlag) {
            systemManagementApi.updateFastWayData(this.id, params).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchFastWayData();
              successMsg("修改成功!!!");
            });
           //新增
          } else {
            systemManagementApi.saveFastWayData(params).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchFastWayData();
              successMsg("保存成功!!!");
            });
          }
          this.$refs.dialogShow.dialogFormVisible = false;
        }
      },
      edit(row) {
        this.search = '';
        this.updateFlag = true;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.id = row.id;
        let form = {};
        form['appId'] = row.appId;
        form['appName'] = row.appName;
        form['name'] = row.name;
        form['lnkDesc'] = row.lnkDesc;
        form['accessUrl'] = row.accessUrl;
        form['logoFile'] = null;
        systemManagementApi.getFastWayLogo(this.id).then(res => {
          this.$nextTick(() => {
            this.$refs.DialogFastBody.authPicFile = '';
            if (res.byteLength > 0) {
              this.$refs.DialogFastBody.authPicFile = 'data:image/png;base64,' + btoa(
              new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            }
            this.$refs.DialogFastBody.show(form);
          });
        });
      },
      delInfo(id) {
        MessageBox.confirm('确认删除???', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          systemManagementApi.deleteFastWayData(id).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.searchFastWayData();
            successMsg("删除成功!!!");
          });
        });
      },
      handleCurrentChange(page) {
        this.pageIndex = page;
        this.searchFastWayData();
      },
    }
  }
</script>

<style lang="less" scoped>
  .fast-way {
    height:100%;
  }
</style>
<style lang="less">

</style>