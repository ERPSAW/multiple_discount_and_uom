frappe.ui.form.on("Item", {
    validate:function(frm,cdt,cdn){
        if(frm.doc.uoms){
            var checked_flag=0
            $.each(frm.doc.uoms, function (idx, value) {
                if(value.secondary_uom==1){
                    checked_flag+=1
                }
            })

            if(checked_flag>1){
                frappe.throw('Cannot set multiple secondary UOM.Please set only one secondary UOM to save')
            }
        }
    }
})