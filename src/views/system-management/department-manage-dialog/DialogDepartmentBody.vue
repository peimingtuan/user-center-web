<template>
  <div class="dialog-department-body">
    <el-form :model="form" ref="ruleForm" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model.trim="form.deptName" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="部门代码" prop="deptCode">
        <el-input v-model.trim="form.deptCode" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="是否业务部门">
        <el-select v-model="form.businessDept">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分管领导">
        <el-select
                  placeholder="请选择(多选,最多3个)" 
                  multiple
                  filterable
                  v-model="deptContactArray"
                  @change="limitNumber">
          <el-option
                    v-for="item in staffList"
                    :label="item.name"
                    :value="item.staffId"
                    :key="item.staffId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :maxlength="200" style="width: 450px;" :rows="4" v-model="form.deptDesc" placeholder="......200字以内"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {errorMsg} from "../../../ui"
  
  export default {
    name: "DialogDepartmentBody",
    props: {
     staffList: {
      type: Array
     }
    },
    data() {
      return {
        deptContactArray: [],
        form: {
          deptName: '',
          deptCode: '',
          unitName: '',
          businessDept: 1,
          deptContact: '',
          deptDesc: ''
        },
        formLabelWidth: '150px',
        rules: {
          deptName: [
          { required: true, message: '请输入部门名称(必填)', trigger: 'blur' },
          ],
          deptCode: [
          { required: true, message: '请输入部门代码(必填)', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      show(row) {
        if (row) {
          for (let key in row) {
            this.form[key] = row[key];
          }
          if (row.deptContact) {
            this.deptContactArray = row.deptContact.split(",");
          } else {
            this.deptContactArray = [];
          }
        }else{
          this.deptContactArray = [];
          this.form = {
            deptName: '',
            deptCode: '',
            unitName: '',
            businessDept: 1,
            deptContact: '',
            deptDesc: ''
          };
        }
      },
      submitForm() {
        let successValidate = true;
        this.$refs.ruleForm.validate((valid) => {
          if (!valid) {
            successValidate = false;
            errorMsg("您添加的信息不全!!!");
          }
        });
        return successValidate;
      },
      limitNumber() {
        if (this.deptContactArray.length > 3) {
          this.deptContactArray.pop();
          errorMsg("一个部门最多只能选择3个领导");
        }
        this.form.deptContact = this.deptContactArray.join(",");
      }
    },
  }
</script>

<style lang="less" scoped>
  .dialog-department-body {

  }
</style>
<style lang="less">

</style>