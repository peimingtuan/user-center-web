<template>
  <div class="dialog-role-body">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth" >
        <el-input v-model.trim="form.roleName" maxlength="50" autocomplete="off" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="角色代码" prop="roleCode" :label-width="formLabelWidth" >
        <el-input maxlength="20" v-model.trim="form.roleCode"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth" >
        <el-input maxlength="50" type="textarea" v-model="form.roleDesc" placeholder="......"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "DialogRoleBody",
  data() {
    return {
      form: {
        roleId: '',
        roleName: '',
        roleCode: '',
        roleDesc: '',
        initData: '',
      },
      formLabelWidth: '150px',
      rules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
        ],
        roleCode: [
          {required: true, message: '请输入角色代码', trigger: 'blur'},
        ],
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(row) {
      this.$refs.ruleForm.resetFields();
      if (row) {
        for (let i in row) {
          this.form[i] = row[i]
        }
      } else {
        this.form = {
          roleId: '',
          roleName: '',
          roleCode: '',
          roleDesc: '',
          initData: 2,
        }
      }
    },
    submitForm() {
      let flag;
      this.$refs.ruleForm.validate((valid) => {
        flag = valid;
      });
      return flag;
    },
  },
}
</script>

<style lang="less" scoped>
.dialog-role-body {

}
</style>
<style lang="less">

</style>