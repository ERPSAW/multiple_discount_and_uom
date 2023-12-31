from . import __version__ as app_version

app_name = "multiple_discount_and_uom"
app_title = "Multiple Discount And Uom"
app_publisher = "Ishwarya M"
app_description = "Multiple Discount And Uom"
app_email = "ishwaryamohan"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/multiple_discount_and_uom/css/multiple_discount_and_uom.css"
# app_include_js = "/assets/multiple_discount_and_uom/js/multiple_discount_and_uom.js"

# include js, css files in header of web template
# web_include_css = "/assets/multiple_discount_and_uom/css/multiple_discount_and_uom.css"
# web_include_js = "/assets/multiple_discount_and_uom/js/multiple_discount_and_uom.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "multiple_discount_and_uom/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {"Sales Invoice" : "public/js/sales_invoice.js",
              "Sales Order" : "public/js/sales_order.js",
              "Delivery Note" : "public/js/delivery_note.js",
              "Item":"public/js/item.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------
fixtures = ['Translation',
    {
        "dt": 'Custom Field',
        "filters": [
            ["module", "=", "Multiple Discount And Uom" ],
        ]
    },
    {
        "dt": 'Property Setter',
        "filters": [
            ["module", "=", "Multiple Discount And Uom" ],
        ]
    }
]

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#	"methods": "multiple_discount_and_uom.utils.jinja_methods",
#	"filters": "multiple_discount_and_uom.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "multiple_discount_and_uom.install.before_install"
# after_install = "multiple_discount_and_uom.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "multiple_discount_and_uom.uninstall.before_uninstall"
# after_uninstall = "multiple_discount_and_uom.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "multiple_discount_and_uom.utils.before_app_install"
# after_app_install = "multiple_discount_and_uom.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "multiple_discount_and_uom.utils.before_app_uninstall"
# after_app_uninstall = "multiple_discount_and_uom.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "multiple_discount_and_uom.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

override_doctype_class = {
	"Sales Order": "multiple_discount_and_uom.overrides.sales_order.CustomSalesOrder",
    "Sales Invoice": "multiple_discount_and_uom.overrides.sales_invoice.CustomSalesInvoice",
    "Delivery Note": "multiple_discount_and_uom.overrides.delivery_note.CustomDeliveryNote"
}

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	"Sales Order": {
		"validate": "multiple_discount_and_uom.overrides.sales_invoice.set_discount",
	},
    "Sales Invoice": {
		"validate": "multiple_discount_and_uom.overrides.sales_invoice.set_discount",
	},
    "Delivery Note": {
		"validate": "multiple_discount_and_uom.overrides.sales_invoice.set_discount",
	}
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
#	"all": [
#		"multiple_discount_and_uom.tasks.all"
#	],
#	"daily": [
#		"multiple_discount_and_uom.tasks.daily"
#	],
#	"hourly": [
#		"multiple_discount_and_uom.tasks.hourly"
#	],
#	"weekly": [
#		"multiple_discount_and_uom.tasks.weekly"
#	],
#	"monthly": [
#		"multiple_discount_and_uom.tasks.monthly"
#	],
# }

# Testing
# -------

# before_tests = "multiple_discount_and_uom.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "multiple_discount_and_uom.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "multiple_discount_and_uom.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["multiple_discount_and_uom.utils.before_request"]
# after_request = ["multiple_discount_and_uom.utils.after_request"]

# Job Events
# ----------
# before_job = ["multiple_discount_and_uom.utils.before_job"]
# after_job = ["multiple_discount_and_uom.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
#	{
#		"doctype": "{doctype_1}",
#		"filter_by": "{filter_by}",
#		"redact_fields": ["{field_1}", "{field_2}"],
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_2}",
#		"filter_by": "{filter_by}",
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_3}",
#		"strict": False,
#	},
#	{
#		"doctype": "{doctype_4}"
#	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"multiple_discount_and_uom.auth.validate"
# ]
