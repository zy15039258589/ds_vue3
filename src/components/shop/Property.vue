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
              <el-table-column prop="typeId" label="分类" align="center">

              </el-table-column>
              <el-table-column prop="type" label="属性类型" align="center">

              </el-table-column>
              <el-table-column prop="isSKU" label="sku属性" align="center">
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
        </div>
</template>

<script>
    export default {
        name: "Property",
        data(){
          return{
            tableData:[],
            //分页
            limit:"2",
            name:"",
            count:"",
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
        },
        created:function () {
            this.queryPropertyData(1);
        }
    }
</script>

<style scoped>

</style>
