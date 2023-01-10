<template>
  <div class="data-import">
    <dialog-show class="dialogAddtaskShow" ref="dialogShow" @saveInfo="saveInfo">
     <data-import-body ref="DataImportBody" slot="main-body" :unitInfo="unitInfo" />
    </dialog-show>
    <!-- 右部 -->
    <div class="public-notree-right-content">
      <head-box class="public-header-option" :btnList="btnList" @add="add">
        <el-col :offset="1"></el-col>
      </head-box>
      <table-box
                class="public-table-box-scroll"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :selection="false"
                :tableKey="tableKey"
                :tableData="tableData">
        <el-table-column slot="type" label="系统类型">
          <template slot-scope="scope">
            <span>{{systemType[parseInt(scope.row.type)]}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="status" label="任务状态">
          <template slot-scope="scope">
            <span>{{taskStatus[parseInt(scope.row.status)]}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="operate" label="操作" width="150">
          <template slot-scope="scope">
            <div class="isedit">
             <span @click="edit(scope.row)">修改</span>
             <span @click="delInfo(scope.row)">删除</span>
             <span v-if="scope.row.status === 2" @click="startTask(scope.row)">启动</span>
             <span v-else style="color: red;" @click="stopTask(scope.row)">停止</span>
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
    name: "DataImport",
    data() {
      return {
        loading: false,
        btnList:[{name:'添加',event:'add',icon:'el-icon-plus'}],
        search: "",
        unitInfo: [],
        systemType: {'1': '统一排期', '2': 'RCS', '3': '数字法庭 6.0', '4': '智慧法庭2.0'},
        taskStatus: {'0': '未开始', '1': '进行中', '2': '已关闭'},
        tableKey:[
          {slot: 'type'},
          {prop: 'dbIp', label: 'IP', tooltip: true},
          {prop: 'dbPort', label:'端口', tooltip: true},
          {prop: 'dbName', label:'数据库名', tooltip: true},
          {prop: 'userName', label:'用户名', tooltip: true},
          {prop: 'timeConfig', label:'cron表达式', tooltip: true},
          {slot: 'status'},
          {slot: 'operate'}],
        tableData: [],
        
        updateFlag: false,
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    },
    components: {
      headBox: () => import("@/components/head-box"),
      tableBox: () => import('@/components/table-box'),
      pagingBox: () => import('@/components/paging-box'),
      dialogShow: () => import("../../components/dialog"),
      dataImportBody: () => import("./data-import/DataImportBody"),
    },
    mounted() {
      this.searchTaskData();
      systemManagementApi.getUnitInfo({}).then(res => {
        this.unitInfo = res.body;
      });
    },
    methods: {
      add() {
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(() => {
        this.$refs.DataImportBody.show();
        });
      },
      //查询数据并展示
      searchTaskData(search) {
        this.loading = true;
        let params = {'page':this.pageIndex,'pageSize':this.pageSize};
        if (search) {
          params['search'] = search;
        }
        systemManagementApi.getTimeTask(params).then(res => {
          this.loading = false;
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
        const successValidate = this.$refs.DataImportBody.submitForm();
        if (successValidate) {
          const form = this.$refs.DataImportBody.form;
          this.loading = true;
          //更新
          if (this.updateFlag) {
            this.updateFlag = false;
            systemManagementApi.updateTimeTask(form.id, form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchTaskData();
              successMsg("修改成功!!!");
            }).catch(() => {
              this.loading = false;
            });
           //新增
          } else {
            systemManagementApi.insertTimeTask(form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchTaskData();
              successMsg("保存成功!!!");
            }).catch(() => {
              this.loading = false;
            });
          }
          this.$refs.dialogShow.dialogFormVisible = false;
        }
      },
      //修改
      edit(row) {
        this.updateFlag = true;
        this.$refs.dialogShow.dialogFormVisible=true;
        this.$nextTick(()=>{
          this.$refs.DataImportBody.show(row);
        });
      },
      //删除
      delInfo(row) {
        if (row.status === 1) {
          errorMsg("请先停止任务后再删除!!!");
          return false;
        }
        MessageBox.confirm('确认删除???', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          systemManagementApi.deleteTimeTask(row.id).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.searchTaskData();
            successMsg("删除成功!!!");
          });
        });
      },
      startTask(form) {
       form.status = 1;
       this.loading = true;
       systemManagementApi.updateTimeTask(form.id, form).then(res => {
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.searchTaskData();
          successMsg("修改成功!!!");
       });
      },
      stopTask(form) {
        form.status = 2;
        this.loading = true;
        systemManagementApi.updateTimeTask(form.id, form).then(res => {
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.searchTaskData();
          successMsg("修改成功!!!");
       });
      },
      handleCurrentChange(page) {
        this.pageIndex = page;
        this.searchTaskData();
      }
    }
  }
</script>

<style lang="less" scoped>
  
</style>
<style lang="less">
  .data-import {
    .dialogAddtaskShow {
      .el-dialog{
        width:800px;
      }
    }
  }
</style>