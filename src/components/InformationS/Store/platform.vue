<template>
    <div class="MagList">
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search J-flexSbc" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                  <el-form-item label="电商名称" prop="platformName">
                    <el-input v-model="searchForm.platformName" placeholder="电商名称" style="width:215px"></el-input>
                  </el-form-item>
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary" v-if="checkHasPermission('platform:read')" @click='handlesearch'>查询</el-button>
                  <el-button type="warning" v-if="checkHasPermission('platform:read')" @click="resetForm('searchForm')">重置</el-button>
                  </el-form-item>
              </el-form>
              <el-button type="primary" style="margin-top: -18px;margin-right:18px" v-if="checkHasPermission('platform:create')" @click="newModifyFun()">新增</el-button>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
              <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
              <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                <template slot-scope="scope">
                  <div class="table-menu">
                    <el-menu  :collapse="true"  >
                      <el-submenu index="1" >
                        <template slot="title" >
                          <i class="el-icon-edit-outline"></i>
                        </template>
                        <el-menu-item-group> 
                          <el-menu-item index="1-2" v-if="checkHasPermission('platform:update')" @click="newModifyFun(scope.row)">修改</el-menu-item> 
                          <el-menu-item index="1-3" v-if="scope.row.status==0 && checkHasPermission('platform:change')" @click="warehouseStatusFun(scope.row)">启用</el-menu-item>   
                          <el-menu-item index="1-4" v-if="scope.row.status==1 && checkHasPermission('platform:change')" @click="warehouseStatusFun(scope.row)">停用</el-menu-item> 
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" align='center' width="100">
                <template slot-scope="scope">
                  <div v-html="statusBackground(warehouseStatus(scope.row.status))" class="J-statusBackground"></div>     
                </template>
              </el-table-column>
              <el-table-column prop="platformName" label="电商名称" align='center' width="180"></el-table-column>
              <el-table-column prop="companyName" label="公司名称" align='center' width="180"></el-table-column>
              <el-table-column prop="webUrl" label="预约网址" align='center' width="300"></el-table-column>
              <el-table-column prop="memo" label="备注" align='center' ></el-table-column>
              <el-table-column prop="updateEmployeeName" label="修改人" align='center' width="110"></el-table-column>
              <el-table-column prop="updateTime" label="修改时间" align='center' width="160"></el-table-column>
            </el-table>
            <div class="main-table-page">
              <div class="main-table-page-left"> 
              
              </div>
              <el-pagination background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="page.pageSizes"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="searchForm.pageNo"
                :total="page.total">
              </el-pagination>
            </div>
          </div>
        </div>

        <el-dialog :close-on-click-modal="false" :title="newModify.title" :visible.sync="newModify.visible"  width="630px" center class="Maglist-HairCar J-dialog-vh">
          <div class="J-detail  "> 
              <el-row>
                <el-form ref="newModify.form" :rules="newModifyRules" :model="newModify.form"  label-width="95px" class="demo-ruleForm J-flexSbc" style=" width: 578px;margin:0 auto">
                  <el-form-item label="电商名称 :" prop="platformName" >
                    <el-input v-model="newModify.form.platformName"></el-input>
                  </el-form-item>
                  <el-form-item label="公司名称 :" prop="companyName" >
                    <el-input v-model="newModify.form.companyName"></el-input>
                  </el-form-item>
                  <el-form-item label="预约网址 :" prop="webUrl" class="J-width100">
                    <el-input v-model="newModify.form.webUrl"></el-input>
                  </el-form-item> 
                  <el-form-item label="备注 :" prop="memo"  class="J-width100">
                    <el-input type="textarea" v-model="newModify.form.memo"></el-input>
                  </el-form-item>  
                </el-form>
                <span class="dialog-footer" style="display: block; text-align: center;">
                  <el-button type="primary" :loading="savingFlag" v-if="checkHasPermission('platform:create')" @click="newModifyPreservation('newModify.form')">保 存</el-button>
                </span> 
              </el-row> 
          </div>
        </el-dialog>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
  name:'i-s-platform',
  mixins: [Base,List],
    data() {
      return {
        //...启用还是停用
        platformStatusChange :{
          title:'此操作将启用该电商, 是否继续?',
          data:{
            id:'',
            status:''
          }
        },
        //...新增或是修改
        newModify:{
          visible:false,
          //用来判断新增或是修改
          title:'',
          form:{
            platformName:'',
            companyName:'',
            webUrl:'',
            memo:'',
            id:''//修改需要
          }
        },
        //查询   
        searchForm: { 
          platformName:'',
          pageSize: 10,
          pageNo: 1
        },
        tableData: [], 
        newModifyRules: {
          platformName: [
            { required: true, message: '请输入电商名称', trigger: 'blur' },
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}  
          ],
          companyName:[
            { required: true, message: '请输入公司名称', trigger: 'blur' },
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}  
          ],
          webUrl:[
            { required: true, message: '请输入预约网址', trigger: 'blur' },
            { min: 1, max: 1000, message: '超出长度限制{1~1000}' ,trigger: 'blur'}  
          ],
          memo:[
            { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
          ]
        },
      };
    },
    methods: {
      //客户修改/新增  判断弹框时是否传递row  
      newModifyFun(row){
        this.closeDialog('newModify.form')
        if(row){  
          this.newModify.title='修改电商平台'
          this.newModify.form.platformName=row.platformName
          this.newModify.form.companyName=row.companyName
          this.newModify.form.webUrl=row.webUrl
          this.newModify.form.memo=row.memo
          this.newModify.form.id=row.id
        }else{
          this.newModify.title='新增电商平台'    
          this.selectivity=true      
        }     
        this.newModify.visible=true
      },

      //点击保存验证
       newModifyPreservation(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveDataSubmit()
          } else {
            
            return false;
          }
        });
      },
      //点击保存到-执行修改或增加
      async saveDataSubmit(){  
         this.$confirm('确定要【保存】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
        }).then(() => {  
          this.savingFlag=true
          if(!this.newModify.form.id){
            api.post('/eb/platform/add',this.newModify.form).then(data=>{
              if(data.code==200){
                this.$message({
                  type: 'success',
                  message: '恭喜您，电商平台已新增!'
                });
                this.querySpecialList()
                this.newModify.visible=false
              }
            }).then(() => { 
                this.savingFlag=false             
            })   
          }else{
            api.post('/eb/platform/update',this.newModify.form).then(data=>{
              if(data.code==200){
                this.$message({
                  type: 'success',
                  message: '恭喜您，已成功修改该电商平台!'
                });
                this.querySpecialList()
                this.newModify.visible=false
              }
            }).then(() => { 
                this.savingFlag=false             
            }) 
          } 
        })
      },  
      
      //启用或停用      
      warehouseStatusFun(row){
        this.platformStatusChange.data.id=row.id
        this.platformStatusChange.data.status=row.status
        if(row.status==0){
          this.platformStatusChange.title='此操作将启用该电商, 是否继续?'
        }else{
          this.platformStatusChange.title='此操作将停用该电商, 是否继续?'
        }
        this.$confirm(this.platformStatusChange.title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(async () => {
            const { code, message,data } =await api.post('/eb/platform/status/change',this.platformStatusChange.data)
            if(code==200){
              if(row.status==0){
                this.$message({
                  type: 'success',
                  message: '恭喜您，启用成功!'
                });
              }else{
                this.$message({
                  type: 'success',
                  message: '恭喜您，停用成功!'
                });
              }
              this.querySpecialList()
            }        
        }).catch(() => {
                  
        });
      },
      //获取页面初始数据
      async querySpecialList() {
        const { code, message,data } =await api.post('eb/platform/list', this.searchForm)
        if(code==="200"){
          this.tableData = data.records;
          this.page.total = data.total;  
        }
      }  
    }
  };
</script>