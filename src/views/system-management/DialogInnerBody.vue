<template>
    <div class="dialog-inner-body">
        <el-form :model="form" ref="ruleForm" >
            <el-form-item label="法庭代码" :label-width="formLabelWidth"  required>
                <el-input v-model.trim="form.courtCode"></el-input>
            </el-form-item>
            <el-form-item label="项目名称" :label-width="formLabelWidth" required>
                <el-input v-model="form.projectName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="aesKey" :label-width="formLabelWidth" required>
                <el-input v-model="form.aesKey" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否加解密" :label-width="formLabelWidth" required>
                <el-select v-model="form.enableAes">
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "dialogInnerBody",
        data() {
            return {
                form: {
                    entityId:'',
                    projectName: '',
                    courtCode: '',
                    token:'',
                    aesKey:'',
                    enableAes:false,
                },
                formLabelWidth: '150px',
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            show(row){
                if(row){
                    for(let i in row){
                        this.form[i]=row[i]
                    }
                }else{
                    this.form={
                        entityId:'',
                        projectName: '',
                        courtCode: '',
                        token:'',
                        aesKey:'',
                        enableAes:false,
                    }
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .dialog-inner-body {

    }
</style>
<style lang="less">

</style>