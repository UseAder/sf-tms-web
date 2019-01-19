<template>
    <div class="MagList">
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search J-flexSbc" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                  <el-form-item label="专线查询" prop="word">
                    <el-input v-model="searchForm.word" placeholder="名称、联系人、电话、手机号" style="width:215px"></el-input>
                  </el-form-item>
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary" @click='handlesearch' v-if="checkHasPermission('zx:read')">查询</el-button>
                  <el-button type="warning" @click="resetForm('searchForm')" v-if="checkHasPermission('zx:read')">重置</el-button>
                  </el-form-item>
              </el-form>
              <el-button type="primary" style="margin-top: -18px;margin-right:18px"  v-if="checkHasPermission('zx:create')"  @click="newModifyFun()">新增</el-button>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border  @selection-change="handleSelectionChange">
              <el-table-column fixed type="selection" width="40" align='center'></el-table-column>
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
                          <el-menu-item index="1-1"  v-if="checkHasPermission('zx:update')" @click="newModifyFun(scope.row)">修改</el-menu-item>  
                          <!-- <el-menu-item index="1-2"  v-if="checkHasPermission('zx:delete')" @click="batchDeletion(scope.row)">删除</el-menu-item>  -->
                          <!-- <el-menu-item index="1-3" @click="StoppedConfirm(scope.row)">停用</el-menu-item>   -->
                          <el-menu-item index="1-4" >下游专线对接设置</el-menu-item> 
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="专线名称"  align='center'></el-table-column>
              <el-table-column prop="linkman" label="联系人"  align='center'></el-table-column>
              <el-table-column prop="linkmanPhone" label="联系电话"  align='center'></el-table-column>
              <el-table-column prop="linkmanMobile" label="联系手机"  align='center'></el-table-column>
              <el-table-column prop="address" label="详细地址"  align='center'></el-table-column>
              <el-table-column prop="status" label="状态"  align='center'></el-table-column>
              <el-table-column prop="" label="专线对接"  align='center'></el-table-column>
              <el-table-column prop="memo" label="备注" min-width="200" align='center'></el-table-column>       
              <el-table-column prop="createTime" label="新增时间" min-width="160" align='center'></el-table-column>           
            </el-table>
            <div class="main-table-page">
              <div class="main-table-page-left"> 
                <!-- <el-select v-model="value" placeholder="批量操作">
                  <el-option value="">
                    <div class='J-batchDeletion'  v-if="checkHasPermission('zx:delete')"  @click='batchDeletion'>删除</div>
                  </el-option>
                  
                </el-select>
                <span>已选择{{batchNum}}项</span> -->
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

         <el-dialog :title="newModifyTitle" :visible.sync="InformationsOpinionList.Special.specialOpinion"  width="699px" center class="Maglist-HairCar J-dialog-vh">
          <div class="J-detail J-dialog-vh-body">
               <el-row class=" J-dialog-vh-content-te" :style="'max-height:'+(getScreenHeight-342)+'px;'">
                <el-form ref="specialNewModifyForm" :rules="specialRules" :model="specialNewModifyForm"  label-width="94px" class="demo-ruleForm J-flexSbc" style=" width: 578px;margin:0 auto">
                  <el-form-item label="专线名称 :" prop="name" >
                    <el-input v-model="specialNewModifyForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="联系人 :"  prop="linkman">
                    <el-input v-model="specialNewModifyForm.linkman"></el-input>
                  </el-form-item>
                  <el-form-item label="联系手机 :" prop="linkmanMobile">
                    <el-input v-model="specialNewModifyForm.linkmanMobile"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话 :"  prop="linkmanPhone">
                    <el-input v-model="specialNewModifyForm.linkmanPhone"></el-input>
                  </el-form-item>
                  <el-form-item label="地址 :" prop="address">
                    <div class="J-collect J-flex">
                      <div class="J-collect-left">
                        <el-cascader
                            placeholder="可以输入地区名称查询"
                            :options="area.areaOptions"
                            :props="area.areaProps"
                            filterable
                            clearable
                            v-model="area.selectedConsignorSSQ">
                        </el-cascader>
                      </div>
                      <div class="J-collect-right">
                          <el-input style=" margin-left: 4px;width: 250px;"  v-model="specialNewModifyForm.address" placeholder="详细地址"></el-input>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="备注 :" prop="memo" class="J-width100">
                    <el-input type="textarea" v-model="specialNewModifyForm.memo"></el-input>
                  </el-form-item>  
                </el-form>
              </el-row> 
              <!-- <div class="J-dialog-vh-submission" :style="getScreenHeight-342<=334?'box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)':''" > -->
              <div class="J-dialog-vh-submission" >   
                <span class="dialog-footer">
                  <el-button type="primary" :loading="savingFlag" v-if="checkHasPermission('zx:create')"  @click="newModifyPreservation('specialNewModifyForm')">保 存</el-button>
                </span> 
              </div>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import areaData from '@/utils/area_tree'
