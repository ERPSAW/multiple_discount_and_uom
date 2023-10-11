frappe.ui.form.on("Sales Invoice Item", {
    discount_2:function(frm,cdt,cdn){
        var child=locals[cdt][cdn];
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        if(child.discount_2){
            var amount_after_discount_2=0
            var discount_amount =0
            var rate =0 
            var discount_per=0
            amount_after_discount_2=child.amount_after_discount_1-((child.amount_after_discount_1*child.discount_2)/100)
            child.amount_after_discount_2=amount_after_discount_2
            child.rate=amount_after_discount_2
            grid_row.refresh_field("amount_after_discount_2");
            grid_row.refresh_field("rate");
            
            if(amount_after_discount_2){
                discount_amount=child.price_list_rate-child.amount_after_discount_2
                child.discount_amount=discount_amount
                discount_per = (discount_amount/child.rate)*100
                child.discount_percentage = discount_per
                
                grid_row.refresh_field("discount_percentage")
                grid_row.refresh_field("discount_amount")
            }   
        }
    },
    item_code:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        if(child.item_code){
            frappe.call({
                method:"multiple_discount_and_uom.overrides.sales_invoice.get_uom_item_list",
                args:{
                    item_code:child.item_code
                },
                callback:function(r){
                    if(r.message){
                        if(r.message){
                            child.alternate_uom=r.message
                            grid_row.refresh_field("alternate_uom");
                            set_atlternate_qty(frm,cdt,cdn)
                        }
                    }
                }
            })
        }
    },
    price_list_rate:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        if(child.discount_percentage){
            child.discount_1_=child.discount_percentage 
            grid_row.refresh_field("discount_1_");
            child.amount_after_discount_1=child.price_list_rate-((child.price_list_rate*child.discount_1_)/100)
            grid_row.refresh_field("amount_after_discount_1");
        }
    },
    alternate_uom:function(frm,cdt,cdn){
        set_atlternate_qty(frm,cdt,cdn)
    },
    alternate_qty:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        if(child.alternate_qty && child.alternate_uom_conversion_factor){
            child.qty = child.alternate_qty *child.alternate_uom_conversion_factor
            grid_row.refresh_field("qty");
        }
    },
    qty:function(frm,cdt,cdn){
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
                        child.alternate_qty = child.qty/r.message
                        grid_row.refresh_field("alternate_uom_conversion_factor");
                        grid_row.refresh_field("alternate_qty");

                    }
                }
            })
        }
    },
    rate:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];

        if(child.amount_after_discount_2 && child.discount_2){
            child.discount_2=0
            child.amount_after_discount_2=0
            grid_row.refresh_field("discount_2");
            grid_row.refresh_field("amount_after_discount_2");

            var difference_amount=0
            var difference_amount_2=0
            var discount_percentage=0
            difference_amount= child.rate-child.price_list_rate
            difference_amount_2= (child.rate+child.price_list_rate)/2
            discount_percentage= (difference_amount/difference_amount_2)*100

            child.discount_1_=discount_percentage
            grid_row.refresh_field("discount_1_");
            child.amount_after_discount_1=child.rate
            grid_row.refresh_field("amount_after_discount_1");
        }
    }

})

function set_atlternate_qty(frm,cdt,cdn){
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
                    if(child.qty>0){
                        child.alternate_qty = child.qty/r.message
                    }
                    else{
                        child.alternate_qty = 1/r.message
                    }
                    grid_row.refresh_field("alternate_uom_conversion_factor");
                    grid_row.refresh_field("alternate_qty");

                }
            }
        })
    }
}
