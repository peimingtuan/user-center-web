<template>
  <div class="portal-subgroup">
    <dialog-show ref="dialogShow" @saveInfo="saveInfo" :title="updateFlag ? '修改信息' : '添加信息'">
      <dialog-portal-body ref="DialogPortalBody" slot="main-body" />
    </dialog-show>
    <head-box class="public-header-option" :btnList="btnList" @add="add">
      <el-col :offset="1"></el-col>
      <el-input v-model="search" placeholder="输入应用名称" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchPortalData">查询</el-button>
    </head-box>
    <table-box
              class="public-table-box-scroll"
              :selection="false"
              :tableKey="tableKey"
              :tableData="tableData">
      <el-table-column slot="type" label="类型">
        <template slot-scope="scope">
          <span>{{typeObj[scope.row.type.toString()]}}</span>
        </template>
      </el-table-column>
      <el-table-column slot="heigh" label="高度">
        <template slot-scope="scope">
          <span>{{scope.row.heigh}}px</span>
        </template>
      </el-table-column>
      <el-table-column slot="width" label="宽度">
        <template slot-scope="scope">
          <span>{{scope.row.width}}%</span>
        </template>
      </el-table-column>
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
  import {successMsg, warningMsg} from "@/ui"
  import * as systemManagementApi from "@/api/system-management-api.js"
  export default {
    name: "PortalSubgroup",
    components: {
      headBox: () => import("@/components/head-box"),
      tableBox: () => import('@/components/table-box'),
      pagingBox: () => import('@/components/paging-box'),
      dialogShow: () => import("@/components/dialog"),
      DialogPortalBody: () => import("./dialog/DialogPortalBody"),
    },
    data() {
      return {
        typeObj: {'1':'链接类型','2':'表格','3':'折线图','4':'柱状图-纵向','5':'柱状图-横向','6':'饼状图','7':'极区图','8':'雷达图','255':'其他'},
        btnList: [{name:'添加',event:'add',icon:'el-icon-plus'}],
        tableKey: [{prop:'appId',label:'应用标识',tooltip:true},
          {prop: 'appName',label:'应用名称',tooltip:true},
          {prop: 'name',label:'名称',tooltip:true},
          {slot: 'type'},
          {prop: 'accessUrl',label:'详情地址',tooltip:true},
          {slot: 'heigh'},
          {slot: 'width'},
          {slot: 'operate'}],
        tableData: [],
        updateFlag: false,
        id: '',
        search: '',
        pageIndex: 1,
        pageSize: 9,
        total: 0
      }
    },
    mounted() {
      this.searchPortalData();
    },
    methods: {
      add(){
        this.search = '';
        this.updateFlag = false;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(()=>{
          this.$refs.DialogPortalBody.authPicFile = '';
          this.$refs.DialogPortalBody.show();
        });
      },
      //查询数据并展示
      searchPortalData() {
        const params = {'page': this.pageIndex, 'pageSize': this.pageSize, 'search': this.search};
        systemManagementApi.getPortalData(params).then(res => {
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
        const successValidate = this.$refs.DialogPortalBody.submitForm();
        if (successValidate) {
          const form = this.$refs.DialogPortalBody.form;
          let params = new FormData();
          for (let key in form){
            params.append(key,form[key]);
          }
          //更新
          if (this.updateFlag) {
            systemManagementApi.updatePortalData(this.id, params).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchPortalData();
              successMsg("修改成功!!!");
            });
           //新增
          } else {
            systemManagementApi.savePortalData(params).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchPortalData();
              successMsg("保存成功!!!");
            });
          }
          this.$refs.DialogPortalBody.authPicFile = '';
          this.$refs.dialogShow.dialogFormVisible = false;
        }
      },
      edit(row) {
        this.search = '';
        this.updateFlag = true;
        this.id = row.id;
        let form = {};
        form['appId'] = row.appId;
        form['appName'] = row.appName;
        form['name'] = row.name;
        form['type'] = row.type;
        form['accessUrl'] = row.accessUrl;
        form['heigh'] = row.heigh;
        form['width'] = row.width;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(()=>{
          this.$refs.DialogPortalBody.show(form);
        })
      },
      delInfo(PortalId) {
        MessageBox.confirm('确认删除???', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          systemManagementApi.deletePortalData(PortalId).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.searchPortalData();
            successMsg("删除成功!!!");
          });
        });
      },
      handleCurrentChange(page) {
        this.pageIndex = page;
        this.searchPortalData();
      },
    }
  }
</script>

<style lang="less" scoped>
  .portal-subgroup {
    height:100%;
  }
</style>
<style lang="less">

</style>