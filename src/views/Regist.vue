<template>
  <div class="regist-body">
    <div class="body-content">
      <div class="content-header">
        <div class="content-header-left">
          <img src="../assets/imgs/regist/fahui-blue.png" class="title_img" />
          <span style="color:#2F8DED;">用户中心慧审系统</span>
        </div>
        <div class="content-header-right">
          <span>已有账号,</span>
          <span class="backToLogin" @click="$router.go(-1)">马上登录 ></span>
        </div>
      </div>
      <div class="content-mid">
        <div class="content-mid-content" v-show="type">
          <span id="firstText" style="color:#2e8ded">用户注册协议</span>
          <img v-show="!isShowFirstArrow" src="../assets/imgs/regist/white.png" />
          <img v-show="isShowFirstArrow" src="../assets/imgs/regist/blue.png" />
          <span id="secondText" style="color:#dcdfe6">注册信息</span>
          <img v-show="!isShowSecondArrow" src="../assets/imgs/regist/white.png" />
          <img v-show="isShowSecondArrow" src="../assets/imgs/regist/blue.png" />
          <span v-show="isRealNameAuth===1" id="thirdText" style="color:#dcdfe6">实名认证</span>
          <img v-show="!isShowThirdArrow&&isRealNameAuth===1" src="../assets/imgs/regist/white.png" />
          <img v-show="isShowThirdArrow&&isRealNameAuth===1" src="../assets/imgs/regist/blue.png" />
          <span id="fourthText" style="color:#dcdfe6">注册成功</span>
        </div>
      </div>
      <div class="content-body">
        <div class="content-body-first" v-show="registStepFirst">
          <div class="content-body-first-protocol" v-html="bodyMessage"></div>
          <div class="acceptProtocol" v-show="type">
            <el-button type="primary" size="medium" @click.native="acceptProtocolAction">接受</el-button>
          </div>
          <div class="acceptProtocol" v-show="!type">
            <el-button type="primary" size="medium" @click.native="()=>{$router.go(-1)}">确定</el-button>
          </div>
        </div>
        <div class="content-body-second" v-show="registStepSecond">
          <div class="content-body-second-registion">
            <el-form
              :model="registData"
              :rules="rules"
              ref="RegistForm"
              size="medium"
              style="height:100%"
              label-position="left"
              label-width="80px"
            >
              <el-form-item label="姓名" prop="name" class="red-label">
                <el-input v-model.trim="registData.name" maxlength="32" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item label="登录名" prop="username" class="red-label">
                <el-input v-model.trim="registData.username" maxlength="32" placeholder="登录名"></el-input>
              </el-form-item>
              <el-form-item label="登录密码" prop="password" class="red-label">
                <el-input v-model.trim="registData.password" type="password" placeholder="登录密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model.trim="registData.checkPass" placeholder="确认登录密码"></el-input>
              </el-form-item>
              <!--<el-form-item label="户籍地址" prop="address">-->
                <!--<china-address v-model="addressCodeList" @change="addressChange"></china-address>-->
                <!--<div class="el-input-box">-->
                  <!--<el-input  v-model.trim="registData.address" placeholder="详细地址"></el-input>-->
                <!--</div>-->
              <!--</el-form-item>-->
              <el-form-item label="手机号码" prop="phone" class="red-label">
                <el-input v-model.trim="registData.phone" maxlength="11" placeholder="手机号码"></el-input>
              </el-form-item>
              <el-form-item label="电子邮件" prop="email" class="red-label">
                <el-input v-model.trim="registData.email"  placeholder="电子邮件"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="code" class="red-label">
                <el-input style="width:100px;float: left;" maxlength="6" v-model.trim="registData.code" placeholder="验证码"></el-input>
                <el-button type="primary" class="btn-verificationCode" :disabled="showCount?true:false" @click="getCode(registData.phone)" style="width:120px!important;float: right;padding: 10px 0px;">{{getCodeBtnText}}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="nextStep">
            <el-button type="primary" class="btn-verificationCode" @click.native="backStepAction">上一步</el-button>
            <el-button type="primary" @click.native="nextStepAction">下一步</el-button>
          </div>
        </div>
        <div class="content-body-third" v-show="registStepThird">
          <div class="content-body-third-registion">
            <div class="main-registion" v-if="realnameSuccess">
                <div>
                  <img src="../assets/imgs/regist/qcode.png" /><br/><br/>
                  请用微信客户端扫码验证
                </div>
            </div>
            <div v-else class="main-registion-fail">
              <!--<div class="title">实名认证失败</div>-->
              <el-form
                      :model="realParam"
                      ref="elForm"
                      :rules="rules2"
                      label-position="right"
                      label-width="100px"
              >
                <el-form-item label="姓名" prop="name" class="red-label">
                  <el-input  v-model.trim="realParam.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="证件号码" prop="idCard" class="red-label">
                  <el-input  v-model.trim="realParam.idCard" placeholder="证件号码"></el-input>
                </el-form-item>
                <!--<el-form-item label="身份证上传" class="red-label">-->
                  <!--<div class="photo-card-box">-->
                    <!--<div class="img-box">-->
                      <!--<div>-->
                        <!--<el-upload-->
                                <!--class="avatar-uploader"-->
                                <!--action=""-->
                                <!--:show-file-list="false"-->
                                <!--:http-request="uploadSectionFile"-->
                        <!--&gt;-->
                          <!--<img v-if="idCardPositiveFile" :src="idCardPositiveFile" class="avatar-img">-->
                          <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                        <!--</el-upload>-->
                      <!--</div>-->
                      <!--<div>请上传身份证正面</div>-->
                    <!--</div>-->
                    <!--<div class="img-box">-->
                      <!--<div>-->
                        <!--<el-upload-->
                                <!--class="avatar-uploader"-->
                                <!--action=""-->
                                <!--:show-file-list="false"-->
                                <!--:http-request="uploadSectionFile2"-->
                        <!--&gt;-->
                          <!--<img v-if="idCardNegativeFile" :src="idCardNegativeFile" class="avatar-img">-->
                          <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                        <!--</el-upload>-->
                      <!--</div>-->
                      <!--<div>请上传身份证反面</div>-->
                    <!--</div>-->
                    <!--<div>-->
                      <!--<div><i class="el-icon-warning"></i>请上传身份证照片支持jpg/jpeg/png等类型(5M以内)</div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</el-form-item>-->
                <el-form-item label="人脸正面照上传" class="red-label">
                  <div class="id-card-box">
                    <div class="img-box">
                      <div>
                        <el-upload
                                class="avatar-uploader"
                                action=""
                                :show-file-list="false"
                                :http-request="uploadSectionFile3"
                        >
                          <img v-if="authPicFile" :src="authPicFile" class="avatar-img">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </div>
                      <div>请上传人脸正面照</div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="图例">
                    <img src="../assets/imgs/regist/shiL.png" />
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="nextStep">
            <el-button type="primary" class="btn-verificationCode" @click.native="backTwoStepAction">上一步</el-button>
            <el-button type="primary" @click.native="nextFourthStepAction">下一步</el-button>
          </div>
        </div>
        <div class="content-body-fourth" v-show="registStepFourth">
          <div></div>
          <div class="content-body-third-image">
            <img src="../assets/imgs/regist/success.png" />
            <span style="font-size:19px; margin-top:20px;">注册成功</span>
          </div>
          <el-button type="primary" @click.native="$router.go(-1)">返回登录界面</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {isMobile,isEmail,isName,isCardId} from "@/assets/js/tools"
  import {isMobile as telPhone} from "@/assets/js/validator"
  import * as api from "@/api/regist-api"
  import md5 from 'js-md5'
