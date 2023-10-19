
__version__ = '0.0.1'


import erpnext.controllers.accounts_controller
import multiple_discount_and_uom.overrides.sales_invoice as _custom

erpnext.controllers.accounts_controller.AccountsController.apply_pricing_rule_on_items = _custom.apply_pricing_rule_on_items



