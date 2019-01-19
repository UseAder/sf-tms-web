<template>
  <div>
    <el-dialog
    :close-on-click-modal="false" 
      :title="newModifyTitle"
      :visible.sync="showDialog"
      @close="$emit('update:pVisible', false)"
      width="1200px"
      center
      class="Maglist-HairCar J-el-dialog__body J-dialog-vh">    

      <div class="J-detail J-inputBorder0 J-yx-error J-dialog-vh-body" > 
        <el-row >  
          <div  id="J-dialog-header-offsetHeight">
            <el-form label-width="84px" class="demo-ruleForm J-flexSbc">
              <el-form-item label="开单日期：">
                <el-date-picker
                  v-model="billTime"
                  type="daterange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                ></el-date-picker>
                <el-button type="primary" class="J-ml-20" @click="handlesearch">查询</el-button>
              </el-form-item>
            </el-form>
            <span class="ticket-tishi">勾选要开票的运单</span>
          </div>
          
          <el-row class="J-elTable"  id="J-elTable">
            <el-table
              :max-height="getScreenHeight-jElTableOffsetTop-jdialogFooterOffsetHeight>111?getScreenHeight-jElTableOffsetTop-jdialogFooterOffsetHeight:'none'" 
              ref="multipleTable"
              show-summary
              :summary-method="kpAddGetSummaries"
              :data="tableData"
              border
              @selection-change="handleSelectionChange">
              <el-table-column fixed type="selection" width="35"></el-table-column>
              <el-table-column fixed type="index" width="50" label="序号" align="center"></el-table-column>
              <el-table-column prop="waybillNo" label="运单号" min-width="130" align="center">
                <template slot-scope="scope">
                  <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                  </template>
              </el-table-column>
              <el-table-column prop="status" label="运单状态" min-width="100" align="center">
                  <template slot-scope="scope">
                      <div v-html="statusBackground(waybillStatus(scope.row.status))" class="J-statusBackground"></div>     
                  </template>
              </el-table-column>
              <el-table-column prop="consignorName" label="发货单位" min-width="150" align="center"></el-table-column>
              <el-table-column prop="consignorLinkman" label="发货方" min-width="150" align="center"></el-table-column>
              <el-table-column prop="xfFee" label="现付" min-width="100" align="center"></el-table-column>
              <el-table-column prop="dfFee" label="到付" min-width="100" align="center"></el-table-column>
              <el-table-column prop="hfFee" label="回付" min-width="100" align="center"></el-table-column>
              <el-table-column prop="yjFee" label="月结" min-width="100" align="center"></el-table-column>
              <el-table-column prop="exceptionFee" label="异常费用" min-width="110" align="center"></el-table-column>
              <el-table-column prop="goodsName" label="货物名称" min-width="100" align="center"></el-table-column>
              <el-table-column prop="pack" label="包装" min-width="100" align="center"></el-table-column>
              <el-table-column prop="goodsNum" label="件数" min-width="100" align="center"></el-table-column>
              <el-table-column prop="goodsWeight" label="重量" min-width="100" align="center"></el-table-column>
              <el-table-column prop="goodsBulk" label="体积" min-width="100" align="center"></el-table-column>
              <el-table-column prop="memo" label="运单备注" min-width="200" align="center"></el-table-column>
            </el-table>
          </el-row>
        </el-row>
        <el-row class="J-marginT "  id="J-dialog-footer-offsetHeight">
          <el-form ref="newModifyForm"  :rules="newModifyRules"  :model="newModifyForm"  >
            <el-col :span="6">
              <div class="labal">开票金额：</div>
              <div class="input J-borderBot">{{select.fee}}</div>                      
            </el-col>
            <el-col :span="6">
              <div class="labal">运单数</div>
              <div class="input J-borderBot">{{select.waybillNum}}</div>                      
            </el-col>
            <el-col :span="6">
              <div class="labal"></div>
              <div class="input J-borderBot"></div>                      
            </el-col>
            <el-col :span="6">
              <div class="labal"></div>
              <div class="input J-borderBot"></div>                      
            </el-col>
            <el-col :span="6">
              <div class="labal">开票抬头</div>
              <div class="input ">
                <el-form-item prop="invoiceTitle">
                    <el-input type="text" placeholder="开票抬头" v-model="newModifyForm.invoiceTitle">
                    </el-input> 
                </el-form-item>
              </div> 
            </el-col>
            <el-col :span="18">
              <div class="labal">开票备注</div>
              <div class="input ">
                <el-form-item prop="memo">
                    <el-input type="text" placeholder="开票备注" v-model="newModifyForm.memo">
                    </el-input> 
                </el-form-item>
              </div> 
            </el-col>
          </el-form>
        </el-row>
        <span class="dialog-footer" style="display: block; text-align: center;margin-top:18px">
          <el-button type="primary" :loading="savingFlag" @click="saveKp('newModifyForm')">保 存</el-button>
        </span>
      </div>
    </el-dialog>
     <waybillNo-component
        :showFlag.sync="openWaybill.visiable"
        :waybillNo="openWaybill.waybillNo"
        :statusText="openWaybill.statusText"
        :waybillId="openWaybill.waybillId"
        v-if="openWaybill.visiable"
      ></waybillNo-component>
  </div>
