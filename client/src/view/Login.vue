<template>
  <div class="login">
    <div class="header">
    </div>
    <div class="content">
      <form action="" name="form2">
        <mu-text-field label="帐号" labelFloat name="username"/>
        <br/>
        <mu-text-field label="密码" type="password" labelFloat name="password"/>
        <br/>
        <div class="btn-radius" @click="submit">登录</div>
      </form>
      <div @click="register" class="tip-user">注册帐号</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import socket from "../socket";

  export default {
    data() {
      return {
        loading: ""
      };
    },
    methods: {
      submit() {
        const name = document.form2.username.value.trim();
        const password = document.form2.password.value.trim();
        if (name !== "" && password !== "") {
          const data = {
            name: name,
            password: password
          };
          this.$store.dispatch("loginSubmit", data).then(res => {
            if (res.code === 200) {
              this.$Toast({
                content: '登录成功',
                timeout: 3000,
                background: "#2196f3"
              });
              this.$store.commit("setUserInfo", {
                type: "userid",
                value: res.data.user._id
              });
              this.$store.commit("setUserInfo", {
                type: "name",
                value: res.data.user.name
              });
              this.$store.commit("setUserInfo", {
                type: "src",
                value: res.data.user.src
              });
              this.$router.push({path: "/"});
              socket.emit("login", {userId: res.data.user._id});
            } else {
              this.$Alert({
                show: true,
                content: this.$errorCode[res.code]
              });
            }
          });
        } else {
          this.$Alert({
            show: true,
            content: "用户名和密码不能为空"
          });
        }
      },
      register() {
        this.$router.push({path: "register"});
      }
    },
    mounted() {
      this.$store.commit("setTab", false);
    },
    computed: {}
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .login {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-image: url('//s3.qiufengh.com/webchat/bg.jpg');
    background-size: 100% 100%;
    background-position: center center;

    .mu-appbar {
      text-align: center;

      .mu-flat-button-label {
        font-size: 20px;
      }
    }

    .content {
      width: 80%;
      margin: 70px auto 20px;

      .mu-text-field {
        width: 100%;
      }

      .mu-raised-button {
        min-width: 80px;
        display: block;
        width: 100%;
        margin: 0 auto;
        transition: all 0.375s;

        &.loading {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
    }
  }
</style>
