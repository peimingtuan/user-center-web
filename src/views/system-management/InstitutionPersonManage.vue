<template>
  <div class="institution-person-manage">
    <dialog-show class="dialogInstitutionShow" ref="dialogInstitutionShow" @saveInfo="saveInfo" :title="updateFlag ? '修改信息' : '添加信息'">
      <dialog-institution-body
                              ref="DialogInstitutionBody"
                              slot="main-body"
                              :jobList="jobList"
                              :roleList="roleList"
                              :deptInfoList="deptInfoList"
                              :updateFlag="updateFlag"/>
    </dialog-show>
    <!-- 法院树 -->
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
      <head-box class="public-header-option" :btnList="btnList" @add="add">
        <el-col :span="6" :offset="3">
          <el-input v-model.trim="search" placeholder="输入姓名" clearable @change="pageIndex = 1">
            <el-button slot="append" icon="el-icon-search" :disabled="loadingTree" @click="searchStaffBySearch(search)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12" :offset="2">
          <el-row>
            <el-col :span="6">
              <el-button type="primary" icon="el-icon-download" @click="downloadModel">下载模板</el-button>
            </el-col>
            <el-col :span="4" :offset="1">
              <el-button type="primary" icon="el-icon-bottom-right" @click="importExcel">导入</el-button>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-badge :value="failureCount" class="item">
                <el-button type="primary" @click="showImportFailureVisible = true">导入失败</el-button>
              </el-badge>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-button type="primary" icon="el-icon-top-right" @click="checkExportInfo">导出</el-button>
            </el-col>
          </el-row>
        </el-col>
      </head-box>
      
      <table-box
                class="public-table-box-scroll"
                v-loading="loadingTable"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :selection="false"
                :tableKey="tableKey"
                :tableData="tableData">
        <el-table-column slot="sex" label="性别" width="50">
          <template slot-scope="scope">
            <div>{{ scope.row.sex === 1 ? '男':'女' }}</div>
          </template>
        </el-table-column>
        <el-table-column slot="operate" label="操作" width="200">
          <template slot-scope="scope">
            <div class="isedit">
              <span @click="edit(scope.row.staffId)">修改</span>
              <span @click="delInfo(scope.row.staffId)">删除</span>
            </div>
          </template>
        </el-table-column>
      </table-box>
      
      <el-dialog title="导入人员信息确认" width="40%" :visible.sync="showImportDialogVisible">
        <el-form label-width="150px">
          <el-form-item label="所属单位">
            <el-input v-model="unitName" readonly></el-input>
          </el-form-item>
          <el-form-item label="所属部门">
            <el-input v-model="deptName" readonly></el-input>
          </el-form-item>
          <el-form-item label="上传文件">
            <el-upload
                      action=""
                      accept=".xls,.xlsx"
                      :limit="1"
                      :http-request="uploadSectionFile">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请在下载模板,填充数据后进行上传,只能上传.xls或.xlsx文件，且不超过50M</div>
            </el-upload>
          </el-form-item>
        </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="showImportDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="startImport">确 定</el-button>
       </span>
      </el-dialog>
      
      <el-dialog title="导出人员信息确认" width="40%" :visible.sync="showExportDialogVisible">
        <el-row v-if="disable">
          <span style="font-size: 20px;">全部导出？</span>
        </el-row>
        <el-form label-width="150px" v-else>
          <el-form-item label="所属单位">
            <el-input v-model="unitName" readonly></el-input>
          </el-form-item>
          <el-form-item label="所属部门">
            <el-input v-model="deptName" readonly ></el-input>
          </el-form-item>
          <el-form-item label="导出数量">
            <el-input v-model="total" readonly></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showExportDialogVisible = false" style="margin: 10px;">取 消</el-button>
          <el-button type="primary" @click="exportExcel" >确 定</el-button>
        </span>
      </el-dialog>
      
      <el-dialog title="导入失败" width="60%" :visible.sync="showImportFailureVisible">
        <table-box
                  class="public-table-box-scroll"
                  v-loading="loadingTable"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  :selection="false"
                  :tableKey="tableKey"
                  :tableData="failureTable">
          <el-table-column slot="sex" label="性别" width="50">
            <template slot-scope="scope">
              <div>{{ scope.row.sex === 1 ? '男':'女' }}</div>
            </template>
          </el-table-column>
          <el-table-column slot="message" label="错误信息" width="50">
            <template slot-scope="scope">
              <div>{{ scope.row.importErrorDesc }}</div>
            </template>
          </el-table-column>
          <el-table-column slot="operate" label="操作" width="150">
            <template slot-scope="scope">
              <div class="isedit">
                <span @click="failureAdd(scope.$index,scope.row)">手动添加</span>
                <span @click="failureDel(scope.$index)">直接删除</span>
              </div>
            </template>
          </el-table-column>
        </table-box>
      </el-dialog>
      <el-dialog title="职务详情" width="40%" :visible.sync="showJobDialogVisible">
       <table-box
                 class="public-table-box-scroll"
                 :selection="false"
                 :tableKey="jobTableKey"
                 :tableData="jobListTable">
      </table-box>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showJobDialogVisible = false">关 闭</el-button>
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
  import {search} from "../../api/roles/api.js"
  import md5 from 'js-md5'
  export default {
    name: "InstitutionPersonManage",
    components: {
      scrollTreeBox:()=>import('./department-manage-dialog/ScrollTreeBox'),
      headBox:()=>import("@/components/head-box"),
      tableBox:()=>import('@/components/table-box'),
      pagingBox:()=>import('@/components/paging-box'),
      dialogShow:()=>import("../../components/dialog"),
      DialogInstitutionBody:()=>import("./institution-person-dialog/DialogInstitutionBody"),
    },
    data() {
      return {
        baseUrl: process.env.NODE_ENV === 'production' ? './' : 'http://10.51.23.129:8099/wj-ums/',
        loadingTree: false,
        loadingTable: false,
        bsTreeData: [],
        unitId: '',
        unitName: '',
        unitCode: '',
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
        
        search:'',
        btnList: [{name: '添加', event: 'add', icon: 'el-icon-plus'}],
        deptInfoList: [],
        jobList: [],
        roleList: [],
        jobTableKey: [{prop: 'jobName', label: '职务名称', tooltip: true},{prop: 'jobCode', label: '职务代码', tooltip: true}],
        jobListTable: [],
        showImportDialogVisible: false,
        importFile: '',
        showImportFailureVisible: false,
        failureCount: 0,
        failureTable: [],
        showExportDialogVisible: false,
        exportExcelUrl: '',
        showJobDialogVisible: false,
        disable: true,
        tableKey:[{prop: 'name', label: '姓名', tooltip: true, width: 100},
                  {slot: 'sex'},
                  {prop: 'unitName', label: '所属单位', tooltip: true, width: 200},
                  {prop: 'deptName', label: '所属部门', tooltip: true, width: 150},
                  {prop: 'phone', label: '联系电话', tooltip: true},
                  {prop: 'email', label: '邮箱', tooltip: true},
                  {slot: 'message'},
                  {slot: 'operate'}],
        tableData: [],
        updateFlag: false,
        
        pageIndex: 1,
        pageSize: 9,
        total: 0,
      }
    },
    mounted() {
      this.loadingTree = true;
      //获取单位部门树
      systemManagementApi.getDeptsTree().then(res => {
        this.loadingTree = false;
        if (!res.success) {
          errorMsg(res.message);
          return false;
        }
        //左侧单位树默认选中和展开root节点
        this.defaultExpandedKeys = [res.body[0].id];
        this.unitId = res.body[0].id;
        this.currentNodeKey = res.body[0].id;
        this.bsTreeData = res.body;
        this.getStaff({"page": this.pageIndex, "pageSize": this.pageSize});
      });
      //提供职务以供选择
      systemManagementApi.getJobInfo({}).then(res => {
        if (!res.success) {
          warningMsg('暂无职务可供选择');
          return false;
        }
        this.jobList = res.body;
      });
      //提供角色以供选择
      search().then(res => {
        if (!res.success) {
          warningMsg('暂无角色可供选择');
          return false;
        }
        this.roleList = res.body;
      });
    },
    methods: {
      treeClick(data) {
        if (this.currentNodeKey == data.id) return false;
        this.search = '';
        this.pageIndex = 1;
        this.currentNodeKey = data.id;
        //根节点不能添加人员
        if (data.id === this.bsTreeData[0].id) {
          this.unitId = data.id;
          this.disable = true;
          this.getStaff({"page": this.pageIndex, "pageSize": this.pageSize});
          return false;
        }
        this.disable = false;
        //单位节点
        if (data.type === 0) {
          this.isUnitNode = true;
          this.unitId = data.id;
          this.unitName = data.name;
          this.unitCode = data.code;
          this.deptId = '';
          this.deptName = '';
          this.searchStaffByUnitId();
          //查询单位下的部门
          systemManagementApi.getDeptInfo({"unitId": this.unitId}).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.deptInfoList = res.body;
          });
         //部门节点 
        } else {
          this.isUnitNode = false;
          this.deptId = data.id;
          this.deptName = data.name;
          this.deptInfoList = [];
          this.deptInfoList.push({'deptId':this.deptId,'deptName':this.deptName})
          this.searchStaffByDeptId();
        }
      },
      add() {
        this.search = '';
        if (this.disable) {
          errorMsg("请在左侧点击选择具体单位或部门！！！");
          return false;
        }
        this.updateFlag = false;
        this.$refs.dialogInstitutionShow.dialogFormVisible = true;
        this.$nextTick(()=>{
          this.$refs.DialogInstitutionBody.show();
          if (!this.isUnitNode) {
            this.$refs.DialogInstitutionBody.form.deptId = this.deptId;
            this.$refs.DialogInstitutionBody.form.deptName = this.deptName;
          } 
        })
      },
      //查询单位下的人员
      searchStaffByUnitId() {
        const params = {"unitId": this.unitId, "page": this.pageIndex, "pageSize": this.pageSize};
        this.getStaff(params);
      },
      //查询部门下的人员
      searchStaffByDeptId() {
        const params = {"deptId": this.deptId, "page": this.pageIndex, "pageSize": this.pageSize};
        this.getStaff(params);
      },
      //模糊查询
      searchStaffBySearch(search) {
        const params = {"name": this.search, "page": this.pageIndex, "pageSize": this.pageSize};
        //根节点
        if (this.currentNodeKey === this.bsTreeData[0].id) {}
        else if (this.isUnitNode) params["unitId"] = this.unitId;
        else params["deptId"] = this.deptId;
        this.getStaff(params);
      },
      getStaff(params) {
        this.loadingTable = true;
        systemManagementApi.getStaff(params).then(res => {
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
          this.searchStaffByUnitId();
        } else {
          this.searchStaffByDeptId(); 
        }
      },
      //保存数据
      saveInfo() {
        //校验必填字段
        const successValidate = this.$refs.DialogInstitutionBody.submitForm();
        if (successValidate) {
          const form = this.$refs.DialogInstitutionBody.form;
          form.unitId = this.unitId;
          form.unitName = this.unitName;
          if (this.updateFlag) {
            //更新
            systemManagementApi.updateStaff(form.staffId, form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.flushData();
              successMsg("修改成功!!!");
            });
          } else {
            //新增
            systemManagementApi.saveStaff(form).then(res => {
              if (!res.success) {
                errorMsg(res.message);
                return false;
              }
              this.flushData();
              successMsg("保存人员信息成功!!!");
              if (this.$refs.DialogInstitutionBody.createLoginInfo) {
                form.password = md5(form.password);
                form['relatedId'] = res.body.id;
                form['unitId'] = this.unitId;
                form['unitCode'] = this.unitCode;
                systemManagementApi.saveUserInfo(form).then(res => {
                  if (!res.success) {
                    errorMsg(res.message);
                    return false;
                  }
                  successMsg("创建用户成功!!!");
                });
              }
            });
          }
          this.$refs.dialogInstitutionShow.dialogFormVisible = false;
        }
      },
      //修改
      edit(staffId) {
        this.search = '';
        if (this.disable) {
          errorMsg("请在左侧点击选择具体部门！！！");
          return false;
        }
        this.updateFlag = true;
        this.$refs.dialogInstitutionShow.dialogFormVisible=true;
        systemManagementApi.getStaffById(staffId).then(res => {
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          let jobIds = [];
          for (let jobInfo of res.body.jobList) {
            jobIds.push(jobInfo.jobId);
          }
          res.body['jobIds'] = jobIds;
          this.$nextTick(()=>{
            this.$refs.DialogInstitutionBody.show(res.body)
          });
        }); 
      },
      //删除
      delInfo(staffId) {
        MessageBox.confirm('确认删除???', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          systemManagementApi.deleteStaff(staffId).then(res => {
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
        this.searchStaffBySearch(this.search);
      },
      importExcel() {
        if (this.isUnitNode) {
          errorMsg("请在左侧点击选择具体部门！！！");
          return false;
        }
        this.showImportDialogVisible = true;
      },
      //下载模板
      downloadModel() {
        systemManagementApi.downloadStaffDemo().then(res =>{
          let blob = new Blob([res], {
                    type: 'application/vnd.ms-excel'
                  });
          let fileName = 'import_staff.xls';
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
          } else {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            //释放内存
            window.URL.revokeObjectURL(link.href)
          }
        });
      },
      //导入文件上传
      uploadSectionFile(file) {
        console.log(file);
        this.importFile = '';
        const isExpectFile = file.file.type === 'application/vnd.ms-excel' || file.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isExpectFile) {
          errorMsg('只能上传.xls或.xlsx文件!!!');
          return false;
        }
        const isLt50M = file.file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
          errorMsg('上传文件最大为50M!!!');
          return false;
        }
        this.importFile = file.file;
      },
      //开始导入
      startImport() {
        if (!this.importFile){
          errorMsg('请上传excel文件');
          return false;
        }
        let params = new FormData();
        params.append('unitId',this.unitId);
        params.append('unitName',this.unitName);
        params.append('file',this.importFile);
        if (!this.isUnitNode) {
          params.append('deptId',this.deptId);
          params.append('deptName',this.deptName);
        }
        systemManagementApi.importStaffExcel(params).then(res => {
          this.showImportDialogVisible = false;
          if (!res.success) {
            errorMsg(res.message);
            return false;
          }
          this.failureCount = res.body.length;
          this.failureTable = res.body;
          this.searchStaffByDeptId();
        });
      },
      //导入失败手动添加
      failureAdd(index, row) {
        this.failureTable.splice(index,1);
        this.failureCount--;
        this.$refs.dialogInstitutionShow.dialogFormVisible = true;
        this.$nextTick(()=>{
          this.$refs.DialogInstitutionBody.show(row);
        })
      },
      //导入失败删除
      failureDel(index) {
        this.failureTable.splice(index,1);
        this.failureCount--;
      },
      //检查导出信息
      checkExportInfo() {
        this.showExportDialogVisible = true;
        if (this.unitId === this.bsTreeData[0].id) {
          this.exportExcelUrl = "/api/v2/staffs/export";
        } else if (this.isUnitNode) {
          this.exportExcelUrl = "/api/v2/staffs/export?unitId=" + this.unitId;
        } else {
          this.exportExcelUrl = "/api/v2/staffs/export?unitId=" + this.unitId + "&deptId=" + this.deptId;
        }
      },
      //导出
      exportExcel() {
        this.showExportDialogVisible = false;
        systemManagementApi.exportStaffExcel(this.exportExcelUrl).then(res => {
          let blob = new Blob([res], {
                    type: 'application/vnd.ms-excel'
                  });
          let fileName = 'temporary' + Date.parse(new Date()) +'.xls';
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
          } else {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            //释放内存
            window.URL.revokeObjectURL(link.href)
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .institution-person-manage {

  }
</style>
<style lang="less">
  .institution-person-manage {
    .dialogInstitutionShow{
      .el-dialog{
        width:800px;
      }
    }
  }
</style>