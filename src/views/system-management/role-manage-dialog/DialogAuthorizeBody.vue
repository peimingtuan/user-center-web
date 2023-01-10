<template>
  <div class="authorize">
    <el-tabs v-model="activeName" @tab-click="getAppNameList" type="border-card">
      <el-tab-pane name="five" disabled></el-tab-pane>
      <el-tab-pane name="six" disabled></el-tab-pane>
        <el-tab-pane name="first">
            <div slot="label" class="el-tab-pane-div"><span style="font-size: 18px;" :class="activeName==='first'?'setColor':''">模块授权</span></div>
            <div class="dialog-authorize-body">
                <div class="content-left">
                    <scroll-tree-box
                            ref="treeBox"
                            :treeData="bsTreeData"
                            show-checkbox
                            nodeKey="id"
                            filterKey="name"
                            check-strictly
                            :defaultProps="defaultProps"
                            :defaultExpandedKeys="defaultExpandedKeys"
                            @treeClick="treeClick"/>
                </div>
                <div class="content-center" v-show="boxIsShow">
                    <el-form :model="form" ref="ruleForm" >
                        <el-form-item label="单位选择" :label-width="formLabelWidth"  required>
                            <el-select v-model="form.unitRange" placeholder="请选择">
                                <el-option
                                        v-for="item in unitList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <div class="choice-box" v-show="unitRange===3">
                                <div ref="queryBox" class="selectRadio">
                                    <el-input v-model="unit" readonly></el-input><el-button type="primary" @click="inputFocus">选择</el-button>
                                    <div ref="queryDown" v-show="treeShow" class="tree_radio">
                                        <el-tree
                                                ref="unitTree"
                                                class="filter_tree"
                                                show-checkbox
                                                :data="unitTreeData"
                                                :props="unitDefaultProps"
                                                nodeKey="unitId"
                                                :highlight-current = "true"
                                                :expand-on-click-node="false"
                                                @node-click="handleNodeClick"
                                                accordion
                                                check-strictly
                                        >
                                        </el-tree>
                                        <div style="text-align: center">
                                            <el-button type="primary" size="mini" @click="treeShow=false">取消</el-button>
                                            <el-button type="primary" size="mini" @click="saveUnitTree">确定</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="部门选择" :label-width="formLabelWidth"  required>
                            <el-select v-model="form.deptRange" placeholder="请选择">
                                <el-option
                                        v-for="item in departList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <div class="choice-box" v-show="deptRange===3">
                                <div ref="queryBox2" class="selectRadio">
                                    <el-input v-model="dept" readonly></el-input><el-button type="primary" @click="inputFocus2">选择</el-button>
                                    <div ref="queryDown2" v-show="treeShow2" class="tree_radio">
                                        <el-tree
                                                ref="departTree"
                                                class="filter_tree"
                                                show-checkbox
                                                :data="departTreeData"
                                                :props="departDefaultProps"
                                                nodeKey="id"
                                                :highlight-current = "true"
                                                :expand-on-click-node="false"
                                                @node-click="handleNodeClick2"
                                                accordion
                                                check-strictly
                                        >
                                        </el-tree>
                                        <div style="text-align: center">
                                            <el-button type="primary" size="mini" @click="treeShow2=false">取消</el-button>
                                            <el-button type="primary" size="mini" @click="saveDepartTree">确定</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="参与人选择" :label-width="formLabelWidth" required>
                            <el-select v-model="form.staffRange" placeholder="请选择">
                                <el-option
                                        v-for="item in partakePeopleList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="承办人选择" :label-width="formLabelWidth" required>
                            <el-select v-model="form.undertakerRange" placeholder="请选择">
                                <el-option
                                        v-for="item in undertakePeopleList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <div class="choice-box" v-show="undertakerRange===3">
                                <div ref="queryBox3" class="selectRadio">
                                    <el-input v-model="undertaker" readonly></el-input><el-button type="primary" @click="inputFocus3">选择</el-button>
                                    <div ref="queryDown3" v-show="treeShow3" class="tree_radio">
                                        <el-tree
                                                ref="undertakerTree"
                                                class="filter_tree"
                                                show-checkbox
                                                nodeKey="id"
                                                :data="undertakerTreeData"
                                                :props="undertakerDefaultProps"
                                                :highlight-current = "true"
                                                :expand-on-click-node="false"
                                                @node-click="handleNodeClick3"
                                                accordion
                                        >
                                        </el-tree>
                                        <div style="text-align: center">
                                            <el-button type="primary" size="mini" @click="treeShow3=false">取消</el-button>
                                            <el-button type="primary" size="mini" @click="saveUndertakerTree">确定</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <!--<el-form-item label="办案节点选择" :label-width="formLabelWidth" required>-->
                            <!--<el-select v-model="form.caseNodeRange" placeholder="请选择">-->
                                <!--<el-option-->
                                        <!--v-for="item in caseNodeList"-->
                                        <!--:key="item.id"-->
                                        <!--:label="item.name"-->
                                        <!--:value="item.id">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->
                        <el-form-item label="案由选择"  :label-width="formLabelWidth" required>
                            <el-select v-model="form.causeRange">
                                <el-option
                                        v-for="item in causeList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <div class="choice-box" v-show="causeRange===3">
                                <div ref="queryBox4" class="selectRadio">
                                    <el-input v-model="cause"  readonly></el-input><el-button type="primary" @click="inputFocus4">选择</el-button>
                                    <div ref="queryDown4" v-show="treeShow4" class="tree_radio">
                                        <el-tree
                                                ref="tree"
                                                class="filter_tree"
                                                :data="treeData"
                                                :props="defaultProps"
                                                show-checkbox
                                                :highlight-current = "true"
                                                :expand-on-click-node="false"
                                                @node-click="handleNodeClick4"
                                                accordion
                                        >
                                        </el-tree>
                                        <div style="text-align: center">
                                            <el-button type="primary" size="mini" @click="treeShow4=false">取消</el-button>
                                            <el-button type="primary" size="mini" @click="saveCauseTree">确定</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="操作选择" :label-width="formLabelWidth">
                            <el-checkbox-group v-model="type">
                                <el-checkbox
                                        v-for="item in checkboxList"
                                        :label="item.moduleName"
                                        :key="item.moduleName"
                                        />
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div style="margin-top: 10%;">
                <el-button @click="saveModuleInfo" type="primary" style="position: relative;float: right;margin-left: 10px;">确定</el-button>

                <el-button @click="closeDialog" type="primary" style="position: relative;float: right;">取消</el-button>
            </div>
        </el-tab-pane>
        <el-tab-pane name="second">
            <div slot="label" class="el-tab-pane-div"><span style="font-size: 18px;" :class="activeName==='second'?'setColor':''">portal授权</span></div>
            <portal-authorize-body ref="secondBody" :appNameList="portalNameList" @saveInfo="saveInfo" @delInfo="delInfo"></portal-authorize-body>
        </el-tab-pane>
        <el-tab-pane name="third">
            <div slot="label" class="el-tab-pane-div"><span style="font-size: 18px;" :class="activeName==='third'?'setColor':''">快捷方式授权</span></div>
            <fast-way-authorize-body ref="thirdBody" :appNameList="fastWayNameList" @saveInfo="saveInfo"></fast-way-authorize-body>
        </el-tab-pane>
        <el-tab-pane name="four" disabled></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    import * as systemManagementApi from "@/api/system-management-api.js"
    import * as api from "@/api/system-management/role-manage-api"
    export default {
        name: "DialogAuthorizeBody",
        props:{
            row:{}
        },
        components:{
            scrollTreeBox:()=>import('@/components/tree-box/ScrollTreeBox'),
            portalAuthorizeBody: () => import('./PortalAuthorizeBody'),
            fastWayAuthorizeBody: () => import('./FastWayAuthorizeBody')
        },
        data() {
            return {
                activeName: 'first',
                //所有portal
                portalNameList: [],
                fastWayNameList: [],
                //模块一
                boxIsShow:false,
                bsTreeData:[],
                defaultExpandedKeys:[],//默认展开的节点的 key 的数组
                defaultProps: {
                    children: 'child',
                    label:'name'
                },
                unitList:[{id:1,name:'本单位'},{id:2,name:'非本单位'},{id:3,name:'指定单位'},{id:4,name:'全部'}],//单位
                departList:[{id:1,name:'本部门'},{id:2,name:'非本部门'},{id:3,name:'指定部门'},{id:4,name:'全部'}],//部门
                partakePeopleList:[{id:1,name:'本人参与'},{id:2,name:'非本人参与'},{id:4,name:'全部'}],//参与人
                undertakePeopleList:[{id:1,name:'本人承办'},{id:2,name:'非本人承办'},{id:3,name:'指定承办人'},{id:4,name:'全部'}],//承办人
                //caseNodeList:[{id:1,name:'提交审委会'},{id:2,name:'提交专业法官会议'},{id:3,name:'全部'}],//办案节点
                causeList:[{id:3,name:'指定案由'},{id:4,name:'全部'}],
                form: {
                    roleId: "",//角色id
                    roleName: "",//角色名称
                    moduleId: "",//模块ID
                    moduleName: "",//模块名称
                    unitRange:1,//单位范围
                    unit:[],
                    deptRange:1,//部门范围
                    dept:[],
                    staffRange:1,//人员范围
                    undertakerRange: 1,//承办人范围
                    undertaker:[],
                    //caseNodeRange:'',//办案节点范围
                    causeRange:4,//案由范围
                    cause:[],//案由
                    operations:[] //操作权限
                },
                checkboxList:[],//操作权限
                type:[],
                formLabelWidth: '150px',
                treeShow:false,
                treeShow2:false,
                treeShow3:false,
                treeShow4:false,
                treeData:[],
                unitTreeData:[],
                unitDefaultProps:{
                    children: 'children',
                    label:'unitName'
                },
                departTreeData:[],
                departDefaultProps:{
                    children: 'childs',
                    label:'name'
                },
                undertakerTreeData:[],
                undertakerDefaultProps:{
                    children: 'childs',
                    label:'name'
                },
                unit:'',//单位
                dept:'',//部门
                undertaker:'',//承办人
                cause:'',
                initData:[],//初始化数据
                nodeChecked:false,
                indexKey:''
            }
        },
        watch:{

        },
        computed:{
            unitRange(){
                return this.form.unitRange
            },
            deptRange(){
                return this.form.deptRange
            },
            undertakerRange(){
                return this.form.undertakerRange
            },
            causeRange(){
                return this.form.causeRange
            }
        },
        created() {
            document.addEventListener('click', this.queryHide);
            document.addEventListener('click', this.queryHide2);
            document.addEventListener('click', this.queryHide3);
            document.addEventListener('click', this.queryHide4);
        },
        mounted() {
            this.getUnitTree()
            this.getDepartTree()
            this.getUndertakerTree()
        },
        updated() {
        },
        beforeDestroy() {
            document.removeEventListener('click',this.queryHide);
            document.removeEventListener('click',this.queryHide2);
            document.removeEventListener('click',this.queryHide3);
            document.removeEventListener('click',this.queryHide4);
        },
        methods: {
            //查看当前用户所有授权情况
            async allCheckPowers(){
                //获取应用模块树
                let result=await api.getTree()
                this.bsTreeData=result.body;
                let res=await api.allCheckPowers(this.row.roleId)
                this.initData=res.body //初始化存储数据
                this.indexKey='' //todo 初始化
                let arr=res.body.map(item=>{
                    return item.moduleId
                })
                this.$nextTick(()=>{
                    this.boxIsShow=false;
                    this.$refs.treeBox.filterText=''
                    //勾选已授权模块
                    this.$refs.treeBox.$refs.tree.setCheckedKeys(arr)
                })
            },
            treeClick(val,node) {
                if(val.type===2&&val.supportPower===1){
                    this.authorityDo(val.id)
                    // this.checkPowers(val.id)
                    this.refreshData(val)
                    this.boxIsShow=true;//展示右半部分
                } else {
                    this.boxIsShow=false;
                }
            },
            //获取当前操作权限
            async authorityDo(parentModuleId){
                let res=await api.getModuleApps({parentModuleId})
                if(res.body&&res.body.length>0){
                    this.checkboxList=res.body
                }else{
                    this.checkboxList=[]
                }
            },
            //刷新数据
            refreshData(val){
                let isBo=true,index;
                for(let i=0;i<this.initData.length;i++){
                    if(val.id===this.initData[i].moduleId){
                        if(this.indexKey!==''){
                            for(let j in this.form){//todo 存储上一次的form表单信息
                                this.initData[this.indexKey][j]=this.form[j]
                            }
                            let arrList=[]
                            if(this.checkboxList.length>0){
                                this.checkboxList.map(item=>{
                                    if(this.type.includes(item.moduleName)){
                                        arrList.push(Object.assign(item,{roleId:this.row.roleId,roleName:this.row.roleName}))
                                    }
                                })
                            }
                            this.initData[this.indexKey].operations=arrList
                        }
                        this.indexKey=i
                        isBo=false;
                        index=i;
                        break;
                    }
                }
                //todo 需要重置form
                this.form={
                    roleId:'',//角色id
                    roleName:'',//角色名称
                    moduleId:val.id,//模块ID
                    moduleName:val.name,//模块名称
                    unitRange:1,//单位范围
                    unit:[],
                    deptRange:1,//部门范围
                    dept:[],
                    staffRange:1,//人员范围
                    undertakerRange: 1,//承办人范围
                    undertaker:[],
                    //caseNodeRange:'',//办案节点范围
                    causeRange:4,//案由范围
                    cause:[],//案由
                    operations:[] //操作权限
                }
                this.unit = ''//单位
                this.dept = ''//部门
                this.undertaker = ''//承办人
                this.cause = ''
                this.type=[]
                //todo 初始化数据中已经存在，需要赋值form
                if(!isBo){
                    let obj=this.initData[index]
                    for(let i in obj){
                        this.form[i]=obj[i]
                    }
                    if(this.form.unit&&this.form.unit.length>0){
                        let arr=this.form.unit.map(item=>{
                            return item.unitName
                        })
                        this.unit=arr.join(',')
                    }
                    if(this.form.dept&&this.form.dept.length>0){
                        let arr=this.form.dept.map(item=>{
                            return item.deptName
                        })
                        this.dept=arr.join(',')
                    }
                    if(this.form.undertaker&&this.form.undertaker.length>0){
                        let arr=this.form.undertaker.map(item=>{
                            return item.undertakerName
                        })
                        this.undertaker=arr.join(',')
                    }
                    //操作权限
                    if(this.form.operations){
                        let typeArray=this.form.operations.map(item=>{
                            return item.moduleName
                        })
                        this.type=typeArray
                    }
                }
            },
            //单位树
            async getUnitTree() {
                let res=await api.getUnitTree()
                this.unitTreeData=res.body;
            },
            //部门树
            async getDepartTree() {
                let res=await api.getDepartTree()
                this.departTreeData=res.body;
            },
            //承办人员树
            async getUndertakerTree(){
                let res=await api.getUndertakerTree()
                this.undertakerTreeData=res.body;
            },
            //保存单位树
            saveUnitTree(){
                let unitArr=[]
                let arr=this.$refs.unitTree.getCheckedNodes().map(item=>{
                    unitArr.push(item.unitName)
                    return {unitId:item.unitId,unitName:item.unitName}
                })
                this.unit=unitArr.join(',')
                this.form.unit=arr.length>0?arr:[]
                this.treeShow = false;
            },
            //保存部门树
            saveDepartTree(){
                let departArr=[]
                let arr=[]
                this.$refs.departTree.getCheckedNodes().map(item => {
                    if (item.type === 1){
                        departArr.push(item.name)
                        arr.push({deptId:item.id,deptName:item.name})
                    }
                })
                this.dept=''
                this.dept=departArr.join(',')
                this.form.dept=departArr.length>0?arr:[]
                this.treeShow2 = false;
            },
            //保存承办人树
            saveUndertakerTree(){
                let undertakerArr=[]
                let arr=[]
                this.$refs.undertakerTree.getCheckedNodes().map(item=>{
                    if (item.type === 2) {
                        undertakerArr.push(item.name)
                        arr.push({undertakerId: item.id, undertaker: item.name})
                    }
                })
                this.undertaker=undertakerArr.join(',')
                this.form.undertaker=arr.length>0?arr:[]
                this.treeShow3 = false;
            },
            //保存案由树
            saveCauseTree(){
                this.treeShow4 = false;
            },
            //保存模块授权
            async saveModuleInfo(){
                let selectData=this.$refs.treeBox.$refs.tree.getCheckedKeys()
                let selectNodes=this.$refs.treeBox.$refs.tree.getCheckedNodes()
                let array=[],array2=[],array3=[];
                selectData.map(item=>{
                    let isBo=true
                    for(let i=0;i<this.initData.length;i++){
                        if(item===this.initData[i].moduleId){
                            isBo=false
                            array.push(this.initData[i])
                            break;
                        }
                    }
                    if(isBo){
                        array2.push(item)
                    }
                })
                selectNodes.map(item=>{
                    if(array2.includes(item.id)){
                        if(item.type===2&&item.supportPower===1){
                            array3.push({
                                "roleId":this.row.roleId,
                                "roleName": this.row.roleName,
                                "moduleId": item.id,
                                "moduleName": item.name,
                                unitRange:1,//单位范围
                                unit:[],
                                deptRange:1,//部门范围
                                dept:[],
                                staffRange:1,//人员范围
                                undertakerRange: 1,//承办人范围
                                undertaker:[],
                                //caseNodeRange:'',//办案节点范围
                                causeRange:4,//案由范围
                                cause:[],//案由
                            })
                        }else{
                            array3.push({
                                "roleId":this.row.roleId,
                                "roleName": this.row.roleName,
                                "moduleId": item.id,
                                "moduleName": item.name,
                            })
                        }
                    }
                })
                let isBoS=true
                for(let i=0;i<array.length;i++){
                    array[i].roleName=this.row.roleName;
                    array[i].roleId=this.row.roleId;
                    if(array[i].unitRange===3){
                        if(array[i].unit.length===0){
                            this.$msgW('请选择单位')
                            isBoS=false
                            break;
                        }
                    }
                    if(array[i].deptRange===3){
                        if(array[i].dept.length===0){
                            this.$msgW('请选择部门')
                            isBoS=false
                            break;
                        }
                    }
                    if(array[i].undertakerRange===3){
                        if(array[i].undertaker.length===0){
                            this.$msgW('请选择承办人')
                            isBoS=false
                            break;
                        }
                    }
                }
                if(!isBoS)return
                await api.rolePowers([...array,...array3],this.row.roleId)
                this.$msgS('授权成功')
                this.$emit('saveModuleInfo')
            },
            inputFocus(){
                this.treeShow = true;
            },
            inputFocus2(){
                this.treeShow2 = true;
            },
            inputFocus3(){
                this.treeShow3 = true;
            },
            inputFocus4(){
                this.treeShow4 = true;
            },
            handleNodeClick(item){
                //this.form.courtName=item.unitName
                //this.treeShow = false;
            },
            handleNodeClick2(item){

            },
            handleNodeClick3(item){

            },
            handleNodeClick4(item){

            },
            queryHide(e){
                if ((!this.$refs.queryBox.contains(e.target)) && (!this.$refs.queryDown.contains(e.target))) {
                    /* 关闭元素 */
                    this.treeShow = false
                }
            },
            queryHide2(e){
                if ((!this.$refs.queryBox2.contains(e.target)) && (!this.$refs.queryDown2.contains(e.target))) {
                    /* 关闭元素 */
                    this.treeShow2 = false
                }
            },
            queryHide3(e){
                if ((!this.$refs.queryBox3.contains(e.target)) && (!this.$refs.queryDown3.contains(e.target))) {
                    /* 关闭元素 */
                    this.treeShow3 = false
                }
            },
            queryHide4(e){
                if ((!this.$refs.queryBox4.contains(e.target)) && (!this.$refs.queryDown4.contains(e.target))) {
                    /* 关闭元素 */
                    this.treeShow4 = false
                }
            },
            getAppNameList() {
                if (this.activeName === "second") {
                    this.$refs.secondBody.loading = true;
                    this.$nextTick(()=>{
                        systemManagementApi.getRolePortals(this.row.roleId).then(res => {
                          this.$refs.secondBody.authorizedInfo = res.body;
                          let value = [];
                          for (let item of res.body) {
                            value.push(item.id);
                          }
                          this.$refs.secondBody.value = value;
                        });
                        systemManagementApi.getPortalData(1,1000).then(res => {
                            this.portalNameList = res.body;
                            this.$refs.secondBody.loading = false;
                        });
                    })
                } else if (this.activeName === "third") {
                    this.$refs.thirdBody.loading = true;
                    this.$nextTick(() => {
                        systemManagementApi.getRoleLnks(this.row.roleId).then(res => {
                          this.$refs.thirdBody.authorizedInfo = res.body;
                          let value = [];
                          for (let item of res.body) {
                            value.push(item.id);
                          }
                          this.$refs.thirdBody.value = value;
                        });
                        systemManagementApi.getFastWayData(1,1000).then(res => {
                          this.fastWayNameList = res.body;
                          this.$refs.thirdBody.loading = false;
                        });
                    })
                }
            },
            delInfo(ids) {
              systemManagementApi.delRolePortals(ids).then(res => {
                  this.$message.success("删除成功!!!");
              });
            },
            saveInfo(ids){
                if (this.activeName === "second") {
                    systemManagementApi.saveRolePortals(this.row.roleId, ids).then(res => {
                        this.$message.success("添加成功!!!");
                    });
                } else if (this.activeName === "third") {
                    systemManagementApi.saveRoleLnks(this.row.roleId, ids).then(res => {
                        this.$message.success("保存成功!!!");
                    });
                }
            },
            closeDialog() {
                this.$emit("closeDialog");
            }
        }
    }
