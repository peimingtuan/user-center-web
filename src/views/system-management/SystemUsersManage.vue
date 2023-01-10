<template>
  <div class="system-users-manage">
    <dialog-show class="dialogAddUdersShow" ref="dialogShow" @saveInfo="saveInfo" :title="updateFlag ? '修改信息' : '添加信息'">
      <dialog-add-uders-body 
                            ref="DialogAddUdersBody"
                            slot="main-body"
                            :roleList="roleList"
                            :updateFlag="updateFlag"
                            :userLoading="userLoading"/>
    </dialog-show>
    <!-- 右部 -->
    <div class="public-notree-right-content">
      <head-box class="public-header-option" :btnList="btnList" @add="add">
        <el-col :offset="1"></el-col>
        <el-input v-model="search" placeholder="输入用户名或登录名" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" @click="getUserInfoBySearch(search)">查询</el-button>
      </head-box>
      <table-box
                class="public-table-box-scroll"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :selection="false"
                :tableKey="tableKey"
                :tableData="tableData">
        <el-table-column slot="sex" label="性别">
          <template slot-scope="scope">
            <div>{{ scope.row.sex === 1 ? '男':'女' }}</div>
          </template>
        </el-table-column>
        <el-table-column slot="userType" label="用户类型">
          <template slot-scope="scope">
            <div>{{ userTypeObj[scope.row.userType]}}</div>
          </template>
        </el-table-column> 
        <el-table-column slot="operate" label="操作" width="150">
          <template slot-scope="scope">
            <div class="isedit">
              <span @click="edit(scope.row.userId)">修改</span>
              <span @click="delInfo(scope.row.userId)">删除</span>
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
  import {search} from "../../api/roles/api.js"
  import md5 from 'js-md5'
  
  export default {
    name: "SystemUsersManage",
    components:{
      headBox: () => import("@/components/head-box"),
      tableBox: () => import('@/components/table-box'),
      pagingBox: () => import('@/components/paging-box'),
      dialogShow: () => import("../../components/dialog"),
      DialogAddUdersBody: () => import("./system-users-dialog/DialogAddUdersBody"),
    },
    data() {
      return {
        loading: false,
        userLoading: false,
        btnList: [{name: '添加', event: 'add', icon: 'el-icon-plus'}],
        search: '',
        userTypeObj: {1: '法院用户', 2: '互联网用户', 4:'管理员', 255: '其他用户'},
        tableKey:[
                  {prop: 'name', label: '用户名', tooltip: true},
                  {prop: 'username', label: '登录名', tooltip: true},
                  {slot: 'sex'},
                  {prop: 'phone', label: '联系电话', tooltip: true},
                  {prop: 'email', label: '邮箱', tooltip: true},
                  {slot: 'userType'},
                  {slot: 'operate'}],
        tableData: [],
        roleList: [],
        updateFlag: false,
        roleIds: [],
        pageIndex: 1,
        pageSize: 9,
        total: 0,
        value:''
      }
    },
    mounted() {
      this.searchUserInfo();
      search().then(res => {
        if (!res.success) {
          warningMsg('暂无角色可供选择');
          return false;
        }
        this.roleList = res.body;
      });
    },
    methods: {
      add() {
        this.search = '';
        this.updateFlag = false;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.DialogAddUdersBody.options = [];
          this.$refs.DialogAddUdersBody.show();
        });
      },
      //模糊查询
      getUserInfoBySearch(search) {
        this.pageIndex = 1;
        this.searchUserInfo(search);
      },
      //查询数据并展示
      searchUserInfo(search) {
        this.loading = true;
        const params = {"page": this.pageIndex, "pageSize": this.pageSize};
        if (search) {
          params["search"] = search;
        }
        systemManagementApi.getUserInfo(params).then(res => {
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
        const successValidate = this.$refs.DialogAddUdersBody.submitForm();
        if (successValidate) {
          const form = this.$refs.DialogAddUdersBody.form;
          //更新
          if (this.updateFlag) {
            delete form.checkPassword;
            delete form.password;
            systemManagementApi.updateUserInfo(form.userId, form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchUserInfo();
              successMsg("修改成功!!!");
            });
           //新增用户
          } else {
            form.password = md5(form.password);
            form.checkPassword = md5(form.checkPassword);
            systemManagementApi.saveUserInfo(form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchUserInfo();
              successMsg("保存成功!!!");
            });
          }
          this.$refs.dialogShow.dialogFormVisible = false;
        }
      },
      edit(userId) {
        this.search = '';
        this.updateFlag = true;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.userLoading = true;
        systemManagementApi.getUserInfoById(userId).then(res => {
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.roleIds = [];
          for (let roleInfo of res.body.roleInfoList) {
            this.roleIds.push(roleInfo.roleId);
          }
          res.body['roleIds'] = this.roleIds;
          delete res.body.password;
          this.$nextTick(() => {
            this.$refs.DialogAddUdersBody.options = [];
            if (res.body.staff) {
              this.$refs.DialogAddUdersBody.options.push(res.body.staff);
            }
            this.$refs.DialogAddUdersBody.unitOptions = [];
            if (res.body.unitInfo) {
              this.$refs.DialogAddUdersBody.unitOptions.push(res.body.unitInfo);
            }
            this.$refs.DialogAddUdersBody.show(res.body);
            this.userLoading = false;
          });
        });
      },
      delInfo(userId) {
        MessageBox.confirm('确认删除???', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          systemManagementApi.deleteUserInfo(userId).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.searchUserInfo();
            successMsg("删除成功!!!");
          });
        });
      },
      handleCurrentChange(page) {
        this.pageIndex = page;
        this.searchUserInfo(this.search);
      },
    }
  }
</script>

<style lang="less" scoped>
  .system-users-manage {

  }
</style>
<style lang="less">
  .system-users-manage{
    .dialogAddUdersShow{
      .el-dialog{
        width:800px;
      }
    }
    .dialogWarrantShow{
      .el-dialog{
        width:1200px;
      }
    }
  }
</style>