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
                  <el-button size="mini" type="danger" @click="propertyValue(scope.$index, scope.row)">属性值维护</el-button>
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

          <el-dialog title="修改信息" :visible.sync="dialogPropertyValue">
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
            <el-form-item label="属性名">
              <input type="hidden" v-model="valueUpdate.id">
              <input type="hidden" v-model="valueUpdate.propertyId">
              <el-input v-model="valueUpdate.value"></el-input>
            </el-form-item>

            <el-form-item label="属性中文名">
              <el-input v-model="valueUpdate.valueCH"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button @click="dialogValueUpdate = false">取 消</el-button>
              <el-button type="primary" @click="updatePropertyValue">修改</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

          <el-dialog title="属性值新增信息" :visible.sync="dialogValueAdd">
            <el-form ref="form" :model="valueAdd" label-width="80px">
              <el-form-item label="属性名">
                <input type="hidden" v-model="valueAdd.propertyId">
                <el-input v-model="valueAdd.value"></el-input>
              </el-form-item>

              <el-form-item label="属性中文名">
                <el-input v-model="valueAdd.valueCH"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button @click="dialogValueUpdate = false">取 消</el-button>
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
        methods: {
          //属性值表的所有方法
          propertyValue:function(index,row){
                this.valueAdd.propertyId=row.id;
                var zy = this;
                this.$axios.get("http://192.168.235.1:8082/ValueController/getData?id="+row.id).then(function (res) {
                  zy.valueTableData=res.data.data;
                  if(row.type==3){
                    zy.$message({
                      message: '你是自定义的属性',
                      type: 'warning'
                    });
                    zy.dialogPropertyValue=false;
                  }else{
                    zy.dialogPropertyValue=true;
                  }
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
          },
          updatePropertyValue:function(){
            var  zy=this;
              this.$axios.post("http://192.168.235.1:8082/ValueController/update",this.$qs.stringify(this.valueUpdate)).then(function () {
                zy.$message({
                  message: '修改成功',
                  type: 'success'
                });
                zy.queryLocal(zy.valueUpdate.propertyId);
                zy.dialogValueUpdate=false;

              }).catch(function () {
                alert("失败")
              })
          },queryLocal:function(id){
            var zy=this;
                this.$axios.get("http://192.168.235.1:8082/ValueController/getData?id="+id).then(function (res) {
                  zy.valueTableData=res.data.data;
                }).catch(function () {
                  alert("查询失败")
                })
          },
          addValue:function(){
              this.valueAdd.value="";
              this.valueAdd.valueCH="";
              this.dialogValueAdd=true;
          },
          addValueData:function(){
            var zy=this;
            this.$axios.post("http://192.168.235.1:8082/ValueController/add",this.$qs.stringify(this.valueAdd)).then(function () {
              zy.$message({
                message: '新增成功',
                type: 'success'
              });
              zy.queryLocal(zy.valueAdd.propertyId);
              zy.dialogValueAdd=false;
            }).catch(function () {
              alert("新增失败")
            })
          },
          deleteValue:function(indsx,row){
              var zy=this;
              this.$axios.get("http://192.168.235.1:8082/ValueController/delete?id="+row.id).then(function () {
                zy.$message({
                  message: '删除成功',
                  type: 'success'
                });
                zy.queryLocal(row.propertyId);
              }).catch(function () {
                alert("删除失败")
              })
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
            this.$axios.post("http://192.168.235.1:8082/PropertyController/getDate", this.$qs.stringify(data)).then(function (res) {
              zy.tableData = res.data.data;
              zy.count = res.data.count;
            }).catch(function () {
              alert("查询失败")
            })
          },
          queryType: function () {
            var zy = this;
            this.$axios.get("http://192.168.235.1:8082/PropertyController/queryType").then(function (res) {
              zy.typeData = res.data.data;
              zy.typeList+="["
              for (var i = 0; i < zy.typeData.length; i++) {
                var type = zy.typeData[i];
                var boolean = zy.typeFu(type);
                if (boolean == false) {
                  zy.typeList+="{id:"+type.id+",name:'分类"
                  zy.diguiType(type);
                  zy.typeList+="/"+type.name+"'},"
                }else{
                  if(zy.typeData[i].pid==1){
                    zy.diguiType(zy.typeData[i]);
                  }
                }
              }
              zy.typeList+="]"
              zy.typeDataZi.push(zy.typeList);
              console.log(zy.typeDataZi);
            }).catch(function () {
              alert("查询失败")
            })
          },
          diguiType:function(type){
            debugger;
            this.countFlig++;
            //[{},{},{}]
            for (var i = 0; i <this.typeData.length ; i++) {
              debugger;
                if(i==0){
                  continue
                }
                if(this.typeData[i].id==type.pid){
                  this.typeList+="/"+this.typeData[i].name
                  this.diguiType(this.typeData[i]);
                }else{
                  continue
                }
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
            for (var i = 0; i < this.typeData.length; i++) {
              if (row.typeId === this.typeData[i].id) {
                return this.typeData[i].name
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
            this.$axios.post("http://192.168.235.1:8082/PropertyController/add", this.$qs.stringify(this.formAdd)).then(function () {
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
            var zy=this;
              this.$axios.post("http://192.168.235.1:8082/PropertyController/update", this.$qs.stringify(this.formXiugai)).then(function () {
                alert("修改成功")
                zy.dialogBrandUpdate=false;
                zy.formXiugai = [];
                zy.chaxun();
              }).catch(function () {
                alert("修改失败")
              })
          },
          deleteProperty:function (index,row) {
            var zy=this;
            this.$axios("http://192.168.235.1:8082/PropertyController/delete?id="+row.id).then(function () {
              alert("删除成功")
              zy.chaxun();
            }).catch(function () {
              alert("删除失败")
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
