import Vue from 'vue'
import Router from 'vue-router'

import store from '@/vuex/store'
import * as types from '@/vuex/types'

import Login from '@/components/login'
import Main from '@/components/main'
import Home from '@/components/home'
import AppHome from '@/components/appHome'
import Datak from '@/components/datak'


import BackGoods from '@/components/BackGoods/waybillBackGoods'

import SendGoodsTrackAnomalyTrack from '@/components/ExceptionManager/SendGoodsException/sendGoodsExceptionList'
import BackGoodsTrackAnomalyTrack from '@/components/ExceptionManager/BackGoodsException/backGoodsExceptionList'

import SendGoodsTrackSendGoodsList from '@/components/TrackingS/SendGoodsTrack/sendGoodsList'
import BackGoodsTrackBackGoodsTrackList from '@/components/TrackingS/BackGoodsTrack/backGoodsTrackList'


import WaybillSAddUpdate from '@/components/WaybillS/addUpdate'
import WaybillSMagListGl from '@/components/WaybillS/Waybill/magListGl'
import WaysReceiptRecovery from '@/components/WaybillS/Receipt/recovery'
import WaysReceiptGrant from '@/components/WaybillS/Receipt/grant'
import WaysBookingBooking from '@/components/WaybillS/Booking/booking'


import DispatchSdispatch from '@/components/DispatchS/dispatch'
import DispatchSshort from '@/components/DispatchS/short'

import ExamineSwaybill from '@/components/ExamineS/Waybill/waybill'
import ExamineSscheduling from '@/components/ExamineS/Scheduling/scheduling'
import ExamineSfinancial from '@/components/ExamineS/Financial/financial'
import ExamineScustomer from '@/components/ExamineS/Customer/customer'
import ExamineSdefinition from '@/components/ExamineS/Definition'

import FinanceSreconCustomer from '@/components/FinanceS/Recon/customer'
import FinanceSreconLine from '@/components/FinanceS/Recon/line'
import FinanceSreconVehicle from '@/components/FinanceS/Recon/vehicle'
import FinanceSreconShort from '@/components/FinanceS/Recon/short'
import FinanceSreconBusiness from '@/components/FinanceS/Recon/business'
import FinanceSreconOther from '@/components/FinanceS/Recon/other'
import FinanceScost from '@/components/FinanceS/cost'
import FinanceSsumTable from '@/components/FinanceS/Sum/table'
import FinanceSsumFlow from '@/components/FinanceS/Sum/flow'
import FinanceSticket from '@/components/FinanceS/ticket'
import FinanceSoilcard from '@/components/FinanceS/oilcard'



import InformationSStoreDsStore from '@/components/InformationS/Store/dsStore'
import InformationSStorePlatfrom from '@/components/InformationS/Store/platform'
import InformationSvehicle from '@/components/InformationS/vehicle'
import InformationScustomer from '@/components/InformationS/customer'
import InformationSprice from '@/components/InformationS/price'
import InformationSspecial from '@/components/InformationS/special'

import CompanyScompany from '@/components/CompanyS/company'
import CompanySemployee from '@/components/CompanyS/employee'
import CompanySsystem from '@/components/CompanyS/system'




Vue.use(Router)

