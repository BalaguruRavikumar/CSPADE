from __future__ import unicode_literals
import os
from django.db import models
from django.contrib.sessions.models import Session
from projects.random_primary import RandomPrimaryIdModel


# def validate_txt(value):
# 	pdb.set_trace()
# 	# Probably worth doing this check first anyway
# 	if not value.name.endswith('.txt'):
# 		raise ValidationError('Invalid file type,must be tab delimited text file')
# 	# with open(value.file, 'r') as txtfile:
# 	try:
# 		pdb.set_trace()
# 	# Do whatever checks you want here
# 	# Raise ValidationError if checks fail
# 	except csv.Error:
# 		raise ValidationError('Failed to parse the CSV file')

# # Create your models here.
class Project(RandomPrimaryIdModel):
	#user = models.ForeignKey(User, on_delete=models.CASCADE)
	session = models.ForeignKey(Session,on_delete=models.CASCADE,null=True,blank=True)
	timestamp = models.DateTimeField(auto_now=True,auto_now_add=False)
	#data_file = models.FileField(upload_to='uploads/',validators=[validate_txt])
	data_file = models.FileField(upload_to='uploads/')
	smiles_data = models.TextField(null=True,blank=True)
	d3_data = models.TextField(null=True,blank=True)
	compounds = models.IntegerField(null=True,blank=True)
	header = models.TextField(null=True,blank=True)
	example = models.BooleanField(default=False)
	activity_measure = models.TextField(null=True,blank=True)
	example_type = models.TextField(null=True,blank=True)
	feature = models.TextField(null=True,blank=True)
	layout = models.TextField(null=True,blank=True)
	rotate = models.TextField(null=True,blank=True)
	style =  models.TextField(null=True,blank=True)
	branch_thickness = models.TextField(null=True,blank=True)
	branch_color = models.TextField(null=True,blank=True)
	node_radius = models.TextField(null=True,blank=True)
	node_color = models.TextField(null=True,blank=True)
	label_size = models.TextField(null=True,blank=True)
	highlight = models.BooleanField(default=True)
	selected_compounds = models.TextField(null=True,blank=True)


	def __str__(self):		# __unicode__ on Python 2
		return os.path.splitext(os.path.basename(self.data_file.name))[0]

	def filename(self):
		return os.path.splitext(os.path.basename(self.data_file.name))[0]
