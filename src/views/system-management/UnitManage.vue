<template>
  <div class="unit-manage">
    <!-- 模态框,点击添加按钮弹出 -->
    <dialog-show ref="dialogShow" @saveInfo="saveInfo" :title="updateFlag ? '修改信息' : '添加信息'">
      <!-- form表单 -->
      <dialog-unit-body ref="DialogUnitBody" slot="main-body" :updateFlag="updateFlag"/>
    </dialog-show>
    <!-- 左侧单位树 -->
    <scroll-tree-box
                    ref="treeBox"
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
    <!-- 右侧内容 -->
    <div class="public-tree-right-content">
      <!-- 添加和查询 -->
      <head-box
               class="public-header-option"
               :btnList="btnList"
               @add="add">
        <el-col :offset="1"></el-col>
        <el-input v-model.trim="search" placeholder="输入单位名称或简称" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" :disabled="loadingTree" @click="searchUnitInfoBySearch(search)">查询</el-button>
      </head-box>
      <!-- 表格数据 -->
      <table-box
                class="public-table-box-scroll"
                v-loading="loadingTable"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :selection="false"
                :tableKey="tableKey"
                :tableData="tableData">
        <el-table-column slot="operate" label="操作" width="150">
          <template slot-scope="scope">
            <div class="isedit">
              <span  @click="edit(scope.row)">修改</span>
              <span  @click="delInfo(scope.row.unitId)">删除</span>
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
    name: "UnitManage",
    components: {
      scrollTreeBox: () => import('./unit-manage-dialog/ScrollTreeBox'),
      headBox: () => import("@/components/head-box"),
      tableBox: () => import('@/components/table-box'),
      pagingBox: () => import('@/components/paging-box'),
      dialogShow: () => import("../../components/dialog"),
      DialogUnitBody: () => import("./unit-manage-dialog/DialogUnitBody"),
    },
    data() {
      return {
        loadingTree: false,
        loadingTable: false,
        bsTreeData: [],
        parentUnitId: '',
        parentUnitName: '',
        parentUnitCode: '',
        nodeKey: 'unitCode',
        defaultProps: {
            children: 'children',
            label: 'unitName'
        },
        defaultExpandedKeys: [],
        currentNodeKey: '',
        btnList: [{name:'添加',event:'add', icon:'el-icon-plus'}],
        search: '',
        tableKey: [{prop: 'unitName', label: '单位名称', tooltip:true},
                   {prop: 'unitShortName', label: '单位简称', tooltip:true},
                   {prop: 'unitWord', label: '单位代字', tooltip:true},
                   {prop: 'unitCode', label: '单位代码', tooltip:true},
                   {prop: 'unitGradeCode', label: '单位分级码', tooltip: true, width: 100},
                   {prop: 'unitDesc', label: '描述', tooltip: true, width: 200},
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
      systemManagementApi.getUnitTree().then(res => {
        this.loadingTree = false;
        if (!res.success) {
          errorMsg(res.message);
          return false;
        }
        //左侧单位树默认选中和展开root节点
        this.bsTreeData = res.body;
        this.parentUnitId = res.body[0].unitId;
        this.parentUnitName = res.body[0].unitName;
        this.parentUnitCode = res.body[0].unitCode;
        this.defaultExpandedKeys = [res.body[0].unitCode];
        this.currentNodeKey = res.body[0].unitCode;
        this.searchUnitInfoByParentUnitId();
      });
    },
    methods: {
      //获取单位树
      searchUnitTree() {
        this.loadingTree = true;
        systemManagementApi.getUnitTree().then(res => {
          this.loadingTree = false;
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.bsTreeData = res.body;
        });
      },
      treeClick(val) {
        if (this.currentNodeKey == val.unitCode) return false;
        this.search = '';
        this.parentUnitId = val.unitId;
        this.parentUnitName = val.unitName; 
        this.parentUnitCode = val.unitCode;
        this.pageIndex = 1;
        this.currentNodeKey = val.unitCode;
        this.searchUnitInfoByParentUnitId();
      },
      //查询子节点
      searchUnitInfoByParentUnitId() {
          this.loadingTable = true;
          const params = {"parentUnitId": this.parentUnitId, "page": this.pageIndex, "pageSize": this.pageSize};
          systemManagementApi.getUnitInfo(params).then(res => {
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
      searchUnitInfoBySearch(search) {
        if (search.trim() === '') {
          errorMsg("请输入具体查询条件!!!");
          return false;
        }
        this.pageIndex = 1;
        const params = {"search": search, "page": this.pageIndex, "pageSize": this.pageSize};
        systemManagementApi.getUnitInfo(params).then(res => {
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.tableData = res.body;
          this.total = res.count;
        });
      },
      //添加按钮
      add() {
        this.search = '';
        this.updateFlag = false;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.DialogUnitBody.show();
        });
      },
      //修改按钮
      edit(row) {
        this.search = '';
        this.updateFlag = true;
        this.$refs.dialogShow.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.DialogUnitBody.show(row);
        });
      },
      //保存数据
      saveInfo() {
        //校验必填字段
        const successValidate = this.$refs.DialogUnitBody.submitForm();
        if (successValidate) {
          const form = this.$refs.DialogUnitBody.form;
          //更新
          if (this.updateFlag) {
            systemManagementApi.updateUnitInfo(form.unitId, form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchUnitTree();
              this.searchUnitInfoByParentUnitId();
              successMsg("修改成功!!!");
            });
            //新增
          } else {
            form.parentUnitId = this.parentUnitId;
            form.parentUnitName = this.parentUnitName;
            systemManagementApi.insertUnitInfo(form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.searchUnitTree();
              this.searchUnitInfoByParentUnitId();
              successMsg("保存成功!!!");
            });
          }
          //在发生变化后左侧树打开至变化节点
          this.defaultExpandedKeys = [form.unitCode];
          this.$refs.dialogShow.dialogFormVisible = false;
        }
      },
      //删除按钮
      delInfo(unitId) {
        MessageBox.confirm('确认删除???', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          systemManagementApi. deleteUnitInfo(unitId).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.searchUnitInfoByParentUnitId();
            this.searchUnitTree();
            this.defaultExpandedKeys = [this.parentUnitCode];
            successMsg("删除成功!!!");
          });
        });
      },
      handleCurrentChange(page) {
        this.pageIndex = page;
        if (this.search) {
          this.searchUnitInfoBySearch(this.search);
        } else {
          this.searchUnitInfoByParentUnitId();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .unit-manage {

  }
</style>
<style lang="less">

</style>