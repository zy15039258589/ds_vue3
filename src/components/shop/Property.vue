<template>
        <div>
          <el-button type="primary" @click="add">新增</el-button>
          <center><el-input v-model="name"  style="width:200px;"></el-input>
            <el-button type="primary" @click="chaxun">查询</el-button></center>
            <el-table :data="tableData" style="width: 100%" max-height="250">
              <el-table-column fixed prop="id" label="序号" width="150">

              </el-table-column>
              <el-table-column prop="name" label="属性名" align="center">

              </el-table-column>
              <el-table-column prop="nameCH" label="属性中文名" align="center">

              </el-table-column>
              <el-table-column prop="typeId"  v-bind:formatter="typeIdFor" label="分类" align="center">

              </el-table-column>
              <el-table-column prop="type" v-bind:formatter="typeFor" label="属性类型" align="center">

              </el-table-column>
              <el-table-column prop="isSKU" v-bind:formatter="isSKUFor" label="sku属性" align="center">
              </el-table-column>

              <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" @click="updateProperty(scope.$index,scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteProperty(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="handleCurrentChange"
              :page-sizes="[2, 5, 8, 10]"
              :page-size="2"
              layout="total, sizes, prev, pager, next, jumper"
              :total=count>
            </el-pagination>





          <el-dialog title="新增信息" :visible.sync="dialogBrandAdd">
            <el-form ref="form" :model="formAdd" label-width="80px">
              <el-form-item label="属性名">
                <el-input v-model="formAdd.name"></el-input>
              </el-form-item>

              <el-form-item label="属性中文名">
                <el-input v-model="formAdd.nameCH"></el-input>
              </el-form-item>
                <el-form-item label="分类">
                          <el-select  v-model="formAdd.typeId" placeholder="请选择">
                              <el-option
                                v-for="item in typeDataZi"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                          </el-select>
                </el-form-item>
              <el-form-item label="属性类型">
                <el-radio v-model="formAdd.type" label="0">下拉框</el-radio>
                <el-radio v-model="formAdd.type" label="1">单选框</el-radio>
                <el-radio v-model="formAdd.type" label="2">复选框</el-radio>
                <el-radio v-model="formAdd.type" label="3">输入框</el-radio>
              </el-form-item>

              <el-form-item label="sku属性">
                  <el-radio v-model="formAdd.isSKU" label="0">是</el-radio>
                  <el-radio v-model="formAdd.isSKU" label="1">否</el-radio>
              </el-form-item>

              <el-form-item>
                <el-button @click="dialogBrandUpdate2 = false">取 消</el-button>
                <el-button type="primary" @click="addProperty">新增</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>


        </div>
</template>

<script>
    export default {
        name: "Property",
        data(){
          return{
            tableData:[],
            typeData:[],
            typeDataZi:[],
            //分页
            limit:"2",
            name:"",
            count:"",
            //新增
            dialogBrandAdd:false,
            formAdd:{
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSKU:""
            }

          }
        },
        methods:{
            handleSizeChange:function(val){
                this.limit=val;
                this.queryPropertyData(1);
            },
            chaxun:function(){
              this.queryPropertyData(1);
            },
            handleCurrentChange:function(val){
                this.queryPropertyData(val);
            },
            queryPropertyData:function (page) {
                var data={"page":page,"limit":this.limit,"name":this.name}
                var zy=this;
                this.$axios.post("http://192.168.235.1:8080/PropertyController/getDate",this.$qs.stringify(data)).then(function (res) {
                  zy.tableData=res.data.data;
                  zy.count=res.data.count;
                }).catch(function () {
                  alert("查询失败")
                })
            },
            queryType:function(){
                var zy=this;
                this.$axios.get("http://192.168.235.1:8080/PropertyController/queryType").then(function (res) {
                  debugger;

                  zy.typeData=res.data.data;
                    for (var i = 0; i <zy.typeData.length ; i++) {
                          var type=zy.typeData[i];
                          var boolean=zy.typeFu(type);
                          if(boolean==false){
                            var data={};
                            data.id=zy.typeData[i].id
                            data.name=zy.typeData[i].name
                            zy.typeDataZi.push(data)
                          }
                    }
                    //[{id="",name=""},{id="",name=""},{id="",name=""}]


                }).catch(function () {
                  alert("失败")
                })
            },
            typeFu(type){
              debugger;
              for (var i = 0; i <this.typeData.length ; i++) {
                var pid=this.typeData[i].pid
                if(type.id==pid) {
                  return true;
                }
              }
              return false;
            },
            typeIdFor:function (row,column,cellValue,index) {
              debugger;
              for (var i = 0; i <this.typeData.length ; i++) {
                  if(row.typeId===this.typeData[i].id){
                    return this.typeData[i].name
                  }
              }
              return "未知"
            },
            typeFor:function (row,column,cellValue,index) {
                if(row.type==0){
                   return "下拉框"
                }
                if(row.type==1){
                  return "单选框"
                }
                if(row.type==2){
                  return "复选框"
                }
                if(row.type==3){
                  return "输入框"
                }
            },
            isSKUFor:function (row,column,cellValue,index) {
                if(row.isSKU==0){
                  return "是"
                }
                if(row.isSKU==1){
                  return "否"
                }
            },
            add:function () {
                this.dialogBrandAdd=true;
            },
            addProperty:function () {
              var zy=this;
               this.$axios.post("http://192.168.235.1:8080/PropertyController/add",this.$qs.stringify(this.formAdd)).then(function () {
                  alert("新增成功")
                  zy.formAdd=[];
                  zy.dialogBrandAdd=false;
                 zy.chaxun();
               }).catch(function () {
                 alert("新增失败")
               })
            }
        },
        created:function () {
            this.queryType();
            this.queryPropertyData(1);
        }
    }
</script>

<style scoped>

</style>