</script>

<style lang="less" scoped>
    .setColor{
        color:#2F8DED;
    }
    .el-tab-pane-div {
      border: gainsboro solid 1px;
      padding:0 15px;
      border-bottom: gainsboro solid 0px;
    }
    .dialog-authorize-body {
        width:100%;
        height:480px;
        .content-left{
            width:30%;
            height:100%;
            float:left;
            &>div{
                width:100%!important;
                max-width:300px!important;
            }
        }
        .content-center{
            width:70%;
            float:left;
        }
        .choice-box{
            float:right;
            .tree_radio {
                position: absolute;
                z-index: 100;
                top: 108%;
                left: 0;
                width: 100%;
                height: 240px;
                /*overflow: auto;*/
                border: solid 1px #dcdcdc;
                background-color: #fff;
                .el-tree{
                    height: 200px;
                    overflow: auto;
                }
            }
        }
    }
</style>
<style lang="less">
    .authorize {
      .el-tabs__item {
        padding: 0;
      }
    }
    .dialog-authorize-body {
        .content-center{
            .el-form{
                .el-input,.el-select{
                    width:300px!important;
                }
                .choice-box{
                    .selectRadio {
                        position:relative;
                        /*margin-bottom:20px;*/
                        i{
                            color: #C0C4CC;
                        }
                    }
                    .el-input,.el-select{
                        width:250px!important;
                        margin-right:5px;
                    }
                }
            }
        }
    }
</style>