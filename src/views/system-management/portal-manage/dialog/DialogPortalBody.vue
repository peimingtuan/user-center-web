<template>
  <div class="dialog-portal-body">
    <el-form :model="form" ref="ruleForm" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="应用标识" prop="appId">
        <el-input v-model.trim="form.appId"></el-input>
      </el-form-item>
      <el-form-item label="应用名称" prop="appName">
        <el-input v-model.trim="form.appName"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name"></el-input>
      </el-form-item>
      <el-form-item label="组件类型" prop="type">
        <el-select v-model="form.type">
          <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详情地址" prop="accessUrl">
        <el-input v-model.trim="form.accessUrl" placeholder="http://ip:port/context/xxx"></el-input>
      </el-form-item>
      <el-form-item label="高度" prop="heigh">
        <el-input v-model.number="form.heigh" placeholder="取值范围(0,1000],单位px"></el-input>
      </el-form-item>
      <el-form-item label="宽度" prop="width">
        <el-input v-model.number="form.width" placeholder="取值范围(0,100],取百分比"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {errorMsg} from "@/ui"
  export default {
    name: "DialogPortalBody",
    data() {
      var checkHeigh = (rule, value, callback) => {
              if (!value) {
                return callback(new Error('高度不能为空'));
              }
              if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'));
              } else {
                if (value > 1000 || value <= 0) {
                  callback(new Error('高度取值范围(0,1000]'));
                } else {
                  callback();
                }
              }
            };
      var checkWidth = (rule, value, callback) => {
              if (!value) {
                return callback(new Error('宽度不能为空'));
              }
              if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'));
              } else {
                if (value > 100 || value <= 0) {
                  callback(new Error('宽度取值范围(0,100]'));
                } else {
                  callback();
                }
              }
            };
      return {
        typeList:[{value: 1,name:'链接类型'},
          {value: 2,name:'表格'},
          {value: 3,name:'折线图'},
          {value: 4,name:'柱状图-纵向'},
          {value: 5,name:'柱状图-横向'},
          {value: 6,name:'饼状图'},
          {value: 8,name:'雷达图'},
          {value: 255,name:'其他'}],
        form: {
          appId:'',
          appName:'',
          name:'',
          type: '',
          accessUrl: '',
          heigh: null,
          width: null,
        },
        authPicFile: '',
        formLabelWidth: '150px',
        rules: {
          appId: [
            { 
              required: true, 
              message: '请输入应用标识', 
              trigger: 'blur'
            },
          ],
          appName: [
            { 
              required: true, 
              message: '请输入应用名称', 
              trigger: 'blur'
            },
          ],
          name: [
            { 
              required: true, 
              message: '请输入名称', 
              trigger: 'blur'
            },
          ],
          type: [
            { 
              required: true, 
              message: '请输入组件类型', 
              trigger: 'blur'
            },
          ],
          accessUrl: [
            { 
              required: true, 
              message: '请输入详情地址', 
              trigger: 'blur'
            },
          ],
          heigh: [
            { 
              required: true,
              validator: checkHeigh, 
              trigger: 'blur'
            },
          ],
          width: [
            { 
              required: true,
              validator: checkWidth,
              trigger: 'blur'
            },
          ]
        }
      }
    },
    methods: {
      show(row){
        if(row){
          for(let i in row){
            this.form[i]=row[i]
          }
        } else {
          this.form = {
            appId:'',
            appName:'',
            name:'',
            type: '',
            accessUrl: '',
            heigh: null,
            width: null,
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
    }
  }
</script>

<style lang="less" scoped>
  .dialog-portal-body {

  }
</style>
<style lang="less">
</style>