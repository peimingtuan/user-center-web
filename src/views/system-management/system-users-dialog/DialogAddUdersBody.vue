<template>
  <div
      class="dialog-institution-body"
      v-loading="userLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <div>
        <el-form-item label="用户名" prop="name">
          <el-input v-model.trim="form.name" autocomplete="off" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="username">
          <el-input v-model.trim="form.username" autocomplete="off" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item v-if="!updateFlag" label="登录密码" prop="password" :rules="[{required: true, validator: checkLength, trigger: 'blur'}]">
          <el-input v-model="form.password" type="password" placeholder="长度在6-16位字符"></el-input>
        </el-form-item>
        <el-form-item v-if="!updateFlag" label="确认密码" prop="checkPassword" :rules="[{required: true, validator: validatePass2, trigger:'blur'}]">
          <el-input type="password" v-model="form.checkPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择角色">
          <el-select style="width: 200px;" v-model="form.roleIds" multiple @change="limitRoleNumber" placeholder="请选择(多选,最多3个)">
            <el-option v-for="item in roleList" :label="item.roleName" :value="item.roleId" :key="item.roleId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型">
          <el-select v-model="form.userType" style="width: 200px;" @change="initInfo">
            <el-option label="法院用户" :value="1"></el-option>
            <el-option label="管理员账号" :value="4"></el-option>
            <el-option label="互联网用户" :value="2"></el-option>
            <el-option label="其他" :value="255"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号所在单位" v-if="form.userType === 1 && !setStaffInfo" prop="unitCode">
          <a id = "showUnitName" title="" class="el-tooltip">
            <el-select
                      style="width: 180px;"
                      :disabled="updateFlag"
                      v-model="form.unitCode"
                      v-loading="unitLoading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="输入名称查询"
                      :remote-method="unitRemoteMethod"
                      @change="backfillUnitId"
                      @mouseover.native="showName(form.unitName)">
              <el-option
                        v-for="item in unitOptions"
                        :key="item.unitCode"
                        :label="item.unitName"
                        :value="item.unitCode"
                        :title="item.unitName">
              </el-option>
            </el-select>
          </a>
        </el-form-item>
      </div>
      <div v-if="form.userType === 1 && !updateFlag">
        <el-form-item label="关联人员">
          <el-switch v-model="setStaffInfo"></el-switch>
        </el-form-item>
        <div v-if="setStaffInfo">
          <el-form-item label="关联的人员" prop="relatedId">
            <el-select style="width: 180px;"
            v-model="form.relatedId"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            filterable
            remote
            reserve-keyword
            placeholder="输入人员名称进行搜索"
            :remote-method="remoteMethod"
            @change="backfillIdCard">
            <el-option
             v-for="item in options"
             :key="item.staffId"
             :label="item.name"
             :value="item.staffId">
             <span>{{ item.name }}</span> -
             <span>{{ item.unitName }}</span>
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号码" prop="idCard">
            <el-input v-model="form.idCard" :maxlength="18" readonly></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="form.age" readonly></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <el-input v-model="form.birthdate" readonly></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="form.sex" style="width: 200px;" disabled placeholder="">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" readonly></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" readonly></el-input>
          </el-form-item>
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
    props:{
     roleList: {
       type: Array,
     },
     updateFlag: {
       type: Boolean,
     },
     userLoading: {
       type: Boolean,
       default: false
     }
    },
    data() {
      return {
        loading: false,
        unitLoading: false,
        setStaffInfo: false,
        options: [],
        unitOptions: [],
        createLoginInfo: false,
        form: {
          name:'',
          sex: null,
          idCard: '',
          birthdate: '',
          age: '',
          roleIds: [],
          phone: '',
          email: '',
          username: '',
          password: '',
          checkPassword: '',
          userType: 1,
          employer: '',
          relatedId: '',
          unitId: '',
          unitCode: '',
          unitName: ''
        },
        rules: {
          unitCode: [{required: true, message: '请填写单位(必填)', trigger: 'blur'}],
          username: [{required: true, message: '请输入登录名(必填)', trigger: 'blur'}],
          name: [{required: true, message: '请输入用户名(必填)', trigger: 'blur'}],
          email: [{validator: this.validEmail, trigger: 'blur'}],
          phone: [{validator: this.validPhone, trigger: 'blur'}],
          idCard: [{validator: this.validID, trigger: 'change'}],
          relatedId: [{required: true, message: '请输入关联的人员(必填)', trigger: 'blur'}],
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
            name:'',
            idCard: '',
            sex: null,
            birthdate: '',
            age: '',
            deptName: '',
            job: '',
            phone: '',
            email: '',
            username: '',
            password: '',
            checkPassword: '',
            userType: 1,
            employer: '',
            relatedId: '',
            unitId: '',
            unitCode: '',
            unitName: ''
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
        this.form.sex = null;
        this.form.age = '';
        this.form.birthdate = ''; 
        let iden = this.form.idCard;
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
      initInfo() {
        this.form.relatedId = '';
        this.form.unitId = '';
        this.form.unitCode = '';
      },
      remoteMethod(query) {
        this.form.unitId = '';
        this.form.unitCode = '';
        if (query) {
          this.loading = true;
          //查询所有人员
          systemManagementApi.getStaff({"search": query}).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.options = res.body;
            this.loading = false;
          });
        } else {
         this.options = [];
        }
      },
      unitRemoteMethod(query) {
        this.form.relatedId = '';
        if (query) {
          this.unitLoading = true;
          //查询所有单位
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
      backfillUnitId(val) {
        this.form.unitId = this.unitOptions.filter(item => item.unitCode === val)[0].unitId;
        this.form.unitName = this.unitOptions.filter(item => item.unitCode === val)[0].unitName;
      },
      backfillIdCard(val) {
        this.form.idCard = '';
        this.form.phone = '';
        this.form.email = '';
        this.form.idCard = this.options.filter(item => item.staffId === val)[0].idCard;
        this.form.phone = this.options.filter(item => item.staffId === val)[0].phone;
        this.form.email = this.options.filter(item => item.staffId === val)[0].email;
      },
      //角色数量限制
      limitRoleNumber() {
        if(this.form.roleIds.length > 3){
          this.form.roleIds.pop();
          errorMsg("每人最多只能选择3个角色");
        }
      },
      showName(val){
        document.getElementById('showUnitName').title = val;
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
    .el-select__tags { 
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