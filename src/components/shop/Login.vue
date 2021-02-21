<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="param" label-width="0px" class="ms-content">
                <el-form-item prop="name">
                    <el-input v-model="param.name" placeholder="name">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                  <font style="color: red;">{{code}}</font>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="denglu('param')">登录</el-button>
                </div>
                <div class="login-btn">
                  <el-button type="primary" @click="zc()">注册</el-button>
                </div>
                <p class="login-tips">Tips : 请输入正确的账号密码。</p>
            </el-form>
        </div>

      <el-dialog title="注册页面" :visible.sync="zhuchi">
        <el-form ref="formGoodsAdd" :model="loginAdd" :rules="rules"  label-width="80px">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="loginAdd.name"></el-input>
            <el-input v-model="loginAdd.imgUrl" type="hidden"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="loginAdd.realName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginAdd.password"></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="title">
            <el-radio-group v-model="loginAdd.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号" prop="password">
            <el-input v-model="loginAdd.phone"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="password">
            <el-input v-model="loginAdd.email"></el-input>
          </el-form-item>

          <el-form-item label="身份证" prop="password">
            <el-input v-model="loginAdd.idCard"></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="password">
              <el-date-picker
                v-model="loginAdd.birthday"
                type="date"
                placeholder="选择日期时间">
              </el-date-picker>
          </el-form-item>


          <el-form-item label="头像" align="left">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/BrandController/imgAdd"
              list-type="picture-card"
              :on-success="handleAvatarSuccess">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="部门" align="left" prop="bandId">
            <el-select  v-model="loginAdd.deptId" placeholder="请选择">
              <el-option
              v-for="item in brandData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="学历" align="left" prop="bandId">
            <el-select  v-model="loginAdd.eduId" placeholder="请选择">
              <el-option
                v-for="item in brandData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item align="center">
            <el-button type="primary" @click="zhuchiLogin">注册</el-button>
            <input type="reset"/>
          </el-form-item>
        </el-form>
      </el-dialog>

    </div>
</template>

<script>
export default {
    data: function() {
        return {
          param:{
            name:"",
            password:""
          },
            zhuchi:false,
            loginAdd:{
                  name:"",
                  realName:"",
                  password:"",
                  sex :"",
                  phone:"",
                  email:"",
                  idCard:"",
                  birthday:"",
                  imgUrl:"",
                  eduId:"",
                  deptId:"",
                  imgUrl:""
            },
            code:"",
            imageUrl:"",
            rules: {
                name: { required: true, message: '请输入用户名', trigger: 'blur' },
                password: { required: true, message: '请输入密码', trigger: 'blur' },
            },
        };
    },
    methods: {
      denglu(param) {
        this.$refs[param].validate((valid) => {
          if (valid) {
              this.$axios.post("http://localhost:8080/UserController/login",this.$qs.stringify(this.param)).then(res=>{
                      if(res.data.ccg==0){
                        this.code="账号或密码错误"
                      }
                      if(res.data.ccg==1){
                        this.code="账号或密码错误"
                      }
                      if(res.data.ccg==2){
                        this.$router.push('/');
                      }
              }).catch(res=>{
                  alert("登录失败")
              })
          } else {

            return false;
          }
        });
      },
        zc:function () {
            this.zhuchi=true;
        },
        zhuchiLogin:function () {
          console.log(this.loginAdd);
          this.$axios.post("http://localhost:8080/UserController/userAdd",this.$qs.stringify(this.loginAdd)).then(res=>{
                alert("注册成功")
            this.zhuchi=false;
          }).catch(res=>{
            alert("失败")
          })
        },
      handleAvatarSuccess:function (res, file) {
        this.updateGoodsAdd.imgPath=res;
        this.updateGoodsAdd.imageUrl=res;
      },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
