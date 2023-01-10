<template>
  <div class="dialog-unit-body">
    <el-form :model="form" ref="ruleForm" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="团队名称" prop="groupName">
        <el-input v-model.trim="form.groupName" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="团队代码" prop="groupCode">
        <el-input v-model.trim="form.groupCode" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="团队描述">
        <el-input v-model.trim="form.groupDesc" type="textarea" :maxlength="200" style="width: 450px;" :rows="4"  placeholder="...... 200字以内"></el-input>
      </el-form-item>
      <el-form-item label="团队人员">
        <span>*请从下面的左侧列表选择人员*</span>
      </el-form-item>
      <div style="margin:20px;">
        <el-transfer
          :titles="['可选人员', '已添加人员']"
          filterable
          filter-placeholder="搜索"
          v-model="form.staffIds"
          :props="{
             key: 'staffId',
             label: 'name'
            }"
          :data="staffList">
        </el-transfer>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "DialogUnitBody",
    props:{
     staffList: {
      type:Array
     }
    },
    data() {
      return {
        staffIdList: [],
        form: {
          groupName: '',
          groupCode: '',
          staffIds: [],
          groupDesc: '',
        },
        formLabelWidth: '150px',
        rules: {
          groupName: [
          { required: true, message: '请输入单位名称(必填)', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      show(row){
        if (row) {
          for (let key in row) {
            this.form[key] = row[key];
          }
        } else {
          this.form = {
            groupName: '',
            groupCode: '',
            staffIds: [],
            groupDesc: '',
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
      }
    },
  }
</script>

<style lang="less" scoped>
  .dialog-unit-body {

  }
</style>
<style lang="less">

</style>