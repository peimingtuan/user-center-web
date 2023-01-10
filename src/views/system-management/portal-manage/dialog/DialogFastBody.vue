<template>
  <div class="dialog-fast-body">
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
      <el-form-item label="链接地址" prop="accessUrl">
        <el-input v-model.trim="form.accessUrl"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.lnkDesc" type="textarea" maxlength="200" style="width: 450px;" :rows="4" placeholder="...... 200字以内"></el-input>
      </el-form-item>
      <el-form-item label="图标文件" class="red-label">
       <div class="id-card-box">
        <div class="img-box">
         <div>
          <el-upload
              class="avatar-uploader"
              action=""
              accept="image/png,image/jpeg"
              :show-file-list="false"
              :http-request="uploadSectionFile"
          >
           <img v-if="authPicFile" :src="authPicFile" class="avatar-img">
           <i v-else class="el-icon-plus avatar-uploader-icon"></i>
           <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过50kb</div>
          </el-upload>
         </div>
         <div>请上传图标文件</div>
        </div>
       </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {errorMsg} from "@/ui"
  export default {
    name: "DialogFastBody",
    data() {
      return {
        form: {
          appId: '',
          appName: '',
          name: '',
          logoFile: null,
          accessUrl: '',
          lnkDesc: ''
        },
        authPicFile: '',
        formLabelWidth: '150px',
        rules: {
          appId: [
            { 
              required: true, 
              message: '请输入应用标识', 
              trigger: 'blur' ,
            },
          ],
          appName: [
            { 
              required: true, 
              message: '请输入应用名称', 
              trigger: 'blur' ,
            },
          ],
          name: [
            { 
              required: true, 
              message: '请输入名称', 
              trigger: 'blur' ,
            },
          ],
          accessUrl: [
            { 
              required: true, 
              message: '请输入链接地址', 
              trigger: 'blur' ,
            },
          ]
        }
      }
    },
    methods: {
      show(row){
        if(row){
          for (let i in row) {
            this.form[i]=row[i]
          }
        } else {
          this.form = {
            appId: '',
            appName: '',
            name: '',
            logoFile: null,
            accessUrl: '',
            lnkDesc: ''
          };
        }
      },
      submitForm() {
        if(!this.authPicFile){
          errorMsg("请上传图标文件");
          return false;
        }
        let successValidate = true;
        this.$refs.ruleForm.validate((valid) => {
          if (!valid) {
            successValidate = false;
            errorMsg("您添加的信息不全!!!");
          }
        });
        return successValidate;
      },
      uploadSectionFile(file) {
       const isExpectFile = file.file.type === 'image/png' || file.file.type === 'image/jpeg';
       if (!isExpectFile) {
         errorMsg('只能上传jpg/png文件!!!');
         return false;
       }
       const isLt50K = file.file.size / 1024 < 50;
       if (!isLt50K) {
         errorMsg('上传文件最大为50K!!!');
         return false;
       }
       let that=this
       that.form.logoFile = file.file
       let fr = new FileReader();
       fr.readAsDataURL(file.file);
       fr.onload = function (e) {
        that.authPicFile =fr.result;
       }
      },
    },
  }
</script>

<style lang="less" scoped>
  .dialog-fast-body {

  }
</style>
<style lang="less">

</style>