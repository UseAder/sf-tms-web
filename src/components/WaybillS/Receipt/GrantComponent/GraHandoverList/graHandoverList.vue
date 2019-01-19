<template>
    <div>
        <div class="J-main-body">
            <div class="homeMain-header"> 
                <div class="J-main-search" >
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                        <el-form-item label="清单日期" prop="createTime">
                            <el-date-picker
                                v-model="searchForm.createTime"
                                type="datetimerange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="发货单位" prop="consignorName">
                            <el-input v-model="searchForm.consignorName" placeholder="发货单位"></el-input>
                        </el-form-item>
                        <el-form-item class="J-main-search-button">
                            <el-button type="primary"  v-if="checkHasPermission('send:read')" @click='handlesearch'>查询</el-button>
                            <el-button type="warning"  v-if="checkHasPermission('send:read')" @click="resetForm('searchForm')">重置</el-button>
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
                                    <el-menu-item index="1-2" v-if="checkHasPermission('send:read')" @click="newFun(scope.row)">回单详情</el-menu-item>  
                                    <el-menu-item index="1-3" v-if="checkHasPermission('send:delete')" @click="deleteConfirm(scope.row)">删除</el-menu-item>  
                                    <el-menu-item index="1-4"  v-if="checkHasPermission('receipt:read')" @click="exportFile(scope.row)">导出</el-menu-item>  
                                </el-menu-item-group>
                            </el-submenu> 
                            </el-menu>
                        </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="handTime" label="清单日期"  width="170" align='center'></el-table-column>
                    <el-table-column prop="targetName" label="发货方"  min-width="110" align='center'></el-table-column>
                    <el-table-column prop="waybillNum" label="运单数"  min-width="100" align='center'></el-table-column>
                    <el-table-column prop="receiptNum" label="回单份数"   min-width="100" align='center'></el-table-column>
                    <el-table-column prop="memo" label="备注说明"  min-width="200" align='center'></el-table-column>
                    <el-table-column prop="employeeName" label="创建人"  min-width="110" align='center'></el-table-column>
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
        <components :dialog.sync='isUpdate.isDialog' :isContent.sync='isUpdate.isContent' :updateRow.sync='isUpdate.updateRow' v-if="isUpdate.isDialog"></components>
    </div>
</template>
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import isDialog from './graMxDialog.vue'

export default {
    mixins: [Base,List],
    components: { 
        'components':isDialog
    },
    data() {
        return {
            searchForm: { // 查询   
                createTime:[],
                startHandTime:'',
                endHandTime:'',
                consignorName:'',
                pageSize: 10,
                pageNo: 1
            },
            tableData: [], // 表格
        };
    },
    watch:{
        "searchForm.createTime": function (val, oldval) {
            if (val !== null) {
                this.searchForm.startHandTime = val[0];
                this.searchForm.endHandTime = val[1];
            }else{
                this.searchForm.startHandTime = null;
                this.searchForm.endHandTime = null;
            }
        },
    },
    methods: {
        deleteConfirm(row){
            this.$confirm('此操作将永久删除该交接清单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center:true,
            type: 'warning'
            }).then(async () => {
                const { code, message,data } =await api.post('/receipt/delete/receipt/back/pc',row.id)
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
            }).catch(() => {
                
            });
        },
        async querySpecialList() {//获取页面初始数据    
          const { code, message,data } =await api.post('/receipt/receipt/back/pc', this.searchForm)
          if(code==="200"){
            this.tableData = data.records;
            this.page.total = data.total;  
          }
        },
          async exportFile(row){
            const { code, message,data } =await api.get('/receipt/pc/export/detail?pcId='+row.id)
            if(code==="200"){
                   this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
            }
        }
    }
};
</script>