export default {
  name:'i-special',
  mixins: [Base,List],
  data() {
    return {
        batchNum:0,//已选择n项
        ids:[],//选择删除的id数组
        batchDeletionTitle:"",//删除弹框title的内容
        newModifyMessage:false,//判断是新增还是修改
        newModifyTitle:'',//新增或修改弹框title的内容
        //信息管理-专线管理新增或修改
        specialNewModifyForm:{
          name:'',
          linkman:'',
          linkmanMobile:'',
          linkmanPhone:'',
          provinceId:'',
          cityId:'',
          countyId:'',
          address:'',
          memo:'',
          id:''
        },
        searchForm: { //信息管理-专线管理 查询   
          word:'',
          pageSize: 10,
          pageNo: 1
        },
        tableData: [], 
        multipleSelection: [], //多选
        specialRules: {
          name: [
            { required: true, message: '请输入专线名称', trigger: 'blur' },
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}     
          ],
          linkman: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}     
          ],
          linkmanMobile: [
            { required: true, message: '请输入联系手机' ,trigger: ['blur', 'change'] },
            { validator: this.linkmanMobileRules, trigger: ['blur', 'change']}
          ],
          linkmanPhone: [
            { validator: this.linkmanPhoneRules, trigger: ['blur', 'change']}
          ],
          memo:[
            { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
          ] 
        },
        //地区控件
        area:{
          areaOptions: areaData.dataAll,
          areaProps:{ value: 'id',label:'areaName', children: 'childAreaList'},
          selectedConsignorSSQ:[], // 发货地址省市区选择
        },
      };
    },

    created() {
    },
    methods: {
     
      newModifyFun(row){//专线修改/新增  判断弹框时是否传递row  
        this.closeDialog('specialNewModifyForm')
        if(row){
          this.newModifyMessage=false
          this.newModifyTitle='专线修改'
          this.specialNewModifyForm.name=row.name
          this.specialNewModifyForm.linkman=row.linkman
          this.specialNewModifyForm.linkmanMobile=row.linkmanMobile
          this.specialNewModifyForm.linkmanPhone=row.linkmanPhone
          this.specialNewModifyForm.address=row.address
          this.specialNewModifyForm.memo=row.memo
          this.specialNewModifyForm.id=row.id
          this.area.selectedConsignorSSQ = [row.provinceId,row.cityId,row.countyId];
        }else{
          this.area.selectedConsignorSSQ=[]
          this.newModifyMessage=true
          this.newModifyTitle='专线新增'
        }     
        this.InformationsOpinionList.Special.specialOpinion=true
      },
      //点击保存验证
      async newModifyPreservation(formName){//弹框保存
        this.specialNewModifyForm.provinceId = this.area.selectedConsignorSSQ[0]
        this.specialNewModifyForm.cityId = this.area.selectedConsignorSSQ[1]
        this.specialNewModifyForm.countyId = this.area.selectedConsignorSSQ[2]
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveDataSubmit()
           } else {
            return false;
          }
        });
      },
      async saveDataSubmit(){  //点击保存到-执行修改或增加
         this.$confirm('确定要【保存】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
        }).then(() => {  
            this.savingFlag=true
            api.post('zx/addoredit',this.specialNewModifyForm).then(data=>{
              if(data.code==200){
                if(this.newModifyMessage){
                  this.$message({
                        type: 'success',
                        message: '恭喜您，专线已新增!'
                    });
                }else{
                  this.$message({
                      type: 'success',
                      message: '恭喜您，已成功修改该专线信息!'
                  }); 
                }
                this.querySpecialList()
                this.InformationsOpinionList.Special.specialOpinion=false
              }
            }).then(() => {          // 点击确认
            this.savingFlag=false
          }) 
        }).catch(() => {})
      },  
      async querySpecialList() {//获取页面初始数据
        const { code, message,data } =await api.post('zx/list', this.searchForm)
        this.tableData = data.records;
        this.page.total = data.total;
      }, 
      handleSelectionChange(val) {
        var delsete=[]
        this.multipleSelection = val;
        for (const item of this.multipleSelection) {
            delsete.push(item.id)  
        }
        this.batchNum=delsete.length
        this.ids=delsete
      },
       batchDeletion(row){//批量删除
        if(row.id){
            this.batchDeletionTitle='此操作将永久删除当前专线, 是否继续?'
        }else{
           this.batchDeletionTitle='此操作将永久删除已选择专线, 是否继续?'
        }
        this.$confirm(this.batchDeletionTitle, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(async () => {
          if(row.id){
            this.ids.splice(0,this.ids.length,row.id);
          }   
          if(this.ids!=''){
              const { code, message,data } =await api.post('zx/delete',this.ids )
              if(code==200){
                this.$message({
                  type: 'success',
                  message: '恭喜您，删除成功!'

                });
                if (this.tableData.length===1) {
                    this.searchForm.pageNo--
                }   
                this.querySpecialList()

              }    
            }else{
              this.$message({
                type: 'warning',
                message: '请选择需要删除的专线'
              });   
            }         
        }).catch(() => {
               
        });
      },
    
    }
  };
</script>
<style>

</style>
