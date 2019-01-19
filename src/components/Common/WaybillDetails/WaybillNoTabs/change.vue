<template>
 <div class="J-detail"> 
        <el-row>
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                运单信息变更
            </div>
            <el-table
    :data="changeW"
    border 
    style="width: 100%">
    <el-table-column
      prop="createTime"
      label="改单时间"
      width="100"  align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="employeeName"
      label="操作人"
      width="100" align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="status"
      label="审核状态" 
      width="100" align='center' header-align="center">
      <template slot-scope="scope">
        <div v-html="statusBackground(auditStatus(scope.row.status))" class="J-statusBackground"></div>     
      </template>
    </el-table-column>
    <el-table-column
      prop="reason"
      label="修改原因"
      min-width="200"  align='center' header-align="center">
    </el-table-column>
    <el-table-column min-width="250"
      label="改单内容"  align='center' >
      <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <div class="change-tabel">
              <div class="change-table-left">
                <div class="change-tabel-tr">变更内容</div>
                <div class="change-tabel-th" v-for="site in scope.row.changeList" :key="site.index">{{ site.contentDes}}</div>              
              </div>
              <div class="change-table-left">
                <div class="change-tabel-tr">改单前</div>
                <div class="change-tabel-th" v-for="site in scope.row.changeList" :key="site.index">{{ site.beforeValueDes}}</div>              
              </div>
              <div class="change-table-right">
                <div class="change-tabel-tr">改单后</div>
                <div class="change-tabel-th" v-for="site in scope.row.changeList" :key="site.index">{{ site.afterValueDes}}</div>              
              </div>
            </div>
          </div>
      </template>
    </el-table-column>
  </el-table>    
</el-row> 
    
        <el-row>
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                调度信息变更
            </div>
             <el-table
    :data="changeD"
    border 
    style="width: 100%">
    <el-table-column
      prop="createTime"
      label="改单时间"
      width="100"  align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="employeeName"
      label="操作人"
      width="100" align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="status"
      label="审核状态"
      width="100" align='center' header-align="center">
      <template slot-scope="scope">
        <div v-html="statusBackground(auditStatus(scope.row.status))" class="J-statusBackground"></div>     
      </template>
    </el-table-column>
    <el-table-column
      prop="reason"
      label="修改原因"
      min-width="200"  align='center' header-align="center">
    </el-table-column>
    
     <el-table-column min-width="250"
      label="改单内容"  align='center'>
      <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <div class="change-tabel">
              <div class="change-table-right">
                <div class="change-tabel-tr">变更内容</div>
                <div class="change-tabel-th" v-for="site in scope.row.changeList" :key="site.index">{{ site.contentDes}}</div>              
              </div>
              <div class="change-table-left">
                <div class="change-tabel-tr">改单前</div>
                <div class="change-tabel-th" v-for="site in scope.row.changeList" :key="site.index">{{ site.beforeValueDes}}</div>              
              </div>
              <div class="change-table-right">
                <div class="change-tabel-tr">改单后</div>
                <div class="change-tabel-th" v-for="site in scope.row.changeList" :key="site.index">{{ site.afterValueDes}}</div>              
              </div>
            </div>
          </div>
      </template>
    </el-table-column>
  </el-table>      
        </el-row> 
        
    </div>
</template>
<script>
import api from '@/utils/api.js'
import Base from "@/utils/base.js"

export default {
  mixins: [Base],
  props: ["waybillId"],
  data() {
    return {
      changeW: [],
      changeD: [],
    }
  },
  async created() {
    const  { code, message,data} =await api.get('/waybill/dd/change?waybillId=' + this.waybillId+'&dataType=1')
    if(code==="200"){this.changeW = data;}
    this.changeDFun()    
  },
  methods:{
    async changeDFun(){
      const  { code, message,data} =await api.get('/waybill/dd/change?waybillId=' + this.waybillId+'&dataType=2')
      if(code==="200"){this.changeD = data;}
    }
  }
}
</script>
<style>
.change-tabel{
     display: flex;line-height: 45px;
    min-width: 300px;
    text-align: center;border:1px solid #ebeef5
}
.change-tabel-tr{
  background: #f5f7fa
}
.change-table-left,.change-table-right{
  width: 50%;
}
.change-table-left{
 border-right:1px solid #ebeef5
}

.change-tabel-th{
  border-top:1px solid #ebeef5;
  height: 45px;
}

</style>
