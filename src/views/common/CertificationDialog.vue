<template>
    <dialog-show
            title="实名认证"
            ref="dialogShow"
            @saveInfo="saveInfo">
            <template slot="main-body">
                <div class="certification-dialog">
                    <el-form
                            :model="form"
                            :rules="rules"
                            label-position="left"
                            label-width="120px"
                            ref="ruleForm" >
                        <el-form-item label="证件类型" required>
                            <el-select v-model="form.cardName" placeholder="请选择">
                                <el-option
                                        v-for="item in cardList"
                                        :key="item.id"
                                        :label="item.id"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="证件号码" prop="cardNumber" required>
                            <el-input  v-model.trim="form.cardNumber" placeholder="证件号码"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证上传" required>
                            <div class="photo-card-box">
                                <div class="img-box">
                                    <div>
                                        <el-upload
                                                class="avatar-uploader"
                                                action="https://jsonplaceholder.typicode.com/posts/"
                                                :show-file-list="false"
                                                :on-success="handleAvatarSuccess"
                                        >
                                            <img v-if="imageUrl" :src="imageUrl" class="avatar-img">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </div>
                                    <div>请上传身份证正面</div>
                                </div>
                                <div class="img-box">
                                    <div>
                                        <el-upload
                                                class="avatar-uploader"
                                                action="https://jsonplaceholder.typicode.com/posts/"
                                                :show-file-list="false"
                                                :on-success="handleAvatarSuccess2"
                                        >
                                            <img v-if="imageUrl2" :src="imageUrl2" class="avatar-img">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </div>
                                    <div>请上传身份证反面</div>
                                </div>
                                <div>
                                    <div><i class="el-icon-warning"></i>请上传身份证照片支持jpg/jpeg/png等类型(5M以内)</div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="身份证上传" required>
                            <div class="id-card-box">
                                <div class="img-box">
                                    <div>
                                        <el-upload
                                                class="avatar-uploader"
                                                action="https://jsonplaceholder.typicode.com/posts/"
                                                :show-file-list="false"
                                                :on-success="handleAvatarSuccess3"
                                        >
                                            <img v-if="imageUrl3" :src="imageUrl3" class="avatar-img">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </div>
                                    <div>请上传身份证正面</div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="图例">
                            <img src="../../assets/imgs/regist/shiL.png" />
                        </el-form-item>
                    </el-form>
                </div>
            </template>
    </dialog-show>
</template>

<script>
    import {isCardId} from "@/assets/js/tools"
    import * as api from "@/api/common-api"
    export default {
        name: "CertificationDialog",
        components:{
            dialogShow:()=>import("@/components/dialog")
        },
        data() {
            return {
                imageUrl:'',
                imageUrl2:'',
                imageUrl3:'',
                cardList:[{id:0,name:'身份证'}],
                form: {
                    cardName:'',
                    cardNumber:''
                },
                rules: {
                    cardName:[{required: true, message: '请选择证件类型', trigger: "change"}],
                    cardNumber:[
                        {required: true, message:'请输入证件号码', trigger: "blur"},
                        {validator:isCardId, trigger:'blur'}
                    ],
                }
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
            handleAvatarSuccess(){

            },
            handleAvatarSuccess2(){

            },
            handleAvatarSuccess3(){

            },
            show(){
                this.$refs.dialogShow.dialogFormVisible=true

            },
            saveInfo(){
                this.$refs['ruleForm'].validate(async (valid) => {
                    if(valid){
                        console.log('验证通过')
                        //await api.changePassword(this.form)
                        this.$refs.dialogShow.dialogFormVisible=false
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
    .certification-dialog {

    }
</style>
<style lang="less">
    @import "../../assets/css/common.less";
    .certification-dialog {
        .el-form{
            margin:0 auto;
            .el-input,.el-select{
                /*width:250px!important;*/
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
</style>