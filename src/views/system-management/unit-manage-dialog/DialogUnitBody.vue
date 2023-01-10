<template>
  <div class="dialog-unit-body">
    <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="formLabelWidth">
      <div v-if="!updateFlag">
        <el-form-item label="添加方式">
          <el-radio v-model="showSelect" :label="true" border>快速添加法院</el-radio>
          <el-radio v-model="showSelect" :label="false" border>添加新单位</el-radio>
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName" v-if="showSelect">
          <el-select
                    style="width: 340px;"
                    v-model="selectedUnitCode"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="输入法院名称查询"
                    :remote-method="remoteMethod"
                    @change="backfill">
            <el-option
                      v-for="item in options"
                      :key="item.unitCode"
                      :label="item.unitName"
                      :value="item.unitCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName" v-else>
          <el-input v-model.trim="form.unitName" :maxlength="50"></el-input>
        </el-form-item>
      </div>
      <el-form-item v-else label="单位名称" prop="unitName" v-else>
        <el-input v-model.trim="form.unitName" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="单位简称">
        <el-input v-model.trim="form.unitShortName" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="单位代字" prop="unitWord">
        <el-input v-model.trim="form.unitWord" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="单位代码" prop="unitCode">
        <el-input v-model.trim="form.unitCode" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="单位分级码" prop="unitGradeCode">
        <el-input v-model.trim="form.unitGradeCode" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :maxlength="200" style="width: 450px;" :rows="4" v-model="form.unitDesc" placeholder="...... 200字以内"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as systemManagementApi from "../../../api/system-management-api.js"
  import {errorMsg} from "../../../ui"
  export default {
    name: "DialogUnitBody",
    props: {
      updateFlag: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        options: [],
        showSelect: true,
        selectedUnitCode: '',
        form: {
          unitName: '',
          unitShortName: '',
          unitWord: '',
          unitCode: '',
          unitGradeCode: '',
          unitDesc: ''
        },
        formLabelWidth: '150px',
        rules: {
          unitName: [
          { required: true, message: '请选择或输入单位(必填)', trigger: 'blur' },
          ],
          unitWord: [
          { required: true, message: '请输入单位代字(必填)', trigger: 'blur' },
          ],
          unitCode: [
          { required: true, message: '请输入单位代码(必填)', trigger: 'blur' },
          ],
          unitGradeCode: [
          { required: true, message: '请输入单位分级码(必填)', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      show(row){
        this.showSelect = true;
        if (row) {
          for (let key in row) {
            this.form[key] = row[key];
          }
        } else {
          this.form = {
            unitName: '',
            unitShortName: '',
            unitWord: '',
            unitCode: '',
            unitGradeCode: '',
            unitDesc: ''
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
      backfill(val) {
        this.form = this.options.filter(item => item.unitCode === val)[0];
        this.selectedUnitCode = '';
        this.showSelect = false;
      },
      remoteMethod(query) {
        if (query) {
          this.loading = true;
          //通过基础库查询法院信息以供用户选择
          systemManagementApi.getBaseUnitData(query, this.page, this.pageSize).then(res => {
            if (!res.success) {
              errorMsg(res.message);
              return false;
            }
            this.options = res.body;
            this.loading = false;
          });
        } else {
         this.options = [];
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .dialog-unit-body {

  }
</style>
<style lang="less">

</style>