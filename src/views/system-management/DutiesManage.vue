<template>
  <div class="duties-manage">
    <dialog-show ref="dialogShow" @saveInfo="saveInfo" :title="updateFlag ? '修改信息' : '添加信息'">
      <dialog-duties-body ref="DialogDutiesBody" slot="main-body" />
    </dialog-show>
    <!-- 右部 -->
    <div class="public-notree-right-content">
      <head-box class="public-header-option" :btnList="btnList" @add="add">
        <el-col :offset="1"></el-col>
        <el-input v-model.trim="search" placeholder="输入职务名称" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" @click="getJobInfoBySearch(search)">查询</el-button>
      </head-box>
      <table-box
                class="public-table-box-scroll"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :selection="false"
                :tableKey="tableKey"
                :tableData="tableData">
        <el-table-column slot="valid" label="是否内置">
          <template slot-scope="scope">
            <div>{{ scope.row.isBuildIn === 1 ? '是':'否' }}</div>
          </template>
        </el-table-column>
        <el-table-column slot="operate" label="操作" width="150">
          <template slot-scope="scope">
            <div class="isedit" v-if="scope.row.isBuildIn === 2">
              <span @click="edit(scope.row)">修改</span>
              <span @click="delInfo(scope.row.jobId)">删除</span>
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
  import {successMsg, warningMsg, errorMsg} from "../../ui"
  import * as systemManagementApi from "../../api/system-management-api.js"
  export default {
    name: "DutiesManage",
    data() {
      return {
        loading: false,
        btnList: [{name: '添加', event: 'add', icon: 'el-icon-plus'}],
        search: "",
        tableKey: [{prop: 'jobName', label:'职务名称', tooltip: true},
                   {prop: 'jobCode', label:'职务代码', tooltip: true},
                   {prop: 'jobDesc', label:'描述', tooltip: true, width: 200},
                   {slot: 'valid'},
                   {slot: 'operate'}],
        tableData: [],
        updateFlag: false,
        
        pageIndex: 1,
        pageSize: 9,
        total: 0
      }
    },
    components: {
      headBox: () => import("@/components/head-box"),
      tableBox: () => import('@/components/table-box'),
      pagingBox: () => import('@/components/paging-box'),
      dialogShow: () => import("../../components/dialog"),
      DialogDutiesBody: () => import("./duties-manage-dialog/DialogDutiesBody"),
    },
    mounted() {
      this.searchJobInfo();
    },
    methods: {
      add() {
        this.search = '';
        this.updateFlag = false;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.DialogDutiesBody.show();
        });
      },
      getJobInfoBySearch(search) {
        this.searchJobInfo(search);
      },
      //查询数据并展示
      searchJobInfo(search) {
        this.loading = true;
        //模糊查询
        if (search) {
          this.pageIndex = 1;
          let params = {"page": this.pageIndex, "pageSize": this.pageSize, "search": search};
          systemManagementApi.getJobInfo(params).then(res => {
            this.loading = false;
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.tableData = res.body;
            this.total = res.count;
          });
          //查询所有
        } else {
          let params = {"page": this.pageIndex, "pageSize": this.pageSize};
          systemManagementApi.getJobInfo(params).then(res => {
            this.loading = false;
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.tableData = res.body;
            this.total = res.count;
          });
        }
      },
      //保存数据
      saveInfo() {
        //校验必填字段
        const successValidate = this.$refs.DialogDutiesBody.submitForm();
        if (successValidate) {
          const form = this.$refs.DialogDutiesBody.form;
          //更新
          if (this.updateFlag) {
            systemManagementApi.updateJobInfo(form.jobId, form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchJobInfo();
              successMsg("修改成功!!!");
            });
           //新增
          } else {
            systemManagementApi.saveJobInfo(form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchJobInfo();
              successMsg("保存成功!!!");
            });
          }
          this.$refs.dialogShow.dialogFormVisible = false;
        }
      },
      //修改
      edit(row) {
        this.search = '';
        this.updateFlag = true;
        this.$refs.dialogShow.dialogFormVisible=true;
        this.$nextTick(() => {
          this.$refs.DialogDutiesBody.show(row);
        });
      },
      //删除
      delInfo(depdId) {
        MessageBox.confirm('确认删除???', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          systemManagementApi.deleteJobInfo(depdId).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.searchJobInfo();
            successMsg("删除成功!!!");
          });
        });
      },
      handleCurrentChange(page) {
        this.pageIndex = page;
        this.searchJobInfo();
      }
    }
  }
</script>

<style lang="less" scoped>
  .duties-manage {

  }
</style>
<style lang="less">

</style>