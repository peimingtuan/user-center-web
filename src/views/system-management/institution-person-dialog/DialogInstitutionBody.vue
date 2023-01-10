<template>
  <div class="dialog-institution-body">
    <el-form :model="form" ref="ruleForm" :rules="rules">
      <div>
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="form.name" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-select style="width: 180px;" v-model="form.deptId" @change="setDeptName" placeholder="请选择(单选)">
            <el-option v-for="item in deptInfoList" :label="item.deptName" :value="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务" prop="jobIds">
          <el-select style="width: 180px;" v-model="form.jobIds" multiple @change="limitNumber" placeholder="请选择(多选,最多5个)">
            <el-option v-for="item in jobList" :label="item.jobName" :value="item.jobId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <div v-if="!updateFlag">
          <el-form-item label="创建登录账号">
            <el-button type=primary size="small" @click="createLoginInfo = !createLoginInfo">
              <span v-if = "!createLoginInfo">创建</span>
              <span v-else>取消</span>
            </el-button>
          </el-form-item>
          <div v-if="createLoginInfo">
            <el-form-item label="登录名" prop="username" :rules="[{required: true, message: '请输入登录名(必填)', trigger: 'blur'}]">
              <el-input v-model.trim="form.username" autocomplete="off" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="选择角色">
              <el-select style="width: 180px;" v-model="form.roleIds" multiple @change="limitRoleNumber" placeholder="请选择(多选,最多3个)">
                <el-option v-for="item in roleList" :label="item.roleName" :value="item.roleId" :key="item.roleId"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
      <div>
        <el-form-item label="身份证号码" prop="idCard">
          <el-input v-model="form.idCard" :maxlength="18" ></el-input>
        </el-form-item>
        <el-form-item label="生日">
          <el-input v-model="form.birthdate" readonly></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" readonly></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" style="width: 180px;">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否员额法官">
          <el-select style="width: 180px;" v-model="form.originalJudge">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="!updateFlag">
          <div v-if="createLoginInfo">
            <el-form-item><br/></el-form-item>
            <el-form-item label="登录密码" prop="password" :rules="[{required: true, validator: checkLength, trigger: 'blur'}]">
              <el-input v-model="form.password" type="password" placeholder="输入长度在6-16位字符"></el-input>
            </el-form-item>
            <el-form-item label="再次确认" prop="checkPassword" :rules="[{required: true, validator: validatePass2,trigger:'blur'}]">
              <el-input type="password" v-model="form.checkPassword" autocomplete="off"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import * as systemManagementApi from "../../../api/system-management-api.js"
  import {successMsg,warningMsg,errorMsg} from "../../../ui"
  export default {
    name: "DialogInstitutionBody",
    props: {
     jobList: {
       type: Array,
     },
     roleList: {
       type: Array,
     },
     deptInfoList: {
       type: Array,
     },
     deptId: {
       type: String
     },
     updateFlag: {
       type: Boolean
     }
    },
    data() {
      return {
        createLoginInfo: false,
        form: {
          name:'',
          sex: null,
          idCard: '',
          birthdate: '',
          age: '',
          deptId: '',
          deptName: '',
          jobIds: [],
          phone: '',
          email: '',
          originalJudge: 2,
          username: '',
          password: '',
          checkPassword: '',
          userType: 1,
          roleIds: []
        },
        rules: {
          deptId: [{required: true, message: '请选择部门(必填)', trigger: 'blur'}],
          name: [{required: true, message: '请输入姓名(必填)', trigger: 'blur'}],
          jobIds: [{required: true, message: '请选择职务(必选)', trigger: 'blur'}],
          email: [{validator: this.validEmail, trigger: 'blur'}],
          phone: [{validator: this.validPhone, trigger: 'blur'}],
          idCard: [{validator: this.validID, trigger: 'blur'}]
        },
      }
    },
    mounted() {
      this.form.deptId = this.deptId;
    },
    methods: {
      show(row) {
        if (row) {
          for (let key in row) {
            this.form[key] = row[key];
          }
        } else {
          this.form = {
            name:'',
            idCard: '',
            sex: null,
            birthdate: '',
            age: '',
            deptName: '',
            jobIds: [],
            phone: '',
            email: '',
            originalJudge: 2,
            username: '',
            password: '',
            checkPassword: '',
            userType: 1,
            roleIds: []
          };
        }
      },
      submitForm() {
        let successValidate = false;
        this.$refs.ruleForm.validate((valid) => {
         if (valid) {
          successValidate = true;
         } else {
          errorMsg("您添加的信息不全或有误!!!");
         }
        });
        return successValidate;
      },
      validEmail(rule, value, callback) {
        if (value.length > 0) {
          if (/(^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$)/.test(value) == false) {
            callback(new Error("邮箱格式错误"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      validPhone(rule, value, callback) {
        if (value.length > 0) {
          if (/(^1[34578]\d{9}$)/.test(value) == false) {
            callback(new Error("手机号格式错误"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      // 实现自动生成生日，性别，年龄
      validID(rule, value, callback) {
        let iden = value;
        const val = iden.length;
        if (val === 0) {
          callback();
        } else if (val < 15) {
          callback(new Error("身份证号位数错误!!!"));
        } else if (val === 18 || val === 15) {
          let sex = null;
          let birth = null;
          let myDate = new Date();
          let month = myDate.getMonth() + 1;
          let day = myDate.getDate();
          let age = null;
          if(val === 18) {
           age = myDate.getFullYear() - iden.substring(6, 10) - 1;
           sex = iden.substring(16,17);
           birth = iden.substring(6,10)+"-"+iden.substring(10,12)+"-"+iden.substring(12,14);
           if (iden.substring(10, 12) < month || iden.substring(10, 12) == month && iden.substring(12, 14) <= day) age++;
          }
          if(val === 15) {
            age = myDate.getFullYear() - iden.substring(6, 8) - 1901;
            sex = iden.substring(13,14);
            birth = "19"+iden.substring(6,8)+"-"+iden.substring(8,10)+"-"+iden.substring(10,12);
            if (iden.substring(8, 10) < month || iden.substring(8, 10) == month && iden.substring(10, 12) <= day) age++;
          }
          if(sex % 2 === 0) sex = 2;
          else sex = 1;
          this.form.sex = sex;
          this.form.age = age;
          this.form.birthdate = birth;
          callback();
        } else {
          callback(new Error("身份证号位数错误!!!"));
        }
      },
      //检查密码
      checkLength(rule, value, callback) {
        if (!value) {
          return callback(new Error('密码不能为空'));
        }
        if (value.length > 16 || value.length < 6) {
          callback(new Error('密码长度取值范围[6,16]'));
        } else {
          callback();
        }
      },
      //再次确认密码校验
      validatePass2(rule, value, callback) {
        if (value === '') {
         callback(new Error('请再次输入密码!'));
        } else if (value !== this.form.password) {
         callback(new Error('两次输入密码不一致!'));
        } else {
         callback();
        }
      },
      //职务数量限制
      limitNumber() {
        if(this.form.jobIds.length > 5){
          this.form.jobIds.pop();
          errorMsg("每人最多只能选择5个职务");
        }
      },
      //角色数量限制
      limitRoleNumber() {
        if(this.form.roleIds.length > 3){
          this.form.roleIds.pop();
          errorMsg("每人最多只能选择3个角色");
        }
      },
      setDeptName(val){
        this.form.deptName = this.deptInfoList.filter(item => item.deptId === val)[0].deptName;
      }
    }
  }
</script>

<style lang="less" scoped>
  .dialog-institution-body {

  }
</style>
<style lang="less">
  @import "../../../assets/css/common.less";
  .dialog-institution-body {
    /deep/ .el-select__tags {
      flex-wrap: unset; 
      overflow: auto;
    }
    .el-form {
      .f-s-b();
      &>div{
        width:400px;
        .el-input{
          width:200px!important;
        }
        .el-form-item__label{
          width:120px;
        }
        .el-form-item__content{
          margin-left:120px;
        }
        .el-button--text{
          span{
            color:#409EFF!important;
            .f16();
          }
        }
      }
    }
  }
</style>