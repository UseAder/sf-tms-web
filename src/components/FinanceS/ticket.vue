<template>
  <div class="MagList" >
    <div class="MagListTablist">
      <el-tabs v-model="ticketCurrentView">
        <el-tab-pane :label="item.title" :name="item.name"  v-for="item in ticketTabMagList" :key="item.index"></el-tab-pane>  
        
      </el-tabs>
    </div>
    <div :is="ticketCurrentView" ></div>
  </div>
</template>

<script>
import Base from "@/utils/base.js";
import customerTicket from './TicketComponent/customerTicket'
import ticketList from './TicketComponent/ticketList'
export default {
  name:'f-ticket',
    mixins: [Base],
  data() {
    return {
      ticketCurrentView: "customerTicket", 
      ticketTabMagList:[
          {title:'客户待开票',name:'customerTicket'},
          {title:'发票列表',name:'ticketList'},
      ]
    }
  },
  components: {    
      customerTicket, 
      ticketList
  },
  methods:{
     querySpecialList(){
       
     }
  }  
}
</script>

