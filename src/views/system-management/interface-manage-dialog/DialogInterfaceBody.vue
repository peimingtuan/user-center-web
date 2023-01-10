<template>
  <div class="dialog-Interface-body">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="应用名称" prop="appName" :label-width="formLabelWidth">
        <el-input v-model="form.appName" :maxlength="50" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="接口名称" prop="interfaceName" :label-width="formLabelWidth">
        <el-input v-model="form.interfaceName" :maxlength="50" autocomplete="off" placeholder="请输入接口名称"></el-input>
      </el-form-item>
      <el-form-item label="接口编码" prop="interfaceCode" :label-width="formLabelWidth">
        <el-input v-model.trim="form.interfaceCode" :maxlength="50" autocomplete="off" placeholder="请输入接口编码"></el-input>
      </el-form-item>
      <el-form-item label="接口地址" prop="url" :label-width="formLabelWidth">
        <el-input v-model.trim="form.url" :maxlength="100" autocomplete="off" placeholder="请输入接口地址"></el-input>
      </el-form-item>
      <el-form-item label="请求方式" prop="method" :label-width="formLabelWidth">
        <el-select v-model="form.method">
          <el-option label="GET" key="GET" value="GET"></el-option>
          <el-option label="POST" key="POST" value="POST"></el-option>
          <el-option label="PATCH" key="PATCH" value="PATCH"></el-option>
          <el-option label="DELETE" key="DELETE" value="DELETE"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口描述" prop="desc" :label-width="formLabelWidth">
        <el-input v-model.trim="form.desc" :maxlength="200" autocomplete="off" placeholder="请输入接口描述"></el-input>
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
        appId: '',
        appName: '',
        id: '',
        interfaceName: '',
        interfaceCode: '',
        url: '',
        method: '',
        desc: '',
      },
      formLabelWidth: '150px',
      rules: {
        interfaceName: [
          {required: true, message: '请输入接口名称', trigger: 'blur'},
        ],
        interfaceCode: [
          {required: true, message: '请输入接口编码', trigger: 'blur'},
        ],
        url: [
          {required: true, message: '请输入接口地址', trigger: 'blur'},
        ],
        method: [
          {required: true, message: '请选择请求方式', trigger: 'change'}
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
          appId: '',
          appName: '',
          id: '',
          interfaceName: '',
          interfaceCode: '',
          url: '',
          method: '',
          desc: '',
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
.dialog-Interface-body {

}
</style>
<style lang="less">

</style>