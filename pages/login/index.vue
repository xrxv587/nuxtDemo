<template>
  <div class="container">
    <div class='logo'>
      <img src='./assets/images/logo.png'>
      <h3>中清协同助手</h3>
    </div>
    <!-- <img class='sucai' src='./assets/images/sucai.png'> -->
    <div class="login-box">
      <el-form class="login-form" :rules="rules" :model="loginForm" ref="loginForm" v-if='step===0' :key='111'>
        <h3>中清协同助手</h3>
        <p>业务管理系统</p>
        <el-form-item prop="userName">
          <el-input v-model.trim="loginForm.userName" placeholder="登录账号">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model.trim="loginForm.password" type="password" placeholder="输入密码">
          </el-input>
        </el-form-item>
        <el-form-item style="padding-top:20px">
          <el-button type="primary" class="btn-login" :loading="loading" @click="handleLogin"> 登 录 </el-button>
          <!-- <div class="forget"></div> -->
          <div class="handle">
            <span class="remember">
              <el-checkbox v-model="checked"></el-checkbox> 记住密码
            </span>
            <span @click="forget" class="forget">忘记密码</span></div>
        </el-form-item>
      </el-form>
      <el-form class="login-form" v-if='step===1' ref="captchaForm" :rules="rules1" :model="captchaForm" :key='222'>
        <h3>中清营销管家</h3>
        <p>忘记密码</p>
        <el-form-item prop="oldPhone">
          <el-input v-model.trim="captchaForm.oldPhone" placeholder="请输入登记的手机账号">
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input v-model.trim="captchaForm.captcha" type='number' placeholder="请输入验证码" autocomplete="off" class="captcha"></el-input>
          <el-button type="primary" class="btn-login captchaBtn" v-if="captchaShow&&captchaForm.oldPhone===''"> {{showMes}} </el-button>
          <el-button type="primary" class="btn-login" @click="getCaptchaTXT" style="width:110px;vertical-align:top;" v-if="captchaShow&&captchaForm.oldPhone!==''"> {{showMes}} </el-button>
          <el-button type="primary" class="btn-login" disabled style="width:110px;" v-if='!captchaShow'> {{count}}秒后重发 </el-button>
        </el-form-item>
        <el-form-item style="padding-top:20px">
          <el-button type="primary" class="btn-login" :loading="loading" @click.prevent="handleNext" v-if="captchaForm.oldPhone!==''&&captchaForm.captcha!==''"> 下一步</el-button>
          <el-button type="primary" class="btn-login captchaBtn" style="width:320px;" :loading="loading" v-if="captchaForm.oldPhone===''||captchaForm.captcha===''"> 下一步</el-button>
        </el-form-item>
      </el-form>
      <el-form class="login-form" v-if='step===2' ref="resetForm" :rules="rules2" :model="resetForm" :key='333'>
        <h3>中清营销管家</h3>
        <p>新密码设置</p>
        <div class="label">设置新密码：</div>
        <el-form-item prop="newPassword">
          <el-input v-model.trim="resetForm.newPassword" placeholder="请输入3-8位密码 (数字、字母)" autocomplete="off"></el-input>
        </el-form-item>
        <div class="label">确认密码：</div>
        <el-form-item prop="confirmPassword">
          <el-input v-model.trim="resetForm.confirmPassword" placeholder="请输入3-8位密码 (数字、字母)" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="padding-top:20px">
          <el-button type="primary" class="btn-login" :loading="loading" @click.prevent="handleConfirm" v-if="resetForm.newPassword!==''&&resetForm.confirmPassword!==''"> 提交</el-button>
          <el-button type="primary" class="btn-login captchaBtn" style="width:320px;" :loading="loading" v-if="resetForm.newPassword===''||resetForm.confirmPassword===''"> 提交</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-alert class="alert-error" v-if="error" :title="error" type="error" :closable="false" style="line-height:0">
      </el-alert> -->
    </div>
  </div>
</template>

<script>
import session from '../../assets/js/session';
import local from '../../assets/js/local';
import axios from 'axios';
import { addBelongAttrToNav } from '../../assets/js/navConfig';

