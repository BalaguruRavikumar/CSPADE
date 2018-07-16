from django.shortcuts import render,get_object_or_404
from django.http import HttpResponse
# from projects.tasks import process_smiles

#modules:

# import pandas as pd
# from pubchempy import get_cids
# import os,pdb 
# from scipy.cluster.hierarchy import dendrogram, linkage, to_tree
# import numpy as np
# import re
# import json

def home(request):

	return render(request, "home.html", {'nbar': 'home'})

def help(request):
	return render(request, "help.html", {'nbar': 'help'})

def about(request):
	return render(request, "about.html", {'nbar': 'about'})
