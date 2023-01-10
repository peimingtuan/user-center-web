<template>
    <div class="dialog-cast-members-body">
        <div class="content-left">
            <scroll-tree-box
                    ref="tree2"
                    :treeData="bsTreeData"
                    nodeKey="id"
                    :showCheckbox="true"
                    filterKey="name"
                    :defaultProps="defaultProps"
                    @treeClick="treeClick">
            </scroll-tree-box>
        </div>
        <div class="content-center">
            <div @click="changeBox"><i class="el-icon-arrow-right"></i></div>
        </div>
        <div class="content-right">
            <div>已选择</div>
            <div>
                <div class="input-box" v-for="(item,index) in boxList" :key="index">
                    <el-input v-model="item.userName" readonly clearable></el-input>
                    <i class="el-icon-close" @click="clearData(index)"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from "@/api/system-management/role-manage-api"
    export default {
        name: "DialogCastMembersBody",
        components:{
            scrollTreeBox:()=>import('@/components/tree-box/ScrollTreeBox'),
        },
        data() {
            return {
                bsTreeData:[],
                defaultProps: {
                    children: 'childs',
                    label:'name'
                },
                boxList:[],
                timer:null
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
             show(roleId){
                Promise.all([api.getUndertakerTree(roleId),api.checkRoleUsers(roleId)]).then(res=>{
                    this.bsTreeData=res[0].body
                    this.boxList=res[1].body
                    this.$nextTick(()=>{
                        this.$refs.tree2.filterText=''
                        let arr=[]
                        this.boxList.map(item=>{
                            arr.push(item.userId)
                        })
                        this.$refs.tree2.$refs.tree.setCheckedKeys(arr)
                    })
                })
            },
            //查看角色
            async checkRoleUsers(roleId){
                  let res=api.checkRoleUsers(roleId)
                  this.boxList=res.body
            },
            changeBox(){
                 let arr=this.$refs.tree2.$refs.tree.getCheckedNodes()
                arr.map(item=>{
                    if(item.type===2){
                        let isBo=true
                        for(let i=0;i<this.boxList.length;i++){
                            if(item.id===this.boxList[i].userId){
                                isBo=false
                                // return false
                            }
                        }
                        if(isBo){
                            this.boxList.push({
                                userId:item.id,
                                userName:item.name
                            })
                        }
                    }
                })
            },
            treeClick(data,node){

            },
            clearData(index){
                this.boxList.splice(index,1)
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../assets/css/common.less";
    .dialog-cast-members-body {
        width:100%;
        height:420px;
        max-height:600px;
        overflow: auto;
        .content-left{
            width:40%;
            height:100%;
            float:left;
            border:1px solid #dcdcdc;
            &>div{
                width:100%!important;
                max-width:300px!important;
                min-height:400px;
                border-right:none!important;
            }
        }
        .content-center{
            width: 20%;
            height:100%;
            float: left;
            .fc();
            &>div{
                width:50px;
                height:50px;
                background:#409EFF;
                border-radius: 50%;
                cursor:pointer;
                i{
                    color:#fff;
                }
                .fc()
            }
        }
        .content-right {
            width: 40%;
            height:100%;
            border:1px solid #dcdcdc;
            float: left;
            &>div:nth-child(1){
                padding:5px;
                line-height:30px;
                background:rgba(234, 243, 253, 1);
            }
            &>div:nth-child(2){
                height:calc(100% - 40px);
                overflow: auto;
                .input-box{
                    margin:5px 10px;
                    position:relative;
                    i{
                        position:absolute;
                        right:5px;
                        top:10px;
                        cursor:pointer;
                        .f20();
                    }
                }
            }
        }
    }
</style>
<style lang="less">

</style>