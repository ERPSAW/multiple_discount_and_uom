import frappe
from erpnext.selling.doctype.sales_order.sales_order import SalesOrder

class CustomSalesOrder(SalesOrder):
    @frappe.whitelist()
    def set_rate(self):
        if self.items:
            for each in self.items:
                each.rate=each.amount_after_discount_2
                each.amount = each.qty*each.rate