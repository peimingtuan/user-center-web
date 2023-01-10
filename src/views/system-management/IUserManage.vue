<template>
  <div class="i-user-manage">
    <dialog-show
        ref="dialogShow"
        class="dialogShow"
        v-bind:title="option"
        @saveInfo="doOption">
      <dialog-i-user-body ref="DialogIUserBody" slot="main-body"/>
    </dialog-show>
    <dialog-show
        ref="updatePwd"
        class="dialogShow"
        v-bind:title="option"
        @saveInfo="changePassword">
      <dialog-update-pwd-body ref="DialogUpdatePwdBody" slot="main-body"/>
    </dialog-show>
    <dialog-show
        ref="secretKey"
        class="dialogShow"
        v-bind:title="option"
        primaryButton="生成密钥"
        @saveInfo="generateKey">
      <dialog-SecretKeyBody ref="DialogSecretKeyBody" slot="main-body"/>
    </dialog-show>
    <dialog-show
        ref="dialogAuthShow"
        class="dialogAuthShow"
        title="授权"
        @saveInfo="doAuth">
      <dialog-i-user-auth-body ref="DialogIUserAuthBody" slot="main-body"/>
    </dialog-show>

    <!-- 右部 -->
    <div class="public-notree-right-content">
      <head-box class="public-header-option" @add="add" :btnList="btnList">
        <el-col :offset="1" style="text-align: right;font-size:16px;">接口用户查询：</el-col>
        <el-input placeholder="请输入接口用户名称" v-model="searchName" @keyup.enter.native="search()">
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
              <span @click="edit(scope.$index, scope.row)">修改信息</span>
              <span @click="auth(scope.$index, scope.row)">接口授权</span>
              <span @click="checkAuthCode(scope.$index, scope.row, 'updatePwd')">修改密码</span>
              <span @click="checkAuthCode(scope.$index, scope.row, 'generateKey')">查看密钥</span>
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
import md5 from 'js-md5'

