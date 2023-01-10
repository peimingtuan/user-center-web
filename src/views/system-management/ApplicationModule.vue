<template>
    <div class="application-module">
        <add-application-dialog
                ref="addApplicationDialog"
                @save="saveInfo"
        />
        <!-- 左侧树 -->
        <scroll-tree-box
                ref="treeBox"
                :treeData="bsTreeData"
                 nodeKey="id"
                filterKey="name"
                :defaultProps="defaultProps"
                :defaultExpandedKeys="defaultExpandedKeys"
                @treeClick="treeClick">
        </scroll-tree-box>
        <!-- 右侧内容 -->
        <div class="public-tree-right-content">
            <div class="head-box public-header-option">
                <el-button type="primary" icon="el-icon-plus" @click="add" :disabled="initData===1?true:false">{{isApply?'添加应用':'添加模块'}}</el-button>
                <el-upload
                        class="import-file"
                        ref="upload"
                        action=""
                        :file-list="fileList"
                        :show-file-list="false"
                        :http-request="appImport"
                >
                    <el-button size="small" type="primary">应用导入</el-button>
                </el-upload>
                <el-button type="primary" @click="importDown">导入模板下载</el-button>
            </div>
            <!-- 表格数据 -->
            <table-box class="public-table-box-scroll"
                       :selection="false"
                       :tableKey="tableKey"
                       :tableData="tableData">
                <el-table-column slot="moduleType" label="模块类型" width="150">
                    <template slot-scope="scope">
                        <div>{{scope.row.moduleType===1?'菜单模块':'操作模块'}}</div>
                    </template>
                </el-table-column>
                <el-table-column slot="supportPower" label="是否支持数据权限">
                    <template slot-scope="scope">
                        <div>{{scope.row.supportPower===1?'是':'否'}}</div>
                    </template>
                </el-table-column>
                <el-table-column slot="operate" label="操作" width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.row.initData===1" class="disabledGray">
                            <span>修改</span>
                            <span>删除</span>
                        </div>
                        <div v-else class="isedit">
                            <span  @click="edit(scope.row)">修改</span>
                            <span  @click="delInfo(scope.row,scope.$index)">删除</span>
                        </div>
                    </template>
                </el-table-column>
            </table-box>
            <!-- 分页 -->
            <paging-box
                    :pageIndex="pageIndex"
                    :pageSize="pageSize"
                    :total="total"
                    @handleCurrentChange="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script>
    import {MessageBox} from "element-ui"
    import * as api from "@/api/system-management/application-module-api"
    export default {
        name: "ApplicationModule",
        components: {
            scrollTreeBox:()=>import('@/components/tree-box/ScrollTreeBox'),
            headBox:()=>import("@/components/head-box"),
            tableBox:()=>import('@/components/table-box'),
            pagingBox:()=>import('@/components/paging-box'),
            addApplicationDialog:()=>import("./application-module-dialog/addDialog"),
        },
        data() {
            return {
                fileList:[],
                isApply:true,//true为应用，false为模块
                initData:false,//是否可添加模块
                bsTreeData: [],
                defaultExpandedKeys:[],//默认展开的节点的 key 的数组
                defaultProps: {
                    children: 'child',
                    label:'name'
                },
                type:0,
                appId:'',
                parentModuleId:'',
                tableData:[],
                row:null,
                pageIndex:1,
                pageSize:10,
                total:0,
                appParam:{},
                checkedTreeData:{},//默认选中的treeData
            }
        },
        watch:{
            isApply(){
                this.pageIndex=1
            }
        },
        computed:{
            tableKey(){
                if(this.isApply){
                    return [
                        {prop:'appName',label:'应用名称',tooltip:true},
                        {prop:'appCode',label:'应用代码',tooltip:true},
                        {prop:'appAddr',label:'应用URL地址',tooltip:true},
                        {prop:'appDesc',label:'说明',tooltip:true},
                        {slot: 'operate'}
                        ]
                }else{
                    return [
                        {prop:'moduleName',label:'模块名称',tooltip:true},
                        {prop:'moduleCode',label:'模块代码',tooltip:true},
                        {slot: 'moduleType'},
                        {prop:'moduleAddr',label:'模块URL地址',tooltip:true},
                        {slot: 'supportPower'},
                        {prop:'moduleDesc',label:'说明',tooltip:true},
                        {slot: 'operate'}
                    ]
                }
            },
        },
        created() {

        },
        mounted() {
            this.getTreeData()
        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            //应用导入
            async appImport(file){
                if(file.file.name.split(".").length>1){
                    let inputFile = file.file.name.split(".")[file.file.name.split(".").length - 1];
                    if(inputFile.toLowerCase()==='zip'){
                        let params = new FormData()
                        params.append('zip',file.file)
                        api.appImport(params)
                    }else{
                        this.$msgW('必须上传zip文件')
                    }
                }else{
                    this.$msgW('上传的文件格式不正确')
                }
            },
            //导入模板下载
            async importDown(){
                window.open('/wj-ums/api/v2/apps/import')
            },
            //获取单位树
            async getTreeData() {
                let res=await api.getTree()
                    this.bsTreeData=res.body;
                //console.log(this.bsTreeData,this.bsTreeData[0].id,200)
                    if(this.bsTreeData.length>0){
                        this.$nextTick(()=>{
                            if (this.isApply){
                                this.checkedTreeData=this.bsTreeData[0]
                            }else{
                                if(this.parentModuleId){
                                    this.checkedTreeData.id=this.parentModuleId
                                }else if(this.appId){
                                    this.checkedTreeData.id=this.appId
                                }else{
                                    this.checkedTreeData=this.bsTreeData[0]
                                }
                            }
                            this.defaultExpandedKeys=[this.checkedTreeData.id]
                            this.$refs.treeBox.$refs.tree.setCurrentKey(this.checkedTreeData.id)
                            this.choiceTree(this.checkedTreeData)
                        })
                    }
            },
            treeClick(val,node) {
                this.checkedTreeData=val
                this.choiceTree(val, node)
            },
            choiceTree(val, node){
                this.initData=val.initData;
                if(val.type===0) {//0应用
                    this.type=0;
                    this.isApply=true;
                    this.appParam={
                        id:val.id,
                        appName:val.name
                    }
                }else if(val.type===1){//1为应用，添加模块
                    this.type=1;
                    this.isApply=false
                    this.appId=val.id
                    this.appParam={
                        id:val.id,
                        appName:val.name
                    }
                    this.parentModuleId='';
                }else{//2为模块
                    let appData = this.getAppParent(node);
                    this.appId=appData.id;
                    this.appParam={
                        id:appData.id,
                        appName:appData.name
                    }
                    this.parentModuleId=val.id;
                    this.type=2;
                    this.isApply=false
                }
                this.searchNodeData()
            },
            //查询
            async searchNodeData(page) {
                if(page)this.pageIndex=page
                let res=null
                let {pageIndex,pageSize,appId,parentModuleId}=this
                if(this.isApply){
                     res=await api.getApps({pageIndex,pageSize})
                }else{
                     if(this.type===1)res=await api.getModuleApps({pageIndex,pageSize,appId})
                     else res=await api.getParentModuleApps({pageIndex,pageSize,appId,parentModuleId})
                }
                this.tableData = res.body;
                this.total = res.count;
            },
            add() {
                this.$refs.addApplicationDialog.show(this.isApply,true)
            },
            //保存
            async saveInfo(form,name) {
                    if(this.isApply){
                        if(!form.appLogoFile)delete form.appLogoFile
                        let params = new FormData()
                        for(let i in form){
                            params.append(i,form[i])
                        }
                        if(name==='添加应用')await api.saveApps(params)
                        else await api.savePatchApps(params,this.row.appId)
                        this.$msgS("保存成功")
                    }else{
                        if(!form.moduleLogoFile)delete form.moduleLogoFile
                        if(!form.modulePitchLogoFile)delete form.modulePitchLogoFile
                        let params = new FormData()
                        for(let i in form){
                            params.append(i,form[i])
                        }
                        params.set('parentModuleId',this.parentModuleId)
                        if(name==='添加模块')await api.saveModuleApps(params)
                        else await api.savePatchModuleApps(params,this.row.moduleId)
                        this.$msgS("保存成功")
                    }
                    this.$refs.addApplicationDialog.$refs.dialogShow.dialogFormVisible=false
                    this.getTreeData()
                    this.searchNodeData(1)
            },
            //修改
            edit(row) {
                this.$refs.addApplicationDialog.show(this.isApply,false,row)
                this.row=row;
            },
            //删除
            delInfo(row,index){
                MessageBox.confirm('确认删除???', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    if(this.isApply){
                        await api.deleteInfo(row.appId)
                        this.$msgS('删除成功')
                        this.searchNodeData();
                        this.getTreeData();
                    }else{
                        await api.deleteModuleInfo(row.moduleId)
                        this.$msgS('删除成功')
                        this.searchNodeData();
                        this.getTreeData();
                    }
                }).catch(() => {

                });
            },
            handleCurrentChange(page){
                this.pageIndex = page;
                this.searchNodeData();
            },
            getAppParent(node) {
                if (node.parent.data.type === 1) {
                    return node.parent.data
                }else {
                    return this.getAppParent(node.parent)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .application-module {

    }
</style>
<style lang="less">
    .application-module{
        .head-box{
            .import-file{
                display:inline-block;
                margin:0 10px;
            }
            .el-button {
                line-height:35px;
                padding:0 20px;
                i{
                    color:#fff;
                }
            }
            .el-input{
                margin-left:5px;
                width:300px;
                line-height:35px;
                i{
                    color:#C0C4CC;
                }
            }
        }
        .disabledGray{
            span{
                margin-right:10px;
                color:#dcdcdc;
            }
        }
    }
</style>