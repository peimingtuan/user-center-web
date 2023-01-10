<template>
    <dialog-show
            title="修改密码"
            ref="dialogShow"
            @saveInfo="saveInfo">
            <template slot="main-body">
                <div class="edit-password-dialog">
                    <el-form
                            :model="form"
                            :rules="rules"
                            label-position="left"
                            ref="ruleForm" >
                        <el-form-item label="旧  密  码" prop="password">
                            <el-input type="password" v-model.trim="form.password" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="新  密  码" prop="newPassword">
                            <el-input type="password" v-model.trim="form.newPassword" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input type="password" v-model.trim="form.checkPass" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
    </dialog-show>

</template>

<script>
    import * as api from "@/api/common-api"
    import FoundationTools from '@/assets/js/function-ajax'
    import md5 from 'js-md5'
    export default {
        name: "EditPasswordDialog",
        components:{
            dialogShow:()=>import("@/components/dialog")
        },
        data() {
            let checkPassword = (rule, value, callback) => {
                if (!value) {
                     callback(new Error('请输入旧密码'));
                }else{
                    callback()
                }
            };
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.form.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    password:'',
                    newPassword:'',
                    checkPass: '',
                },
                rules: {
                    password: [
                        { validator: checkPassword, trigger: 'blur' }
                    ],
                    newPassword: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                }
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
        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            show(){
                this.$refs.dialogShow.dialogFormVisible=true
                this.form.password=''
                this.form.newPassword=''
                this.form.checkPass=''
            },
            saveInfo(){
                this.$refs['ruleForm'].validate(async (valid) => {
                    if(valid){
                        let param=JSON.parse(JSON.stringify(this.form))
                        param.newPassword=md5(this.form.newPassword)
                        param.password=md5(this.form.password)
                        await api.changePassword(param,this.userId)
                        this.$refs.dialogShow.dialogFormVisible=false
                        FoundationTools.delCookie('userInfo')
                        if(sessionStorage.getItem('loginType')==1)this.$router.push({path:'/Login'})
                        else this.$router.push({path:'/IntranetLogin'})
                    }else{
                        console.log('验证失败')
                        return false
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .edit-password-dialog {

    }
</style>
<style lang="less">
    .edit-password-dialog{
        .el-form-item__label{
            width:120px!important;
        }
        .el-form-item__content{
            margin-left:120px!important;
        }
    }
</style>