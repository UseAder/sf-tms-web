<template>
  <div class="MagList">
    <div class="MagListTablist" >
      <el-tabs v-model="activeName" @tab-click="tabMagListClick">
        <el-tab-pane
          :label="item.name"
          :name="item.status+''"
          v-for="item in tabMagList"
          :key="item.status"
        ></el-tab-pane>
      </el-tabs>
      <a style="position: absolute;top: 10px;right: 15px;color: blue;" href="https://wuliu-tms.oss-cn-hangzhou.aliyuncs.com/tms/%E8%BF%90%E5%8D%95%E6%B8%85%E5%8D%95%E5%AF%BC%E5%85%A5_20190115.xls" target="_blank">下载清单导入模板</a>
    </div>
    <div class="J-main-body">
      <div class="homeMain-header">
        <div class="J-main-search">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
            <!-- <div class="from-search"> -->
              <el-form-item label="开单日期" prop="billTime">
                <el-date-picker
                  v-model="searchForm.billTime"
                  type="daterange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="发货单位" prop="consignorName">
                <el-input v-model="searchForm.consignorName" placeholder="发货单位/发货人/手机号"></el-input>
              </el-form-item>
              <el-form-item label="运单号" prop="waybillNo">
                <el-input v-model="searchForm.waybillNo" placeholder="运单号"></el-input>
              </el-form-item>
              <el-form-item label="运单状态" prop="status">
                <el-select v-model="searchForm.status"  multiple collapse-tags clearable placeholder="运单状态">
                  <el-option
                    v-for="item in this.base.statusMagListgl"
                    :key="item.value"
                    :label="item.code"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            <!-- </div> -->
            <!-- <div class="from-search"> -->
              <el-form-item label="收货单位" prop="consigneeName">
                <el-input v-model="searchForm.consigneeName" placeholder="收货单位/收货人/手机号"></el-input>
              </el-form-item>
              <el-form-item label="发站" prop="beginSiteName">
                <el-input v-model="searchForm.beginSiteName" placeholder="发站"></el-input>
              </el-form-item>
               <el-form-item label="到站" prop="endSiteName">
                <el-input v-model="searchForm.endSiteName" placeholder="到站"></el-input>
              </el-form-item>
             
            <!-- </div> -->
            <!-- <div class="from-search"> -->
              <el-form-item class="J-main-search-button">
                
                <el-button type="primary" @click="handlesearch">查询</el-button>
                <el-button type="warning" @click="resetForm('searchForm')">重置</el-button>
                <el-button type="primary" @click="exportFile()" >导出</el-button>
              </el-form-item>
            <!-- </div> -->
          </el-form>
        </div>
      </div>
            <!-- <div class="J-elTable" :style="'height:'+this.$store.getters.getScreenHeight-227"> -->
      
      <div class="J-elTable" id="J-elTable" >        
        <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border  @selection-change="handleSelectionChange">
          <el-table-column fixed type="selection" width="40"></el-table-column>
          <el-table-column fixed type="index" width="50" label="序号" align="center"></el-table-column>
          <el-table-column label="操作" align="center" header-align="center" fixed>
            <template slot-scope="scope">
              <div class="table-menu">
                <el-menu :collapse="true">
                  <el-submenu index="1">
                    <template slot="title">
                      <i class="el-icon-edit-outline"></i>
                    </template>

                    <el-menu-item-group v-if="scope.row.status != -1">
                      <el-menu-item index="1-1" v-if="checkHasPermission('waybill:update')" @click="modifyWayListFun(scope.row)">修改</el-menu-item>
                      <el-menu-item
                        index="1-2"
                        v-if="scope.row.status == 1 && checkHasPermission('waybill:confirm')"
                        @click="confirmOrder(scope.row)"
                      >运单确认</el-menu-item>
                      <el-menu-item
                        index="1-9"
                        v-if="scope.row.status != -1  && checkHasPermission('waybill:delete')" 
                        @click="waybillDelFun(scope.row)"
                      >作废</el-menu-item>
                      <el-menu-item index="1-10" v-if="checkHasPermission('waybill:read')" @click="importWaybillDetail(scope.row)">清单导入</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="2">
                      <span slot="title">标记</span>
                      <div class="J-flexW" style="width:156px;padding: 0 5px;">
                        <div v-for="item in managementMark.managementMarkList" :key="item.id" @click="mark(item.id, scope.row,1)">
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
                <el-tooltip v-for="mark in scope.row.marks" :key="mark.id"
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
          <el-table-column prop="status" label="运单状态" min-width="110" align="center">
            <template slot-scope="scope">
                <div v-html="statusBackground(waybillStatus(scope.row.status))" class="J-statusBackground"></div>     
            </template>
          </el-table-column>
          <el-table-column label="运单号" min-width="110" align="center">
            <template slot-scope="scope">
              <el-button
                @click="showWaybill(scope.row)"
                type="text"
                size="small"
              >{{ scope.row.waybillNo }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="beginSiteName" label="发站" min-width="110" align="center"></el-table-column>
          <el-table-column prop="endSiteName" label="到站" min-width="110" align="center"></el-table-column>
          <el-table-column prop="billTime" label="开单日期" min-width="110" align="center"></el-table-column>
          <el-table-column prop="receipt" label="回单" min-width="110" align="center">
            <template slot-scope="scope">{{ receiptType(scope.row.receipt) }}</template>
          </el-table-column>
          <el-table-column prop="payType" label="付款方式" min-width="110" align="center">
            <template slot-scope="scope">
              {{ payType(scope.row.payType) }}
            </template>
          </el-table-column>
          <el-table-column prop="pickFlag" label="上门提货" min-width="110" align="center">
            <template slot-scope="scope">
              {{ pickFlag(scope.row.pickFlag) }}
            </template>
          </el-table-column>
          <el-table-column prop="deliveryType" label="交接方式" min-width="110" align="center"> 
            <template slot-scope="scope">
              {{ deliveryType(scope.row.deliveryType) }}
            </template>
          </el-table-column>
          <el-table-column prop="consignorName" label="发货单位" min-width="110" align="center"></el-table-column>
          <el-table-column prop="consignorLinkman" label="发货人" min-width="110" align="center"></el-table-column>
          <el-table-column prop="consignorLinkmanMobile" label="发货人手机" min-width="120" align="center"></el-table-column>
          <el-table-column prop="consignorAddress" label="发货地址" min-width="200" align="center"></el-table-column>
          <el-table-column prop="consigneeName" label="收货单位" min-width="110" align="center"></el-table-column>
          <el-table-column prop="consigneeLinkman" label="收货人" min-width="110" align="center"></el-table-column>
          <el-table-column prop="consigneeLinkmanMobile" label="收货人手机" min-width="120" align="center"></el-table-column>
          <el-table-column prop="consigneeAddress" label="收货地址" min-width="200" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="goodsName" label="货物名称" min-width="110" align="center"></el-table-column>
          <el-table-column prop="pack" label="包装" min-width="110" align="center"></el-table-column>
          <el-table-column prop="goodsNum" label="件数" min-width="110" align="center"></el-table-column>
          <el-table-column prop="goodsWeight" label="重量" min-width="110" align="center"></el-table-column>
          <el-table-column prop="goodsBulk" label="体积" min-width="110" align="center"></el-table-column>
          <el-table-column prop="xfFee" label="现付" min-width="110" align="center"></el-table-column>
          <el-table-column prop="dfFee" label="到付" min-width="110" align="center"></el-table-column>
          <el-table-column prop="hfFee" label="回付" min-width="110" align="center"></el-table-column>
          <el-table-column prop="yjFee" label="月结" min-width="110" align="center"></el-table-column>
          <el-table-column prop="hkFee" label="回扣" min-width="110" align="center"></el-table-column>
          <el-table-column prop="memo" label="备注" min-width="200" align="center"></el-table-column>
          <el-table-column prop="requireSendTime" label="要求发货日期" min-width="110" align="center"></el-table-column>
          <el-table-column prop="requireArriveTime" label="要求到货日期" min-width="110" align="center"></el-table-column>
          <el-table-column prop="createTime" label="登记时间" min-width="170" align="center"></el-table-column>
        </el-table>
        <div class="main-table-page">
          <div class="main-table-page-left">
            
          </div>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="page.pageSizes"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            :current-page="searchForm.pageNo"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div>
      <el-dialog
        :title="modifyWaybill.title"
        :close-on-click-modal="false"
        :visible.sync="modifyWaybill.visiable"
        width="1280px"
        center
        v-if="modifyWaybill.visiable" class="Maglist-HairCar J-dialog-vh"
      >
      
        <v-addUpdata
          :waybillId.sync="modifyWaybill.waybillId"
          :showFlag.sync="modifyWaybill.visiable"
          :reloadListFlag.sync="reloadListFlag"
          v-if="modifyWaybill.visiable"
        ></v-addUpdata>
      </el-dialog>
      <v-managementMark   @reloadData="markReloadData" :dialog.sync="managementMark.visiable"  v-if="managementMark.visiable"></v-managementMark>
      <waybillNo-component
        :showFlag.sync="openWaybill.visiable"
        :waybillNo="openWaybill.waybillNo"
        :statusText="openWaybill.statusText"
        :waybillId="openWaybill.waybillId"
        v-if="openWaybill.visiable"
      ></waybillNo-component>

      <el-input v-show="false" v-model="file.path" id="wdfileSelect" name="wdfileSelect" @change="uploadWdFile" ref="wdfileSelect"  type="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></el-input>
    </div>
  </div>
</template>
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from "@/utils/api.js";
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";
import managementMarkDialog from "@/components/Common/managementMark.vue";
import addUpdata from "@/components/WaybillS/addUpdate.vue";
export default {
  name:'w-maglistgl',
  mixins: [Base,List],
  components: {
    "waybillNo-component": waybillNoComponent,
    "v-managementMark": managementMarkDialog,
    "v-addUpdata": addUpdata
  },
  data() {
    return {
      //运单修改
      modifyWaybill: {
        title: "",
        visiable: false,
        waybillId: ""
      },
      //运单详情框
      openWaybill: {
        waybillNo: "",
        waybillId: "",
        statusText: "",
        visiable: false
      },

      batchNum: 0, //已选择n项
      activeName: "0", //Tabs 标签页 基础用法
      searchForm: {
        billTime: [],
        signTime: [],
        startBillTime: "", //开单日期
        endBillTime: "",
        startSignTime: "", //签收时间
        endSignTime: "",
        status: "", //运单状态
        waybillNo: "", //运单号
        beginSiteName: "", //发站
        consignorName: "", //发货信息
        consigneeName: "", //收货人
        endSiteName: "", //到站
        pageSize: 10,
        pageNo: 1
      },
      startEndBillTime: [], //开单日期
      startEndSignTime: [], //签收时间

      tableData: [], //table数据
      multipleSelection: [], //多选
      tabMagList: [
        { status: 0, name: "全部" },
        { status: 1, name: "待确认" },
        { status: 5, name: "待调度" },
        { status: 10, name: "待发车" },
        { status: 15, name: "运输中" },
        { status: 20, name: "已到站" },
        { status: 25, name: "已签收" },
        { status: -1, name: "已作废" },
      ],
      file:{
        waybillId:'', //选择上传时的运单ID
        waybillNo:'',
        path:''
      },
      //list重新加载
      reloadListFlag: false
    };
  },

  watch: {
    "searchForm.billTime": function(val, oldval) {
      if (val !== null) {
        this.searchForm.startBillTime = val[0];
        this.searchForm.endBillTime = val[1];
      } else {
        this.searchForm.startBillTime = null;
        this.searchForm.endBillTime = null;
      }
    },
    "searchForm.signTime": function(val, oldval) {
      if (val !== null) {
        this.searchForm.startSignTime = val[0];
        this.searchForm.endSignTime = val[1];
      } else {
        this.searchForm.startSignTime = null;
        this.searchForm.endSignTime = null;
      }
    },
    //外部触发列表更新
    reloadListFlag: function(val, oldval) {
      if (val) {
        this.querySpecialList();
        //还原以便下次为true时触发更新
        this.reloadListFlag = false 
      }
    },
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    // 监听,当路由发生变化的时候执行
    $route(to, from) {      
      if (to.params.status) {
        this.getathJump(to.params.status);
      }
    }
  },
  created() {
    this.managementMarkListCreated();
    if (Object.keys(this.$route.params).length !== 0) {
       this.getathJump(this.$route.params.status);
    }
  },

  methods: {
    //重新加载 标记数据列表数据
    markReloadData: function (flag) {        
      if (flag) {
        this.managementMarkListCreated()
      }
    },
    getathJump(status){
      this.activeName=status

      this.searchForm.status = []
      if (status != '0') {
        this.searchForm.status.push(status*1);
      }else{
        this.searchForm.status = []
      }
      this.querySpecialList();
    },
    /**
     *  清单导入
     */
    async importWaybillDetail(row) {
      
      //检查清单是否有导入过，如果有导入过则需要提示
      const { code, message, data } = await api.get("/waybill/goodslist/upload/check?id="+ row.id);
      if (code === "200") {

        let msg = '该运单清单已经导入过, 是否要重新导入清单?'
        if (!data) {
          msg = '确定是否要导入运单清单？'
        } 
        this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center:true,
            type: 'warning'
          }).then(() => {
            //弹出文件选择窗口
            this.openFileLoadDialog(row)
          }).catch(() => {});
      }
    },

    openFileLoadDialog(row) {
        //弹出文件选择窗口
        this.file.waybillId = row.id
        this.file.waybillNo = row.waybillNo
        var wdfileSelect = document.getElementById("wdfileSelect");
        wdfileSelect.click();
    },

    /**
     * 上传运单清单文件
     */
    async uploadWdFile( val ) {
      if (val != '') {
        let wdfs = this.$refs.wdfileSelect;
        var formdata = new FormData();
        formdata.append("id", this.file.waybillId);
        formdata.append('file',wdfs.$refs.input.files[0]);
        const { code, message, data } = await api.post("/waybill/goodslist/upload", formdata ,{'Content-Type': 'application/x-www-form-urlencoded'})
        if (code == '200') {
          this.$message({type: "success",message: this.file.waybillNo +  ",运单清单导入成功!"});
        }
        //清空路径数据，以便下次选择时可以触发change事件
        this.file.path = '' 
      }
    },
    modifyWayListFun(row) {
      this.modifyWaybill.visiable = true;
      this.modifyWaybill.waybillId = row.id;
      this.modifyWaybill.title = "运单修改-" + row.waybillNo;
    },

    showWaybill(row) {
      this.openWaybill.waybillNo = row.waybillNo;
      this.openWaybill.waybillId = row.id;
      this.openWaybill.statusText = this.waybillStatusTxt(row.status);
      this.openWaybill.visiable = true;
    },
    //确认开单
    confirmOrder(row) {//确认开单
        this.$confirm('你确认运单已完成核实，确认后将移交调度, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(async() => {
          const { code, data, message } = await api.post('/waybill/confirm?id='+row.id)
          if (code === '200') {
            this.$message({showClose: true, message: '运单确认成功，现在可以进行调度', type: 'success'});
          }
          this.querySpecialList() 
        }).catch(() => {        
        });
      },
    //运单作废
    waybillDelFun(row) {
      this.$confirm("运单作废, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center:true,
        type: "warning"
      })
        .then(async () => {
          const { code, message, data } = await api.post(
            "/waybill/del",
            row.id
          );
          if (code === "200") {
            this.$message({
              type: "success",
              message: "作废成功!"
            });
          }
        })
        .catch(() => {});
    },
    async querySpecialList() {
      const { code, message, data } = await api.post(
        "/waybill/list",
        this.searchForm
      );
      if (code === "200") {
        this.tableData = data.records;
        this.page.total = data.total;
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    tabMagListClick(tab, event) {
      //tab切换  **
      this.searchForm.status = []
      if (tab.$vnode.data.key!='0') {
        this.searchForm.status.push(tab.$vnode.data.key);
      }else{
        this.searchForm.status = []
      }
      this.querySpecialList();
    },
      exportFile(){
       api.post('/waybill/export/list', this.searchForm).then(data=>{
        if (data.code == '200') {
          this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
        }
      })
    },
  }
};
</script>


<style>
</style>
