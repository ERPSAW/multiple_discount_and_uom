import frappe

@frappe.whitelist()
def get_uom_item_list(item_code):
    secondary_uom_list=None
    item_doc = frappe.get_doc('Item', item_code)
    for uom in item_doc.uoms:
        if uom.secondary_uom==1:
            secondary_uom_list=uom.uom
    return secondary_uom_list

@frappe.whitelist()
def get_conversion_factor(item_code,uom):
    conversion_factor=frappe.db.get_value('UOM Conversion Detail',{'parent':item_code,'uom':uom}, 'conversion_factor')
    return conversion_factor