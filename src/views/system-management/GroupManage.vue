<template>
  <div class="group-manage">
    <dialog-show ref="dialogShow" @saveInfo="saveInfo" :title="updateFlag ? '修改信息' : '添加信息'">
      <!-- form表单 -->
      <dialog-group-body ref="DialogGroupBody" slot="main-body" :staffList="staffList"/>
    </dialog-show>
    <!-- 左侧树 -->
    <scroll-tree-box
                    v-loading="loadingTree"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    :treeData="bsTreeData"
                    :nodeKey="nodeKey"
                    :defaultProps="defaultProps"
                    :defaultExpandedKeys="defaultExpandedKeys"
                    :currentNodeKey="currentNodeKey"
                    @treeClick="treeClick">
    </scroll-tree-box>
    <!-- 右侧 -->
    <div class="public-tree-right-content">
      <head-box
               class="public-header-option" 
               :btnList="btnList"
               @add="add">
        <el-col :offset="1"></el-col>
        <el-input v-model.trim="search" placeholder="输入团队名称或代码" clearable @change="pageIndex = 1"></el-input>
        <el-button type="primary" icon="el-icon-search" :disabled="loadingTree" @click="searchGroupBySearch(search)">查询</el-button>
      </head-box>
      <table-box
                class="public-table-box-scroll"
                v-loading="loadingTable"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :selection="false"
                :tableKey="tableKey"
                :tableData="tableData">
        <el-table-column slot="deptName" label="所属部门">
          <template slot-scope="scope">
            <div>{{scope.row.deptName ? scope.row.deptName :'无'}}</div>
          </template>
        </el-table-column>
        
        <el-table-column slot="operate" label="操作" width="150">
          <template slot-scope="scope">
            <div class="isedit">
              <span @click="edit(scope.row)">修改</span>
              <span @click="delInfo(scope.row.groupId)">删除</span>
              <span @click="showStaffName(scope.row.groupId)">查看人员</span>
            </div>
          </template>
        </el-table-column>
      </table-box>
      <!-- 展示团队人员 -->
      <el-dialog
                title="团队人员"
                width="60%"
                :visible.sync="dialogVisible">
       <table-box
                 class="public-table-box-scroll"
                 :selection="false"
                 :tableKey="staffTableKey"
                 :tableData="groupStaffList">
        <el-table-column slot="sex" label="性别">
          <template slot-scope="scope">
            <div>{{scope.row.sex === 1 ? '男':'女'}}</div>
          </template>
        </el-table-column>
       </table-box>
       <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
       </span>
      </el-dialog>
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
  import {successMsg,warningMsg,errorMsg} from "../../ui"
  import {treeList} from "@/assets/js/tree-data.js"
  import * as systemManagementApi from "../../api/system-management-api.js"
  
  export default {
    name: "GroupManage",
    components: {
      scrollTreeBox: () => import('./department-manage-dialog/ScrollTreeBox'),
      headBox: () => import("@/components/head-box"),
      tableBox: () => import('@/components/table-box'),
      pagingBox: () => import('@/components/paging-box'),
      dialogShow: () => import("../../components/dialog"),
      DialogGroupBody: () => import("./group-manage-dialog/DialogGroupBody"),
    },
    data() {
      return {
        loadingTree: false,
        loadingTable: false,
        bsTreeData: [],
        unitId: '',
        unitName: '',
        deptId: '',
        deptName: '',
        nodeKey: 'id',
        defaultProps: {
          children: 'childs',
          label: 'name'
        },
        defaultExpandedKeys: [],
        currentNodeKey: '',
        isUnitNode: true,
        
        search: '',
        btnList: [{name: '添加', event: 'add', icon: 'el-icon-plus'}],
        disable: true,
        staffList: [],
        
        tableKey:[{prop: 'groupName', label: '团队名称', tooltip: true},
                  {prop: 'groupCode', label: '团队代码', tooltip: true},
                  {prop: 'unitName', label: '所属单位', tooltip: true},
                  {slot: 'deptName'},
                  {prop: 'groupDesc', label: '描述', tooltip: true, width: 200},
                  {slot: 'operate'}],
        tableData: [],
        dialogVisible: false,
        staffTableKey: [{prop: 'name', label: '姓名', tooltip: true, width: 100},
                        {slot: 'sex'},
                        {prop: 'unitName', label: '所属单位', tooltip: true, width: 130},
                        {prop: 'deptName', label: '所属部门',tooltip: true, width: 100},
                        {prop: 'phone', label: '联系电话', tooltip: true},
                        {prop: 'email', label: '邮箱', tooltip: true}],
        groupStaffList: [],  
        updateFlag: false,
        
        pageIndex: 1,
        pageSize: 9,
        total: 0
      }
    },
    mounted() {
      //获取单位部门树
      this.loadingTree = true;
      systemManagementApi.getDeptsTree().then(res => {
        this.loadingTree = false;
        if (!res.success) {
          errorMsg(res.message);
          return false;
        }
        //左侧单位树默认选中和展开root节点
        this.defaultExpandedKeys = [res.body[0].id];
        this.currentNodeKey = res.body[0].id;
        this.bsTreeData = res.body;
        this.getGroup({"page": this.pageIndex, "pageSize": this.pageSize});
      });
    },
    methods: {
      treeClick(val) {
        if (this.currentNodeKey == val.id) return false;
        this.search = '';
        this.pageIndex = 1;
        this.staffList = [];
        this.currentNodeKey = val.id;
        //根节点不能添加团队
        if (val.id === this.bsTreeData[0].id) {
          this.disable = true;
          this.getGroup({"page": this.pageIndex, "pageSize": this.pageSize});
          return false;
        }
        this.disable = false;
        //单位节点
        if (val.type === 0) {
          this.isUnitNode = true;
          this.unitId = val.id;
          this.unitName = val.name;
          this.searchGroupByUnitId();
          //查询单位下的人员
          systemManagementApi.getStaff({"unitId": this.unitId}).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.staffList = res.body;
          });
         //部门节点 
        } else {
          this.isUnitNode = false;
          this.deptId = val.id;
          this.deptName = val.name;
          this.searchGroupByDeptId();
          //查询部门下的人员
          systemManagementApi.getStaff({"deptId": this.deptId}).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.staffList = res.body;
          });
        }
      },
      add() {
        this.search = '';
        if (this.disable) {
          errorMsg("请在左侧点击选择具体单位或部门！！！");
          return false;
        }
        this.updateFlag = false;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.DialogGroupBody.show();
        });
      },
      //查询单位下的团队
      searchGroupByUnitId() {
        const params = {"unitId": this.unitId, "page": this.pageIndex, "pageSize": this.pageSize};
        this.getGroup(params);
      },
      //查询部门下的团队
      searchGroupByDeptId() {
        const params = {"deptId": this.deptId, "page": this.pageIndex, "pageSize": this.pageSize};
        this.getGroup(params);
      },
      //模糊查询
      searchGroupBySearch(search){
        const params = {"search": search, "page": this.pageIndex, "pageSize": this.pageSize};
        //根节点
        if (this.currentNodeKey === this.bsTreeData[0].id) {}
        else if (this.isUnitNode) params["unitId"] = this.unitId;
        else params["deptId"] = this.deptId;
        this.getGroup(params);
      },
      getGroup(params) {
        this.loadingTable = true;
        systemManagementApi.getGroup(params).then(res => {
          this.loadingTable = false;
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.tableData = res.body;
          this.total = res.count;
        });
      },
      //刷新表格数据
      flushData() {
        if(this.isUnitNode) {
          this.defaultExpandedKeys = [this.unitId];
          this.searchGroupByUnitId();
        } else {
          this.defaultExpandedKeys = [this.deptId];
          this.searchGroupByDeptId(); 
        }
      },
      //保存数据
      saveInfo() {
        //校验必填字段
        const successValidate = this.$refs.DialogGroupBody.submitForm();
        if (successValidate) {
          const form = this.$refs.DialogGroupBody.form;
          //部门节点需要加上所属部门id和name
          if (!this.isUnitNode) {
            form.deptId = this.deptId;
            form.deptName = this.deptName;
          }
          form.unitId = this.unitId;
          form.unitName = this.unitName;
          //更新
          if (this.updateFlag) {
            systemManagementApi.updateGroup(form.groupId, form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.flushData();
              successMsg("修改成功!!!");
            });
           //新增
          } else {
            systemManagementApi.saveGroup(form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.flushData();
              successMsg("保存成功!!!");
            });
          }
          this.$refs.dialogShow.dialogFormVisible = false;
        }
      },
      //修改
      edit(row) {
        this.search = '';
        //查询团队人员
        systemManagementApi.getStaffByGroupId(row.groupId).then(res => {
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.updateFlag = true;
          this.$refs.dialogShow.dialogFormVisible = true;
          this.$nextTick(()=>{
            let form = {};
            form['staffIds'] = [];
            for(let i = 0; i< res.body.staffList.length; i++){
              form.staffIds.push(res.body.staffList[i].staffId);
            }
            form['groupId'] = row.groupId;
            form['groupName'] = row.groupName;
            form['groupCode'] = row.groupCode;
            form['groupDesc'] = row.groupDesc;
            this.$refs.DialogGroupBody.show(form);
          })
        });
      },
      //删除
      delInfo(groupId) {
        MessageBox.confirm('确认删除???', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          systemManagementApi.deleteGroup(groupId).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.flushData();
            successMsg("删除成功!!!");
          });
        });
      },
      //查询团队下的人员
      showStaffName(groupId) {
        systemManagementApi.getStaffByGroupId(groupId).then(res => {
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.groupStaffList = res.body.staffList;
          this.dialogVisible = true;
        });
      },
      handleCurrentChange(page) {
        this.pageIndex = page;
        this.searchGroupBySearch(this.search);
      }
    }
  }
</script>

<style lang="less" scoped>
  .group-manage {

  }
</style>
<style lang="less">

</style>