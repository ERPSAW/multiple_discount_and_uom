frappe.ui.form.on("Sales Order Item", {
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
                        child.alternate_qty = r.message*child.qty
                        grid_row.refresh_field("alternate_uom_conversion_factor");
                        grid_row.refresh_field("alternate_qty");

                    }
                }
            })
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
                        child.alternate_qty = r.message*child.qty
                    }
                    else{
                        child.alternate_qty = r.message
                    }
                    grid_row.refresh_field("alternate_uom_conversion_factor");
                    grid_row.refresh_field("alternate_qty");

                }
            }
        })
    }
}

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
        child.margin_type="Percentage"
        
        grid_row.refresh_field("discount_percentage")
        grid_row.refresh_field("discount_amount")
        grid_row.refresh_field("rate")
        grid_row.refresh_field("margin_type")
    }
}