export default {
  name: "IUserManage",
  components: {
    scrollTreeBox: () => import('@/components/tree-box/ScrollTreeBox'),
    headBox: () => import("@/components/head-box"),
    tableBox: () => import('@/components/table-box'),
    pagingBox: () => import('@/components/paging-box'),
    dialogShow: () => import("../../components/dialog"),
    DialogIUserBody: () => import("./i-user-manage-dialog/DialogIUserBody"),
    DialogIUserAuthBody: () => import("./i-user-manage-dialog/DialogIUserAuthBody"),
    DialogUpdatePwdBody: () => import("./i-user-manage-dialog/DialogUpdatePwdBody"),
    DialogSecretKeyBody: () => import("./i-user-manage-dialog/DialogSecretKeyBody"),
  },
  data() {
    return {
      searchName: '',
      btnList: [{name: '添加', event: 'add', icon: 'el-icon-plus'}],
      tableKey: [
        {prop: 'iUserName', label: '接口用户名称', tooltip: true},
        {prop: 'username', label: '接口用户账号', tooltip: true},
        {prop: 'accessFrequency', label: '访问频率', tooltip: true},
        {prop: 'maxConcurrency', label: '最大并发', tooltip: true},
        {prop: 'accessTime', label: '访问时段', tooltip: true},
        {prop: 'expireTime', label: '过期时间', tooltip: true},
        {prop: 'desc', label: '描述信息', tooltip: true},
        {slot: 'operate'}
      ],
      tableData: [],
      option: '',

      // 分页
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId
    }
  },
  mounted() {
    this.search();
  },
  methods: {
    doOption() {
      if (this.option === '添加信息') {
        this.saveInfo();
      } else if (this.option === '修改信息') {
        this.changeInfo();
      }
    },
    //添加
    add() {
      this.option = "添加信息"
      this.$refs.dialogShow.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.DialogIUserBody.show();
      })
    },
    saveInfo() {
      let flag = this.$refs.DialogIUserBody.submitForm();
      if (!flag) {
        return
      }
      let info = this.$refs.DialogIUserBody.form
      info.password = md5(info.password)
      info.password2 = md5(info.password2)
      if (info.accessTime_) {
        info.accessTime = this.$refs.DialogIUserBody.array2Str(info.accessTime_)
      }
      systemManagementApi.insertIUser([info]).then(() => {
        this.$refs.dialogShow.dialogFormVisible = false
        this.search();
      })
    },
    //查询数据并展示
    async search() {
      let result = await systemManagementApi.searchIUser({
        search: this.searchName,
        page: this.pageIndex,
        pageSize: this.pageSize
      })
      if (result.body.length == 0 && this.pageIndex > 1) {
        this.pageIndex = this.pageIndex - 1
        await this.search()
      } else {
        this.tableData = result.body;
        this.total = result.count;
      }
    },
    //修改
    edit(index, row) {
      this.option = "修改信息"
      this.$refs.dialogShow.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.DialogIUserBody.show(row)
      })
    },
    changeInfo() {
      let x = this.$refs.DialogIUserBody.submitForm();
      if (!x) {
        return
      }
      let info = this.$refs.DialogIUserBody.form
      if (info.accessTime_) {
        info.accessTime = this.$refs.DialogIUserBody.array2Str(info.accessTime_)
      }
      systemManagementApi.updateIUser(info).then(() => {
        this.$refs.dialogShow.dialogFormVisible = false
        this.search();
      })
    },
    //涉密操作（修改密码、查看密钥）
    checkAuthCode(index, row, operation) {
      this.$prompt('请再次输入登录密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
      }).then(({value}) => {
        this.validate(value, index, row, operation)
      });
    },
    //校验授权码
    async validate(value, index, row, operation) {
      let {userId} = this
      let flag = false
      await systemManagementApi.validate({userId}.userId, md5(value)).then((res) => {
        if (res) {
          flag = res.success
        }
      })
      if (flag) {
        if (operation === 'updatePwd') {
          //修改密码
          this.showUpdatePwdDialog(index, row)
        } else if (operation === 'generateKey') {
          // 查看密钥
          this.showDialogSecretKey(index, row)
        }
      } else {
        errorMsg("密码错误")
      }
    },
    showUpdatePwdDialog(index, row) {
      this.option = '修改密码'
      this.$refs.updatePwd.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.DialogUpdatePwdBody.show(row)
      })
    },
    changePassword() {
      let flag = this.$refs.DialogUpdatePwdBody.submitForm();
      if (!flag) {
        return
      }
      let old = this.$refs.DialogUpdatePwdBody.row
      let info = this.$refs.DialogUpdatePwdBody.form
      info.iUserId = old.iUserId
      info.iUserName = old.iUserName
      info.username = old.username
      info.password = md5(info.password)
      info.password2 = md5(info.password2)
      systemManagementApi.updateIUser(info).then(() => {
        this.$refs.updatePwd.dialogFormVisible = false
      })
    },
    showDialogSecretKey(index, row) {
      this.option = '查看密钥'
      this.$refs.secretKey.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.DialogSecretKeyBody.show(row)
      })
    },
    generateKey() {
      this.$refs.DialogSecretKeyBody.generateKey()
    },
    //删除
    delInfo(index, row) {
      MessageBox.confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await systemManagementApi.delIUser(row.iUserId).then(() => {
          this.search()
        })
      }).catch(console.error);
    },
    //授权
    auth(index, row) {
      this.$refs.dialogAuthShow.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.DialogIUserAuthBody.show(row.iUserId)
      })
    },
    doAuth() {
      let checked = []
      this.$refs.DialogIUserAuthBody.getCheckedNodes().forEach(z => {
        if (z.type === 'int') {
          checked.push({interfaceId: z.id, interfaceName: z.name})
        }
      })

      systemManagementApi.insertAuth(this.$refs.DialogIUserAuthBody.iUserId, checked).then(() => {
        this.$refs.dialogAuthShow.dialogFormVisible = false
      })
    },
    //分页
    handleCurrentChange(page) {
      this.pageIndex = page;
      this.search();
    },
  },
}
</script>

<style lang="less" scoped>
.i-user-manage {

}
</style>
<style lang="less">
.i-user-manage {
  .dialogIUserShow {
    .el-dialog {
      width: 800px;
    }
  }

  .dialogIUserMoreShow {
    .el-dialog {
      width: 1200px;
    }
  }
}
</style>