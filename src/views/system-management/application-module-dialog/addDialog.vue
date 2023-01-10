<template>
    <dialog-show
            :title="title"
            ref="dialogShow"
            :class="title==='添加应用'|| title==='修改应用'?'':'application-module-width'"
            @cancel="cancel"
            @saveInfo="saveInfo">
            <template slot="main-body">
                <div class="application-module-dialog">
                    <el-form
                            v-if="title==='添加应用'|| title==='修改应用'"
                            :model="form"
                            :rules="rules"
                            label-position="right"
                            ref="ruleForm" >
                        <el-form-item label="应用名称" prop="appName">
                            <el-input  v-model.trim="form.appName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="应用代码" prop="appCode">
                            <el-input  v-model.trim="form.appCode" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="应用URL地址" prop="appAddr">
                            <el-input  v-model.trim="form.appAddr" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="图标">
                            <div class="img-box">
                                <el-upload
                                        class="avatar-uploader"
                                        action=""
                                        :show-file-list="false"
                                        :http-request="handleAvatarSuccess"
                                >
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar-img">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="应用描述">
                            <el-input type="textarea" maxlength="200" style="width: 450px;" :rows="4" v-model="form.appDesc" placeholder="...... 200字以内"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form
                            v-else
                            :model="form"
                            :rules="rules2"
                            label-position="right"
                            ref="ruleForm2" >
                        <el-form-item label="应用名称">
                            <el-input  v-model.trim="form.appName" autocomplete="off" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="模块名称" prop="moduleName">
                            <el-input  v-model.trim="form.moduleName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="模块代码" prop="moduleCode">
                            <el-input  v-model.trim="form.moduleCode" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="模块URL地址" prop="moduleAddr">
                            <el-input  v-model.trim="form.moduleAddr" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="模块类型">
                            <el-select
                                    v-model="form.moduleType"
                                    placeholder="请选择">
                                <el-option
                                        v-for="item in moduleTypeList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否支持数据权限">
                            <el-select
                                    v-model="form.supportPower"
                                    placeholder="请选择">
                                <el-option
                                        v-for="item in selectList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="模块图标">
                            <div class="img-box">
                                <el-upload
                                        class="avatar-uploader"
                                        action=""
                                        :show-file-list="false"
                                        :http-request="handleAvatarSuccess"
                                >
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar-img">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="模块选中图标">
                            <div class="img-box">
                                <el-upload
                                        class="avatar-uploader"
                                        action=""
                                        :show-file-list="false"
                                        :http-request="handleAvatarSuccess2"
                                >
                                    <img v-if="imageUrl2" :src="imageUrl2" class="avatar-img">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="模块描述">
                            <el-input type="textarea" maxlength="200" style="width: 450px;" :rows="4" v-model="form.moduleDesc" placeholder="...... 200字以内"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
    </dialog-show>
</template>

