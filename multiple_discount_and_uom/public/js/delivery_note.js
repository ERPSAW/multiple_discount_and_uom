frappe.ui.form.on("Delivery Note Item", {
    discount_1_:function(frm,cdt,cdn){
        var child=locals[cdt][cdn];
        if(child.discount_1_){
            set_discount_amount(frm,cdt,cdn,child)
        }
    },
    discount_2:function(frm,cdt,cdn){
        var child=locals[cdt][cdn];
        if(child.discount_2){
            set_discount_amount(frm,cdt,cdn,child)
        }
    },
    item_code:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        if(child.item_code){
            frappe.call({
                method:"multiple_discount_and_uom.overrides.sales_invoice.get_uom_item_list",
                args:{
                    item_code:child.item_code
                },
                callback:function(r){
                    if(r.message){
                        var uom_list=[];
                        for(var i=0; i<r.message.length; i++){
                            uom_list.push(r.message[i])
                        }
                        uom_list.push('')

                        frm.set_query("alternate_uom", "items", function(doc, cdt, cdn) {
                            return {
                                filters: {
                                    name: ['in',uom_list],
                                }
                            };
                        });
                    }
                }
            })
        }
    },
    alternate_uom:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        if(child.alternate_uom){
            frappe.call({
                method:"multiple_discount_and_uom.overrides.sales_invoice.get_conversion_factor",
                args:{
                    item_code:child.item_code,
                    uom:child.alternate_uom
                },
                callback:function(r){
                    if(r.message){
                        child.alternate_uom_conversion_factor=r.message
                        // child.alternate_qty = r.message*child.qty
                        grid_row.refresh_field("alternate_uom_conversion_factor");
                        // grid_row.refresh_field("alternate_qty");

                    }
                }
            })
        }
    },
    alternate_qty:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        if(child.alternate_qty && child.alternate_uom_conversion_factor){
            child.qty = child.alternate_qty *child.alternate_uom_conversion_factor
            grid_row.refresh_field("qty");
        }
    }

})

function set_discount_amount(frm,cdt,cdn,child){
    var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
    var amount_after_discount_1=0
    var amount_after_discount_2=0
    var discount_amount =0
    var rate =0 
    var discount_per=0
    if(child.discount_1_){
        amount_after_discount_1=child.rate-((child.rate*child.discount_1_)/100)
        child.amount_after_discount_1=amount_after_discount_1
        grid_row.refresh_field("amount_after_discount_1");
    }
    if(child.discount_2){
        amount_after_discount_2=amount_after_discount_1-((amount_after_discount_1*child.discount_2)/100)
        child.amount_after_discount_2=amount_after_discount_2
        grid_row.refresh_field("amount_after_discount_2");
        
    }

    if(amount_after_discount_2){
        discount_amount=child.rate-child.amount_after_discount_2
        child.discount_amount=discount_amount
        discount_per = (discount_amount/child.rate)*100
        child.discount_percentage = discount_per
        rate= child.rate-discount_amount
        child.rate=rate
        
        grid_row.refresh_field("discount_percentage")
        grid_row.refresh_field("discount_amount")
        grid_row.refresh_field("rate")
    }
}