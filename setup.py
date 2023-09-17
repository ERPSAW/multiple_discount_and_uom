from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in multiple_discount_and_uom/__init__.py
from multiple_discount_and_uom import __version__ as version

setup(
	name="multiple_discount_and_uom",
	version=version,
	description="Multiple Discount And Uom",
	author="Ishwarya M",
	author_email="ishwaryamohan",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
