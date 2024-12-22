<template>
  <div class="login-container">
    <div class="login-box">
      <el-card class="login-card">
        <div class="title">
          <h2>后台管理系统</h2>
          <p class="subtitle">Admin Management System</p>
        </div>
        <el-form 
          :model="loginForm" 
          :rules="rules" 
          ref="loginFormRef"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="请输入用户名"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleLogin" 
              class="login-button"
              size="large"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref(null)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      // 这里添加实际的登录逻辑
      localStorage.setItem('token', 'dummy-token')
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } else {
      ElMessage.error('请填写正确的登录信息')
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1f4037 0%, #99f2c8 100%);
  overflow: hidden;
}

.login-box {
  width: 100%;
  max-width: 450px;
  padding: 0 20px;
}

.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.title h2 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
}

.subtitle {
  font-size: 16px;
  color: #7f8c8d;
}

.login-form {
  padding: 20px 30px;
}

:deep(.el-input__wrapper) {
  background-color: #f5f7fa;
  box-shadow: none;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  border-color: #409eff;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 1px #409eff;
}

.login-button {
  width: 100%;
  height: 45px;
  font-size: 16px;
  margin-top: 10px;
}

@media screen and (max-width: 480px) {
  .login-box {
    padding: 0 15px;
  }
  
  .login-form {
    padding: 15px;
  }
  
  .title h2 {
    font-size: 24px;
  }
}
</style> 