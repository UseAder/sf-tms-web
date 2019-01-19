import api from '@/utils/api.js'

export default {
  data() {
    return {
      savingFlag:false,//加载中

      page:{
        pageSizes: [10, 20, 50, 100], //分页
        pageSize: 10, //当前选择分页数
        total: 0
      },
      // permissionDataList:[], //权限数据
      WaybillsOpinionList:{//Waybills(运单管理)内所有 弹框
        return:{//回单管理
          receiptOpinion:false,//回收//取消回收
          sendOpinion:false//发放//取消发放

        }
      },
      ExceptionOpinionList:{//Waybills(运单管理)内所有 弹框
        exception:{
          createAbnormalOpinion:false,//异常新增
          addAbnormalItemOpinion:false//异常条目新增
        }
      },
      ExaminesOpinionList:{//Examines(审核管理)内所有 弹框
        waybill:{
          examineOpinion:false,//运单变更审核
          detailsOpinion:false,//运单变更审核详情
        },
        Definition:{
          examineOpinion:false,//审核流程定义
        }
      },
      CompanysOpinionList:{//Companys(公司管理)内所有 弹框
        Employee:{//员工管理
          employeeOpinion:false,//员工新增
          jueseOpinion:false//角色新增
        }
      },
      FinancesOpinionList:{//FinanceS(财务管理)内所有 弹框
        Recon:{
          vehicleDetailsOpinion:false,//整车对账单明细
        },
        Cost:{//费用核销
          costHxOpinion:false,//费用核销
          costMxOpinion:false,//费用支付明细
        },
        Oilcard:{//油卡管理
          oilcardOpinion:false,//油卡新增
          rechargeOpinion:false,////油卡充值
          allotOpinion:false,//油卡分配
          callbackOpinion:false,//油卡收回
          recordOpinion:false//油卡使用记录
        },
        Ticket:{//开票管理
          ticketOpinion:false,//新增开票
          completeOpinion:false,//完成开票
          ticketXqOpinion:false//开票详情
        }
      },  
      InformationsOpinionList:{//InformationS(信息管理)内所有 弹框
        Customer:{//客户管理
          customerOpinion:false,//客户新增
        },
        Special:{//员工管理
          specialOpinion:false,//员工新增
        },
        Price:{
          priceOpinion:false,//新增报价
          weiqueding:false,
          priceXqOpinion:false//报价详情
        },
        Vehicle:{//车辆管理
          vehicleOpinion:false//车辆新增
        },
      },
      //新增或修改弹框
      isUpdate:{
        isDialog:false,//新增或修改弹框打开
        isContent:false,//false 新增内容 true 修改内容
        updateRow:{},//传递数据
      },
      //管理标记
       managementMark:{
        visiable:false,
        managementMarkList:[]
      },
      base:{   
          feeTypeFlow:[{value:1,code:'客户运费结算'},{value:2,code:'专线运费结算'},{value:3,code:'整车运费结算'},{value:4,code:'短驳运费结算'},{value:5,code:'回扣结算'},{value:6,code:'其他异费收付结算'}],
          incomeTypeFlow:[{value:'1',code:'客户'},{value:'2',code:'专线'},{value:'3',code:'整车'},{value:'4',code:'短驳'},{value:'5',code:'回扣'},{value:'100',code:'其他'}],
          kpStatus:[{value:'1',code:'未完成',color:'#67C23A'},{value:'2',code:'完成开票',color:'#67C23A'}],
          receiptTickeTDialog:[{value:'1',code:'目的网点待回收'},{value:'2',code:'目的网点已回收-待寄出'},{value:'3',code:'目的网点已寄出-待始发网点接收'},{value:'4',code:'始发网点已接收-待发放'},{value:'5',code:'始发网点已发放'}],
          auditStatusBuizBatch:[{value:0,code:'待提交审核',color:'#E6A23C' },{value:1,code:'待审核',color:'#67C23A'},{value:2,code:'审核通过',color:'#909399'},{value:3,code:'审核失败',color:'#E6A23C'},],
          balanceStatusBuizBatch:[{value:1,code:'未核销',color:'#67C23A'},{value:2,code:'核销中',color:'#E6A23C'},{value:3,code:'已核销',color:'#909399'}],
          statusMagListgl:[{value:-1,code:'已作废',color:'#3e8ef7'},{value:1,code:'待确认',color:'#eb6709'},{value:5,code:'待调度',color:'#0bb2d4'},{value:10,code:'待发车',color:'#ff4c52'},{value:15,code:'运输中',color:'#9463f7'},{value:20,code:'已到站',color:'#67C23A'},{value:25,code:'已签收',color:'#909399'}],
          goodsTrackStatus:[{value:5,code:'发车',color:'#ff4c52'},{value:10,code:'到站',color:'#67C23A'},{value:15,code:'中转',color:'#9463f7'},{value:20,code:'签收',color:'#909399'}],
          goodsTrackStatusItem:[{value:1,code:'下单',color:'#eb6709'},{value:5,code:'已确认',color:'#0bb2d4'},{value:10,code:'已调度',color:'#ff4c52'},{value:15,code:'已发车',color:'#9463f7'},{value:20,code:'已到站',color:'#67C23A'},{value:25,code:'签收',color:'#909399'}],
 
          receiptMagListgl:[{value:1,code:'回单'},{value:2,code:'电子回单'},{value:3,code:'回执'},{value:4,code:'原单'},{value:5,code:'收条'},{value:6,code:'信封'},],
          payTypeMagListgl:[{value:1,code:'现付'},{value:2,code:'到付'},{value:3,code:'回付'},{value:4,code:'月结'}],
          pickFlagMagListgl:[{value:'0',code:'不需要'},{value:'1',code:'需要'}],
          deliveryTypeMagListgl:[{value:'1',code:'自提'},{value:'2',code:'送货'}],
          //回单状态
          receiptStatus:[{value:1,code:'待回收',color:'#67C23A'},{value:5,code:'待发放',color:'#E6A23C'},{value:10,code:'已发放',color:'#909399'}],
          //回单批次回单类型 
          receiptHandType:[{value:1,code:'已发放',color:'#67C23A'},{value:2,code:'已回收',color:'#E6A23C'}],
         
          // receiptVehicleDialog:[{value:'1',code:'待回收'},{value:'5',code:'待发放'},{value:'10',code:'已发放'}],
          //回单回收
          receiptRetrieveStatus:[{value:1,code:'待回收'},{value:2,code:'已回收'}],
          //回单发放
          receiptBackStatus:[{value:'1',code:'发放'},{value:'2',code:'已发放'}],

          inOutPayType:[{value:1,code:'收入'},{value:2,code:'支出'}],
          dispatchType:[{value:1,code:'专线'},{value:2,code:'整车'}],
          statusDispatch:[{value:1,code:'待调度',color:'#67C23A'},{value:2,code:'已调度',color:'#909399'}],
          bxgsOption:[{value:'人保保险',code:'人保保险'},{value:'平安保险',code:'平安保险'}],
          statusOption:[{value:10,code:'待发车'},{value:15,code:'运输中'},{value:20,code:'已到站'},{value:25,code:'已签收'}],
          businessBDataType:[{value:1,code:'发货方'},{value:2,code:'承运方'},{value:4,code:'其他'}],      
          //异常跟踪处理状态
          anomalyTrackStatus:[{value:1,code:'未处理' ,color:'#409EFF'},{value:2,code:'处理中',color:'#67C23A'},{value:3,code:'处理完成',color:'#909399'},],
          //车辆来源
          sourceType:[{value:1,code:'自有',color:'#67C23A'},{value:2,code:'合同',color:'#E6A23C'}],
          //车长接口
          truckTypeOptions:[],
          //车型接口
          conductorOptions:[],
          //分配状态
          distributionStatus:[{value:1,code:'未分配',color:'#67C23A'},{value:2,code:'已分配',color:'#909399'}],
          businessTypeOptions:[{value:1,code:'普通'},{value:2,code:'电商进仓'}],
          //仓库管理状态
          warehouseStatus:[{value:0,code:'停用',color:'#909399'},{value:1,code:'启用',color:'#67C23A'}],
          //退货发货状态
          backGoodsStatus:[{value:1,code:'重新打包',color:'#409EFF'},{value:5,code:'退货发货',color:'#67C23A'},{value:10,code:'退货到站',color:'#E6A23C'},{value:15,code:'市内配送',color:'#E6A23C'},{value:20,code:'客户签收',color:'#909399' },{value:25,code:'签收异常',color:'#F56C6C'}],
          queryBackGoodsStatus:[{value:5,code:'退货发货',color:'#67C23A'},{value:10,code:'退货到站',color:'#E6A23C'},{value:15,code:'市内配送',color:'#E6A23C'},{value:20,code:'客户签收',color:'#909399' },{value:25,code:'签收异常',color:'#F56C6C'}],
          
          ////////////////////签单实收///////
          //责任方
          dutyPersonType:[{value:1,code:'客户'},{value:2,code:'承运方'},{value:3,code:'公司'}],
          //去向 ： 1二次配送 ,2物流退回，4报废不赔,5报废索赔,6没有退货
          dealWay:[{value:1,code:'二次配送'},{value:2,code:'物流退回'},{value:4,code:'报废不赔'},{value:5,code:'报废索赔'},{value:6,code:'没有退货'}],
          //预约状态
          bookingStatus:[{value:0,code:'未预约',color:'#67C23A'},{value:null,code:'未预约',color:'#67C23A'},{value:1,code:'已预约',color:'#909399'}],
          //异常类型
          exceptType:[{value:1,code:'发货异常'},{value:2,code:'退货异常'}],
          //收入支出
          exceptIoType:[{value:1,code:'收入'},{value:2,code:'支出'}],
          //
          visibleFlag:[{value:0,code:'不可见',color:'#909399'},{value:1,code:'可见',color:'#67C23A'}],
          //短信模板类型
          smsTemplateType:[{label:'发货方',options:[{value:1,code:'在途通知'},{value:2,code:'货物签收'}]},{label:'整车',options:[{value:3,code:'装车通知'}]}],

          //是否起始清单
          isBeginList:[{value:1,code:'初始清单'},{value:2,code:'导入清单'}],

          //短信发送状态
          smsSendStatus:[{value:-1,code:'发送异常'},{value:0,code:'未发送'},{value:1,code:'已发送'}],
          balanceHolderTypeOp:[{ value: 1,code: '客户结算'}, {value: 2,code: '专线结算'}, {value: '3',code: '整车结算'}, {value: '4',code: '短驳结算'}, { value: '5',code: '回扣结算'}, {value: '100',code: '其他收支结算'}]
        },
        
      // checked:true,
      value: '',  

      loading: true,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },

    }
  },
  created() {
    this.querySpecialList()
  },
 
  methods: {
    //列表状态列样式 
    statusBackground(colorCode){
      let html=''
      if (colorCode) {
        html="<span style=background:"+colorCode.color+">"+colorCode.code+"</span>"
      }
      return html
    },
    statusBackgroundTrack(colorCode){
      let html=''
      if (colorCode) {
        html="<span style=color:"+colorCode.color+">"+colorCode.code+"</span>"
      }
      return html
    },
    newFun(row){//新增 方法（isUpdata）      
      this.isUpdate.isDialog = true;
      this.isUpdate.isContent=true
      this.isUpdate.updateRow=row
    },
    modifyFun(row){//修改 方法 打开时
      this.isUpdate.isDialog = true;
      this.isUpdate.isContent=false
      this.isUpdate.updateRow=row
    },  
    async querySpecialList() {//获取页面初始数据
    },    
    handlesearch() {
      this.searchForm.pageNo=1
      this.querySpecialList();
    },

  
    // async handlesearch() {
    //   this.savingFlag=true;
    //   this.searchForm.pageNo=1;
    //  await this.querySpecialList().then(_=>{{
    //   this.savingFlag=false;

    //  };})

    // },  
    handleSizeChange(val) {//`每页 ${val} 条`
      this.searchForm.pageSize=val;
      this.querySpecialList();
    },
    handleCurrentChange(val) {//当前页 
      this.searchForm.pageNo=val;
      this.querySpecialList();
    },
    resetForm(formName) {
      this.searchForm.pageNo=1
      //重置
      if(this.$refs[formName]){
        
        this.$refs[formName].resetFields();
      
        this.$nextTick(function(){//默认选中
          this.querySpecialList()
        })
      }
    },
    //弹框关闭时清空表单数据
    closeDialog(formName){    
      if(this.$refs[formName]){    
      this.$refs[formName].resetFields();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
   
    //------------------  验证 规则-----------------
    /**
     * 手机验证
     */
    linkmanMobileRules(rule, value, callback){
      var linkmanMobileRex = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
      if (!linkmanMobileRex.test(value)&&value) {
        callback(new Error('手机号格式错误'));
      }else{
        callback();
      }
    },
    /**
     * 电话验证
     */
    linkmanPhoneRules(rule, value, callback){
      var linkmanPhoneRex = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
      if (!linkmanPhoneRex.test(value)&&value) {
        callback(new Error('固定电话格式错误'));
      }else{
        callback();
      } 
     },
    /**
     * 车牌验证
     */
    plateNumberRules(rule, value, callback) {
      var testRex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/u;
      if (!testRex.test(value)&&value) {
          callback(new Error('车牌号不正确'));
      }else{
          callback();
      }
    },
    /**
     * 身份证验证
     */
    iDRules(rule, value, callback) {
      var testRex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (!testRex.test(value)&&value) {
          callback(new Error('身份证验证不正确'));
      }else{
          callback();
      }
    },
    
    /**
     * 只允许输入整数或字母
     */
    numberStringRules(rule, value, callback) {
      var testRex =/[\W]/g ;
      if (testRex.test(value)&&value) {
          callback(new Error('只允许输入整数或字母'));
      }else{
          callback();
      }
    },
    /**
     * 只能输入整数或小数的验证
     */
    numberRules(rule, value, callback) {
      var testRex = /^[0-9]+([.]{1}[0-9]+){0,1}$/ ;
      if (!testRex.test(value)&&value) {
          callback(new Error('输入类型错误'));
      }else{
          callback();
      }
    },
    /**
     * 只能输入整数de验证
     */
    numRules(rule, value, callback) {
      var testRex = /\D/g;
      if (testRex.test(value)&&value) {
          callback(new Error('输入类型错误'));
      }else{
          callback();
      }
    },
      
    // ------------------  列表 状态格式化  formatter-----------------
    //回单类型
    receiptType: function(type) {
      let param = this.base.receiptMagListgl.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },  
 
    /**
     * 调度类型
     */
    dispatchType(type){
      let param = this.base.dispatchType.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
    /**
     * 调度状态
     */
    dispatchStatus:function(status) {
      let param = this.base.statusDispatch.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },

    balanceHolderType:function(type) {
      let param = this.base.balanceHolderTypeOp.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
    

    /**
     * 审核状态
     */
    auditStatus : function (status) {
      let param = this.base.auditStatusBuizBatch.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },
    /**
     * 核销状态 结算状态
     */
    balanceStatus : function (status) {
        let param = this.base.balanceStatusBuizBatch.find((n) => (n.value == status));
        if (param === undefined) {
            return ""
        }
        return param;
    },
    
    /**
     * 异常跟踪处理状态
     */
    anomalyTrackStatus:function(status) {
      let param = this.base.anomalyTrackStatus.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },
    /**
     * 车辆来源
     */
    sourceType: function(type) {
      let param = this.base.sourceType.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param;
    },
    /**
     * 分配状态
     */
    distributionStatus: function(status) {
      let param = this.base.distributionStatus.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },
       /**
     * 运单跟踪操作状态
     */
    goodsTrackStatus:function(status){
      let param = this.base.goodsTrackStatus.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },
    goodsTrackStatusItem:function(status){
      let param = this.base.goodsTrackStatusItem.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },
    /**
     * 运单状态
     */
    waybillStatus:function(status){
      let param = this.base.statusMagListgl.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },
    /**
     * 运单状态
     */
    waybillStatusTxt:function(status){
      let param = this.base.statusMagListgl.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
    /**
     * 运单状态---运输
     */
    waybillTransportationStatus:function(status){
      let param = this.base.waybillTransportationStatus.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },
     /**
     * 运单跟踪状态
     */
    waybillTrackStatus:function(status){
      let param = this.base.goodsTrackStatus.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
    /**
     * 回单状态
     */
    receiptStatus:function(status){
      let param = this.base.receiptStatus.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },
     /**
     * 回单批次回单类型
     */
    receiptHandType:function(type){
      let param = this.base.receiptHandType.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param;
    },
    /**
     * 付款方式
     */
    payType:function(type){
      let param = this.base.payTypeMagListgl.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
    /**
     * 上门提货
     */
    pickFlag:function(type){
      let param = this.base.pickFlagMagListgl.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
    /**
     * 仓库管理
     */
    warehouseStatus:function(status){
      let param = this.base.warehouseStatus.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },

    kpStatusFormat(status){
      let param = this.base.kpStatus.find((n) => (n.value == status));
      if (param === undefined) {
          return ""
      }
      return param;
    },
 
    /**
     * 退货状态
     */
     backGoodsStatus:function(status){
      let param = this.base.backGoodsStatus.find((n) => (n.value == status));
      if (param === undefined) {
        return ""
    }
    return param;
  },

    /**
     * 预约状态
     */
    bookingStatus:function(status){
      let param = this.base.bookingStatus.find((n) => (n.value == status));

      if (param === undefined) {
          return "未预约"
      }
      return param;
    },
       /**
     * 费用方
     */
    businessBDataType:function(type){
      let param = this.base.businessBDataType.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
     /**
     * 费用类型
     */
    inOutPayType:function(type){
      let param = this.base.inOutPayType.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
    /**
     *资金流水类型
     */  
    feeTypeFlow : function (type) {
      let param = this.base.feeTypeFlow.find((n) => (n.value == type));      
      if (param === undefined) {
          return ""
      }
      return param.code;
  },
    /**
     * 责任方  dutyPersonType
     */
    dutyPersonType:function(type){
      let param = this.base.dutyPersonType.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },

     /**
     * 去向
     */
    dealWay:function(type){
      let param = this.base.dealWay.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
    
    /**
     * 异常类型
     */
    exceptType:function(type){
      let param = this.base.exceptType.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },

    exceptIoType:function (type) {
      let param = this.base.exceptIoType.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
    /**
     * 用户可见/不可见
     */
    visibleFlag:function(type){
      let param = this.base.visibleFlag.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param;
    },
    
    deliveryType:function(type){
      let param = this.base.deliveryTypeMagListgl.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.code;
    },
    vehicleType(type){
      let truckParam = this.base.truckTypeOptions.find((n) => (n.value == type));
      if (truckParam === undefined) {
          return ""
      }
      return truckParam.item;
    },
    
    isBeginListFlag(flag){
      let isBeginFlag = this.base.isBeginList.find((n) => (n.value == flag));
      if (isBeginFlag === undefined) {
          return ""
      }
      return isBeginFlag.code;
    },
    
    smsSendStatus(stauts){
      let smsSendParam = this.base.smsSendStatus.find((n) => (n.value == stauts));
      if (smsSendParam === undefined) {
          return ""
      }
      return smsSendParam.code;
    },
    // ------------------接口数据-----------------
     //获取车型
      vehicleTypeInterface() {
        api.get('/system/dic/code?code=TRUCK_TYPE').then(data=>{
          if (data.code === '200') {
            this.base.truckTypeOptions = data.data;
          } 
        })
      },  
      //获取车长
      conductorInterfacee() {
        api.get('/system/dic/code?code=TRUCK_LENGTH').then(data=>{
          if (data.code === '200') {
            this.base.conductorOptions = data.data;
          } 
        })
      },  
      /*****************共用的方法*********************/
      /**
     * 标记管理
     */
      managementMarkFun(){
        this.managementMark.visiable=true
      },
      async managementMarkListCreated(){
        const { code, message,data } =await api.get('/mark/list')
        if(code == "200"){
          var signData=[]  
          data.forEach(val => {
            if(val.colorValue){
              signData.push(val);
            }
          });
          this.managementMark.managementMarkList=signData
        }
      },
      //标记
      async mark(id, row, type) {

        let d = {id:id, dataId:row.id, dataType:type}
        const { code, message, data } = await api.post("/mark/assign", d);
        if (code == "200") {
          this.querySpecialList()
          this.$message({type: "success",message: "操作标记成功!"});
        }
      },
      /**************************************/


    // ------------------- 列表  状态格式化  formatter ------------------
    /**
     * 检测是否有指定的权限
     * @param {*} code 权限代码
     */
    checkHasPermission(code){
      let permissionDataString = sessionStorage.getItem("permissionData")
      if (permissionDataString) {
        let permissionDataList = JSON.parse(permissionDataString)        
        if (permissionDataList) {
          let has = permissionDataList.find((n) => (n === code))
          return has !== undefined
        }
      } else {
        return false
      }
    }
  }
}