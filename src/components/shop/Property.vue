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
                  <el-button size="mini" v-if="scope.row.type!=3" type="danger" @click="propertyValue(scope.$index, scope.row)">属性值维护</el-button>
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




          <el-dialog title="修改信息" :visible.sync="dialogBrandUpdate">
            <el-form ref="form" :model="formXiugai" label-width="80px">
              <el-form-item label="属性名">
                <input type="hidden" v-model="formXiugai.id">
                <el-input v-model="formXiugai.name"></el-input>
              </el-form-item>

              <el-form-item label="属性中文名">
                <el-input v-model="formXiugai.nameCH"></el-input>
              </el-form-item>
              <el-form-item label="分类">
                <el-select  v-model="formXiugai.typeId" placeholder="请选择">
                  <el-option
                    v-for="item in typeDataZi"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="属性类型">
                <el-radio v-model="formXiugai.type" :label="0">下拉框</el-radio>
                <el-radio v-model="formXiugai.type" :label="1">单选框</el-radio>
                <el-radio v-model="formXiugai.type" :label="2">复选框</el-radio>
                <el-radio v-model="formXiugai.type" :label="3">输入框</el-radio>
              </el-form-item>

              <el-form-item label="sku属性">
                <el-radio v-model="formXiugai.isSKU" :label="0">是</el-radio>
                <el-radio v-model="formXiugai.isSKU" :label="1">否</el-radio>
              </el-form-item>

              <el-form-item>
                <el-button @click="dialogBrandUpdate2 = false">取 消</el-button>
                <el-button type="primary" @click="update">修改</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <!-- -----------属性值表-------------- -->

          <el-dialog :title="title" :visible.sync="dialogPropertyValue">
            <el-button type="primary" @click="addValue">新增</el-button>
            <el-table :data="valueTableData" style="width: 100%" max-height="250">
              <el-table-column fixed prop="id" label="序号" width="150">
              </el-table-column>
              <el-table-column prop="value" label="属性名" align="center">
              </el-table-column>
              <el-table-column prop="valueCH" label="属性中文名" align="center">
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" @click="updateValue(scope.$index,scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteValue(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>


          <el-dialog title="属性值修改信息" :visible.sync="dialogValueUpdate">
          <el-form ref="form" :model="valueUpdate" label-width="80px">
            <el-form-item label="属性名" prop="value">
              <input type="hidden" v-model="valueUpdate.id">
              <input type="hidden" v-model="valueUpdate.propertyId">
              <el-input v-model="valueUpdate.value"></el-input>
            </el-form-item>

            <el-form-item label="属性中文名" prop="valueCH">
              <el-input v-model="valueUpdate.valueCH"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button @click="dialog">取 消</el-button>
              <el-button type="primary" @click="updatePropertyValue">修改</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

          <el-dialog title="属性值新增信息" :visible.sync="dialogValueAdd">
            <el-form ref="form" :model="valueAdd" label-width="80px">
              <el-form-item label="属性名" prop="value">
                <input type="hidden" v-model="valueAdd.propertyId">
                <el-input v-model="valueAdd.value"></el-input>
              </el-form-item>

              <el-form-item label="属性中文名" prop="valueCH">
                <el-input v-model="valueAdd.valueCH"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button @click="dialog">取 消</el-button>
                <el-button type="primary" @click="addValueData">添加</el-button>
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
            arr:[],
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
            },
            //修改
            dialogBrandUpdate:false,
            formXiugai:{
              id:"",
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSKU:""
            },
            typeList:"",
            countFlig:0,
            //属性值表的所有属性
            dialogPropertyValue:false,
            valueTableData:[],
            title:"",
            //修改
            dialogValueUpdate:false,
            valueUpdate:{
              id:"",
              value:"",
              valueCH:"",
              propertyId:""
            },
            valueAdd:{
              value:"",
              valueCH:"",
              propertyId:""
            },
            dialogValueAdd:false,
          }
        },
        rules:{
          value: [
            { required: true, message: '请输入值名称', trigger: 'blur' },
          ],
          valueCH: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
        },

        methods: {
          //属性值表的所有方法
          propertyValue:function(index,row){
                this.valueAdd.propertyId=row.id;
                var cc="";
                for (let i = 0; i <this.typeData.length ; i++) {
                    if(this.typeData[i].id==row.typeId){
                          cc=this.typeData[i].name;
                    }
                }
                this.title=cc+"-----"+row.nameCH+"的值属性"
                var zy = this;
                this.$axios.get("http://192.168.235.1:8080/ValueController/getData?id="+row.id).then(function (res) {
                  zy.valueTableData=res.data.data;
                    zy.dialogPropertyValue=false;
                    zy.dialogPropertyValue=true;
                }).catch(function () {
                  alert("查询失败")
                })
          },
          updateValue:function(index,row){
            this.valueUpdate.id=row.id;
            this.valueUpdate.value=row.value;
            this.valueUpdate.valueCH=row.valueCH;
            this.valueUpdate.propertyId=row.propertyId;
            this.dialogValueUpdate=true;
            this.dialogPropertyValue=false;
          },
          updatePropertyValue:function(){
              this.$confirm('您确定要修改么', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                var  zy=this;
                this.$axios.post("http://192.168.235.1:8080/ValueController/update",this.$qs.stringify(this.valueUpdate)).then(function () {
                  zy.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  zy.queryLocal(zy.valueUpdate.propertyId);
                  zy.dialogValueUpdate=false;
                  zy.dialogPropertyValue=true;
                }).catch(function () {
                  alert("失败")
                })
              }).catch(() => {

              });


          },queryLocal:function(id){
            var zy=this;
                this.$axios.get("http://192.168.235.1:8080/ValueController/getData?id="+id).then(function (res) {
                  zy.valueTableData=res.data.data;
                }).catch(function () {
                  alert("查询失败")
                })
          },
          addValue:function(){
              this.valueAdd.value="";
              this.valueAdd.valueCH="";
              this.dialogValueAdd=true;
              this.dialogPropertyValue=false;
          },
          addValueData:function(){
            var zy=this;
            this.$axios.post("http://192.168.235.1:8080/ValueController/add",this.$qs.stringify(this.valueAdd)).then(function () {
              zy.$message({
                message: '新增成功',
                type: 'success'
              });
              zy.queryLocal(zy.valueAdd.propertyId);
              zy.dialogValueAdd=false;
              zy.dialogPropertyValue=true;
            }).catch(function () {
              alert("新增失败")
            })
          },
          deleteValue:function(indsx,row){
            this.$confirm('您确认要删除么', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var zy=this;
              this.$axios.get("http://192.168.235.1:8080/ValueController/delete?id="+row.id).then(function () {
                zy.$message({
                  message: '删除成功',
                  type: 'success'
                });
                zy.queryLocal(row.propertyId);
              }).catch(function () {
                alert("删除失败")
              })
            }).catch(() => {

            });
          },
          dialog:function(){
            debugger;
            this.dialogValueUpdate=false;
            this.dialogValueAdd=false;
            this.dialogPropertyValue=true;
          },








          //属性表的所有方法
          handleSizeChange: function (val) {
            this.limit = val;
            this.queryPropertyData(1);
          },
          chaxun: function () {
            this.queryPropertyData(1);
          },
          handleCurrentChange: function (val) {
            this.queryPropertyData(val);
          },
          queryPropertyData: function (page) {
            var data = {"page": page, "limit": this.limit, "name": this.name}
            var zy = this;
            this.$axios.post("http://192.168.235.1:8080/PropertyController/getDate", this.$qs.stringify(data)).then(function (res) {
              zy.tableData = res.data.data;
              zy.count = res.data.count;
            }).catch(function () {
              alert("查询失败")
            })
          },
          queryType: function () {
            var zy = this;
            this.$axios.get("http://192.168.235.1:8080/PropertyController/queryType").then(function (res) {
              console.log(res.data.data)
              zy.arr=res.data.data;
              zy.typeData = res.data.data;
              //zy.typeList+="["
              for (var i = 0; i < zy.typeData.length; i++) {
                var type = zy.typeData[i];
                var boolean = zy.typeFu(type);
                if (boolean == false) {
                  zy.typeDataZi.push(zy.typeData[i])
                }
              }

              for (let i = 0; i <zy.typeDataZi.length ; i++) {
                    zy.typeList="";
                    zy.diguiType(zy.typeDataZi[i])
                    zy.typeDataZi[i].name=zy.typeList.split("/").reverse().join("/")
              }
            }).catch(function () {
              alert("查询失败")
            })
          },
          diguiType:function(type){
            if(type.pid!=0){ //临界值
              this.typeList+=type.name+"/"
              for (var i = 0; i <this.typeData.length ; i++) {
                if(this.typeData[i].id==type.pid){
                  this.diguiType(this.typeData[i]);
                }
              }
            }else{
              this.typeList+=type.name
            }

          },
          typeFu(type) {
            for (var i = 0; i < this.typeData.length; i++) {
              var pid = this.typeData[i].pid
              if (type.id == pid) {
                return true;
              }
            }
            return false;
          },
          typeIdFor: function (row, column, cellValue, index) {
            console.log(JSON.stringify(this.arr))
            for (var i = 0; i < this.arr.length; i++) {
              if (cellValue === this.arr[i].id) {
                  return this.arr[i].name
              }
            }
            return "未知"
          },
          typeFor: function (row, column, cellValue, index) {
            if (row.type == 0) {
              return "下拉框"
            }
            if (row.type == 1) {
              return "单选框"
            }
            if (row.type == 2) {
              return "复选框"
            }
            if (row.type == 3) {
              return "输入框"
            }
          },
          isSKUFor: function (row, column, cellValue, index) {
            if (row.isSKU == 0) {
              return "是"
            }
            if (row.isSKU == 1) {
              return "否"
            }
          },
          add: function () {
            this.formAdd={};
            this.dialogBrandAdd = true;
          },
          addProperty: function () {
            var zy = this;
            this.$axios.post("http://192.168.235.1:8080/PropertyController/add", this.$qs.stringify(this.formAdd)).then(function () {
              alert("新增成功")
              zy.formAdd = [];
              zy.dialogBrandAdd = false;
              zy.chaxun();
            }).catch(function () {
              alert("新增失败")
            })
          },
          updateProperty: function (index, row) {
            this.formXiugai.id = row.id;
            this.formXiugai.name = row.name;
            this.formXiugai.nameCH = row.nameCH;
            this.formXiugai.typeId = row.typeId;
            this.formXiugai.type = row.type;
            this.formXiugai.isSKU = row.isSKU;
            this.dialogBrandUpdate = true;
          },
          update:function () {

            this.$confirm('您确认要修改么？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var zy=this;
              this.$axios.post("http://192.168.235.1:8080/PropertyController/update", this.$qs.stringify(this.formXiugai)).then(function () {
                alert("修改成功")
                zy.dialogBrandUpdate=false;
                zy.formXiugai = [];
                zy.chaxun();
              }).catch(function () {
                alert("修改失败")
              })
            }).catch(() => {

            });



          },
          deleteProperty:function (index,row) {

            this.$confirm('您确认要删除么', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var zy=this;
              this.$axios("http://192.168.235.1:8080/PropertyController/delete?id="+row.id).then(function () {
                alert("删除成功")
                zy.chaxun();
              }).catch(function () {
                alert("删除失败")
              })

            }).catch(() => {

            });
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
