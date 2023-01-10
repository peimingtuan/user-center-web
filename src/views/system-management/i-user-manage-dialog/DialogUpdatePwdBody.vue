<template>
  <div class="dialog-IUser-body">
    <el-form :model="form" :rules="rules" ref="ruleForm">

      <el-form-item label="接口用户密码" prop="password"
                    :label-width="formLabelWidth">
        <el-input v-model.trim="form.password" type="password" autocomplete="off" placeholder="请输入接口用户密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password2"
                    :label-width="formLabelWidth">
        <el-input v-model.trim="form.password2" type="password" autocomplete="off" placeholder="请确认接口用户密码"></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>

export default {
  name: "DialogBody",
  data() {
    return {
      form: {
        iUserId: '',
        password: '',
        password2: ''
      },
      formLabelWidth: '150px',
      rules: {
        password: [
          {
            validator: (rule, value, callback) => {
              console.log(value)
              if (!value || value === '') {
                callback(new Error('请输入密码'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        password2: [
          {
            validator: (rule, value, callback) => {
              console.log(value)
              if (this.form.password !== null && this.form.password !== ''){
                if (!value || value === '') {
                  callback(new Error('请再次输入密码'));
                } else if (value !== this.form.password) {
                  callback(new Error('两次输入密码不一致!'));
                } else {
                  callback();
                }
              }
            },
            trigger: 'blur'
          }
        ]
      },
      row: {},
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(row) {
      this.$refs.ruleForm.resetFields();
      this.row = row
      this.form = {
        password: '',
        password2: ''
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
.dialog-IUser-body {

}
</style>
<style lang="less">

</style>