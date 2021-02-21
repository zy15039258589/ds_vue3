<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="realName" label="真实名称" width="120"></el-table-column>
      <el-table-column prop="name" label="账号" width="120"></el-table-column>
      <el-table-column prop="sex" label="性别" width="120"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
      <el-table-column prop="idCard" label="身份证" width="120"></el-table-column>
      <el-table-column fixed prop="birthday" label="生日" width="150"></el-table-column>
      <el-table-column prop="imgUrl" label="头像" width="300"></el-table-column>
      <el-table-column prop="eduId" label="学历" width="120"></el-table-column>
      <el-table-column prop="deptId" label="部门" width="120"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="userAddRole(scope.row)" type="text" size="small">赋角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="用户赋角色信息" :visible.sync="dialogFj">

      <el-checkbox-group v-model="roleArr">
        <el-checkbox-button v-for="city in roles" :label="city.id" :key="city.id">{{city.name}}</el-checkbox-button>
      </el-checkbox-group>

        <el-button type="text" size="mini" @click="() => addUserRole()">赋角色</el-button>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "User",
        data(){
          return{
            tableData:[],
            dialogFj:false,
            //角色被选中的数据
            roleArr:[],
            //角色所有的数据
            roles:[],
            //用户id
            userId:""
          }
        },
        methods:{
          userAddRole:function (row) {
            //先赋上用户id
            this.userId=row.id;
            this.$axios.get("http://localhost:8080/RoleController/queryRoleByUserId?userId="+row.id+"").then(re=>{
              var arr=re.data.data;
              for (var i = 0; i <arr.length ; i++) {
                this.roleArr.push(arr[i].rid)
              }
            }).catch(re=>{
              alert("查询角色失败")
            })
            this.dialogFj=true;
          },
          addUserRole:function () {
              this.$axios.get("http://localhost:8080/RoleController/userAddRole?userRoleArr="+this.roleArr+"&userId="+this.userId+"").then(re=>{
                alert("赋角色成功")
                this.dialogFj=false;
              }).catch(re=>{
                alert("赋角色失败")
              })

          }
        },
        created:function () {
          this.$axios.get("http://localhost:8080/UserController/queryUser").then(re=>{
              this.tableData=re.data.data;
          }).catch(re=>{
            alert("查询失败")
          })
          //加载好角色的数据
          this.$axios.get("http://localhost:8080/RoleController/getData").then(res=>{
            this.roles=res.data.data
          }).catch(re=>{
            alert("失败")
          })
        }
    }
</script>

<style scoped>

</style>
