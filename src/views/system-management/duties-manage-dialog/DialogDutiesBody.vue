<template>
  <div class="dialog-duties-body">
    <el-form :model="form" ref="ruleForm" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="职务名称" prop="jobName">
        <el-input v-model.trim="form.jobName" autocomplete="off" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="职务代码" prop="jobCode">
        <el-input v-model="form.jobCode" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="是否内置">
        <el-select v-model="form.isBuildIn" disabled>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职务描述">
        <el-input type="textarea" :maxlength="200" style="width: 450px;" :rows="4" v-model="form.jobDesc" placeholder="......200字以内"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {errorMsg} from "../../../ui"

  export default {
    name: "DialogDutiesBody",
    data() {
      return {
        form: {
          jobName:'',
          jobCode: '',
          isBuildIn: 2,
          jobDesc: ''
        },
        formLabelWidth: '150px',
        rules: {
          jobName: [
          { required: true, message: '请输入职务名称(必填)', trigger: 'blur' },
          ],
          jobCode: [
          { required: true, message: '请输入职务代码(必填)', trigger: 'blur' },
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
        } else {
          this.form = {
            jobName:'',
            jobCode: '',
            isBuildIn: 2,
            jobDesc: ''
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
    },
  }
</script>

<style lang="less" scoped>
  .dialog-duties-body {

  }
</style>
<style lang="less">

</style>