import frappe
from erpnext.stock.doctype.delivery_note.delivery_note import DeliveryNote

class CustomDeliveryNote(DeliveryNote):
    @frappe.whitelist()
    def set_rate(self):
        if self.items:
            for each in self.items:
                each.rate=each.amount_after_discount_2
                each.amount = each.qty*each.rate