<script>
    import * as api from "@/api/system-management/application-module-api"
    export default {
        name: "EditPasswordDialog",
        components:{
            dialogShow:()=>import("@/components/dialog")
        },
        data() {
            return {
                title:'添加应用',
                imageUrl:'',
                imageUrl2:'',
                form: {},
                rules: {
                    appName: [{required:true,message:'请输入应用名称',trigger:'blur' }],
                    appCode:[{required:true,message:'请输入应用代码',trigger:'blur' }],
                    appAddr: [{required:true,message:'请输入应用URL地址',trigger:'blur'}],
                },
                rules2:{
                    moduleName: [{required:true,message:'请输入模块名称',trigger:'blur' }],
                    moduleAddr: [{required:true,message:'请输入模块URL地址',trigger:'blur'}],
                    moduleCode:[{required:true,message:'请输入模块代码',trigger:'blur' }]
                },
                moduleTypeList:[{id:1,name:'菜单模块'},{id:2,name:'操作模块'}],
                isUpload:1,//默认上传
                isUpload2:1,
                isUpload3:1
            }
        },
        computed:{
          selectList(){
              return this.$store.state.selectList
          }
        },
        created() {
        },
        mounted() {
        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            //取消
            cancel(){
                if(this.$refs['ruleForm'])this.$refs['ruleForm'].resetFields();
                if(this.$refs['ruleForm2'])this.$refs['ruleForm2'].resetFields();
            },
            handleAvatarSuccess(file){
                let that=this
                if(this.title==='添加应用'|| this.title==='修改应用'){
                    that.form.appLogoFile=file.file
                    that.isUpload=1
                }else{
                    that.form.moduleLogoFile=file.file
                    that.isUpload2=1
                }
                let fr = new FileReader();
                fr.readAsDataURL(file.file);
                fr.onload = function (e) {
                    that.imageUrl =fr.result
                }
            },
            handleAvatarSuccess2(file){
                let that=this
                that.form.modulePitchLogoFile=file.file
                that.isUpload3=1
                let fr = new FileReader();
                fr.readAsDataURL(file.file);
                fr.onload = function (e) {
                    that.imageUrl2 =fr.result
                }
            },
            async show(isApply,bo,row){
                if(isApply){
                    if(bo)this.title='添加应用'
                    else this.title='修改应用'
                }else{
                    if(bo)this.title='添加模块'
                    else this.title='修改模块'
                }
                this.$refs.dialogShow.dialogFormVisible=true
                if(isApply){
                    this.form = {
                        appName: '',
                        appCode:'',
                        appAddr: '',
                        appLogoFile:'',
                        appDesc: ''
                    }
                }else{
                    this.form = {
                        parentModuleId:'',//父模块Id
                        appId:this.$parent.appParam.id?this.$parent.appParam.id:'',//所属应用Id
                        appName: this.$parent.appParam.appName?this.$parent.appParam.appName:'',//所属应用名称
                        parentModuleCode:'',//父模块代码
                        moduleCode:'',//模块代码
                        moduleName: '',
                        moduleAddr: '',
                        moduleLogoFile:'',//模块图标
                        modulePitchLogoFile:'',//模块选中图标
                        moduleType:1,//模块类型
                        moduleDesc: '',
                        supportPower:1,//是否支持数据权限
                    }
                }
                this.imageUrl=''
                this.imageUrl2=''
                if(row){
                    for(let i in row){
                        if(this.form.hasOwnProperty(i))this.form[i]=row[i]
                    }
                    let that=this;
                    if(isApply){
                        if(row.appLogo){
                            let res=await api.getAppsImg(row.appLogo)
                            if(res){
                                that.$set(that.form,"appLogoFile",res)
                                that.imageUrl=window.URL.createObjectURL(res)
                                that.isUpload=2
                            }else{
                                that.$set(that.form,"appLogoFile",'')
                                that.imageUrl=''
                                that.isUpload=1
                            }
                        }else{
                            that.$set(that.form,"appLogoFile",'')
                            that.imageUrl=''
                            that.isUpload=1
                        }
                    }else{
                        if(row.moduleLogo){
                            let res=await api.getModulesImg(row.moduleLogo)
                            if(res){
                                that.$set(that.form,"moduleLogoFile",res)
                                that.imageUrl=window.URL.createObjectURL(res)
                                that.isUpload2=2
                            }else{
                                that.$set(that.form,"moduleLogoFile",'')
                                that.imageUrl=''
                                that.isUpload2=1
                            }
                        }else{
                            that.$set(that.form,"moduleLogoFile",'')
                            that.imageUrl=''
                            that.isUpload2=1
                        }
                        if(row.modulePitchLogo){
                            let res=await api.getModulesImg(row.modulePitchLogo)
                            if(res){
                                that.$set(that.form,"modulePitchLogoFile",res)
                                that.imageUrl2=window.URL.createObjectURL(res)
                                that.isUpload3=2
                            }else{
                                that.$set(that.form,"modulePitchLogoFile",'')
                                that.imageUrl2=''
                                that.isUpload3=1
                            }
                        }else{
                            that.$set(that.form,"modulePitchLogoFile",'')
                            that.imageUrl2=''
                            that.isUpload3=1
                        }
                    }
                }
            },
            saveInfo(){
                if(this.title==='添加应用'||this.title==='修改应用'){
                    this.$refs['ruleForm'].validate((valid) => {
                        if(valid){
                            if(this.isUpload===2)this.form.appLogoFile=''
                            this.$emit('save',this.form,this.title)
                        }else{
                            return false
                        }
                    })
                }else{
                    this.$refs['ruleForm2'].validate((valid) => {
                        if(valid){
                            if(this.isUpload2===2)this.form.moduleLogoFile=''
                            if(this.isUpload3===2)this.form.modulePitchLogoFile=''
                            this.$emit('save',this.form,this.title)
                        }else{
                            return false
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .application-module-dialog {

    }
</style>
<style lang="less">
    @import "../../../assets/css/common.less";
    .application-module-width{
        .el-dialog{
            width:1000px!important;
            .el-form{
                .fl-v();
                flex-wrap: wrap;
            }
            .el-input,.el-select{
                width:300px!important;
            }
        }
    }
    .application-module-dialog{
        .el-form-item__label{
            width:150px!important;
        }
        .el-form-item__content{
            margin-left:150px!important;
        }
        div.img-box{
            .el-upload{
                width:100px;
                height:100px;
                .avatar-img{
                    width:100%;
                    height:100%;
                }
            }
        }
    }
</style>