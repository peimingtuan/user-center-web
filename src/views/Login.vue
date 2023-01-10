<template>
    <div class="login">
        <div class="login-box">
            <div class="login-box-left">
                <div class="login-box-left-top">
                    <img  src="../assets/imgs/fahui-white.png" />
                </div>
                <div class="login-box-left-bot">
                    XX法院统一工作平台
                </div>
            </div>
            <div class="login-box-right">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="账号登录" name="first" v-if="typeWay!=2">
                        <el-form
                                class="form"
                                :model="loginForm"
                                ref="loginForm"
                                :rules="rules"
                        >
                            <div class="form-title">账号</div>
                            <el-form-item prop="username">
                                <el-input
                                        class="login-sel-input"
                                        placeholder="请输入账号"
                                        type="text"
                                        v-model="loginForm.username"
                                        prefix-icon="el-icon-user"
                                >
                                </el-input>
                            </el-form-item>
                            <div class="form-title">密码</div>
                            <el-form-item prop="password">
                                <el-input
                                        class="login-sel-input"
                                        placeholder="请输入密码"
                                        type="password"
                                        v-model="loginForm.password"
                                        prefix-icon="el-icon-lock"
                                        @keyup.enter.native="login()"
                                >
                                </el-input>
                            </el-form-item>
                            <el-checkbox
                                    class="rememberMe"
                                    v-model="loginForm.rememberMe"
                            >记住密码</el-checkbox
                            >
                            <el-form-item>
                                <el-button
                                        class="login-enter"
                                        type="primary"
                                        style="width: 100%;"
                                        @click="login()"
                                >
                                    登录
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="手机验证码登录" name="second"  v-if="typeWay!=1">
                        <el-form
                                class="content-back-right-form"
                                :model="loginData"
                                :rules="loginRules"
                                ref="loginData"
                        >
                            <div class="form-title">手机号</div>
                            <el-form-item prop="phone">
                                <el-input
                                        id="phoneNumber"
                                        v-model.trim="loginData.phone"
                                        maxlength="11"
                                        placeholder="请输入注册时使用的手机号"
                                ></el-input>
                            </el-form-item>
                            <div class="form-title">短信验证码</div>
                            <el-form-item prop="code">
                                <el-input
                                        id="verificationCode"
                                        style="width: 55%;float:left;"
                                        maxlength="6"
                                        v-model.trim="loginData.code"
                                        placeholder="请输入验证码"
                                ></el-input>
                                <el-button
                                        type="primary"
                                        class="btn-verificationCode"
                                        :disabled="showCount"
                                        style="width: 43%;float: right;padding: 12px 0px;"
                                        @click="getCode(loginData.phone)"
                                >{{getCodeBtnText}}</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                        type="primary"
                                        style="width: 100%;"
                                        @click="phoneLogin(loginData)"
                                >
                                    登录
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
                <div class="regist-back">
                    未注册用户,请先注册,查看
                    <span @click="goRegist(1)">《注册协议》</span>
                </div>
                <div class="login-box-right-bot">
                    <span @click="goRegist(2)">我要注册 >></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {isMobile} from "@/assets/js/tools"
    import {isMobile as phoneNumber} from "@/assets/js/validator"
    import * as api from "@/api/login-api"
    import FoundationTools from '@/assets/js/function-ajax'
    import md5 from 'js-md5'
    import {mapMutations} from "vuex"
    import {systemLeftMenu} from "@/api/common-api"
    import titleMenuList from "@/assets/js/index-main/title-menu"
    import systemMenuList from "@/assets/js/system-management/left-menu"
    import {getConfig as selectSysName} from "@/api/system-management/apply-manage-api"
    export default {
        name: "Login",
        data() {
            let checkUserName = (rule, value, callback) => {
                if (!value) {
                     callback(new Error('请输入账号'));
                }else{
                    callback()
                }
            };
            let checkPassword = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入密码'));
                }else{
                    callback()
                }
            };
            return {
                activeName: 'first',
                loginForm: {
                    username:"",
                    password:"",
                    unitId:"",
                    rememberMe: false,
                },
                rules: {
                    username: [
                        {
                            validator: checkUserName,
                            trigger: "blur",
                        },
                    ],
                    password: [
                        {
                            validator: checkPassword,
                            trigger: "blur",
                        },
                    ],
                },
                loginData:{
                    phone:null,
                    code:null,
                },
                loginRules:{
                    phone:[
                        {
                            validator: isMobile,
                            trigger: "blur",
                        },
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
                showCount:false,
                count: 60,
                codeId:'',//验证码校验id
                typeWay:3,//登录方式
            }
        },
        computed:{
            getCodeBtnText(){
                if(this.count === 60){
                    return '获取验证码'
                }else{
                    return '获取验证码('+this.count+'s)'
                }
            },
            userId(){
                return this.$store.state.userId
            }
        },
        created() {
            this.getLoginWay()
        },
        mounted() {
            sessionStorage.setItem('loginType',1)//记录登录来源
            let that = this;
            document.onkeydown = function(e) {
                let key = window.event.keyCode;
                if (key === 13) {
                    if(that.activeName==='first')that.login();
                }
            }
            if(FoundationTools.getCookie('userInfo')){
                let userInfo=JSON.parse(FoundationTools.getCookie('userInfo'));
                if(userInfo.rememberMe) Object.assign(this.loginForm,userInfo)
            }
        },
        updated() {
        },
        beforeDestroy() {
            document.onkeydown=null
        },
        methods: {
            ...mapMutations("indexmain", ["setTopActiveAd"]),
            //获取登录方式
            async getLoginWay(){
                let res=await api.loginWay()
                this.typeWay=res.body.loginWay;
                if(this.typeWay==2)this.activeName='second'
            },
            //注册
            goRegist(num){
                this.$router.push({
                    path:'/Regist',
                    query:{
                        type:num
                    }
                })
            },
            //账号登录
            login(){
                this.$refs["loginForm"].validate((valid) => {
                    if (valid) {
                        this.loginMethod(this.loginForm)
                    } else {
                        return false;
                    }
                });
            },
            async loginMethod(loginForm){
                let param=JSON.parse(JSON.stringify(loginForm))
                param.password=md5(param.password)
                let res=await api.goLogin(param)
                let token=res.body.token;
                localStorage.setItem('tokenKey',token)
                this.$store.commit('setUserId',res.body.userId)
                FoundationTools.setCookie('userInfo',JSON.stringify(loginForm),14)//存储用户信息
                this.powerConfig()
            },
            //获取验证码
            async getCode(phone){
                if(phone){
                    if (!phoneNumber(phone)) {
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
            //手机号登录
            async phoneLogin(loginData){
                    this.$refs["loginData"].validate((valid) => {

                    });
                    if(loginData.phone&&loginData.code){
                        await api.checkCode(loginData.phone,loginData.code,this.codeId)
                        let res=await api.phoneLogin({phone:loginData.phone})
                        if(res.body&&res.body.token){
                            let token=res.body.token;
                            localStorage.setItem('tokenKey',token)
                            this.$store.commit('setUserId',res.body.userId)
                        }
                        this.powerConfig()
                    }
            },
            //权限
            async powerConfig(){
                let res=await systemLeftMenu(this.userId)
                let titleList=[],systemList=[];
                //顶部菜单
                let isBo=false
                for(let i=0;i<res.body.length;i++){
                    if(res.body[i].moduleCode==='ums_system'){
                        isBo=true
                        break;
                    }
                }
                if(!isBo)titleList=[titleMenuList[0],titleMenuList[2]]//titleMenuList.splice(1, 1)
                else titleList=titleMenuList
                //系统管理左侧菜单
                systemMenuList.map(item=>{
                    for(let i=0;i<res.body.length;i++){
                        if(item.moduleCode===res.body[i].moduleCode){
                            item.name=res.body[i].moduleName
                            if(i===0&&isBo)titleList[1].url=item.url
                            systemList.push(item)
                            break;
                        }
                    }
                })
                if(isBo)titleList[1].url=systemList[0].url
                let result=await selectSysName()//获取系统名称
                if(result.body){
                    this.$store.commit('setSystemNameValue',result.body.systemNameValue)
                }
                this.$store.commit('setTitleMenuList',titleList)
                this.$store.commit('setSystemLeftMenuList',systemList)
                //日志管理左侧菜单
                this.setTopActiveAd(0);
                this.$router.push({path:'/indexMain/HomePage'})
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "../assets/css/common.less";
    .login {
        width:100vw;
        height:100vh;
        min-width: 1336px;
        min-height: 668px;
        background-image: url("../assets/imgs/bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        .fc();
        .login-box{
            height: 60%;
            width: 50%;
            min-width: 600px;
            min-height: 350px;
            max-height: 500px;
            margin: 0;
            overflow: hidden;
            background-repeat: no-repeat;
            background-color: rgba(255,255,255,.3);
            border-radius: 10px;
            .fl();
            &>div{
                width: 50%;
                min-width: 300px;
                height: 100%;
                margin: 0;
                overflow: hidden;
            }
            &-left{
                &>div{
                    .fc()
                }
                &-top{
                    height:50%;
                    align-items:flex-end!important;
                }
                &-bot{
                    height:50%;
                    font-size:25px;
                    color:#fff;
                }
                /*background-color: rgba(255,255,255,0);*/
            }
            &-right{
                position:relative;
                background:#fff;
                .content-back-right-form,.form{
                    margin:10px 10% 0;
                    position: relative;
                    width:80%;
                    .el-form-item {
                        margin-bottom: 16px;
                    }
                    .form-title {
                        text-align: left;
                        font-size: 13px;
                        margin:2px 0 5px;
                    }
                    .btn-verificationCode {
                        background-color: #ffffff;
                    }
                }
                .rememberMe {
                    margin-bottom:10px;
                }
                .regist-back{
                    text-align: right;
                    margin:0 10%;
                    span{
                        color:#2e8ded;
                        cursor: pointer;
                    }
                }
                &-bot{
                    width:100%;
                    position:absolute;
                    left:0;
                    bottom:10px;
                    text-align: center;
                    span{
                        cursor:pointer;
                    }
                }
            }
        }
    }
</style>
<style lang="less">
    .login{
        .el-tabs{
            .el-tabs__nav{
                width:100%;
                text-align: center;
            }
            #tab-first,#tab-second{
                width:50%;
            }
        }
        .btn-verificationCode{
            span{
                color: #2e8ded;
            }
        }
    }
</style>