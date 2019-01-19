<template>
  <div class="MagList">
    <div class="J-main-body ">
      <div class="homeMain-header"> 
        <div class="J-main-search" >
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
              <el-form-item label="调度时间" prop="createTime">
                <el-date-picker
                    v-model="searchForm.createTime"
                    type="daterange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="运单号" prop="waybillNo">
                <el-input v-model="searchForm.waybillNo" placeholder="运单号"></el-input>
              </el-form-item>
              <el-form-item label="承运商名称" prop="transferName">
                <el-input v-model="searchForm.transferName" placeholder="承运商名称"></el-input>
              </el-form-item>
                <el-form-item label="专线查货" prop="zxWaybillNo">
                <el-input v-model="searchForm.zxWaybillNo" placeholder="专线查货单号"></el-input>
              </el-form-item>
                <el-form-item label="发货单位" prop="consignorName">
                <el-input v-model="searchForm.consignorName" placeholder="发货单位"></el-input>
              </el-form-item>
              <el-form-item label="调度状态" prop="status">
                <el-select v-model="searchForm.status" multiple collapse-tags clearable clear placeholder="请选择">
                  <el-option
                    v-for="item in this.base.statusDispatch"
                    :key="item.value"
                    :label="item.code"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>  
              <el-form-item class="J-main-search-button">
                <el-button type="primary" v-if="checkHasPermission('transfer:read')" @click='handlesearch'>查询</el-button>
                <el-button type="warning" v-if="checkHasPermission('transfer:read')" @click="resetForm('searchForm')">重置</el-button>
                 <el-button type="primary" v-if="checkHasPermission('transfer:read')" @click="exportFile()">导出</el-button>
              </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- <div class="J-navButton"></div> -->
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
                      <el-menu-item index="1-1" v-if="scope.row.ddStatus==1 && checkHasPermission('transfer:create')" @click="showAddDispatch(scope.row,2)">整车调度</el-menu-item>
                      <el-menu-item index="1-2" v-if="scope.row.ddStatus==1 && checkHasPermission('transfer:create')" @click="showAddDispatch(scope.row,1)">专线调度</el-menu-item>
                      <el-menu-item index="1-3" v-if="scope.row.ddStatus==2 && checkHasPermission('transfer:update')" @click="showEditDispatch(scope.row)">修改调度</el-menu-item>
                      <el-menu-item index="1-4" v-if="scope.row.ddStatus==2 && checkHasPermission('transfer:delete')" @click="batchDeletion(scope.row)">取消调度</el-menu-item>
                      <!-- <el-menu-item index="1-5" v-if="scope.row.ddStatus==2 && scope.row.dispatchType == 2 && checkHasPermission('transfer:sms')" @click="sendSms(scope.row)">发送短信</el-menu-item> -->
                    </el-menu-item-group> 
                    <el-submenu index="2">
                      <span slot="title">标记</span>
                      <div class="J-flexW" style="width:156px;padding: 0 5px;">
                        <div v-for="item in managementMark.managementMarkList" :key="item.id" @click="mark(item.id, scope.row,2)">
                          <el-tooltip 
                            class="item"
                            effect="dark"
                            :content="item.memo"
                            placement="top" style="margin:0 3px">
                            <div class="el-color-picker__trigger" style="height: 25px;width: 25px;">
                              <span class="el-color-picker__color is-alpha">
                                <span
                                  class="el-color-picker__color-inner"
                                  :style="'background-color:'+item.colorValue+';margin-right:3px;width:100%;height:100%'"
                                ></span>
                              </span>
                            </div>
                          </el-tooltip>
                        </div>
                      </div>
                      <el-menu-item index="2-5" @click="managementMarkFun" style="text-align: center;padding-left: 40px;">管理</el-menu-item>
                    </el-submenu>
                  </el-submenu> 
                </el-menu>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="标记" min-width="80" align="center">
            <template slot-scope="scope">
              <div>
                <el-tooltip
                  v-for="mark in scope.row.marks"
                  :key="mark.id"
                  class="item"
                  effect="dark"
                  :content="mark.memo"
                  placement="top"
                >
                  <i class="iconfont icon-zhuyi" :style="'color:'+ mark.colorValue+';margin:0 1px;'"></i>
                  {{mark.colorValue}}
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="waybillNo" label="运单号" min-width="110" align='center' fixed>
             <template slot-scope="scope">
                  <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                </template>
          </el-table-column>
          <el-table-column prop="ddStatus" label="调度状态" min-width="110" align='center'>
            <template slot-scope="scope">
              <div v-html="statusBackground(dispatchStatus(scope.row.ddStatus))" class="J-statusBackground"></div>     
            </template>
          </el-table-column>
          <el-table-column prop="dispatchType" label="调度类型" min-width="110" align='center'>
            <template slot-scope="scope">
                  {{dispatchType(scope.row.dispatchType)}}
            </template>
          </el-table-column>
          <el-table-column prop="billTime" label="开单日期" min-width="110" align='center'></el-table-column>
          <el-table-column prop="transferName" label="承运商名称" min-width="110" align='center'></el-table-column>
          <el-table-column prop="linkman" label="联系人" min-width="110" align='center'></el-table-column>
          <el-table-column prop="linkmanMobile" label="联系人手机" min-width="120" align='center'></el-table-column>
          <el-table-column prop="ddTotalFee" label="承运商运费" min-width="110" align='center'></el-table-column>
          <el-table-column prop="zxWaybillNo" label="专线查货单号" min-width="110" align='center'></el-table-column>
          <el-table-column prop="dispatchTime" label="调度时间" min-width="170" align='center'></el-table-column>
          <el-table-column prop="expectSendTime" label="预计发车时间" min-width="170" align='center'></el-table-column>
          <el-table-column prop="expectArriveTime" label="预计到达时间" min-width="170" align='center'></el-table-column>
          <el-table-column prop="receipt" label="回单" min-width="110" align='center'>
            
             <template slot-scope="scope">
            {{ receiptType(scope.row.receipt) }}
          </template>
          </el-table-column>
          <el-table-column prop="receiptNum" label="份数" min-width="80" align='center'></el-table-column>
          <el-table-column prop="pickFlag" label="上门提货" min-width="110" align='center'>
            <template slot-scope="scope">
            {{ pickFlag(scope.row.pickFlag) }}
          </template>
          </el-table-column>
          <el-table-column prop="deliveryType" label="交接方式" min-width="110" align='center'>
            <template slot-scope="scope">
              {{ deliveryType(scope.row.deliveryType) }}
            </template>
          </el-table-column>
          <el-table-column prop="consignorName" label="发货单位" min-width="110" align='center'></el-table-column>
          <el-table-column prop="consignorLinkman" label="发货人" min-width="110" align='center'></el-table-column>
          <el-table-column prop="consignorLinkmanMobile" label="发货人手机" min-width="120" align='center'></el-table-column>
          <el-table-column prop="consignorAddress" label="发货地址" min-width="200" align='center'></el-table-column>
          <el-table-column prop="goodsName" label="货物名称" min-width="110" align='center'></el-table-column>
          <el-table-column prop="pack" label="包装" min-width="110" align='center'></el-table-column>
          <el-table-column prop="goodsNum" label="件数" min-width="110" align='center'></el-table-column>
          <el-table-column prop="goodsWeight" label="重量" min-width="110" align='center'></el-table-column>
          <el-table-column prop="goodsBulk" label="体积" min-width="110" align='center'></el-table-column>
          <el-table-column prop="memo" label="备注" min-width="200" align='center'></el-table-column>
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
    <dispatchTruck @reloadData="reloadData" :showFlag.sync='openDispatch.visiableTruck' :waybillId='openDispatch.waybillId' :addFlag='openDispatch.addFlag'  v-if="openDispatch.visiableTruck"></dispatchTruck>
    <dispatchZx @reloadData="reloadData" :showFlag.sync='openDispatch.visiableZx' :waybillId='openDispatch.waybillId' :addFlag='openDispatch.addFlag'  v-if="openDispatch.visiableZx"></dispatchZx>
    <waybillNo-component :showFlag.sync='openWaybill.visiable' :waybillNo='openWaybill.waybillNo' :waybillId='openWaybill.waybillId' :statusText='openWaybill.statusText' v-if="openWaybill.visiable"></waybillNo-component>
    <v-managementMark @reloadData="markReloadData" :dialog.sync="managementMark.visiable" v-if="managementMark.visiable"></v-managementMark>
    <v-sendingSms :pVisible.sync='openSendingSms.visible' :pWaybillId='openSendingSms.waybillId' :pWaybillNo='openSendingSms.waybillNo' v-if="openSendingSms.visible"></v-sendingSms>
  </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue"
