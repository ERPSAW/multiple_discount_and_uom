import frappe
from frappe.utils import flt
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

def set_discount(doc,method=None):
    if doc.items:
        for each in doc.items:
            each.rate=each.amount_after_discount_2
            each.amount=each.amount_after_discount_2*each.qty
            each.discount_percentage = ((flt(each.price_list_rate)-flt(each.amount_after_discount_2))/each.price_list_rate) * 100
            each.discount_amount=each.custom_discount_amount_1+each.custom_discount_amount_2   
            each.base_rate=each.rate
            each.net_rate=each.rate
            each.base_net_rate=each.rate
            each.base_amount=each.amount
            each.net_amount=each.amount
            each.base_net_amount=each.amount


def apply_pricing_rule_on_items(self, item, pricing_rule_args):
    set_discount(doc=self,method=None)
    