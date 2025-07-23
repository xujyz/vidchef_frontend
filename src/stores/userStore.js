// stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    role: '', // 默认普通用户
    loading: false,
    error: null,
    userInfo: null
  }),
  actions: {
    async fetchUserRole() {
      // 模拟从接口获取用户角色
      const res = await axios.get('/api/user/role');
      this.role = res.data.role;
    },
    // 登录
    async login(params) {
      this.loading = true;
      this.error = null;

      try {
        const response = await loginApi(params)
        const { token,  roleList, userInfo } = response.data;
        console.log("sss",userInfo)
        // 存储 Token 和用户信息到本地存储
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        roleList.length > 0?
        localStorage.setItem('userRole', roleList[0].roleName):
        localStorage.setItem('userRole', 'user')
        this.role = localStorage.getItem('userRole')

        // 更新状态
        this.token = token;
        this.userInfo = userInfo;


        // 设置 Axios 请求头
        // this.setAuthHeader();

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败';
        return false;
      } finally {
        this.loading = false;
      }
    },

  }
});

/*import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, register, sendSmsCode, verifyCode } from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const tempPhone = ref(null) // 临时存储手机号用于验证流程

  const sendCode = async (phone) => {
    try {
      await sendSmsCode(phone)
      tempPhone.value = phone
      return true
    } catch (error) {
      throw error
    }
  }

  const verifySmsCode = async (code) => {
    if (!tempPhone.value) throw new Error('未获取手机号')
    
    try {
      const { verified, tempToken } = await verifyCode(tempPhone.value, code)
      if (verified) {
        return tempToken // 返回临时token用于后续注册/登录
      }
      throw new Error('验证码错误')
    } catch (error) {
      throw error
    }
  }

  const registerWithCode = async (userData, tempToken) => {
    try {
      const { user: newUser, token: newToken } = await register({
        ...userData,
        tempToken
      })
      user.value = newUser
      token.value = newToken
      localStorage.setItem('token', newToken)
      return newUser
    } catch (error) {
      throw error
    }
  }

  const loginWithCode = async (phone, code) => {
    try {
      const { user: loggedInUser, token: newToken } = await login({
        phone,
        code
      })
      user.value = loggedInUser
      token.value = newToken
      localStorage.setItem('token', newToken)
      return loggedInUser
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    tempPhone,
    sendCode,
    verifySmsCode,
    registerWithCode,
    loginWithCode,
    logout
  }
})    */