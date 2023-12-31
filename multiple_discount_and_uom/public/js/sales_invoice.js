frappe.ui.form.on("Sales Invoice Item", {
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
    discount_1_:function(frm,cdt,cdn){
        var child=locals[cdt][cdn];
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        if(child.discount_1_>0){
            calculate_discount_amount1(child,grid_row)
           
            calculate_discount_2(child,grid_row)
                //total discount amount
            update_total_discount_amount(child,grid_row)

            if(child.amount_after_discount_1>0){
                child.rate=child.amount_after_discount_1
                grid_row.refresh_field("rate");
            }
            else{
                child.rate=child.price_list_rate
                grid_row.refresh_field("rate");
            }

            child.amount=child.rate*child.qty
            grid_row.refresh_field("amount");  
        }
        },
    discount_2:function(frm,cdt,cdn){
        var child=locals[cdt][cdn];
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        if(child.discount_2>0){
            calculate_discount_2(child,grid_row)
           
            //total discount amount
            update_total_discount_amount(child,grid_row)
            
            if(child.amount_after_discount_2>0){
                child.rate=child.amount_after_discount_2
                grid_row.refresh_field("rate");
            }
            else{
                child.rate=child.amount_after_discount_1
                grid_row.refresh_field("rate");
            }

            child.amount=child.rate*child.qty
            grid_row.refresh_field("amount");  
        }
    },
    price_list_rate:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        child.discount_1_=child.discount_percentage 
        grid_row.refresh_field("discount_1_");
            if(child.discount_1_>0){
                calculate_discount_amount1(child,grid_row)
            }
            else{
                child.amount_after_discount_1= child.price_list_rate
                    grid_row.refresh_field("amount_after_discount_1");
                    child.rate=child.amount_after_discount_1
                    grid_row.refresh_field("rate");
            }
            if(child.discount_2>0){
                calculate_discount_2(child,grid_row)
            }
            else{
                    child.amount_after_discount_2= child.amount_after_discount_1
                    grid_row.refresh_field("amount_after_discount_2");
                    child.rate=child.amount_after_discount_1
                    grid_row.refresh_field("rate");
            }
                child.amount=child.rate*child.qty
                grid_row.refresh_field("amount");      
            
    },
    alternate_uom:function(frm,cdt,cdn){
        set_atlternate_qty(frm,cdt,cdn)
    },
    alternate_qty:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        if(child.alternate_qty && child.alternate_uom_conversion_factor){
            child.qty = child.alternate_qty *child.alternate_uom_conversion_factor
            child.amount = child.qty * child.rate
            grid_row.refresh_field("qty");
            grid_row.refresh_field("amount")
        }
    },
    qty:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        var grid_row = cur_frm.fields_dict['items'].grid.grid_rows_by_docname[child.name];
        update_total_discount_amount(child,grid_row)
        frm.refresh_fields("items")
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
        if(child.amount_after_discount_2>0 && child.discount_2>0){
            update_total_discount_amount(child,grid_row)
            set_discount_rate(frm,child,grid_row)
        }
    }
})

function set_discount_rate(frm,child,grid_row){
    frappe.call({
        method: "set_rate",
        doc: frm.doc,
        callback: function(data) {
            refresh_field("items");
        }
    });
}

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

function update_total_discount_amount(child,grid_row){
    child.discount_amount=child.custom_discount_amount_1+child.custom_discount_amount_2
    grid_row.refresh_field("discount_amount");

    child.discount_percentage=((child.price_list_rate-child.amount_after_discount_2)/child.price_list_rate) * 100
    grid_row.refresh_field("discount_percentage");
}

function calculate_discount_2(child,grid_row){
     //to calculate rate after discount2
     child.amount_after_discount_2=(child.amount_after_discount_1-((child.amount_after_discount_1*(child.discount_2/100))))
     grid_row.refresh_field("amount_after_discount_2");

     //calculate discount amount2
     child.custom_discount_amount_2=child.amount_after_discount_1-child.amount_after_discount_2
     grid_row.refresh_field("custom_discount_amount_2");
}

function calculate_discount_amount1(child,grid_row){
    //calculate Rate after discount1 
    child.amount_after_discount_1=(child.price_list_rate-((child.price_list_rate*(child.discount_1_/100))))
    grid_row.refresh_field("amount_after_discount_1");
   //caluclate discount amount1
     child.custom_discount_amount_1=child.price_list_rate-child.amount_after_discount_1
     grid_row.refresh_field("custom_discount_amount_1");
}