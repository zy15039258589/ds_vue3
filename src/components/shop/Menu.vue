<template>
        <div>
              <el-tree :data="data" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                      <span>
                        <el-button
                          type="text"
                          size="mini"
                          @click="() => append(data)">
                          新增
                        </el-button>

                        <el-button
                          type="text"
                          size="mini"
                          @click="() => update(node, data)">
                          修改
                        </el-button>
                      </span>
                    </span>
              </el-tree>

          <el-dialog title="新增权限数据" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="addMenu" label-width="80px">
              <el-form-item label="父节点名称">
                <input type="hidden" v-model="addMenu.pid" aria-disabled="true" />
                <el-input v-model="addMenu.label" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="权限名称">
                <el-input v-model="addMenu.name"></el-input>
              </el-form-item>
              <el-form-item label="权限路径">
                <el-input v-model="addMenu.url"></el-input>
              </el-form-item>

              <el-form-item label="type">
                <el-radio v-model="addMenu.type" label="0" border>目录</el-radio>
                <el-radio v-model="addMenu.type" label="1" border>菜单</el-radio>
              </el-form-item>

              <el-form-item>
                <el-button @click="dialogFormVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="add">新 增</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>



              <el-dialog title="修改权限数据" :visible.sync="dialogFormVisible2">
                <el-form ref="form" :model="updateMenu" label-width="80px">
                  <el-form-item label="权限名称">
                    <input  v-model="updateMenu.id" type="hidden">
                    <el-input v-model="updateMenu.name"></el-input>
                  </el-form-item>
                  <el-form-item label="权限路径">
                    <el-input v-model="updateMenu.url"></el-input>
                  </el-form-item>
                  <el-form-item label="是否删除">
                    <el-radio v-model="updateMenu.isDel" label="0" border>否</el-radio>
                    <el-radio v-model="updateMenu.isDel" label="1" border v-bind:disabled="dis">是</el-radio>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateTypeById">修 改</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
        </div>
</template>

<script>
    export default {
        name: "Menu",
        data(){
          return{
            data:[],
            //权限表的所有数据
            menuDate:[],
            jsonStr:"",
            //修改
            dialogFormVisible2:false,
            updateMenu:{
              url:"",
              name:"",
              id:"",
              isDel:""
            },
            dis:false,
            //新增
            dialogFormVisible:false,
            addMenu:{
                url:"",
                name:"",
                type:"",
                pid:"",
                label:""
            }
          }
        },
        methods:{
            update:function(data,da){
              this.updateMenu.url=da.url;
              this.updateMenu.name=da.label
              this.updateMenu.id=da.id;
              var par=this.queryTop(data);
              this.dialogFormVisible2=true;
              debugger;
              if(par==true){
                this.dis=true;
                this.updateMenu.isDel="0"
              }else{
                this.dis=false;
                this.updateMenu.isDel="0"
              }
            },

            updateTypeById:function(){
                this.$axios.post("http://localhost:8080/MenuController/updateMenu",this.$qs.stringify(this.updateMenu)).then(res=>{
                  alert("修改成功");
                  this.dialogFormVisible2=false;
                  location.reload();
                }).catch(re=>{
                  alert("修改失败")
                })
            },
          append:function(data){
            this.addMenu={};
            this.addMenu.pid=data.id;
            this.addMenu.label=data.label
            this.dialogFormVisible=true;
          },
          add:function(){
            var zy=this;
            this.$axios.post("http://localhost:8080/MenuController/addMenu",this.$qs.stringify(this.addMenu)).then(function (res) {
              alert("新增成功");
              zy.dialogFormVisible=false;
              location.reload();
            }).catch(function () {
              alert("新增失败")
            })
          },


          queryMenuData:function () {
              this.$axios.get("http://localhost:8080/MenuController/getData").then(res=>{
                  this.menuDate = res.data.data;
                  this.menu();
              }).catch(re=>{
                alert("失败")
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
              debugger;
            for (let i = 0; i <this.menuDate.length ; i++) {
              if(node.id==this.menuDate[i].pid){
                return true;
              }
            }
            return false;
          },


        },
        created:function () {
            this.queryMenuData();
        }
    }
</script>
  
<style scoped>

</style>
