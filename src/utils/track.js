export default {
    data() {
        return {
            //控制运单跟踪模块div缩放
            trackWaybillVisible:false,
            tableDataTrackId:''
        }
    },
    watch:{
        //table列表数据存在的时候默认选择第一个
        "tableData": function (){
            if (this.tableData!=''&&this.tableData) {
                let tableDataTrackIdStorage = this.tableData.find(n => n.id === this.tableDataTrackId);  
                if (tableDataTrackIdStorage) {
                    this.$refs.defaultChoiceData.setCurrentRow(tableDataTrackIdStorage);      
                }else{
                    this.$refs.defaultChoiceData.setCurrentRow(this.tableData[0])
                    this.tableDataTrackId=''
                }
            }      
        }
    },
    methods: {   
        //控制运单跟踪模块div缩放
        showTrackWaybill(){
            this.trackWaybillVisible=!this.trackWaybillVisible
        },
    }
}

 
 