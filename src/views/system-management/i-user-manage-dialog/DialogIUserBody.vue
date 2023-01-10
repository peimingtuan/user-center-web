<template>
  <div class="dialog-IUser-body">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="接口用户名称" prop="iUserName"
                    :label-width="formLabelWidth">
        <el-input v-model="form.iUserName" maxlength="50" autocomplete="off" placeholder="请输入接口用户名称"></el-input>
      </el-form-item>
      <el-form-item label="接口用户账号" prop="username"
                    :label-width="formLabelWidth">
        <el-input v-model.trim="form.username" maxlength="20" autocomplete="off" placeholder="请输入接口用户账号"></el-input>
      </el-form-item>
      <div v-if="!updateFlag">
        <el-form-item label="接口用户密码" prop="password"
                      :label-width="formLabelWidth">
          <el-input v-model.trim="form.password" maxlength="50" type="password" autocomplete="off" placeholder="请输入接口用户密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2"
                      :label-width="formLabelWidth">
          <el-input v-model.trim="form.password2" maxlength="50" type="password" autocomplete="off" placeholder="请确认接口用户密码"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="限制访问频率" :label-width="formLabelWidth">
        <el-switch v-model="flagFrequency" @change="changeFrequency"/>
      </el-form-item>
      <el-form-item v-if="flagFrequency" label="访问频率" prop="accessFrequency"
                    :label-width="formLabelWidth">
        <el-input type="number" v-model.trim="form.accessFrequency" autocomplete="off" placeholder="请输入访问频率"></el-input>
      </el-form-item>
      <el-form-item v-if="flagFrequency" label="最大并发" prop="maxConcurrency"
                    :label-width="formLabelWidth">
        <el-input type="number" v-model.trim="form.maxConcurrency" autocomplete="off" placeholder="请输入最大并发"></el-input>
      </el-form-item>
      <el-form-item label="限制访问时段" :label-width="formLabelWidth">
        <el-switch v-model="flagAccessTime" @change="changeAccessTime"/>
      </el-form-item>
      <el-form-item v-if="flagAccessTime" label="访问时段" prop="accessTime_"
                    :label-width="formLabelWidth">
        <el-time-picker
            is-range
            arrow-control
            v-model.trim="form.accessTime_"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            formate="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="限制有效时间" :label-width="formLabelWidth">
        <el-switch v-model="flagExpireTime" @change="changeExpireTime"/>
      </el-form-item>
      <el-form-item v-if="flagExpireTime" label="过期时间" prop="expireTime"
                    :label-width="formLabelWidth">
        <el-date-picker
            v-if="flagExpireTime"
            v-model.trim="form.expireTime"
            type="datetime"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="描述信息" prop="desc" :label-width="formLabelWidth">
        <el-input v-model.trim="form.desc" autocomplete="off" placeholder="请输入描述信息"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'js-md5'

export default {
  name: "DialogBody",
  data() {
    return {
      flagFrequency: null,
      flagAccessTime: null,
      flagExpireTime: null,
      form: {
        iUserId: '',
        iUserName: '',
        username: '',
        password: '',
        accessFrequency: '',
        maxConcurrency: '',
        accessTime: '',
        accessTime_: '',
        expireTime: '',
        desc: '',
        password2: ''
      },
      formLabelWidth: '150px',
      rules: {
        iUserName: [{required: true, message: '请输入接口用户名称', trigger: 'blur'}],
        username: [{required: true, message: '请输入接口用户账号', trigger: 'blur'}],
        password: [{
          required: true,
          validator: (rule, value, callback) => {
            if (this.updateFlag) {
              return true
            }
            if (!value) {
              callback(new Error('请输入密码'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }],
        password2: [{
          required: true,
          validator: (rule, value, callback) => {
            if (this.updateFlag) {
              return true
            }
            if (!value) {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.form.password) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        accessFrequency: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!this.flagFrequency) {
              return true
            }
            if (!value) {
              callback(new Error('请输入访问频率'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }],
        maxConcurrency: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!this.flagFrequency) {
              return true
            }
            if (!value) {
              callback(new Error('请输入最大并发'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }],
        accessTime_: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!this.flagAccessTime) {
              return true
            }
            if (!value) {
              callback(new Error('请输入访问时段'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }],
        expireTime: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!this.flagExpireTime) {
              return true
            }
            if (!value) {
              callback(new Error('请输入过期时间'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }],
        desc: [{required: false}]
      },
      updateFlag: false
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
        this.updateFlag = true
        for (let i in row) {
          this.form[i] = row[i]
        }
        this.flagFrequency = !((row.accessFrequency == null || row.accessFrequency === '') && (row.maxConcurrency == null || row.maxConcurrency === '')) || ((row.accessFrequency != null && row.accessFrequency !== '') && (row.maxConcurrency != null && row.maxConcurrency !== ''))
        this.flagAccessTime = !(row.accessTime == null || row.accessTime === '')
        this.flagExpireTime = !(row.expireTime == null || row.expireTime === '')
        if (row.accessTime != null && row.accessTime !== '') {
          this.form.accessTime_ = this.str2Array(row.accessTime)
        } else {
          this.form.accessTime_ = ''
        }
      } else {
        this.updateFlag = false
        this.form = {
          iUserId: '',
          iUserName: '',
          username: '',
          password: '',
          accessFrequency: '',
          maxConcurrency: '',
          accessTime: '',
          accessTime_: '',
          expireTime: '',
          desc: '',
          password2: ''
        }
        this.flagFrequency = false
        this.flagAccessTime = false
        this.flagExpireTime = false
      }
    },
    submitForm() {
      let flag;
      this.$refs.ruleForm.validate((valid) => {
        flag = valid;
      });
      return flag;
    },
    str2Array(accessTime) {
      if (accessTime && accessTime !== '') {
        return accessTime.split('-')
      }
    },
    array2Str(accessTime) {
      return accessTime[0] + '-' + accessTime[1]
    },
    changeFrequency() {
      if (!this.flagFrequency) {
        this.form.accessFrequency = ''
        this.form.maxConcurrency = ''
      }
    },
    changeAccessTime() {
      if (!this.flagAccessTime) {
        this.form.accessTime = ''
        this.form.accessTime_ = ''
      }
    },
    changeExpireTime() {
      if (!this.flagExpireTime) {
        this.form.expireTime = ''
      }
    }
  },
}
</script>

<style lang="less" scoped>
.dialog-IUser-body {

}
</style>
<style lang="less">

</style>