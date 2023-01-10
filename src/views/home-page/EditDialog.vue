<template>
    <dialog-show
            title="编辑模块"
            ref="dialogShow"
            @saveInfo="saveInfo">
            <template slot="main-body">
                <div class="edit-dialog">
                    <el-form :model="form" :rules="rules" ref="ruleForm" >
                        <el-form-item label="模块" :label-width="formLabelWidth" prop="appName">
                            <el-select v-model="form.appName">
                                <el-option
                                        v-for="item in moduleList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="区块名称" :label-width="formLabelWidth" prop="name">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="所属分类" :label-width="formLabelWidth" prop="type">
                            <el-select v-model="form.type">
                                <el-option
                                        v-for="item in typeList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
    </dialog-show>

</template>

<script>
    import {editPortal} from "@/api/home-page-api"
    export default {
        name: "EditDialog",
        components:{
            dialogShow:()=>import("@/components/dialog")
        },
        data() {
            return {
                moduleList:[{id:1,name:'辅助工具'},{id:2,name:'代办事项'},{id:3,name:'提醒事项'},{id:4,name:'消息通知'}],
                typeList:[{id:1,name:'法院概况'},{id:2,name:'审判态势'},{id:3,name:'案件质量'},{id:4,name:'庭室及个人情况'}],
                form: {
                    appName:1,
                    name: '',
                    type:1,
                },
                formLabelWidth: '150px',
                rules: {
                    appName: [
                        {required:true,message:'请选择模块', trigger: 'change' }
                    ],
                    name: [
                        {required:true,message: '请输入区块名称', trigger: 'blur' }
                    ],
                    type: [
                        {required:true,message:'请选择所属分类', trigger: 'change' }
                    ]
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
            show(row){
                this.$refs.dialogShow.dialogFormVisible=true
                if(row){
                    for(let i in row){
                        this.form[i]=row[i]
                    }
                }
            },
            saveInfo(){
                this.$emit('saveInfo')
            }
        }
    }
</script>

<style lang="less" scoped>
    .edit-dialog {

    }
</style>
<style lang="less">

</style>