import managementMarkDialog from "@/components/Common/managementMark.vue";
import dispatchTruck from './DispatchComponent/cart.vue'
import dispatchZx from './DispatchComponent/company.vue'
import sendingSmsDialog from '@/components/Common/sendingSms.vue'
export default {
  name:'d-dispatch',
  mixins: [Base,List],
  components: { 
    'dispatchTruck':dispatchTruck,
    'dispatchZx':dispatchZx,
     "v-managementMark": managementMarkDialog,
     "waybillNo-component": waybillNoComponent,
     'v-sendingSms':sendingSmsDialog,
  },
  data() {
    return {
      
      searchForm: {
        createTime:[],//配合watch监听用来重置时间
        startDispatchBillTime: '', //开单日期
        endDispatchBillTime: '',
        waybillNo:'',
        transferName:'',
        zxWaybillNo:'',
        consignorName:'',
        status:'',
        pageSize: 10,
        pageNo: 1
      },
      tableData: [],//整车对账 表格

      //运单详情框
      openWaybill:{
        waybillNo:'',
        waybillId:'', 
        visiable:false,
        statusText:''
      },
      //调度框
      openDispatch:{
        addFlag:false,
        waybillId:'', 
        visiableZx:false,
        visiableTruck:false,
      },
      //发送短信
      openSendingSms:{
        waybillId:'',
        waybillNo:'',
        visible:false,
      },
    };
  },
  watch:{
    "searchForm.createTime": function (val, oldval) {
      if (val !== null) {
        this.searchForm.startDispatchBillTime = val[0];
        this.searchForm.endDispatchBillTime = val[1];
      }else{
        this.searchForm.startDispatchBillTime = null;
        this.searchForm.endDispatchBillTime = null;
      }
    },
  },
  created(){
    this.managementMarkListCreated()
    },
  methods: {
    //重新加载 标记数据列表数据
    markReloadData: function (flag) {        
      if (flag) {
        this.managementMarkListCreated()
      }
    },
    showWaybill(row) {
      this.openWaybill.waybillNo = row.waybillNo
      this.openWaybill.waybillId = row.waybillId
      this.openWaybill.statusText = this.dispatchStatus(row.ddStatus).code;
      this.openWaybill.visiable = true;
    }, 
    
    /**
     * row行数
     * type显示类型
     */
    showAddDispatch(row, type) {
      this.openDispatch.addFlag = true
      this.openDispatch.waybillId = row.waybillId
      this.openDispatch.visiableZx = (type === 1)
      this.openDispatch.visiableTruck = (type !== 1)
    }, 
    /**
     * row行数
     */
    showEditDispatch(row) {
      this.openDispatch.addFlag = false
      this.openDispatch.waybillId = row.waybillId
      this.openDispatch.visiableZx = (row.dispatchType === 1)
      this.openDispatch.visiableTruck = (row.dispatchType !== 1)
    }, 

    //重新加载数据列表数据
    reloadData: function (flag) {        
      if (flag) {
          this.querySpecialList()
      }
    },

    //获取页面初始数据
    async querySpecialList() {
      const { code, message,data } =await api.post('/dp/list', this.searchForm)
      if(code==="200"){
        this.tableData = data.records;
        this.page.total = data.total;  
      }
    },
    //调度
    batchDeletion(row){  
      this.batchDeletionTitle='此操作将取消当前调度, 是否继续?'
      this.$confirm(this.batchDeletionTitle, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center:true,
        type: 'warning'
      }).then(async () => {
        const { code, message,data } =await api.post('dp/cancel?id=' + row.id)
        if(code==200){
          this.$message({type: 'success', message: '调度取消成功!'});
          this.querySpecialList()
        } 
      }).catch(()=>{});
    },  
    sendSms(row) {
      this.openSendingSms.visible = true
      this.openSendingSms.waybillId = row.waybillId
      this.openSendingSms.waybillNo = row.waybillNo
    },
      exportFile(){
       api.post('/dp/export/list', this.searchForm).then(data=>{
        if (data.code == '200') {
          this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
        }
      })
    },
  }
};
</script>



