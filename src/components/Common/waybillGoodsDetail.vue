 <template>
    <el-dialog :title="dialog.title" :visible.sync="dialog.showDetailDialog" @close="$emit('update:showDetailDialog', false)"
            width="800px"  center  class="Maglist-HairCar J-dialog-vh" append-to-body>  
        <div class="J-detail J-dialog-vh-body"> 
            <el-row class=" J-dialog-vh-content">
                <el-table :max-height="getScreenHeight-jElTableOffsetTop-150>69?getScreenHeight-jElTableOffsetTop-150:'none'"  :data="waybillGoodsDetail" border  class="table-checkboxLabel">
                    <el-table-column fixed type="index" width="50" label="序号" align='center'/> 
                    <el-table-column prop="customerOrderNo" label="客户订单号" width="180"  align='center' header-align="center"/>
                    <el-table-column prop="productName" label="产品名称" width="180"  align='center' header-align="center"/>
                    <el-table-column prop="skuNo" label="编码型号(SKU)" width="180"  align='center' header-align="center"/>
                    <el-table-column prop="num" label="数量" width="180"  align='center' header-align="center"/>
                    <el-table-column prop="csFlag" label="是否初始清单" min-width="110" align='center'>
                        <template slot-scope="scope">
                        {{isBeginListFlag(scope.row.csFlag)}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-row> 
        </div> 
    </el-dialog>
</template>
 
<script>
import List from "@/utils/list.js";
import api from '@/utils/api.js'
import Base from "@/utils/base.js";
export default {
  mixins: [Base,List],
  props: ["showDetailDialog","waybillId"],
  data() {
    return {
      waybillGoodsDetail:[],
      dialog:{
          title:'货物清单',
          showDetailDialog:this.showDetailDialog
      }
    };
  },
  watch: { 
        showDetailDialog () {
            this.dialog.showDetailDialog = this.showDetailDialog
        }, 
    },

  methods:{

        //查看货物清单
     async loadWaybillGoodsDetail(){ 
     const  { code, message,data} =await api.get('/waybill/goods/detail/list?waybillId=' + this.waybillId)
         if(code==="200"){
             if(data){
                  this.waybillGoodsDetail = data;
              }
           }
      }      
  },

  async created() {
     this.loadWaybillGoodsDetail();
  }
};
</script>



 