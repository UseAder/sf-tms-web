<template>
    <div>
        <div class="J-main-body">
            <div class="homeMain-header"> 
                <div class="J-main-search" >
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                        <el-form-item label="承运方" prop="transferName">
                            <el-input v-model="searchForm.transferName" placeholder="承运方"></el-input>
                        </el-form-item>
                        <el-form-item class="J-main-search-button">
                            <el-button type="primary" v-if="checkHasPermission('receipt:read')" @click='handlesearch'>查询</el-button>
                            <el-button type="warning" v-if="checkHasPermission('receipt:read')" @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="J-elTable" id="J-elTable" >
                <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
                    <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                    <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                        <template slot-scope="scope">
                        <div class="table-menu">
                            <el-menu  :collapse="true" >
                            <el-submenu index="1" >
                                <template slot="title" >
                                <i class="el-icon-edit-outline"></i>
                                </template>
                                <el-menu-item-group> 
                                  
                                 <el-menu-item index="1-2" @click="newFun(scope.row)">回收</el-menu-item>  
                                 <el-menu-item index="1-3" @click="exportFile(scope.row)">导出</el-menu-item>  

                                </el-menu-item-group>
                            </el-submenu> 
                            </el-menu>
                        </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="transferName" label="承运方"  align='center'></el-table-column>
                    <el-table-column prop="waitReceiptNum" label="待收份数"  align='center'></el-table-column>
                    <el-table-column prop="waybillNum" label="运单数"   align='center'></el-table-column>
                    <el-table-column prop="goodsNum" label="货物件数"  align='center'></el-table-column>
                </el-table>
                <div class="main-table-page">
                <div class="main-table-page-left"> 
                
                </div>
                    <el-pagination background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="page.pageSizes"
                        :page-size="page.pageSize"
                        :current-page="searchForm.pageNo"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total">
                </el-pagination>
                </div>
            </div>
        </div>
        <components @closeDialog="reloadData"  :dialog.sync='isUpdate.isDialog' :isContent.sync='isUpdate.isContent' :updateRow.sync='isUpdate.updateRow' v-if='isUpdate.isDialog'></components>
    </div>
</template>
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import isDialog from './recDialog.vue'
export default {
    mixins: [Base,List],
    components: { 
        'components':isDialog
    },
    data() {
        return {
            searchForm: { // 查询   
                transferName:'',
                pageSize: 10,
                pageNo: 1,
                transferId:''
            },
            tableData: [], // 表格
        };
    },
    methods: {
        //重新加载数据列表数据
        reloadData: function (flag) {        
            if (flag) {
                this.querySpecialList()
            }
        },

        async querySpecialList() {//获取页面初始数据    
          const { code, message,data} =await api.post('/receipt/wait/list', this.searchForm)
          if(code==="200"){
            this.tableData = data.records;
            this.page.total = data.total;  
          }
        },

        async exportFile(row) {   
            this.searchForm.transferId= row.transferId
          const { code, message,data} =await api.post('/receipt/wait/detail/export/list', this.searchForm)
          if(code==="200"){
            this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
          }
        },

         
    }
};
</script>