export default {
  name: "Regist",
  data() {
    return {
      authPicFile:'',//人脸照片
      idCardPositiveFile:"",//身份证正面照
      idCardNegativeFile:'',//身份证反面照
      type: false, //false为仅查看注册协议、true为走注册流程
      bodyMessage:'',//msg.userProtocolContent
      isShowFirstArrow: false,
      isShowSecondArrow: false,
      isShowThirdArrow:false,
      registStepFirst: true,
      registStepSecond: false,
      registStepThird: false,
      registStepFourth: false,
      registData: {
        name:'',
        username:"",
        password:'',
        checkPass:'',
        phone:'',
        email:'',
        code:'',
        //address:'',
        //addressCode:''
      },
      realParam:{
        name:'',//姓名
        idCard:'',//身份证号
        authPicFile:'',//人脸照片
        //idCardPositiveFile:"",//身份证正面照
        //idCardNegativeFile:'',//身份证反面照
      },
      addressCodeList:[],
      realnameSuccess:false,//是否认证成功
      rules:{
        name:[
          {
            validator: isName,
            trigger: "blur",
          },
        ],
        username:[
          {
            validator: (rule,value,callback)=>{
              if(!value){
                callback(new Error('请输入登录名'))
              }else{
                callback()
              }
            },
            trigger: "blur",
          }
        ],
        password:[
          {
            validator:(rule,value,callback)=>{
              if(!value){
                callback(new Error('请输入密码'))
              }else if(this.isPasswordComplexityCheck===1&&!new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{9,30}').test(value)){//9-30位，必须包含字母，数字
                callback('密码长度9-30位字符，且包含字母和数字')
              }else{
                if (this.registData.checkPass !== '') {
                  this.$refs.RegistForm.validateField('checkPass');
                }
                callback()
              }
            },
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            validator: (rule,value,callback)=>{
              if(!value){
                callback(new Error('请再次输入密码'))
              }else if(value !== this.registData.password){
                callback('两次输入密码不一致!')
              }else{
                callback()
              }
            },
            trigger: 'blur' }
        ],
        address:[
          {required: true, message:'请输入地址', trigger: "blur"}
        ],
        phone:[
          {validator:isMobile, trigger: "blur"}
        ],
        email:[
          {required: true, message:'请输入电子邮件',trigger: "blur"},
          {validator:isEmail, trigger: "blur"}
        ],
        code:[
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入验证码'));
              }else if(value.length!==6){
                callback(new Error('请输入正确的验证码'));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ]
      },
      rules2:{
        name:[{validator: isName, trigger: "blur"}],
        idCard:[{required: true, message:'请输入证件号码', trigger: "blur"}, {validator:isCardId, trigger:'blur'}],
      },
      showCount:false,
      count:60,
      codeId:'',//验证码校验id
      isPasswordComplexityCheck:1,//密码复杂度校验
      isRealNameAuth:2,//是否实名认证
    };
  },
  components: {
    chinaAddress:()=>import("@/components/chinaAddress")
  },
  computed:{
    getCodeBtnText(){
      if(this.count === 60){
        return '获取验证码'
      }else{
        return '获取验证码('+this.count+'s)'
      }
    },
  },
  watch: {},
  created() {
    // 来源 1查看；2走注册流程
    const { type } = this.$route.query;
    if (type == 1) {
      this.type = false;
    } else {
      this.type = true;
    }
    this.isRealNameSwitch(type)
  },
  mounted() {

  },
  methods: {
    //判断是否开启实名认证
    async isRealNameSwitch(type){
      let result=await api.agreement()
      this.bodyMessage=result.body.registerAgreement
      if(type==2){
        let res=await api.realNameSwitch()
        this.isRealNameAuth=res.body.isRealNameAuth
      }
    },
    //上传图片
    uploadSectionFile(file){
      let that=this
      that.realParam.idCardPositiveFile=file.file
      let fr = new FileReader();
      fr.readAsDataURL(file.file);
      fr.onload = function (e) {
        that.idCardPositiveFile =fr.result
      }
    },
    uploadSectionFile2(file){
      let that=this
      that.realParam.idCardNegativeFile=file.file
      let fr = new FileReader();
      fr.readAsDataURL(file.file);
      fr.onload = function (e) {
        that.idCardNegativeFile =fr.result
      }
    },
    uploadSectionFile3(file){
      let that=this
      that.realParam.authPicFile=file.file
      let fr = new FileReader();
      fr.readAsDataURL(file.file);
      fr.onload = function (e) {
        that.authPicFile =fr.result
      }
    },
    //获取验证码
    async getCode(phone){
      if(phone){
        if (!telPhone(phone)) {
          this.$msgW('请输入正确手机号')
          return
        }
      }else{
        this.$msgW('请输入手机号')
        return
      }
      if (this.showCount)return
      this.countDown()
      let res=await api.getCode(phone)
      this.codeId=res.body.codeId;
    },
    countDown(){
      this.showCount = true
      let s = 60
      const _this = this;
      this.timer&&clearInterval(this.timer)
      this.timer = setInterval(()=>{
        s--;
        if(s==0){
          clearInterval(this.timer)
          _this.showCount = false;
          s = 60;
        }
        _this.count = s
      },1000)
    },
    //我接受
    async acceptProtocolAction() {
      this.registStepSecond = true;
      this.registStepFirst = false;
      this.isShowFirstArrow = true;
      document.getElementById("secondText").style.color = "#2e8ded";
      //验证密码复杂度校验
      let res=await api.passwordCheck()
      this.isPasswordComplexityCheck=res.body.isPasswordComplexityCheck
    },
    //注册的上一步
    backStepAction() {
      this.registStepSecond = false;
      this.registStepFirst = true;
      this.isShowFirstArrow = false;
      document.getElementById("secondText").style.color = "#dcdfe6";
    },
    //注册的下一步
    nextStepAction(){
      this.$refs["RegistForm"].validate((valid) => {
          if (valid) {
            this.goRegist(this.registData)
          } else {
            return false;
          }
      });
    },
    //注册
    async goRegist(registData){
      if(this.isRealNameAuth===1){
        this.realParam.name=registData.name
        this.registStepThird = true;
        this.registStepSecond = false;
        this.isShowSecondArrow = true;
        document.getElementById("thirdText").style.color = "#2e8ded";
      }else{
        await api.checkCode(registData.phone,registData.code,this.codeId)
        let param=JSON.parse(JSON.stringify(registData))
        param.password=md5(registData.password)
        await api.goRegist(param)
        this.isShowSecondArrow = true;
        this.registStepSecond = false;
        this.registStepFourth = true;
        this.registStepThird = false;
        this.isShowThirdArrow = true;
        document.getElementById("fourthText").style.color = "#2e8ded";
      }
    },
    //实名的上一步
    backTwoStepAction(){
      this.registStepThird = false;
      this.registStepSecond = true;
      this.isShowSecondArrow = false;
      document.getElementById("thirdText").style.color = "#dcdfe6";
    },
    //实名认证的下一步
    nextFourthStepAction(){
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          this.realName()
        } else {
          return false;
        }
      });
    },
    //实名
    async realName(){
      // if(!this.idCardPositiveFile){
      //   this.$msgW('请上传身份证正面照')
      //   return
      // }
      // if(!this.idCardNegativeFile){
      //   this.$msgW('请上传身份证反面照')
      //   return
      // }
      if(!this.authPicFile){
        this.$msgW('请上传人脸照片')
        return
      }
      let params = new FormData()
      for(let i in Object.assign(this.registData,this.realParam)){
          if(i==='password')params.append(i,md5(this.registData[i]))
          else params.append(i,this.registData[i])
      }
      let res=await api.certification(params)
      //if(res.body&&res.body.userId)sessionStorage.setItem('userId',res.body.userId)
      this.registStepFourth = true;
      this.registStepThird = false;
      this.isShowThirdArrow = true;
      document.getElementById("fourthText").style.color = "#2e8ded";
    },
    addressChange(val){
      this.registData.address = val.provinceCode ? val.provinceName + val.cityName + val.countryName : "";
      this.registData.addressCode = val.provinceCode ? this.addressCodeList.join("-") : "";
      //console.log(this.registData.address,800,this.registData.addressCode)
    }
  }
};
</script>