export default {
  data() {
    const validatePasswordUser = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'));
      } else if (value.length < 3 || value.length > 8) {
        callback(new Error('密码长度为3-8字符'));
      } else if (/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('密码不支持中文字符'));
      } else if (
        this.resetForm.newPassword &&
        this.resetForm.confirmPassword !== ''
      ) {
        this.$refs.resetForm.validateField('confirmPassword');
        callback();
      } else {
        callback();
      }
    };
    const validateRePasswordUser = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入确认密码'));
      } else if (value.length < 3 || value.length > 8) {
        callback(new Error('密码长度为3-8字符'));
      } else if (/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('密码不支持中文字符'));
      } else if (value !== this.resetForm.newPassword) {
        callback(new Error('密码输入不一致'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        userName: '',
        password: '',
        supplier: ''
      },
      captchaForm: {
        oldPhone: '',
        captcha: ''
      },
      showMes: '获取验证码',
      captchaShow: true,
      count: '',
      timer: null,
      resetForm: {
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change'
          }
        ]
      },
      rules1: {
        oldPhone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'change'
          }
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'change'
          }
        ]
      },
      rules2: {
        newPassword: [
          {
            required: true,
            validator: validatePasswordUser,
            trigger: 'change'
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validateRePasswordUser,
            trigger: 'change'
          }
        ]
      },
      loading: false,
      suppliers: [],
      peopleId: null,
      error: null,
      step: 0,
      checked: false
    };
  },
  mounted() {
    if (local.getString('checked')) {
      this.loginForm.userName = local.getString('userName');
      this.loginForm.password = local.getString('password');
      if (local.getString('checked') === 'true') {
        this.checked = true;
      }
    }
    let that = this;
    document.onkeyup = function(e) {
      if (e.keyCode === 13) {
        that.handleLogin();
      }
    };
  },
  methods: {
    getCaptchaTXT() {
      if (this.captchaForm.oldPhone === '') {
        this.$message({
          message: '请输入手机号码',
          type: 'warning'
        });
        return;
      }
      if (!/^1[3|5|7|8][0-9]{9}$/.test(this.captchaForm.oldPhone)) {
        this.$message({
          message: '请输入正确手机号码',
          type: 'warning'
        });
        return;
      }
      if (!this.timer) {
        this.count = 60;
        this.captchaShow = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= 60) {
            this.count--;
          } else {
            this.showMes = '重新获取';
            this.captchaShow = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
        axios.post(`${window.config.apiHost}/system/sendCaptcha`, {
          format: 'TXT',
          phone: this.captchaForm.oldPhone,
          type: 'LOGIN'
        });
      }
    },
    handleLogin() {
      this.$refs.loginForm
        .validate()
        .then(async () => {
          this.loading = true;
          try {
            let response = await axios.post(`${window.config.apiHost}/login`, {
              phone: this.loginForm.userName.trim(),
              password: this.loginForm.password.trim()
            });
            this.loading = false;
            if (response) {
              session.setString('token', response.data.token);
              session.setObject('operator', response.data.user);
              // 获取用户信息
              let userInfo = await axios.get(
                `${window.config.apiHost}/user/info`,
                {
                  headers: {
                    Authorization: response.data.token
                  }
                }
              );
              if (userInfo.data.permissions.length > 0) {
                session.setObject('currentNav', userInfo.data.permissions[0]);
              } else {
                session.setObject('currentNav', {
                  type: 'PC',
                  code: 'home',
                  requestUrl: '/home',
                  name: '首页'
                });
              }
              // 拼装二级菜单
              userInfo.data.permissions = addBelongAttrToNav(userInfo.data.permissions);
              session.setObject('userInfo', userInfo.data);
              window.location.href = '/';
              // 是否记住密码
              if (this.checked) {
                local.setString('userName', this.loginForm.userName.trim());
                local.setString('password', this.loginForm.password.trim());
                local.setString('checked', true);
              } else {
                local.deleteItem('userName');
                local.deleteItem('password');
                local.deleteItem('checked');
              }
            }
          } catch (e) {
            console.log(e);
            this.loading = false;
            if (e.response) {
              this.error = e.response.data.message;
            } else {
              this.error = '服务请求失败，请联系管理员';
            }
            this.$message({
              message: this.error,
              type: 'warning'
            });
            throw e;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    async handleNext() {
      if (!/^1[3|5|7|8][0-9]{9}$/.test(this.captchaForm.oldPhone)) {
        this.$message({
          message: '请输入正确手机号码',
          type: 'warning'
        });
        return;
      }
      try {
        await axios.post(`${window.config.apiHost}/user/checkPhone`, {
          captcha: this.captchaForm.captcha,
          phone: this.captchaForm.oldPhone
        });
        this.error = null;
        this.step = 2;
      } catch (e) {
        this.loading = false;
        if (e.response) {
          this.error = e.response.data.message;
        } else {
          this.error = '服务请求失败，请联系管理员';
        }
        this.$message({
          message: this.error,
          type: 'warning'
        });
        throw e;
      }
    },
    forget() {
      this.$refs.loginForm.resetFields();
      this.error = null;
      this.step = 1;
    },
    handleConfirm() {
      this.$refs.resetForm.validate().then(async () => {
        try {
          await axios.post(`${window.config.apiHost}/user/settingPassword`, {
            captcha: this.captchaForm.captcha,
            phone: this.captchaForm.oldPhone,
            newPassword: this.resetForm.newPassword
          });
          this.$message({
            message: '设置成功！',
            type: 'success'
          });
          window.location.reload();
        } catch (e) {
          this.loading = false;
          if (e.response) {
            this.error = e.response.data.message;
          } else {
            this.error = '服务请求失败，请联系管理员';
          }
          this.$message({
            message: this.error,
            type: 'warning'
          });
          throw e;
        }
      });
    }
  }
};
</script>

<style lang="scss">
html,
body,
#__nuxt,
#__layout,
.container {
  height: 100%;
  width: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px;
  background: url('./assets/images/bg2.png') no-repeat;
  // background-size: cover;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  .logo {
    position: absolute;
    top: 42px;
    left: 42px;
    line-height: 56px;
    h3 {
      // display: inline-block;
      font-size: 24px;
      color: #333333;
      float: right;
      margin-left: 20px;
    }
  }
  .sucai {
    position: absolute;
    top: calc(100% - 460px) / 2;
    left: 10%;
  }
  .login-box {
    position: absolute;
    right: 14%;
    top: calc((100% - 480px) / 2);
    width: 380px;
    height: 460px;
    box-shadow: 0px 11px 45px 0px rgba(214, 232, 255, 0.54);
    border-radius: 5px;
    background-color: white;
    text-align: center;
    h3 {
      margin-top: 84px;
      color: #333333;
      font-size: 26px;
    }
    p {
      color: #555555;
      font-size: 16px;
      margin-bottom: 35px;
    }
  }
  .btn-login {
    width: 320px;
    height: 48px;
    border-radius: 2px;
    font-size: 14px;
    border-color: #1989fa;
    background-color: #1989fa;
  }
  .captchaBtn {
    width: 110px;
    vertical-align: top;
    border: 1px solid #dcdfe6;
    background-color: #f8fcff;
    color: #dcdfe6;
  }
  .handle {
    font-size: 12px;
    color: #999999;
    // text-align: right;
    width: 320px;
    margin: 0 auto;
    .remember {
      float: left;
    }
    .forget {
      float: right;
      cursor: pointer;
    }
  }
  .captcha {
    width: 200px;
    margin-right: 10px;
    .el-input__inner {
      width: 100%;
    }
  }
  .label {
    font-size: 12px;
    color: #333333;
    width: 320px;
    margin: 0 auto;
    text-align: left;
    margin-bottom: 10px;
  }
  .alert-error {
    position: absolute;
    width: 320px;
    left: 30px;
    bottom: 22px;
    overflow: hidden;
  }
  .el-form-item__error {
    // width: 320px;
    left: 30px;
  }
  .password {
    .el-input {
      width: 200px;
      input {
        width: 100%;
      }
    }
    .el-button {
      width: 115px;
    }
  }
}
.el-form-item__label {
  font-size: 18px;
  color: #515f6e;
  font-weight: 600;
}
.el-input__inner {
  width: 320px;
  height: 48px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  background-color: #f8fcff;
  padding: 0 15px;
  font-size: 14px;
}
.el-form-item.is-required .el-form-item__label:before {
  display: none;
}
@media only screen and (min-width: 1500px) {
  .container .login-box {
    right: 17%;
  }
}
</style>