</template>
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from "@/utils/api.js";
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
    mixins: [Base,List],
  /**
   * pAuFlag： 0代表新增， 1修改
   * pInvoiceId： 修改时必填 对账ID
   */
  props: [
    "pVisible",
    "pAuFlag",
    "pConsignorId",
    "pInvoiceTitle",
    "pInvoiceId"
  ],
  components: {
    "waybillNo-component": waybillNoComponent
  },
  data() {
    return {
      showDialog: this.pVisible,
      newModifyTitle: "",
      select: {
        fee: 0,
        waybillNum: 0
      },
      tableData: [], //新增或修改开票中的tableData
      searchForm: {
        //新增开票 查询
        startBillTime: "",
        endBillTime: "",
        consignorId: this.pConsignorId,
        invoiceId: this.pInvoiceId //修改时
      },
      billTime: [], //时间的搜索控件是一个数组
      newModifyForm: {
        invoiceId: this.pInvoiceId, //修改时
        consignorId: this.pConsignorId,
        waybillIds: [],
        invoiceTitle: this.pInvoiceTitle,
        memo: ""
      },
      multipleSelection: [], //多选

      //运单详情框
      openWaybill: {
        waybillNo: "",
        waybillId: "",
        statusText: "",
        visiable: false
      },
      newModifyRules: {  
        invoiceTitle: [
          { required: true, message: '请输入开票抬头' ,trigger: ['blur', 'change'] },
          { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}  
        ],
        memo:[
          { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
        ]
      }
    };
  },
  watch: {
    billTime: function(val, oldval) {
      if (val !== null) {
        this.searchForm.startBillTime = val[0];
        this.searchForm.endBillTime = val[1];
      } else {
        this.searchForm.startBillTime = null;
        this.searchForm.endBillTime = null;
      }
    }
  },

  methods: {
    showWaybill(row) {
      this.openWaybill.waybillNo = row.waybillNo;
      this.openWaybill.waybillId = row.id;
      this.openWaybill.statusText = this.waybillStatusTxt(row.status);
      this.openWaybill.visiable = true;
    },
    /**
     * 初始化
     */
    init() {
      if (this.pAuFlag == 0) {
        this.newModifyTitle = "创建[" + this.pInvoiceTitle + "]客户开票申请";
      } else {
        //加载对账单详情数据
        this.loadKpDetail();
      }
      this.loadwaitKpWaybillList();
    },
    /**
     * 加载明细数据
     */
    loadKpDetail() {
      api.get("/kp/detail?id=" + this.pInvoiceId).then(data => {
        if (data.code === "200") {
          this.newModifyTitle =
            "修改[" + data.data.invoiceTitle + "]客户开票申请";

          this.newModifyForm.invoiceTitle = data.data.invoiceTitle;
          this.newModifyForm.memo = data.data.memo;

          this.select.fee = data.data.fee;
          this.select.waybillNum = data.data.waybillNum;
        }
      });
    },

    //获取运单列表数据
    loadwaitKpWaybillList() {
      this.searchForm.consignorId = this.pConsignorId;
      this.searchForm.invoiceId = this.pInvoiceId;
      api.post("/kp/wait/waybill/list", this.searchForm).then(data => {
        if (data.code === "200") {
          this.tableData = data.data;
          let sData = this.tableData.filter(d => d.hasInvoice == 1);
          this.$nextTick(function() {
            //默认选中
            this.toggleSelection(sData, true);
          });
        }
      });
    },
    //费用未对账 勾选时
    toggleSelection(rows,selected ) {    
        if (rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row,selected);
            });
        } 
        // this.hjfkTotalFun()
    },
    saveKp(formName) {
      if (this.multipleSelection.length == 0) {
        this.$message({ type: "error", message: "请选择要开票的运单！" });
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveDataSubmit(formName)
        } else {
          return false;
        }
      });
      
    },
    saveDataSubmit(){
      this.$confirm("确定要保存该开票申请吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        type: "warning"
      }).then( () => {
          this.savingFlag=true
          let wIds = this.multipleSelection.map(d => d.id);
          this.newModifyForm.waybillIds = wIds;
          api.post("/kp/addupdate",this.newModifyForm).then(data=>{
            if (data.code === "200") {
              let msg = "成功创建客户开票申请!";
              if (this.pAuFlag == 1) {
                msg = "成功修改客户开票申请!";
              }
              this.$message({ type: "success", message: msg });
              this.$emit("update:pVisible", false); //
              this.$emit("reloadList", true); //刷新列表
            }
          }).then(() => { 
            this.savingFlag=false  
          })
        }).catch(() => {})
    },
    //开票申请搜索
    handlesearch() {
      this.loadwaitKpWaybillList();
    },
    kpAddGetSummaries(param) {
      //合计
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        const arr = ["xfFee", "dfFee", "hfFee", "yjFee", "exceptionFee"];
        if (arr.indexOf(column.property) > -1) {
          //则包含该元素}
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += ' 元';
          } else {
            sums[index] = "N/A";
          }
        }
      });
      return sums;
    },

    handleSelectionChange(val) {
      //开票的运单选择时
      this.multipleSelection = val;

      let wIds = this.multipleSelection.map(i=>i.id)
      this.select.waybillNum = wIds.length;
      this.newModifyForm.waybillIds = wIds;
      var sum = this.summingUp(
        val,
        "xfFee",
        "dfFee",
        "hfFee",
        "yjFee",
        "exceptionFee"
      );
      var num = 0;
      for (var i in sum) {
        num += sum[i];
      }
      this.select.fee = num;
    },
    summingUp(arr, ...param) {
      // 第一个参数是要求和的数组对象，后面是要求和的字段（不定项），如果要求和的字段值是字符串也做了相应转换
      var temp = {};
      arr.forEach(function(item, index) {
        for (var k in item) {
          if (param.indexOf(k) >= 0) {
            if (typeof item[k] == "string") {
              item[k] = item[k] * 1;
            }
            if (temp[k]) {
              temp[k] += item[k];
            } else {
              temp[k] = item[k];
            }
          }
        }
      });
      return temp;
    }
  },
  created() {
    this.init();
  }
};
</script>