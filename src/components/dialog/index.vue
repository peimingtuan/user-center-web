<template>
    <div class="dialog-show">
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <slot name="main-body"></slot>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInfo">{{ primaryButton }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "dialogShow",
        props:{
            title:{
                type:String,
                default:'添加信息'
            },
            primaryButton:{
                type:String,
                default:'确定'
            }
        },
        data() {
            return {
                dialogFormVisible: false,
            }
        },
        watch:{
            dialogFormVisible(v){
                if(!v)this.$emit('cancel')
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            saveInfo(){
                this.$emit("saveInfo")
            }
        },
    }
</script>

<style lang="less" scoped>

</style>
<style lang="less">
    .dialog-show {
        .el-dialog{
            width:700px;
            .el-form{
                .el-input,.el-select{
                    width:450px;
                }
            }
        }
    }
</style>