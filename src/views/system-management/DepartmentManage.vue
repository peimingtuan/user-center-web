<template>
  <div class="department-manage">
    <dialog-show ref="dialogShow" @saveInfo="saveInfo" :title="updateFlag ? '修改信息' : '添加信息'">
      <dialog-department-body ref="DialogDepartmentBody" slot="main-body" :staffList="staffList"/>
    </dialog-show>
    <!-- 单位部门树 -->
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
    <!-- 右部 -->
    <div class="public-tree-right-content">
      <head-box
               class="public-header-option"
               :btnList="btnList"
               @add="add"
               @search="search">
        <el-col :offset="1"></el-col>
        <el-input v-model.trim="search" placeholder="输入部门名称" clearable @change="pageIndex = 1"></el-input>
        <el-button type="primary" icon="el-icon-search" :disabled="loadingTree" @click="searchDeptsData(search)">查询</el-button>
      </head-box>
      <!-- 表格 -->
      <table-box
                class="public-table-box-scroll"
                v-loading="loadingTable"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :selection="false"
                :tableKey="tableKey"
                :tableData="tableData">
        <el-table-column slot="businessDept" label="是否业务部门">
          <template slot-scope="scope">
            <div>{{scope.row.businessDept === 1 ? '是' : '否'}}</div>
          </template>
        </el-table-column>
        <el-table-column slot="operate" label="操作" width="150">
          <template slot-scope="scope">
            <div class="isedit">
              <span @click="edit(scope.row)">修改</span>
              <span @click="delInfo(scope.row.deptId)">删除</span>
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
  import {successMsg,warningMsg,errorMsg} from "../../ui"
  import {treeList} from "@/assets/js/tree-data.js"
  import * as systemManagementApi from "../../api/system-management-api.js"
  
  export default {
    name: "DepartmentManage",
    components: {
      scrollTreeBox: () => import('./department-manage-dialog/ScrollTreeBox'),
      headBox: () => import("@/components/head-box"),
      tableBox: () => import('@/components/table-box'),
      pagingBox: () => import('@/components/paging-box'),
      dialogShow: () => import("../../components/dialog"),
      DialogDepartmentBody: () => import("./department-manage-dialog/DialogDepartmentBody"),
    },
    data() {
      return {
        loadingTree: false,
        loadingTable: false,
        bsTreeData: [],
        unitId: '',
        unitName: '',
        parentDeptId: '',
        parentDeptName: '',
        nodeKey: 'id',
        defaultProps: {
          children: 'childs',
          label: 'name'
        },
        defaultExpandedKeys: [],
        currentNodeKey: '',
        isUnitNodeId: true,
        
        disable: true,
        btnList:[{name:'添加',event:'add',icon:'el-icon-plus'}],
        staffList: [],
        search:'',
        
        tableKey:[{prop: 'deptName', label: '部门名称', tooltip:true},
                  {prop: 'deptCode', label: '部门代码', tooltip:true},
                  {prop: 'unitName', label: '所属单位', tooltip:true, width:200},
                  {slot: 'businessDept'},
                  {prop: 'deptDesc', label: '描述', tooltip: true, width: 200},
                  {slot: 'operate'}],
        tableData: [],
        updateFlag: false,
        
        pageIndex: 1,
        pageSize: 9,
        total: 0
      }
    },
    mounted() {
      this.loadingTree = true;
      systemManagementApi.getDeptsTree().then(res => {
        if (!res.success) {
          errorMsg(res.message);
          return false;
        }
        //左侧单位树默认选中和展开root节点
        this.defaultExpandedKeys = [res.body[0].id];
        this.currentNodeKey = res.body[0].id;
        this.bsTreeData = res.body;
        this.loadingTree = false;
        this.searchAllDeptInfo();
      });
    },
    methods: {
      //获取单位部门树
       searchDeptsTree() {
        this.loadingTree = true;
        systemManagementApi.getDeptsTree().then(res => {
          this.loadingTree = false;
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.bsTreeData = res.body;
        });
      },
      treeClick(val) {
        if (this.currentNodeKey == val.id) return false;
        this.search = '';
        this.pageIndex = 1;
        this.staffList = [];
        this.currentNodeKey = val.id;
        //根节点不能添加部门
        if (val.id === this.bsTreeData[0].id){
          this.disable = true;
          this.searchAllDeptInfo();
          return false;
        }
        if (val.type === 0) {
          this.isUnitNode = true;
          this.unitId = val.id;
          this.unitName = val.name;
          this.searchDeptInfoByUnitId();
        } else {
          this.isUnitNode = false;
          this.parentDeptId = val.id;
          this.parentDeptName = val.name;
          this.searchDeptInfoByParentDeptId();
        }
        this.disable = false;
        this.searchStaffByUnitId();
      },
      add() {
        this.search = '';
        if (this.disable) {
          errorMsg("请在左侧点击选择具体单位！！！");
          return false;
        }
        this.updateFlag = false;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.DialogDepartmentBody.show();
        })
      },
      //查询单位下的人员
      searchStaffByUnitId() {
        const params = {"unitId": this.unitId, "page": this.pageIndex, "pageSize": this.pageSize};
        systemManagementApi.getStaff(params).then(res => {
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.staffList = res.body;
        });
      },
      //查询所有部门
      searchAllDeptInfo() {
        this.loadingTable = true;
        systemManagementApi.getDeptInfo({"page": this.pageIndex, "pageSize": this.pageSize}).then(res => {
          this.loadingTable = false;
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.tableData = res.body;
          this.total = res.count;
        });
      },
      //查询单位下的部门
      searchDeptInfoByUnitId() {
        this.loadingTable = true;
        const params = {"unitId": this.unitId, "page": this.pageIndex, "pageSize": this.pageSize};
        systemManagementApi.getDeptInfo(params).then(res => {
          this.loadingTable = false;
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.tableData = res.body;
          this.total = res.count;
        });
      },
      //查询部门下的部门
      searchDeptInfoByParentDeptId() {
        this.loadingTable = true;
        const params = {"parentDeptId": this.parentDeptId, "page": this.pageIndex, "pageSize": this.pageSize};
        systemManagementApi.getDeptInfo(params).then(res => {
          this.loadingTable = false;
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.tableData = res.body;
          this.total = res.count;
        });
      },
      //模糊查询
      searchDeptsData(search){
        this.loadingTable = true;
        const params = {"search": search, "page": this.pageIndex, "pageSize": this.pageSize};
        //根节点
        if (this.currentNodeKey === this.bsTreeData[0].id) {}
        else if (this.isUnitNode) params["unitId"] = this.unitId;
        else params["parentDeptId"] = this.parentDeptId;
        systemManagementApi.getDeptInfo(params).then(res => {
          this.loadingTable = false;
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.tableData = res.body;
          this.total = res.count;
        });
      },
      //刷新数据
      flushData() {
        this.searchDeptsTree();
        if (this.isUnitNode) {
          this.defaultExpandedKeys = [this.unitId];
          this.searchDeptInfoByUnitId();
        } else {
          this.defaultExpandedKeys = [this.parentDeptId];
          this.searchDeptInfoByParentDeptId(); 
        }
      },
      //保存数据
      saveInfo() {
        //校验必填字段
        const successValidate = this.$refs.DialogDepartmentBody.submitForm();
        if (successValidate) {
          const form = this.$refs.DialogDepartmentBody.form;
          //更新
          if (this.updateFlag) {
            systemManagementApi.updateDeptInfo(form.deptId, form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              if (this.isUnitNode) {
                this.defaultExpandedKeys = [this.unitId];
                this.searchDeptInfoByUnitId();
              } else {
                this.defaultExpandedKeys = [this.parentDeptId];
                this.searchDeptInfoByParentDeptId(); 
              }
              successMsg("修改成功!!!");
            });
           //新增
          } else {
            form.unitId = this.unitId;
            form.unitName = this.unitName;
            //部门节点需要加上父部门id和name
            if (!this.isUnitNode) {
              form.parentDeptId = this.parentDeptId;
              form.parentDeptName = this.parentDeptName;
            }
            systemManagementApi.saveDeptInfo(form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.flushData();
              successMsg("保存成功!!!");
            });
          }
          //在发生变化后左侧树打开至变化节点
          if (this.isUnitNode) {
            this.defaultExpandedKeys = [this.unitId];
          } else {
            this.defaultExpandedKeys = [this.parentDeptId];
          }
          this.$refs.dialogShow.dialogFormVisible = false;
        }
      },
      //修改数据
      edit(row) {
        this.search = '';
        this.updateFlag = true;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.DialogDepartmentBody.show(row);
        });
      },
      delInfo(depdId) {
        MessageBox.confirm('确认删除???', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          systemManagementApi.deleteDeptInfo(depdId).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.flushData();
            successMsg("删除成功!!!");
          });
        });
      },
      handleCurrentChange(page) {
        this.pageIndex = page;
        if (this.search) {
          this.searchDeptsData(this.search);
        } else {
          if (this.isUnitNode) {
            this.searchDeptInfoByUnitId();
          } else {
            this.searchDeptInfoByParentDeptId(); 
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .department-manage {

  }
</style>
<style lang="less">

</style>