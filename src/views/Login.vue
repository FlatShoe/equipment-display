<!--
* @Description 登陆页
-->
<template>
  <div class="login-container">
    <el-form class="login-form" ref="formRef" :rules="rules" :model="form">
      <el-form-item prop="username">
        <el-input
          placeholder="请输入用户名"
          name="username"
          type="text"
          v-model="form.username"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          placeholder="请输入密码"
          name="password"
          type="password"
          v-model="form.password"
          @keyup.enter.native="handleLogin"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-button" type="primary" @click="handleLogin" :loading="loading"
          >登陆</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
const rules = {
  username: {required: true, trigger: 'blur', message: '请输入用户名'},
  password: {required: true, trigger: 'blur', message: '请输入密码'}
}
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      form: {
        username: 'admin',
        password: '123456'
      },
      rules
    }
  },
  methods: {
    ...mapActions('system', ['login']),
    /*
     * @Description 操作登陆
     */
    async handleLogin() {
      if (this.loading) return
      const valid = await this.$refs.formRef.validate().catch(err => err)
      if (!valid) return
      this.loading = true
      await this.login(this.form).catch(() => (this.loading = false))
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
.login-container {
  .el-input {
    display: inline-block;
    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
    }
  }
}
</style>
<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: linear-gradient(to right, #d0e9f9 0%, #ffffff 100%);
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }
  .login-button {
    width: 100%;
    height: 100%;
    background-color: #a7c9e1;
    border: none;
  }
}
</style>
