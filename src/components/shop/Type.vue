<template>
  <div  class="custom-tree-container">
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
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

    <el-dialog title="新增分类数据" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="父节点名称">
          <input type="hidden" v-model="form.pid" aria-disabled="true" />
          <el-input v-model="form.label" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新增分类名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addType">新 增</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改分类数据" :visible.sync="dialogFormVisible2">
      <el-form ref="form" :model="updateType" label-width="80px">
        <el-form-item label="修改分类名称">
          <input  v-model="updateType.id">
          <el-input v-model="updateType.name"></el-input>
        </el-form-item>
        <el-form-item label="是否展示">
          <el-radio v-model="updateType.isDel" label="0" border>否</el-radio>
          <el-radio v-model="updateType.isDel" label="1" border v-bind:disabled="dis">是</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="updateTypeById">修 改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>

</template>

<script>

    export default {
        name: "Type",
      data() {
        return {
          data: [],
          jsonStr:"",
          ajaxData:[],
          //新增的
          form:{
            pid:"",
            label:"",
            name:""
          },
          dialogFormVisible:false,
          //修改的
          updateType:{
            name:"",
            isDel:"0",
            id:""
          },
          dialogFormVisible2:false,
          dis:false
        };
      },
      methods:{
        append:function(data){
          console.log(data);
          this.form.pid=data.id;
          this.form.label=data.label
          this.dialogFormVisible=true;
        },
        addType:function(){
           var zy=this;
            this.$axios.post("http://192.168.235.1:8080/api/type/add",this.$qs.stringify(this.form)).then(function (res) {
                alert("新增成功");
                zy.dialogFormVisible=false;
                location.reload();
            }).catch(function () {
              alert("新增失败")
            })
        },
        update:function(data,da){
          debugger;
            this.updateType.name=da.label
            this.updateType.id=da.id;
            var par=this.isParent(data);
          this.dialogFormVisible2=true;
            if(par==true){
                this.dis=true;
                this.updateType.isDel="0"
            }else{
              this.dis=false;
              this.updateType.isDel="0"
            }

        },
        updateTypeById:function(){
          var zy=this;
          this.$axios.post("http://192.168.235.1:8080/api/type/update",this.$qs.stringify(this.updateType)).then(function (res) {
            alert("修改成功");
            zy.dialogFormVisible2=false;
            location.reload();
          }).catch(function () {
            alert("修改失败")
          })
        },

        chandleData:function () {
              for (let i = 0; i <this.ajaxData.length ; i++) {
                    if(this.ajaxData[i].pid==0){
                        this.diguiNode(this.ajaxData[i])
                        break;
                    }
              }
              console.log(this.jsonStr)
              this.data.push(JSON.parse(this.jsonStr));
          console.log(this.data)
            },
            diguiNode:function (node) {
              //{"id":1,"label":"分类",}
              //{"id":1,"label":"分类","children":[]}
              //判断是否为父节点
              var par=this.isParent(node);
              if(par==true){
                this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'","children":[';
                //拼接子节点
                //查找此节点的子节点
                let count=0;
                for (let i = 0; i <this.ajaxData.length; i++) {
                      if(node.id==this.ajaxData[i].pid){
                            count++;
                            this.diguiNode(this.ajaxData[i]);
                            this.jsonStr+=','
                      }
                }
                if(count!=0){
                  this.jsonStr=this.jsonStr.substr(0,this.jsonStr.length-1);
                }
                this.jsonStr+=']}';
              }else{
                this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'"}';
              }

            },
            isParent:function (node) {
              for (let i = 0; i <this.ajaxData.length ; i++) {
                    if(node.id==this.ajaxData[i].pid){
                          return true;
                    }
              }
              return false;
            }
      },
      created:function () {
          var zy=this;
        this.$axios.get("http://192.168.235.1:8080/api/type/getData").then(function (res) {
              zy.ajaxData=res.data.data;
              zy.chandleData();
        }).catch(function () {

        })
      }
    }
</script>

<style scoped>

</style>
