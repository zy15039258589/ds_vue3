<template>
    <div>
      <el-button type="primary" @click="add">新增</el-button>
          <el-table :data="tableData" style="width: 100%" max-height="250">
            <el-table-column fixed prop="id" label="序号" width="150"></el-table-column>
            <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
            <el-table-column prop="createDate"  label="创建时间" align="center"></el-table-column>
            <el-table-column prop="author"  label="操作人" align="center"></el-table-column>

            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="update(scope.$index,scope.row)">编辑</el-button>
                <el-button size="mini" @click="addMenu(scope.$index,scope.row)">赋权</el-button>
              </template>
            </el-table-column>
          </el-table>


          <el-dialog title="修改角色数据" :visible.sync="dialogFormVisible2">
            <el-form ref="form" :model="updateRole" label-width="80px">
              <el-form-item label="角色名称">
                <input  v-model="updateRole.id" type="hidden">
                <el-input v-model="updateRole.name"></el-input>
              </el-form-item>
              <el-form-item label="是否删除">
                <el-radio v-model="updateRole.isDel" label="0" border>否</el-radio>
                <el-radio v-model="updateRole.isDel" label="1" border>是</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleUpdate">修 改</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

      <el-dialog title="新增角色数据" :visible.sync="dialogFormVisible1">
        <el-form ref="form" :model="addRole" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="addRole.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="roleAdd">新 增</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="角色赋权信息" :visible.sync="dialogFq">
        <el-tree ref="tree"  :data="data" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                    </span>
        </el-tree>
        <el-button type="text" size="mini" @click="() => fuquan()">赋权</el-button>
      </el-dialog>


    </div>
</template>

<script>
    export default {
        name: "Role",
        data(){
          return{
            tableData:[],
            updateRole:{
              name:"",
              id:"",
              isDel:""
            },
            dialogFormVisible2:false,
            addRole:{
              name:""
            },
            dialogFormVisible1:false,
            //赋权的操作
            data:[],
            //权限表的所有数据
            menuDate:[],
            jsonStr:"",
            dialogFq:false,
            roleId:""
          }
        },
        methods:{
          update:function (index,row) {
              this.updateRole=row;
              this.updateRole.isDel="0";
              this.dialogFormVisible2=true;
          },
          roleUpdate:function () {
             var data={"name":this.updateRole.name,"id":this.updateRole.id,"isDel":this.updateRole.isDel}
            this.$axios.post("http://localhost:8080/RoleController/updateRole",this.$qs.stringify(data)).then(res=>{
                alert("修改成功");
                this.dialogFormVisible2=false;
                this.queryData();
              }).catch(re=>{
                alert("修改失败")
              })
          },
          add:function(){
              this.dialogFormVisible1=true;
          },
          roleAdd:function(){
             var data={"name":this.addRole.name}
              this.$axios.post("http://localhost:8080/RoleController/addRole",this.$qs.stringify(data)).then(res=>{
                alert("新增成功");
                this.dialogFormVisible1=false;
                this.queryData();
              }).catch(re=>{
                alert("新增失败");
              })
          },
          queryData:function () {
            this.$axios.get("http://localhost:8080/RoleController/getData").then(res=>{
              this.tableData=res.data.data
            }).catch(re=>{
              alert("查询失败")
            })
          },

          addMenu:function (index,row) {
              this.roleId=row.id;
              this.queryMenuData();
              this.dialogFq=true;
          },
          queryMenuData:function () {
            this.$axios.get("http://localhost:8080/MenuController/getData").then(res=>{
              this.menuDate = res.data.data;
              this.menu();
            }).catch(re=>{
            })
          },
          menu:function () {
            for (let i = 0; i <this.menuDate.length ; i++) {
              if(this.menuDate[i].pid==1 || this.menuDate[i].pid==0){
                this.diguiNode(this.menuDate[i]);
                break;
              }
            }
            this.data.push(JSON.parse(this.jsonStr));
          },
          diguiNode:function (node) {
            //{"id":1,"label":"分类",}
            //{"id":1,"label":"分类","children":[]}
            //判断是否为父节点
            var par=this.queryTop(node);
            if(par==true){
              this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'","url":"'+node.url+'","children":[';
              //拼接子节点
              //查找此节点的子节点
              let count=0;
              for (let i = 0; i <this.menuDate.length; i++) {
                if(node.id==this.menuDate[i].pid){
                  count++;
                  this.diguiNode(this.menuDate[i]);
                  this.jsonStr+=','
                }
              }
              if(count!=0){
                this.jsonStr=this.jsonStr.substr(0,this.jsonStr.length-1);
              }
              this.jsonStr+=']}';
            }else{
              this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'","url":"'+node.url+'"}';
            }

          },
          queryTop:function (node) {
            for (let i = 0; i <this.menuDate.length ; i++) {
              if(node.id==this.menuDate[i].pid){
                return true;
              }
            }
            return false;
          },
          fuquan:function () {
            var menuIdArr=this.$refs.tree.getCheckedKeys();
            if(menuIdArr.length>0){
              this.$axios.get("http://localhost:8080/RoleController/roleAddMenu?roleId="+this.roleId+"&menuIdArr="+menuIdArr+"").then(re=>{
                alert("新增成功")
              }).catch(re=>{
                alert("失败")
              })
            }else{
              alert("请至少选择一种权限")
            }
          },
        },
        created:function () {
          this.queryData();
        }
    }
</script>

<style scoped>

</style>
