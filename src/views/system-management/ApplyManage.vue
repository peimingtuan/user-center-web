<template>
    <div class="apply-manage">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-position="right" label-width="130px">
            <el-form-item label="系统名称" prop="systemNameValue">
                <el-input v-model.trim="form.systemNameValue"  placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item >
                <el-checkbox :true-label=1 :false-label=2 v-model="form.isPasswordComplexityCheck">弱口令校验</el-checkbox><br/>
                <el-checkbox :true-label=1 :false-label=2 v-model="form.isRealNameAuth">启用实名认证</el-checkbox>
            </el-form-item>
            <div class="title">短信平台配置</div>
            <el-form-item label="短信平台key" prop="smsApiKey">
                <el-input v-model="form.smsApiKey" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="短信平台密钥" prop="smsApiSec">
                <el-input v-model="form.smsApiSec" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="短信平台签名" prop="smsSign">
                <el-input v-model="form.smsSign" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <div class="title">登录方式</div>
            <el-form-item >
                <el-checkbox v-model="isPassword">账号密码登录</el-checkbox><br/>
                <el-checkbox v-model="isMobile">手机+验证码登录</el-checkbox>
            </el-form-item>
            <el-form-item label="用户注册协议">
                <el-input v-model="fileInput" class="upload-demo" readonly></el-input>
                <el-upload
                        ref="upload"
                        action=""
                        :file-list="fileList"
                        :show-file-list="false"
                        :http-request="uploadSectionFile"
                >
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item >
                <el-button class="saveInfo" type="primary" @click="saveInfo">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import * as api from "@/api/system-management/apply-manage-api"
    export default {
        name: "ApplyManage",
        components: {

        },
        data() {
            return {
                fileList:[],
                fileInput:'',
                form: {
                    systemName:'chnsys-ums',
                    systemNameValue:'',
                    isPasswordComplexityCheck:2,//是否启用密码复杂度检查1.启用 2.不启用
                    isRealNameAuth:2,//是否启用实名认证1.启用 2.不启用
                    loginWay:1,//登陆方式1.账号密码登陆2.手机验证码登陆3.两种登陆都支持
                    smsApiKey:'',//短信平台key
                    smsApiSec:'',//短息平台密钥s
                    smsSign:'',//短信平台签名
                },
                rules:{
                    systemNameValue:[{required:true,message:'请输入系统名称',trigger:'blur'}],
                    smsApiKey:[{required:true,message:'请输入短信平台key',trigger:'blur'}],
                    smsApiSec:[{required:true,message:'请输入短信平台密钥',trigger:'blur'}],
                    smsSign:[{required:true,message:'请输入短信平台签名',trigger:'blur'}]
                },
                isPassword:true,
                isMobile:true
            }
        },
        watch:{

        },
        computed:{
            loginWay(){
                if(this.isPassword&&this.isMobile){
                    return 3
                }else if(this.isPassword&&!this.isMobile){
                    return 1
                }else if(!this.isPassword&&this.isMobile){
                    return 2
                }else if(!this.isPassword&&!this.isMobile){
                    return 4
                }
            }
        },
        created() {
            this.selectConfig()
        },
        mounted() {

        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            //上传
            async uploadSectionFile(file){
                if(file.file.name.split(".").length>1){
                    let inputFile = file.file.name.split(".")[file.file.name.split(".").length - 1];
                    if(inputFile.toLowerCase()==='html'){
                        this.fileInput=file.file.name;
                        let params = new FormData()
                        params.append('file',file.file)
                        api.upload(params)
                    }else{
                        this.$msgW('必须上传html文件')
                    }
                }else{
                    this.$msgW('上传的文件格式不正确')
                }
            },
            //查询
            async selectConfig(){
                let res=await api.getConfig()
                if(res.body){
                    for(let i in res.body){
                        this.form[i]=res.body[i]
                    }
                    switch(this.form.loginWay){
                        case 1:
                            this.isPassword=true;
                            this.isMobile=false;
                            break;
                        case 2:
                            this.isPassword=false;
                            this.isMobile=true;
                            break;
                        default:
                            this.isPassword=true;
                            this.isMobile=true;
                    }
                }
            },
            //保存
            saveInfo(){
                this.$refs['ruleForm'].validate((valid)=>{
                    if(valid){
                        if(this.loginWay===4){
                            this.$msgW('请选择登录方式')
                            return false
                        }
                        this.form.loginWay=this.loginWay
                        api.saveConfig(this.form)
                    }else{
                        return false
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .apply-manage {
        padding:10px;
        .title{
            font-size:16px;
            margin-bottom:15px;
        }
    }
</style>
<style lang="less">
    .apply-manage{
        .el-form{
            .el-input{
                width:400px;
            }
            .saveInfo{
                width:100px;
            }
        }
    }
</style>