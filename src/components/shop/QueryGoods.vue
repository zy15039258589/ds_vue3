<template>
      <div>
            <el-button type="primary" @click="add">新增</el-button>
            <center><el-input v-model="name"  style="width:200px;"></el-input>
              <el-button type="primary" @click="chaxun">查询</el-button></center>
            <el-table :data="tableData" style="width: 100%" max-height="250">
              <el-table-column fixed prop="id" label="序号" width="150"></el-table-column>
              <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
              <el-table-column prop="title" label="标题" align="center"></el-table-column>
              <el-table-column prop="bandId" label="品牌" align="center" :formatter="bandIdFor"></el-table-column>

              <el-table-column prop="typeId" label="分类" align="center" :formatter="typeFor">
              </el-table-column>
              <el-table-column prop="productdecs" label="商品介绍" align="center"></el-table-column>
              <el-table-column prop="price" label="价格" align="center"></el-table-column>
              <el-table-column prop="imgPath" label="主图" align="center">
                <template slot-scope="scope">
                  <!-- <img src="192.168.1.43:8080/imgFiless/f86a6cd6-a0e3-47a6-ba03-62a68ff41c99.gif"/>-->
                  <img width="50px" :src="scope.row.imgPath"/>
                </template>
              </el-table-column>
              <el-table-column prop="stocks" label="库存" align="center"></el-table-column>
              <el-table-column prop="sortNum" label="排序" align="center"></el-table-column>

              <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" @click="updateGoods(scope.$index,scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="propertySku(scope.$index, scope.row)">属性sku维护</el-button>
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


        <el-dialog title="修改商品信息" :visible.sync="dialogGoodsUpdate">
              <el-form ref="formGoodsAdd" :model="updateGoodsAdd" :rules="rules"  label-width="80px">
                <el-form-item label="商品名称" prop="name">
                  <input type="hidden" v-model="updateGoodsAdd.imgPath">
                  <input type="hidden" v-model="updateGoodsAdd.id">
                  <el-input v-model="updateGoodsAdd.name"></el-input>
                </el-form-item>
                <el-form-item label="商品标题" prop="title">
                  <el-input v-model="updateGoodsAdd.title"></el-input>
                </el-form-item>
                <el-form-item label="品牌" align="left" prop="bandId">
                  <el-select  v-model="updateGoodsAdd.bandId" placeholder="请选择">
                    <el-option
                      v-for="item in brandData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form ref="form"  label-width="80px" >
                  <el-form-item  label="属性类型" align="left">
                    <el-select  placeholder="请选择" v-model="updateGoodsAdd.typeId">
                      <el-option
                        v-for="item in typeDataZi"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>

                <el-form-item label="商品介绍" prop="productdecs">
                  <el-input type="textarea" v-model="updateGoodsAdd.productdecs"></el-input>
                </el-form-item>

                <el-form-item label="价格" align="left" prop="price">
                  <el-input-number v-model="updateGoodsAdd.price" controls-position="right" :min="0" :precision="2" :step="0.1"></el-input-number>
                </el-form-item>

                <el-form-item label="库存" align="left">
                  <el-input-number v-model="updateGoodsAdd.stocks" controls-position="right" :step="10"   :min="0" ></el-input-number>
                </el-form-item>

                <el-form-item label="排序" align="left">
                  <el-input-number v-model="updateGoodsAdd.sortNum":min="0" controls-position="right"  label="描述文字"></el-input-number>
                </el-form-item>

                <el-form-item label="商品主照片" align="left">
                  <el-upload
                    class="avatar-uploader"
                    action="http://localhost:8080/BrandController/imgAdd"
                    list-type="picture-card"
                    :on-success="handleAvatarSuccess">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>

                <el-form-item align="center">
                  <el-button type="primary" @click="update">修改</el-button>
                  <input type="reset"/>
                </el-form-item>
              </el-form>
        </el-dialog>


        <el-dialog title="修改商品sku属性信息" :visible.sync="dialogGoodsPropertyUpdate">
              <el-form ref="form"  label-width="80px" >
                <el-form-item  label="属性类型" align="left">
                  <el-select  placeholder="请选择" v-model="properId">
                    <el-option
                      v-for="item in typeDataZi"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>

                  规格:
                  <el-form ref="form"   label-width="80px" v-for="val  in skuPropertyData" v-if="skuPropertyData.length>0">
                    <el-form-item  :label="val.nameCH" align="left">
                      <el-checkbox-group  v-model="val.ckvalue" @change="skuChange">
                        <el-checkbox  v-for="b in val.values" :value="b.name" :key="b.id" :label="b.valueCH" name="type"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-form>

                  <el-form>
                    <el-table v-if="tableShow" :data="tableDataSku" style="width: 100%" >
                      <el-table-column :prop="sku.name" :key="sku.id" :label="sku.nameCH" width="180" v-for=" sku in cols">
                      </el-table-column>
                      <el-table-column prop="price" label="价格" width="180">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.price"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="stocks" label="库存" width="180">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.stocks"></el-input>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>
                  <br>

                  参数：
                  <el-form ref="form" label-width="80px"   v-for="value  in noSkuPropertyData" v-if="noSkuPropertyData.length>0">
                    <el-form-item v-model="formValue" :label="value.nameCH" align="left">
                      <el-select v-if="value.type==0"  placeholder="请选择" v-model="value.ckvalue">
                        <el-option v-for="item in value.values" :key="item.id" :label="item.valueCH" :value="item.id">
                        </el-option>
                      </el-select>

                      <el-radio-group v-if="value.type==1" v-model="value.ckvalue">
                        <el-radio  v-for="b in value.values" :key="b.id" :label="b.valueCH"></el-radio>
                      </el-radio-group>

                      <el-checkbox-group v-if="value.type==2" v-model="value.ckvalue" >
                        <el-checkbox  v-for="b in value.values" :key="b.id" :label="b.valueCH" name="type"></el-checkbox>
                      </el-checkbox-group>
                      <el-input v-if="value.type==3" v-model="value.ckvalue"></el-input>
                    </el-form-item>
                  </el-form>



                </el-form-item>
                <el-form-item align="center">
                  <el-button type="primary" @click="active--">上一步</el-button>
                  <el-button type="primary" @click="updateProperty">修改</el-button>
                  <input type="reset"/>
                </el-form-item>
              </el-form>
        </el-dialog>

      </div>
</template>

<script>
    export default {
        name: "QueryGoods",
        data(){
          return{
            //分类递归
            typeData:[],
            typeDataZi:[],
            typeList:"",
            //查询
            tableData:[],
            typeData:[],
            brandData:[],
            size:2,
            count:"",
            name:"",
            //修改
            dialogGoodsUpdate:false,
            updateGoodsAdd:{
              id:"",
              imgPath:"",
              name:"",
              title:"",
              bandId:"",
              typeId:"",
              productdecs:"",
              price:"",
              stocks:"",
              sortNum:"",
              imageUrl:""
            },
            dialogGoodsPropertyUpdate:false,
            dialogGoodsPropertyUpdateNosku:false,
            //属性维护
            properId:"",
            //sku属性数据
            skuPropertyData:[],
            //非sku属性数据
            noSkuPropertyData:[],
            //是否展示表格
            tableShow:false,
            tableDataSku:[],
            cols:[],
            GoodsPropertyData:[]
          }
        },
        methods:{
          //修改商品属性方法
          calcDescartes:function (array) {
            if (array.length < 2) return array[0] || [];
            return [].reduce.call(array, function (col, set) {
              var res = [];
              col.forEach(function (c) {
                set.forEach(function (s) {
                  var t = [].concat(Array.isArray(c) ? c : [c]);
                  t.push(s);
                  res.push(t);
                })
              });
              return res;
            });
          },
          skuChange:function(){
            let filg=true;
            this.tableShow=false;
            this.cols=[];
            this.tableDataSku=[]
            var cc=[]
            for (let i = 0; i <this.skuPropertyData.length ; i++) {
              this.cols.push({"id":this.skuPropertyData[i].id,"nameCH":this.skuPropertyData[i].nameCH,"name":this.skuPropertyData[i].name});
              if(this.skuPropertyData[i].ckvalue.length==0){
                filg=false;
                break
              }
              cc.push(this.skuPropertyData[i].ckvalue)
            }
            //[[]]
            if(filg==true){
              var res=this.calcDescartes(cc);
              for (let i = 0; i <res.length ; i++) {
                let valuesAttr =res[i];
                let  tableValue={};
                if(typeof valuesAttr=="object"){
                  for (let j = 0; j <valuesAttr.length ; j++) {
                    //因为每次j++每次的key的值都不同 所以达到了不同的key对应不同的值
                    var key=this.cols[j].name;
                    //根据不同的key取值
                    tableValue[key]=valuesAttr[j];
                  }
                }else{
                  var key=this.cols[0].name;
                  //根据不同的key取值
                  tableValue[key]=valuesAttr;
                }
                this.tableDataSku.push(tableValue);
              }
            }
            this.tableShow=filg;
          },







          //商品信息
            chaxun:function(){
              this.queryDate(1);
            },
            handleSizeChange:function(val){
                this.size=val;
              this.queryDate(1);
            },
            handleCurrentChange:function(val){
                  this.queryDate(val);
            },
            queryDate:function(page) {
              var params={"page":page,"limit":this.size,"name":this.name};
              var zy=this
              this.$axios.post("http://localhost:8080/GoodsController/selectGoods",this.$qs.stringify(params)).then(function (res) {
                zy.tableData=res.data.data;
                zy.count=res.data.count;
              }).catch(function () {
                alert("查询失败")
              })
            },
            typeFor:function (row) {
              for (let i = 0; i <this.typeData.length ; i++) {
                  if(this.typeData[i].id==row.typeId){
                    return this.typeData[i].name;
                  }
              }
              return "未知"
            },
          bandIdFor:function (row) {
              for (let i = 0; i <this.brandData.length ; i++) {
                if(this.brandData[i].id==row.bandId){
                  return this.brandData[i].name;
                }
              }
              return "未知"
            },
          updateGoods:function (index,row) {
              this.dialogGoodsUpdate=true;
              this.updateGoodsAdd= JSON.parse(JSON.stringify(row));
          },
          update:function(){
            this.$confirm('您确认要修改么', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log(this.updateGoodsAdd);
              var data={"id":this.updateGoodsAdd.id,"typeId":this.updateGoodsAdd.typeId,"imgPath":this.updateGoodsAdd.imgPath, "name":this.updateGoodsAdd.name, "title":this.updateGoodsAdd.title, "bandId":this.updateGoodsAdd.bandId, "productdecs":this.updateGoodsAdd.productdecs, "price":this.updateGoodsAdd.price, "stocks":this.updateGoodsAdd.stocks, "sortNum":this.updateGoodsAdd.sortNum, "imageUrl":this.updateGoodsAdd.imageUrl};
              var zy=this;
              this.$axios.post("http://localhost:8080/GoodsController/updateGoods",this.$qs.stringify(data)).then(res=>{
                zy.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.dialogGoodsUpdate=false;
                this.chaxun();
              })
            }).catch(() => {

            });
          },
          handleAvatarSuccess:function (res, file) {
            this.updateGoodsAdd.imgPath=res;
            this.updateGoodsAdd.imageUrl=res;
          },
          //分类三级
          queryType: function () {
            var zy = this;
            this.$axios.get("http://localhost:8080/PropertyController/queryType").then(function (res) {
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
              if(type.pid!=0){
                this.typeList+=type.name+"/";
                for (let i = 0; i <this.typeData.length ; i++) {
                  if(type.pid==this.typeData[i].id){
                    this.diguiType(this.typeData[i]);
                  }
                }
              }else{
                this.typeList+=type.name;
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
          propertySku:function (index,row) {
            this.$axios.get("http://localhost:8080/GoodsController/queryByProId?proId="+row.id).then(res=>{
                  this.GoodsPropertyData=res.data.data;
            })
              this.dialogGoodsPropertyUpdate=true;
              this.properId=row.typeId;
          },
          getValeu:function (key) {
            let arrValue=[];
            for (let i = 0; i <this.GoodsPropertyData.length ; i++) {
              debugger;
                let  objData=JSON.parse(this.GoodsPropertyData[i].attrData);
                if(objData[key]!=null){
                  if(this.GoodsPropertyData[i].price!=null){
                    //判断上面数组是否已经有这个数据
                    if(arrValue.indexOf(objData[key])==-1){
                       arrValue.push(objData[key]);
                    }
                  }else{
                    return objData[key]
                  }
                }
            }
            console.log(arrValue.length);
            return arrValue;
          }
        },
        created:function () {
            var zy=this;
            this.$axios.get("http://localhost:8080/api/type/getData").then(function (res) {
              zy.typeData=res.data.data;
            }).catch(function () {

            })
            this.$axios.get("http://localhost:8080/BrandController/queryBrand").then(function (res) {
              zy.brandData=res.data.data;
            }).catch(function () {

            })
            this.queryDate(1);
            this.queryType();
        },
          watch:{
            properId:function () {
                this.$axios.get("http://localhost:8080/ValueController/queryByTypeId?typeId="+this.properId).then(res=>{
                  this.skuPropertyData=res.data.skuData;
                  this.noSkuPropertyData=res.data.attrData;
                })
            },
            dialogGoodsPropertyUpdate:function () {
                if(this.dialogGoodsPropertyUpdate==false){
                  this.properId="";
                }
            }
          }
    }
</script>

<style scoped>

</style>
