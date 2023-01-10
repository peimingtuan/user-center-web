<template>
  <div class="role-manage">
    <dialog-show
        ref="dialogShow"
        class="dialogShow"
        :title="option"
        @saveInfo="doOption">
      <dialog-role-body ref="DialogRoleBody" slot="main-body"/>
    </dialog-show>
    <el-dialog
        class="dialogAuthorizeShow"
        :visible.sync="dialogVisible">
      <dialog-authorize-body ref="DialogAuthorizeBody" :row="row" @saveModuleInfo="dialogVisible=false" @closeDialog="closeDialog"/>
    </el-dialog>
    <dialog-show
        class="dialogCastMembersShow"
        ref="dialogCastMembersShow"
        title="角色选择"
        @saveInfo="saveRoleInfo">
      <dialog-cast-members-body ref="DialogCastMembersBody" slot="main-body"/>
    </dialog-show>
    <!-- 右部 -->
    <div class="public-notree-right-content">
      <head-box
          class="public-header-option"
          @add="add"
          :btnList="btnList"
      >
        <el-col :offset="1" style="text-align: right;font-size:16px;line-height:35px">角色查询：</el-col>
        <el-input placeholder="请输入角色名称" v-model="query" @keyup.enter.native="search()">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search()"></i>
        </el-input>
      </head-box>
      <table-box
          class="public-table-box-scroll"
          :selection="false"
          :tableKey="tableKey"
          :tableData="tableData"
      >
        <el-table-column slot="operate" label="操作" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.initData === 1" class="disabledGray">
              <span>修改</span>
              <span>删除</span>
              <span>授权管理</span>
              <span>角色成员</span>
            </div>
            <div v-else class="isedit">
              <span @click="edit(scope.$index, scope.row)">修改</span>
              <span @click="delInfo(scope.$index, scope.row)">删除</span>
              <span @click="authorize(scope.row)">授权管理</span>
              <span @click="castMenbers(scope.row)">角色成员</span>
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
import * as api from "../../api/roles/api"
import * as http from "@/api/system-management/role-manage-api"
import {errorMsg} from "../../ui";

export default {
  name: "RoleManage",
  components: {
    headBox: () => import("@/components/head-box"),
    tableBox: () => import('@/components/table-box'),
    pagingBox: () => import('@/components/paging-box'),
    dialogShow: () => import("../../components/dialog"),
    DialogRoleBody: () => import("./role-manage-dialog/DialogRoleBody"),
    DialogAuthorizeBody: () => import("./role-manage-dialog/DialogAuthorizeBody"),
    DialogCastMembersBody: () => import("./role-manage-dialog/DialogCastMembersBody")
  },
  data() {
    return {
      dialogVisible: false,
      row:{},
      btnList: [{name: '添加', event: 'add', icon: 'el-icon-plus'}],
      tableKey: [{prop: 'roleName', label: '角色名称', tooltip: true},
        {prop: 'roleCode', label: '角色代码', tooltip: true},
        {prop: 'roleDesc', label: '描述', tooltip: true},
        {slot: 'operate'}],
      tableData: null,
      option: '',

      pageIndex: 1,
      pageSize: 10,
      total: 0,
      query: null,
    }
  },
  created() {
  },
  mounted() {
    this.search();
  },
  updated() {
  },
  beforeDestroy() {
  },
  methods: {
    doOption() {
      if (this.option === '添加信息') {
        this.saveInfo();
      } else if (this.option === '修改信息') {
        this.changeInfo();
      }
    },
    add() {
      this.option = "添加信息"
      this.$refs.dialogShow.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.DialogRoleBody.show()
      })
    },
    async saveInfo() {
      if (!this.$refs.DialogRoleBody.submitForm()) {
        errorMsg("请输入完整信息")
        return
      }
      let role = this.$refs.DialogRoleBody.form
      await api.insert([role]).then(() => {
        this.$refs.dialogShow.dialogFormVisible = false
        this.search();
      })
    },
    async search() {
      let result = await api.search({search: this.query, page: this.pageIndex, pageSize: this.pageSize})

      if (result.body.length == 0 && this.pageIndex > 1) {
        this.pageIndex = this.pageIndex - 1
        await this.search()
      } else {
        this.tableData = result.body;
        this.total = result.count;
      }
    },
    edit(index, row) {
      this.option = "修改信息"
      this.$refs.dialogShow.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.DialogRoleBody.show(row)
      })
    },
    async changeInfo() {
      if (!this.$refs.DialogRoleBody.submitForm()) {
        errorMsg("请输入完整信息")
        return
      }
      let role = this.$refs.DialogRoleBody.form
      await api.update(role).then(() => {
        this.$refs.dialogShow.dialogFormVisible = false
        this.search();
      })
    },
    delInfo(index, row) {
      MessageBox.confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await api.del(row.roleId).then(() => {
          this.search()
        })
      }).catch(console.error);
    },
    //授权管理
    authorize(row) {
        this.row = row;
        this.dialogVisible = true;
        this.$nextTick(()=>{
          this.$refs.DialogAuthorizeBody.activeName = "first";
          this.$refs.DialogAuthorizeBody.allCheckPowers()
        })
    },
    //角色成员
    castMenbers(row) {
      this.row = row;
      this.$refs.dialogCastMembersShow.dialogFormVisible = true
      this.$nextTick(()=>{
        this.$refs.DialogCastMembersBody.show(row.roleId)
      })
    },
    //保存角色
    async saveRoleInfo(){
        // if(this.$refs.DialogCastMembersBody.boxList.length===0){
        //   this.$msgW('请选择角色')
        //   return false
        // }
        await http.addRoleUsers(this.$refs.DialogCastMembersBody.boxList,this.row.roleId)
        this.$msgS('保存成功')
        this.$refs.dialogCastMembersShow.dialogFormVisible = false
    },
    handleCurrentChange(page) {
      this.pageIndex = page
      this.search();
    },
    closeDialog() {
        this.dialogVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.role-manage {

}
</style>
<style lang="less">
    .role-manage {
        .dialogAuthorizeShow {
          .el-dialog__headerbtn{
            top:10px;
            z-index:100
          }
          .el-dialog__header {
              padding: 0;
          }
          .el-dialog__body {
              padding: 0;
          }
          .el-dialog__title {
              display: none;
          }
          .el-dialog {
            width: 1200px !important;
          }
        }
    }
    .disabledGray{
      span{
        margin-right:10px;
        color:#dcdcdc;
      }
    }
</style>
