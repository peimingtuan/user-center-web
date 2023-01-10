<template>
  <div class="data-import-body">
    <el-form :model="form" ref="ruleForm" :rules="rules" :label-width="formLabelWidth">
      <div v-if="form.type == 1">
       <el-form-item label="系统类型" prop="type">
         <el-select v-model="form.type">
           <el-option label="统一排期" :value="1"></el-option>
           <el-option label="RCS" :value="2"></el-option>
           <el-option label="数字法庭6.0" :value="3"></el-option>
           <el-option label="智慧法庭2.0" :value="4"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="IP" prop="dbIp">
         <el-input v-model.trim="form.dbIp" :maxlength="50"></el-input>
       </el-form-item>
       <el-form-item label="端口" prop="dbPort">
         <el-input v-model="form.dbPort" :maxlength="6"></el-input>
       </el-form-item>
       <el-form-item label="用户名" prop="userName">
         <el-input v-model="form.userName" :maxlength="50"></el-input>
       </el-form-item>
       <el-form-item label="密码" prop="password">
         <el-input v-model="form.password" type="password" :maxlength="50"></el-input>
       </el-form-item>
       <el-form-item label="密码类型" prop="passwordType">
         <el-select v-model="form.passwordType">
           <el-option label="明文密码" :value="1"></el-option>
           <el-option label="MD5加密" :value="2"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="cron表达式" prop="timeConfig">
         <el-input v-model="form.timeConfig" placeholder="如:0 0 20 * * ?" :maxlength="50"></el-input>
       </el-form-item>
       <el-form-item label="单位" prop="unitId">
         <el-select
                   style="width: 180px;" 
                   v-model="form.unitId"
                   v-loading="unitLoading"
                   element-loading-text="拼命加载中"
                   element-loading-spinner="el-icon-loading"
                   filterable
                   remote
                   reserve-keyword
                   placeholder="输入名称查询"
                   :remote-method="unitRemoteMethod"
                   @change="backfill">
           <el-option
                     v-for="item in unitOptions"
                     :key="item.unitId"
                     :label="item.unitName"
                     :value="item.unitId">
           </el-option>
         </el-select>
       </el-form-item>
      </div>
      <div v-else>
       <el-form-item label="系统类型">
         <el-select v-model="form.type">
           <el-option label="统一排期" :value="1"></el-option>
           <el-option label="RCS" :value="2"></el-option>
           <el-option label="数字法庭6.0" :value="3"></el-option>
           <el-option label="智慧法庭2.0" :value="4"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="IP" prop="dbIp">
         <el-input v-model.trim="form.dbIp" :maxlength="50"></el-input>
       </el-form-item>
       <el-form-item label="端口" prop="dbPort">
         <el-input v-model="form.dbPort" :maxlength="6"></el-input>
       </el-form-item>
       <el-form-item label="数据库名" prop="dbName">
         <el-input v-model="form.dbName" :maxlength="50"></el-input>
       </el-form-item>
       <el-form-item label="用户名" prop="userName">
         <el-input v-model="form.userName" :maxlength="50"></el-input>
       </el-form-item>
       <el-form-item label="密码" prop="password">
         <el-input v-model="form.password" type="password" :maxlength="50"></el-input>
       </el-form-item>
       <el-form-item label="密码类型" prop="passwordType">
         <el-select v-model="form.passwordType">
           <el-option label="明文密码" :value="1"></el-option>
           <el-option label="MD5加密" :value="2"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="cron表达式" prop="timeConfig">
         <el-input v-model="form.timeConfig" placeholder="如:0 0 20 * * ?"></el-input>
       </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import * as systemManagementApi from "../../../api/system-management-api.js"
  export default {
    name: "DataImportBody",
    data() {
      return {
        unitOptions: [],
        unitLoading: false,
        form: {
          dbIp: '',
          dbPort: '',
          dbName: '',
          table: '',
          userName: '',
          password: '',
          timeConfig: '',
          type: 1,
          unitId: '',
          unitName: '',
          passwordType: null,
          status: 0
        },
        formLabelWidth: '150px',
        rules: {
          dbIp: [{ required: true, message: '请输入IP(必填)', trigger: 'blur'}],
          dbPort: [{ required: true, message: '请输入端口(必填)', trigger: 'blur'}],
          dbName: [{ required: true, message: '请输入数据库名称(必填)', trigger: 'blur'}],
          userName: [{ required: true, message: '请输入用户名(必填)', trigger: 'blur'}],
          password: [{ required: true, message: '请输入密码(必填)', trigger: 'blur'}],
          timeConfig: [{ required: true, message: '请输入cron表达式(必填)', trigger: 'blur'}],
          unitId: [{ required: true, message: '请输入单位名称(必填)', trigger: 'blur'}],
          passwordType: [{ required: true, message: '请输入选择密码类型(必填)', trigger: 'blur'}]
        }
      }
    },
    methods: {
      show(row) {
        if (row) {
          for (let key in row) {
            this.form[key] = row[key];
          }
        } else {
          this.form = {
            dbIp:'',
            dbPort: '',
            dbName: '',
            table: '',
            userName: '',
            password: '',
            timeConfig: '',
            type: 1,
            unitId: '',
            unitName: '',
            passwordType: null,
            status: 0
          };
        }
      },
      submitForm() {
        let successValidate = false;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            successValidate = true;
          } else {
            this.$message.error("您添加的信息不全!!!");
          }
        });
        return successValidate;
      },
      unitRemoteMethod(query) {
        if (query) {
          this.unitLoading = true;
          //查询所有人员
          systemManagementApi.getUnitInfo({"search": query}).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.unitOptions = res.body;
            this.unitLoading = false;
          });
        } else {
         this.unitOptions = [];
        }
      },
      backfill(unitId) {
        this.form.unitName = this.unitOptions.filter(item => item.unitId === unitId)[0].unitName;
      }
    },
  }
</script>

<style lang="less" scoped>
 .data-import-body {

 }
</style>
<style lang="less">

</style>