const routes = [
    {path:'/login',component:Login, meta:{requireAuth:false,title:'登录'}}, 

    {path:'/', component:Main, meta:{requireAuth:true,title:'TMS中心'},
    children:[
        {path:'/Home', component:Home, meta:{requireAuth:true,title:'首页'}},      
        {path:'/AppHome', component:AppHome, meta:{requireAuth:true,title:'应用中心'}},


        {path:'/BackGoods/waybillBackGoods',component:BackGoods,meta:{requireAuth:true,titlea:'退货发货'}},    
        
        {path:'/SendGoods/Exception',name:'SendGoodsTrackAnomalyTrack',component:SendGoodsTrackAnomalyTrack,meta:{requireAuth:true,titlea:'发货异常'}},  
        {path:'/BackGoods/Exception',component:BackGoodsTrackAnomalyTrack,meta:{requireAuth:true,titlea:'退货异常'}},    
  
        {path:'/Track/sendGoodsTrack',component:SendGoodsTrackSendGoodsList,meta:{requireAuth:true,titlea:'发货跟踪'}},    
        {path:'/Track/backGoodsTrack',component:BackGoodsTrackBackGoodsTrackList,meta:{requireAuth:true,titlea:'退货跟踪'}},    

        {path:'/Ways/addUpdate',component:WaybillSAddUpdate,meta:{requireAuth:true,titlea:'新增运单' }},    
        {path:'/Ways/magList',name:'WaybillSMagListGl',component:WaybillSMagListGl,meta:{requireAuth:true,titlea:'运单管理' }},    
        {path:'/Ways/Receipt/recovery',component:WaysReceiptRecovery,meta:{requireAuth:true,titlea:'回单回收' }},    
        {path:'/Ways/Receipt/grant',component:WaysReceiptGrant,meta:{requireAuth:true,titlea:'客户发放' }},  
        {path:'/Ways/Booking/booking',component:WaysBookingBooking,meta:{requireAuth:true,titlea:'进仓预约' }},    
  


        {path:'/Dis/dispatch',component:DispatchSdispatch,meta:{requireAuth:true,titlea:'调度运输' }}, 
        {path:'/Dis/short',component:DispatchSshort,meta:{requireAuth:true,titlea:'短驳管理' }}, 

        {path:'/Exam/waybill',component:ExamineSwaybill,meta:{requireAuth:true,titlea:'运单变更审核' }},
        {path:'/Exam/scheduling',component:ExamineSscheduling,meta:{requireAuth:true,titlea:'调度变更审核' }},
        {path:'/Exam/financial',name:'aaa',component:ExamineSfinancial,meta:{requireAuth:true,titlea:'财务对账审核' }},
        {path:'/Exam/customer',component:ExamineScustomer,meta:{requireAuth:true,titlea:'客户开票审核' }},
        {path:'/Exam/definition',component:ExamineSdefinition,meta:{requireAuth:true,titlea:'审核流程定义' }},

        {path:'/Finan/Recon/customer',component:FinanceSreconCustomer,meta:{requireAuth:true,titlea:'客户运费结算' }},
        {path:'/Finan/Recon/line',component:FinanceSreconLine,meta:{requireAuth:true,titlea:'专线运费结算' }},
        {path:'/Finan/Recon/vehicle',component:FinanceSreconVehicle,meta:{requireAuth:true,titlea:'整车运费结算' }},
        {path:'/Finan/Recon/short',component:FinanceSreconShort,meta:{requireAuth:true,titlea:'短驳运费结算' }},
        {path:'/Finan/Recon/business',component:FinanceSreconBusiness,meta:{requireAuth:true,titlea:'业务回扣结算' }},
        {path:'/Finan/Recon/other',component:FinanceSreconOther,meta:{requireAuth:true,titlea:'其他异费结算' }},
        {path:'/Finan/cost',component:FinanceScost,meta:{requireAuth:true,titlea:'费用核销' }},
        {path:'/Finan/Sum/table',component:FinanceSsumTable,meta:{requireAuth:true,titlea:'业务总表' }},
        {path:'/Finan/Sum/flow',component:FinanceSsumFlow,meta:{requireAuth:true,titlea:'资金流水' }},
        {path:'/Finan/ticket',component:FinanceSticket,meta:{requireAuth:true,titlea:'开票管理' }},
        {path:'/Finan/oilcard',component:FinanceSoilcard,meta:{requireAuth:true,titlea:'油卡管理' }},



        {path:'/Infor/Store/dsStore',component:InformationSStoreDsStore,meta:{requireAuth:true,titlea:'电商仓库管理' }},
        {path:'/Infor/Store/platfrom',component:InformationSStorePlatfrom,meta:{requireAuth:true,titlea:'电商平台管理' }},
        {path:'/Infor/vehicle',component:InformationSvehicle,meta:{requireAuth:true,titlea:'车辆管理' }},
        {path:'/Infor/customer',component:InformationScustomer,meta:{requireAuth:true,titlea:'客户管理' }},
        {path:'/Infor/price',component:InformationSprice,meta:{requireAuth:true,titlea:'价格管理' }},
        {path:'/Infor/special',component:InformationSspecial,meta:{requireAuth:true,titlea:'专线管理' }},

        {path:'/Com/company',component:CompanyScompany,meta:{requireAuth:true,titlea:'企业信息' }},
        {path:'/Com/employee',component:CompanySemployee,meta:{requireAuth:true,titlea:'员工管理' }},
        {path:'/Com/system',component:CompanySsystem,meta:{requireAuth:true,titlea:'系统设置'}},
        
        
        {path: '/datak', component:Datak, meta:{requireAuth:true,title:'数据看板'}},
        {path:'*',redirect:'/Home'},//路由按顺序从上到下，依次匹配。最后一个*能匹配全部，然后重定向到主页面
    ]}
];

//页面刷新时，重新赋值token
if (sessionStorage.getItem('token')) {
    store.commit(types.COMMAND_REFRESH)
}

const router = new Router({
    mode: 'history',//hash
    routes
});

//router 拦截
router.beforeEach((to, from, next) => {
    //console.group(JSON.stringify(to))
    // if (to.matched.some(r => r.meta.requireAuth)) {
    if (to.meta.requireAuth) {
        if (sessionStorage.getItem('token')) {
            next();
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})

export default router;

 
