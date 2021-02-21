<template>
  <center>
  <div style="width:850px; height: 100%">
          <el-steps :active="active" finish-status="success">
            <el-step align="left" title="步骤 1"></el-step>
            <el-step align="right" title="步骤 2"></el-step>
          </el-steps>
        <el-form ref="formGoodsAdd" :model="formGoodsAdd" :rules="rules"  label-width="80px" v-if="active==0">
          <el-form-item label="商品名称" prop="name">
            <input type="hidden" v-model="formGoodsAdd.imgPath">
            <el-input v-model="formGoodsAdd.name"></el-input>
          </el-form-item>
          <el-form-item label="商品标题" prop="title">
            <el-input v-model="formGoodsAdd.title"></el-input>
          </el-form-item>
          <el-form-item label="品牌" align="left" prop="bandId">
            <el-select  v-model="formGoodsAdd.bandId" placeholder="请选择">
              <el-option
                v-for="item in bandData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品介绍" prop="productdecs">
            <el-input type="textarea" v-model="formGoodsAdd.productdecs"></el-input>
          </el-form-item>

          <el-form-item label="价格" align="left" prop="price">
            <el-input-number v-model="formGoodsAdd.price" controls-position="right" :min="0" :precision="2" :step="0.1"></el-input-number>
          </el-form-item>

          <el-form-item label="库存" align="left">
            <el-input-number v-model="formGoodsAdd.stocks" controls-position="right" :step="10"   :min="0" ></el-input-number>
          </el-form-item>

          <el-form-item label="排序" align="left">
            <el-input-number v-model="formGoodsAdd.sortNum":min="0" controls-position="right"  label="描述文字"></el-input-number>
          </el-form-item>

          <el-form-item label="商品主照片" align="left">
            <el-upload
              class="avatar-uploader"
              action="http://192.168.235.1:8080/BrandController/imgAdd"
              list-type="picture-card"
              :on-success="handleAvatarSuccess">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item align="center">
            <el-button type="primary" @click="next('formGoodsAdd')">下一步商品信息</el-button>
            <input type="reset"/>
          </el-form-item>
        </el-form>

            <el-form ref="form"  label-width="80px"  v-if="active==1">
              <el-form-item  label="属性类型" align="left">
                <el-select  placeholder="请选择" v-model="properId">
                  <el-option
                    v-for="item in typeDataZi"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>



              规格:
              <el-form ref="form"   label-width="80px" v-for="val  in skuPropertyData" v-if="skuPropertyData.length>0">
                <el-form-item  :label="val.nameCH" align="left">
                  <el-checkbox-group  v-model="val.ckvalue" @change="skuChange">
                    <el-checkbox  v-for="b in val.values" :key="b.id" :label="b.valueCH" name="type"></el-checkbox>
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
              <br><br><br>



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


              <el-form-item align="center">
                <el-button type="primary" @click="active--">上一步</el-button>
                <el-button type="primary" @click="add">提交</el-button>
                <input type="reset"/>
              </el-form-item>
            </el-form>










  </div>
  </center>
</template>

<script>
    export default {
        name: "Goods",

        data(){
          return{
            active: 0,
            //第一步商品基本数据
            formGoodsAdd:{
              name:"",
              title:"",
              bandId:"",
              productdecs:"",
              price:0,
              stocks:0,
              sortNum:0,
              imageUrl:"",
              imgPath:"",
              typeId:"",
              sku:"",
              noSku:""
            },
            bandData:[],
            //监听数据
            properId:"",
            //处理属性下拉框的数据
            typeData:[],
            typeDataZi:[],
            typeList:"",
            //----------
            //sku属性数据
            skuPropertyData:[],
            //非sku属性数据
            noSkuPropertyData:[],
            //是否展示表格
            tableShow:false,
            tableDataSku:[],
            cols:[],
            //商品主表验证
                  rules: {
                    name: [
                      { required: true, message: '请输入商品名称', trigger: 'blur' },
                      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    title: [
                      { required: true, message: '请输入商品标题', trigger: 'blur' },
                    ],
                    bandId: [
                      { required: true, message: '请选择品牌', trigger: 'blur' },
                    ],
                    productdecs: [
                      { required: true, message: '请输入商品介绍', trigger: 'blur' },
                    ],
                  },
          }
        },

        methods:{
          add:function(){
            console.log(this.skuPropertyData);
            this.formGoodsAdd.typeId=this.properId;
              var noSkus=[];
              for (let i = 0; i <this.noSkuPropertyData.length ; i++) {
                  let dd={};
                  var key=this.noSkuPropertyData[i].name;
                  dd[key]=this.noSkuPropertyData[i].ckvalue;
                  noSkus.push(dd)
              }
              this.formGoodsAdd.noSku=JSON.stringify(noSkus);
              this.formGoodsAdd.sku=JSON.stringify(this.tableDataSku);
              //发起请求  保存数据
              this.$axios.post("http://localhost:8080/GoodsController/addGoodsOrProper",this.$qs.stringify(this.formGoodsAdd)).then(res=>{
                this.$message.success("添加成功");
              })
          },
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
          next:function (formGoodsAdd) {
            this.$refs[formGoodsAdd].validate((valid) => {
              if (valid) {
                if (this.active++ > 2) this.active = 0;
                this.tiaoZhuan=2;
              } else {
                return false;
              }
            });
          },
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
          diguiType:function (type) {
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
          },//图片监听事件
          handleAvatarSuccess:function (res, file) {
            this.formGoodsAdd.imgPath=res;
          },
        },
        created:function(){
          this.$axios.get("http://localhost:8080/BrandController/queryBrand").then(res=>{
              this.bandData=res.data.data;
              this.queryType();
          }).catch(res=>{
            alert("查询失败")
          })
        },
        watch:{
             properId:function () {
               this.tableShow = false;
               this.skuPropertyData = [];// sku 属性   颜色   大小
               this.noSkuPropertyData = [];
               this.$axios.get("http://localhost:8080/ValueController/queryByTypeId?typeId="+this.properId).then(res=>{
                 this.skuPropertyData=res.data.skuData;
                 this.noSkuPropertyData=res.data.attrData;
               })

             }
        }
    }
</script>

<style scoped>

</style>
