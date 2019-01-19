<template>
    <div class="MagList">
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search J-flexSbc" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                  <el-form-item label="仓库名称" prop="warehouseName">
                    <el-input v-model="searchForm.warehouseName" placeholder="仓库名称" style="width:215px"></el-input>
                  </el-form-item>
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary" v-if="checkHasPermission('warehouse:read')" @click='handlesearch'>查询</el-button>
                  <el-button type="warning" v-if="checkHasPermission('warehouse:read')" @click="resetForm('searchForm')">重置</el-button>
                  </el-form-item>
              </el-form>
              <el-button type="primary" style="margin-top: -18px;margin-right:18px" v-if="checkHasPermission('warehouse:create')" @click="newModifyFun()">新增</el-button>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
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
                          <el-menu-item index="1-2" v-if="checkHasPermission('warehouse:update')" @click="newModifyFun(scope.row)">修改</el-menu-item> 
                          <el-menu-item index="1-3" v-if="scope.row.status==0 && checkHasPermission('warehouse:change')" @click="warehouseStatusFun(scope.row)">启用</el-menu-item>   
                          <el-menu-item index="1-4" v-if="scope.row.status==1 && checkHasPermission('warehouse:change')" @click="warehouseStatusFun(scope.row)">停用</el-menu-item> 
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" align='center' min-width="100">
                <template slot-scope="scope">
                  <div v-html="statusBackground(warehouseStatus(scope.row.status))" class="J-statusBackground"></div>     
                </template>
              </el-table-column>
              <el-table-column prop="warehouseName" label="仓库名称" align='center' min-width="130"></el-table-column>
              <el-table-column prop="platformName" label="所属平台" align='center' min-width="110"></el-table-column>
              <el-table-column prop="provinceName" label="所属地省" align='center' min-width="110"></el-table-column>
              <el-table-column prop="cityName" label="所在地市" align='center' min-width="110"></el-table-column>
              <el-table-column prop="countyName" label="所在地区县" align='center' min-width="110"></el-table-column>
              <el-table-column prop="address" label="详细地址" align='center' width="200"></el-table-column>
              <el-table-column prop="linkman" label="收货人" align='center' min-width="110"></el-table-column>
              <el-table-column prop="linkmanPhone" label="收货人电话" align='center' min-width="120"></el-table-column>
              <el-table-column prop="linkmanMobile" label="收货人手机" align='center' min-width="120"></el-table-column>
              <el-table-column prop="canOrderTimes" label="预约时段" align='center' width="150"></el-table-column>
              <el-table-column prop="memo" label="备注" align='center' width="200"></el-table-column>
              <el-table-column prop="updateEmployeeName" label="修改人" align='center' min-width="110"></el-table-column>
              <el-table-column prop="updateTime" label="修改时间" align='center' width="180"></el-table-column>
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

        <el-dialog :close-on-click-modal="false" :title="newModify.title" :visible.sync="newModify.visible"  width="699px" center class="Maglist-HairCar J-dialog-vh">
          <div class="J-detail J-dialog-vh-body">
            <el-row class=" J-dialog-vh-content-te" :style="'max-height:'+(getScreenHeight-342)+'px;'">
              <el-form ref="newModify.form" :rules="newModifyRules" :model="newModify.form"  label-width="99px" class="demo-ruleForm J-flexSbc" style=" width: 578px;margin:0 auto">
                <div class="J-flex">

                  <el-form-item label="仓库名称 :" prop="warehouseName" >
                    <el-input v-model="newModify.form.warehouseName"></el-input>
                  </el-form-item>
                  <el-form-item label="所属平台 :" prop="platformId" >

                    <el-select v-model="newModify.form.platformId" placeholder="请选择">
                      <el-option
                        v-for="item in base.platformId"
                        :key="item.id"
                        :label="item.platformName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <el-form-item label="联系人 :" prop="linkman" >
                  <el-input v-model="newModify.form.linkman"></el-input>
                </el-form-item>
                <el-form-item label="联系手机 :" prop="linkmanMobile" >
                  <el-input v-model="newModify.form.linkmanMobile"></el-input>
                </el-form-item>
                <el-form-item label="联系电话 :" prop="linkmanPhone" >
                  <el-input v-model="newModify.form.linkmanPhone"></el-input>
                </el-form-item>
                <div class="J-flex">
                  <el-form-item label="详细地址 :" :class="showRegionalChoice?'is-error':''">
                    <div class="J-collect J-flex">
                      <div class="J-collect-left">
                      <el-cascader
                          @change='regionalChoice'
                          placeholder="可以输入地区名称查询"
                          :options="area.areaOptions"
                          :props="area.areaProps"
                          filterable
                          clearable
                          v-model="area.selectedConsignorSSQ">
                      </el-cascader>
                      </div>
                    </div> 
                    <div class="el-form-item__error" v-if="showRegionalChoice">请输入地区名称 </div>
                  </el-form-item > 
                  <el-form-item prop="address" style="margin-left: -96px;" >
                    <el-input style="width: 245px;"  v-model="newModify.form.address" placeholder="详细地址"></el-input>
                  </el-form-item> 
                </div>
                <el-form-item label="可预约时段 :" class="J-width100">
                  <div style="position: relative">
                    <el-time-picker
                    style="opacity: 0;"
                    is-range value-format='HH:mm'
                    v-model="timesValue"
                    :picker-options="{
                        format:'HH:mm',
                      }"
                     @change="canOrderTimesChange"
                    range-separator="至"
                    ref="content"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围">
                  </el-time-picker>
                    <div class="J-canOrderTimes">
                        <span class="el-tag el-tag--info el-tag--mini" v-for="(item,index) in canOrderTimes" :key="item" style="margin: 0 4px;    margin-bottom: 5px;">
                          <span class="el-select__tags-text">{{canOrderTimes[index]}}</span>
                          <i class="el-tag__close el-icon-close" @click="canOrderTimesSplice(index)"></i>
                        </span>
                       <span class="iconfont icon-tianjia " style=" cursor: pointer;line-height: 20px;height: 24px; margin-left: 5px;" @click="addTimes"></span>
                    </div>
                  </div>
                </el-form-item> 
                <el-form-item  prop="memo" label="备注 :" class="J-width100">
                  <el-input type="textarea" v-model="newModify.form.memo"></el-input>
                </el-form-item>  
              </el-form>
            </el-row> 
            <!-- <div class="J-dialog-vh-submission" :style="getScreenHeight-342<=334?'box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)':''" > -->
            <div class="J-dialog-vh-submission" >   
              <span class="dialog-footer">
                <el-button type="primary" :loading="savingFlag" v-if="checkHasPermission('warehouse:create')" @click="newModifyPreservation('newModify.form')">保 存</el-button>
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
  name:'i-s-dsStore',
  mixins: [Base,List],
    data() {
      return {
        canOrderTimes:[],
        //预约时间选择  可选择时间段
        timesValue: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
       
        showRegionalChoice:false,
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
          title:'',
          form:{
            warehouseName:'',
            platformId:'',
            linkman:'',
            linkmanMobile:'',
            linkmanPhone:'',
            provinceId:'',
            provinceName:'',
            cityId:'',
            cityName:'',
            countyId:'',
            countyName:'',
            address:'',
            canOrderTimes:[] ,
            memo:'',
            id:''//修改需要
          }
        },
        //查询   
        searchForm: { 
          warehouseName:'',
          pageSize: 10,
          pageNo: 1
        },
        tableData: [], 
        newModifyRules: {
          warehouseName: [
            { required: true, message: '请输入电商仓库名称', trigger:  ['blur', 'change'] },
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}  
          ],
          platformId:[
            { required: true, message: '请选择所属平台', trigger:  ['blur', 'change'] },
          ],
          linkman:[
            { required: true, message: '请选择联系人', trigger:  ['blur', 'change'] },
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}  
          ],
          linkmanMobile: [
            { required: true, message: '请输入联系手机' ,trigger: ['blur', 'change'] },
            { validator: this.linkmanMobileRules, trigger: ['blur', 'change']}
          ],
          linkmanPhone:[
            { validator: this.linkmanPhoneRules, trigger: ['blur', 'change']}
          ],
          address:[
            { required: true, message: '请输入详细地址', trigger: 'change' },
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}  
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
        base:{
          platformId:[]
        }
      };
    },
    methods: {
      addTimes(){
        this.$refs.content.focus();
      },
      canOrderTimesSplice(index){
        // this.newModify.form.canOrderTimes.splice(index,1);
          this.canOrderTimes.splice(index,1)
      },
      canOrderTimesChange(value){
        if (value&&value!='') {
         let times =value[0]+'-'+value[1]
         this.canOrderTimes.push(times)
        //  this.newModify.form.canOrderTimes.push(times)
        } 
      },
      //客户修改/新增  判断弹框时是否传递row  
      newModifyFun(row){
        this.closeDialog('newModify.form')
        this.showRegionalChoice=false;
         this.ebPlatformListAble()
        if(row){  
          this.newModify.title='修改电商仓库'
          this.newModify.form.warehouseName=row.warehouseName
          this.newModify.form.platformId=row.platformId
          this.newModify.form.linkman=row.linkman
          this.newModify.form.linkmanPhone=row.linkmanPhone
          this.newModify.form.linkmanMobile=row.linkmanMobile
          this.newModify.form.address=row.address
            this.canOrderTimes=row.canOrderTimes
          if (!this.canOrderTimes.indexOf('[')) {
              this.canOrderTimes=JSON.parse(  this.canOrderTimes)
          }
          this.newModify.form.memo=row.memo
          this.newModify.form.id=row.id
          this.area.selectedConsignorSSQ = [row.provinceId,row.cityId,row.countyId];
        }else{
          this.newModify.form.canOrderTimes=[]
          this.canOrderTimes=[]
          this.area.selectedConsignorSSQ = [];
          this.newModify.title='新增电商仓库'    
          this.selectivity=true      
        }     
        this.newModify.visible=true
      },
      regionalChoice(valid){
       
        if (valid!='') {
              this.showRegionalChoice=false  
          }
      },
      //点击保存验证
       newModifyPreservation(formName) {
          this.newModify.form.canOrderTimes= this.canOrderTimes
          this.newModify.form.provinceId = this.area.selectedConsignorSSQ[0]
          this.newModify.form.cityId = this.area.selectedConsignorSSQ[1]
          this.newModify.form.countyId = this.area.selectedConsignorSSQ[2]
          if (this.area.selectedConsignorSSQ=='') {
              this.showRegionalChoice=true  
          }
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
            api.post('/eb/warehouses/add',this.newModify.form).then(data=>{
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
            api.post('/eb/warehouses/update',this.newModify.form).then(data=>{
              if(data.code==200){
                this.$message({
                  type: 'success',
                  message: '恭喜您，已成功修改该电商仓库!'
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
          this.platformStatusChange.title='此操作将启用该仓库, 是否继续?'
        }else{
          this.platformStatusChange.title='此操作将停用该仓库, 是否继续?'
        }
        this.$confirm(this.platformStatusChange.title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(async () => {
            const { code, message,data } =await api.post('/eb/warehouses/status/change',this.platformStatusChange.data)
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
        const { code, message,data } =await api.post('/eb/warehouses/list', this.searchForm)
        if(code==="200"){
          this.tableData = data.records;
          this.page.total = data.total;  
        }
      },
      //所有电商平台列表
      async ebPlatformListAble() {
        const { code, message,data } =await api.get('/eb/platform/list/able')
        if(code==="200"){
          this.base.platformId=data
          // this.tableData = data.records;
          // this.page.total = data.total;  
        }
      }  
    }
  };
</script>