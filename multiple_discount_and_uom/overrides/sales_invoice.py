import frappe

@frappe.whitelist()
def get_uom_item_list(item_code):
    secondary_uom_list=[]
    item_doc = frappe.get_doc('Item', item_code)
    for uom in item_doc.uoms:
        secondary_uom_list.append(uom.uom)
    return secondary_uom_list

@frappe.whitelist()
def get_conversion_factor(item_code,uom):
    conversion_factor=frappe.db.get_value('UOM Conversion Detail',{'parent':item_code,'uom':uom}, 'conversion_factor')
    return conversion_factor