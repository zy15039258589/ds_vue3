<template>
  <div>
    <el-button type="primary" @click="add">新增</el-button>
    <center><el-input v-model="name"  style="width:200px;"></el-input>
    <el-button type="primary" @click="chaxun">查询</el-button></center>
  <el-table :data="tableData" style="width: 100%" max-height="250">
    <el-table-column fixed prop="id" label="序号" width="150">

    </el-table-column>
    <el-table-column prop="name" label="姓名" align="center">

    </el-table-column>
    <el-table-column prop="bandE" label="首字母" align="center">

    </el-table-column>
    <el-table-column prop="imgpath" label="图片log" align="center">

      <template slot-scope="scope">
        <!-- <img src="192.168.1.43:8080/imgFiless/f86a6cd6-a0e3-47a6-ba03-62a68ff41c99.gif"/>-->
        <img width="50px" :src="scope.row.imgpath"/>
      </template>
    </el-table-column>
    <el-table-column prop="bandDesc" label="品牌介绍" align="center">

    </el-table-column>
    <el-table-column prop="ord" label="排序" align="center">

    </el-table-column>
    <el-table-column prop="createDate" label="创建时间" align="center">

    </el-table-column>
    <el-table-column prop="updateDate" label="修改时间" align="center">

    </el-table-column>

    <el-table-column fixed="right" label="操作" align="center">
      <template slot-scope="scope">
        <el-button size="mini" @click="updateBrand(scope.$index,scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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


    <el-dialog title="修改信息" :visible.sync="dialogBrandUpdate">
        <el-form ref="form" :model="formUpdate" label-width="80px">
          <el-form-item label="名称">
            <input type="hidden" v-model="formUpdate.imgpath">
            <input type="hidden"  v-model="formUpdate.id">
            <el-input v-model="formUpdate.name"></el-input>
          </el-form-item>

          <el-form-item label="首字母">
            <el-input v-model="formUpdate.bandE"></el-input>
          </el-form-item>

          <el-form-item label="log">
            <el-upload
              class="avatar-uploader"
              action="http://192.168.235.1:8080/BrandController/imgAdd"
              list-type="picture-card"
              :on-success="handleAvatarSuccess">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="品牌介绍">
            <el-input type="textarea" v-model="formUpdate.bandDesc"  maxlength="50" show-word-limit></el-input>
          </el-form-item>

          <el-form-item label="排序字段">
            <el-input v-model="formUpdate.ord"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="dialogBrandUpdate = false">取 消</el-button>
            <el-button type="primary" @click="updateById">修 改</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>





    <el-dialog title="新增信息" :visible.sync="dialogBrandAdd">
      <el-form ref="form" :model="formAdd" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="formAdd.name"></el-input>
        </el-form-item>

        <el-form-item label="首字母">
          <el-input v-model="formAdd.bandE"></el-input>
        </el-form-item>

        <el-form-item label="log">
          <el-upload
            class="avatar-uploader"
            action="http://192.168.235.1:8080/BrandController/imgAdd"
            list-type="picture-card"
            :on-success="handleAvatarSuccess2">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="品牌介绍">
          <el-input type="textarea" v-model="formAdd.bandDesc" show-word-limit  maxlength="50"></el-input>
        </el-form-item>

        <el-form-item label="排序字段">
          <el-input v-model="formAdd.ord"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="dialogBrandUpdate2 = false">取 消</el-button>
          <el-button type="primary" @click="addBrand">新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>




  </div>
</template>

<script>
    export default {
        name: "Brand",
        data(){
           return{
             //查询
             tableData:[],
             //条件查询加分页
             name:"",
             size:"2",
             count:"",
             //修改
             dialogBrandUpdate:false,
             formUpdate:{
               id:null,
               name:"",
               bandE:null,
               bandDesc:"",
               ord:null,
               imgpath:""
             },
             imageUrl:'',
              //新增
             formAdd:{
               name:"",
               bandE:null,
               bandDesc:"",
               ord:null,
               imgpath:""
             },
             dialogBrandAdd:false,
           }
        },

        methods:{
            handleSizeChange:function(val){
                this.size=val;
                this.queryDate(1);
            },
            chaxun:function(){
              this.queryDate(1);
            },
            handleCurrentChange:function(val){
              this.queryDate(val);
            },
            queryDate:function (page) {
                var params={"page":page,"limit":this.size,"name":this.name};
                var zy=this
                this.$axios.post("http://192.168.235.1:8080/BrandController/getBrandDate",this.$qs.stringify(params)).then(function (res) {
                  zy.tableData=res.data.data;
                  zy.count=res.data.count;
                }).catch(function () {
                  alert("查询失败")
                })
            },
            updateBrand:function(index,data){
              this.formUpdate=data;
              this.dialogBrandUpdate=true;
            },
            handleAvatarSuccess:function (res, file) {
              this.formUpdate.imgpath=res;
            },
            updateById:function () {
              var zy=this;
              var brand={"id":this.formUpdate.id,"name":this.formUpdate.name,"bandE":this.formUpdate.bandE,"bandDesc":this.formUpdate.bandDesc,"ord":this.formUpdate.ord,"imgpath":this.formUpdate.imgpath}
              console.log(this.formUpdate);
              this.$axios.post("http://192.168.235.1:8080/BrandController/updateBrand",this.$qs.stringify(brand)).then(function () {
                alert("修改成功");
                zy.dialogBrandUpdate=false;
                zy.chaxun();
              }).catch(function () {
                alert("修改失败")
              })
            },
          handleAvatarSuccess2:function (res, file) {
            this.formAdd.imgpath=res;
          },
          add:function () {
              this.dialogBrandAdd=true;
          },
          addBrand:function () {
              var zy=this;
            this.$axios.post("http://192.168.235.1:8080/BrandController/addBrand",this.$qs.stringify(this.formAdd)).then(function (res) {
              alert("新增成功");
              zy.dialogBrandAdd=false;
              zy.chaxun();
            }).catch(function () {
              alert("新增失败")
            })
          },
          handleDelete:function (index,data) {
            var zy=this;
            this.$axios.get("http://192.168.235.1:8080/BrandController/delete?id="+data.id+"").then(function (res) {
              alert("删除成功");
              zy.chaxun();
            }).catch(function () {
              alert("删除失败")
            })
          }
        },
        created:function () {
            this.queryDate(1);
        }
    }
</script>

<style scoped>

</style>