<style lang="less">
  @import "../assets/css/common.less";
.regist-body {
  width:100vw;
  height:100vh;
  min-width: 1336px;
  min-height: 668px;
  background-image: url("../assets/imgs/bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .body-content {
    height: 85%;
    width: 70%;
    min-width:1000px;
    margin: 0 auto;
    overflow: hidden;
    background-repeat: no-repeat;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .content-header {
      height: 10%;
      width: 95%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .content-header-left {
        height: 100%;
        width: 160px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .content-header-right {
        .backToLogin {
          cursor: pointer;
          color: #2e8ded;
        }
      }
    }
    .content-mid {
      height: 10%;
      width: 95%;
      .content-mid-content {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .content-body {
      height: 80%;
      width: 95%;
      .content-body-first {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .content-body-first-protocol {
          height: 90%;
          width: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          white-space: pre-wrap;
          padding: 0 42px 20px 42px;
          font-size: 1.2rem;
          margin: 0 auto;
        }
        .acceptProtocol {
          height: 10%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .content-body-second {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .content-body-second-registion {
          width:100%;
          height:90%;
          display: flex;
          justify-content: center ;
          align-items: center;
          overflow-y: scroll;
          .el-form {
            /*flex-wrap: wrap;*/
            .el-input,.el-select{
              width:250px;
            }
            .el-form-item__label{
              width:120px!important;
            }
            .el-form-item__content{
              margin-left:120px!important;
            }
            .el-form-item {
              margin-top: 12px;
              /*margin-bottom: 10px;*/
            }
            .el-input-box{
              margin-top:5px;
              .el-input{
                width:400px;
              }
            }
            .el-button{
              width:100px!important;
              float:left!important;
              margin-left:30px;
            }
          }
        }
        .nextStep {
          width: 500px;
          display: flex;
          justify-content: space-between;
        }
        .btn-verificationCode {
          background-color: #ffffff;
          span{
            color: #2e8ded;
          }
        }
      }
      .content-body-third{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .content-body-third-registion{
          /*padding-top: 1.25rem;*/
          width:100%;
          height: 90%;
          overflow: auto;
          .main-registion{
            .fc();
            &>div{
              text-align: center;
            }
          }
          .main-registion-fail{
            .title{
              margin-bottom:20px;
              font-size:16px;
              color:red;
              text-align: center;
            }
            .el-form{
              width: 520px;
              margin: 0 auto;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
              &>div{
                width:100%;
              }
              .el-input,.el-select{
                width:250px;
              }
            }
            .photo-card-box {
              .fl();
              flex-wrap: wrap;
              &>div{
                width:200px;
                height:150px;
              }
              &>div.img-box{
                &>div:nth-child(1){
                  display: flex;
                  display: -webkit-flex; /* Safari */
                  justify-content:space-around;
                  align-items: center;
                  .el-upload{
                    width:150px;
                    height:100px;
                    .avatar-img{
                      width:100%;
                      height:100%;
                    }
                  }
                }
                &>div:nth-child(2){
                  text-align: center;
                  line-height:40px;
                }
              }
              &>div:nth-child(3){
                width:100%;
                height:20px;
                &>div{
                  padding:10px;
                  i{
                    color:#f76b6a;
                    .f16();
                  }
                  line-height: normal;
                  color:#f76b6a;
                }
              }
            }
            .id-card-box{
              div.img-box{
                width:200px;
                height:150px;
                &>div:nth-child(1){
                  display: flex;
                  display: -webkit-flex; /* Safari */
                  justify-content:space-around;
                  align-items: center;
                  .el-upload{
                    width:150px;
                    height:100px;
                    .avatar-img{
                      width:100%;
                      height:100%;
                    }
                  }
                }
                &>div:nth-child(2){
                  text-align: center;
                  line-height:40px;
                }
              }
            }
          }
        }
        .nextStep {
          width:400px;
          display: flex;
          justify-content: space-between;
        }
        .btn-verificationCode {
          background-color: #ffffff;
          span{
            color: #2e8ded;
          }
        }
      }
      .content-body-fourth {
        height: 80%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .content-body-third-image {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
    }
  }
}
</style>