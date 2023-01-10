<template>
    <dialog-show
            title="添加Portal"
            ref="dialogShow"
            @saveInfo="saveInfo">
            <template slot="main-body">
                <div class="add-portal-dialog">
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox v-for="item in List"
                                     :key="item.id"
                                     v-if="item.isDisplay===2"
                                     :label="item.userPortletId">
                                    {{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </template>
    </dialog-show>
</template>

<script>
    export default {
        name: "AddPortalDialog",
        components:{
            dialogShow:()=>import("@/components/dialog")
        },
        data() {
            return {
                checkList:[]
            }
        },
        computed:{
            List(){
                return this.$store.state.portalList
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
                this.checkList=[]
            },
            async saveInfo(){
                if(this.checkList.length===0){
                    this.$msgW("请勾选要添加的模块")
                }else{
                    await this.$store.dispatch('addPortal',this.checkList)
                    this.$msgS("添加成功!")
                    this.$refs.dialogShow.dialogFormVisible=false
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .add-portal-dialog{

    }
</style>
<style lang="less">
    @import "../../assets/css/common.less";
    .add-portal-dialog {
        .el-checkbox{
            margin-bottom:20px;
        }
    }
</style>