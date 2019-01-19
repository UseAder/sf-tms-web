# 货速运-三方物流管理系统

> daikaijie

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
1px solid #ebeef5
# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

CompanyS__企业信息  
    企业信息 员工管理  权限管理  系统设置
    Company Employee Authority System 
DispatchS__调度管理
    调度运输 短驳管理
    Dispatch Short  
ExamineS__审核管理
    运单变更审核 调度变更审核 财务对账审核 客户开票审核 审核流程定义
     Waybill     Scheduling   Financial   Customer  Definition

FinanceS__财务管理
      业务对账  费用核销  资金汇总 开票管理  油卡管理
        Recon     Cost     Sum    Ticket   Oilcard
          业务对账 ——Recon
            客户运费对账 专线运费对账 整车运费对账 短驳运费对账 业务回扣对账 调度其他成本付款
            Customer      Line        Vehicle      Short      Business    Dispatch
            费用核销
          资金汇总 ——Sum
            业务总表 资金流水
             Table   Flow

InformationS__信息管理   
    专线管理 车辆管理 客户管理 价格管理
    Special Vehicle Customer Price 
PriceS__价格管理  
Statis__统计分析
WaybillS__运单管理
    新增运单  运单管理   异常管理  回单管理
    Invoice  MagList   Abnormal  Return 

https://blog.csdn.net/zgpeterliu/article/details/80597330
https://segmentfault.com/a/1190000009506097
https://panjiachen.github.io/vue-element-admin/#/dashboard



addTab 菜单栏增加tabs标签完成

removeTab 菜单栏删除tabs标签完成
SendGoods/Exception
.then(() => {          // 点击确认
          this.savingFlag=false
          this.InformationsOpinionList.Special.specialOpinion=false
          }, () => { // 点击取消 -----
        })