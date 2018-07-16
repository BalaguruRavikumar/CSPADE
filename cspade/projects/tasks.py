# Create your tasks here
from __future__ import absolute_import, unicode_literals
from celery import shared_task
import pdb
import pandas as pd
from pubchempy import get_properties
from projects.models import Project
import numpy as np
from rdkit import Chem
from rdkit.Chem import MACCSkeys
from rdkit import DataStructs
from rdkit.Chem import AllChem
from rdkit.Chem.Fingerprints import FingerprintMols
import math
import yaml
@shared_task

#Task: Takes the compound ID and makes use of the PubChem database to generate the Smiles of the compound 
#and creates a .json file for visulation and approval
############################################################################################


def process_smiles(pk):
	project = Project.objects.get(pk=pk)
	df = pd.read_table(project.data_file, index_col = 'Compound')
	cmpds = df.index.values #Name of Compounds
	# #remove duplicates
	# df = df.reset_index().drop_duplicates(subset='Compound', keep='last').set_index('Compound')
	#PUBChem Smiles and CIDs structural retrieval:
	smiles = {}

	for i in cmpds:
		print(i)
		if 'Smiles' in df.columns:
			if pd.isnull(df.loc[i]['Smiles']):
				sm_string = get_properties('CanonicalSMILES', i, 'name')
				if(len(sm_string)!= 0): 
					smiles[i] = sm_string[0]
			else:
				smiles[i] = {'CanonicalSMILES': df.loc[i]['Smiles'], 'CID':None}
		else:
			sm_string = get_properties('CanonicalSMILES', i, 'name')
			if(len(sm_string)!= 0):
				smiles[i] = sm_string[0]

	dfsmi = pd.DataFrame.from_dict(smiles,orient='index')
	dfsmi.columns = ['Smiles','PubChem_CID']
	if 'Smiles' in df.columns:
		df = df.drop(['Smiles'],axis=1)
	#Merge Smiles Column with Data Frame
	dfcomp = df.join(dfsmi,how='left')
	dfcomp.index.name = 'Compound'
	project.header = ','.join(dfcomp.columns.tolist())
	# dfcomp.to_json('example_data_IC50-smiles.json',orient='index')
	project.smiles_data= dfcomp.to_json(orient='index')
	project.save()


  