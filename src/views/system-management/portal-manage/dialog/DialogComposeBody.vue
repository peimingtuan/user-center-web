<template>
    <div class="dialog-compose-body">
        <el-form :model="form" ref="ruleForm" >
            <el-form-item label="组件名称" :label-width="formLabelWidth"  required>
                <el-input v-model.trim="form.courtName"></el-input>
            </el-form-item>
            <el-form-item label="组件类型" :label-width="formLabelWidth" required>
                <el-select v-model="form.enableAes">
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth" required>
                <el-input type="textarea" v-model="form.description" placeholder="......"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "DialogComposeBody",
        data() {
            return {
                form: {
                    entityId:'',
                    courtName:'',
                    description:'',
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
                        courtName:'',
                        description:'',
                        enableAes:false,
                    }
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .dialog-compose-body {

    }
</style>
<style lang="less">

</style>