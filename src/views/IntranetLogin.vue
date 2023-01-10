<template>
    <div class="intranet-login">
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
                <div class="login-box-right-title">账号登录</div>
                <el-form
                        class="form"
                        :model="loginForm"
                        ref="loginForm"
                        :rules="rules"
                >
                    <div class="form-title">单位选择</div>
                    <el-form-item prop="unitId">
                        <el-select
                                class="login-sel-input"
                                v-model="loginForm.unitId"
                                filterable
                                clearable
                                placeholder="请选择单位">
                            <el-option
                                    v-for="item in unitList"
                                    :key="item.unitId"
                                    :label="item.unitName"
                                    :value="item.unitId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="form-title">账号</div>
                    <el-form-item prop="username">
                        <el-input
                                class="login-sel-input"
                                placeholder="请输入账号"
                                type="text"
                                v-model.trim="loginForm.username"
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
                                v-model.trim="loginForm.password"
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
                                @click="login(loginForm)"
                        >
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {getUnits,goLogin} from "@/api/intranet-login-api"
    import FoundationTools from '@/assets/js/function-ajax'
    import md5 from 'js-md5'
    import {mapMutations} from "vuex"
    import {systemLeftMenu} from "@/api/common-api"
    import titleMenuList from "@/assets/js/index-main/title-menu"
    import systemMenuList from "@/assets/js/system-management/left-menu"
    import {getConfig as selectSysName} from "@/api/system-management/apply-manage-api"
    export default {
        name: "IntranetLogin",
        data() {
            let checkUnitCode=(rule,value,callback)=>{
                if(!value){
                     callback(new Error('请选择法院'));
                }else{
                    callback()
                }
            };
            let checkUserName = (rule, value, callback) => {
                if (!value) {
                     callback(new Error('请输入账号'));
                }else{
                    callback()
                }
            };
            let checkPassword = (rule, value, callback) => {
                if (!value) {
                     callback(new Error('请输入密码'));
                }else{
                    callback()
                }
            };
            return {
                unitList:[],
                loginForm: {
                    unitId:'',
                    username: "",
                    password: "",
                    rememberMe: false,
                },
                rules: {
                    // unitId:[
                    //     {
                    //         validator:checkUnitCode,
                    //         trigger: "change",
                    //     }
                    // ],
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
            }
        },
        computed:{
            userId(){
                return this.$store.state.userId
            }
        },
        created() {
        },
        mounted() {
            sessionStorage.setItem('loginType',2)//记录登录来源
            this.getUnitsData()
            let that = this;
            document.onkeydown = function(e) {
                let key = window.event.keyCode;
                if (key === 13) {
                    that.login();
                }
            }
        },
        updated() {
        },
        beforeDestroy() {
            document.onkeydown=null
        },
        methods: {
            ...mapMutations("indexmain", ["setTopActiveAd"]),
            //获取单位
            async getUnitsData(){
                let res=await getUnits()
                if(res&&res.body)this.unitList=res.body
                else this.unitList=[]
                if(FoundationTools.getCookie('userInfo2')){
                    let userInfo=JSON.parse(FoundationTools.getCookie('userInfo2'));
                    if(userInfo.rememberMe) Object.assign(this.loginForm,userInfo)
                }
            },
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
                let res=await goLogin(param)
                let token=res.body.token;
                localStorage.setItem('tokenKey',token)
                this.$store.commit('setUserId',res.body.userId)
                FoundationTools.setCookie('userInfo2',JSON.stringify(loginForm),14)//存储用户信息
                this.powerConfig()
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
                systemMenuList.map((item,index)=>{
                    for(let i=0;i<res.body.length;i++){
                        if(item.moduleCode===res.body[i].moduleCode){
                            item.name=res.body[i].moduleName
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
    .intranet-login {
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
                &-title{
                    text-align: center;
                    line-height:50px;
                    color:#409EFF;
                    border-bottom:2px solid #409EFF;
                }
                .form{
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
                }
                .rememberMe {
                    margin-bottom:10px;
                }
            }
        }
    }
</style>
<style lang="less">
    .intranet-login{
        .el-select{
            width:100%;
        }
    }
</style>