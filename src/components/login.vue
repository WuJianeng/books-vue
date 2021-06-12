<template>
    <div class='login_container'>
        <div>login component</div>
        <div class="login_box">
            <!-- 头像区域 -->
            <div class='avatar_box'>
                <img src="../assets/logo.png" alt='no img'>
            </div>
            <!-- 登录表单区域 -->
            <el-form ref='loginFormRef' class='login_form' label-width="0px" :model='formLogin' :rules="login_rules">
                <!-- username -->
                <el-form-item prop='username'>
                    <el-input prefix-icon="iconfont icon-user" v-model="formLogin.username"></el-input>
                </el-form-item>
                <!-- password -->
                <el-form-item prop='password'>
                    <el-input prefix-icon="iconfont icon-3702mima" v-model='formLogin.password'
                      type='password'></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <!-- button -->
                    <el-button type="primary" @click="login('loginFormRef')">登录</el-button>
                    <el-button type="info" @click="clear('loginFormRef')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      formLogin: {
        username: '',
        password: ''
      },
      // 表单验证规则对象
      login_rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    login (formName) {
      // 登陆前预验证
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        try {
          const res = await this.$http.post('user/login', this.formLogin)

          if (res.status !== 200) return this.$message.error('登录失败')
          else {
            this.$message.success('登陆成功')
            const { data: { token, tokenHead, info: { userId, email, username } } } = res
            console.log(res)
            // 将token保存至 sessionStorage 中
            window.sessionStorage.setItem('token', tokenHead + ' ' + token)
            window.sessionStorage.setItem('id', userId)
            window.sessionStorage.setItem('username', username)
            window.sessionStorage.setItem('email', email)
            // 跳转至主页
            this.$router.push('/home')
          }
        } catch {
          this.$message.error('登录失败')
        }
      })
    },

    clear (formName) {
      this.$refs[formName].resetFields()
      this.$message({
        message: '已清空表单',
        center: true
      })
    }
  }
}

</script>

<style lang="less" scoped>
.login_container {
    background-color: #2B4B6B;
    height: 100%
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.btns {
    display: flex;
    justify-content: flex-end;
}

.login_form {
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

</style>
