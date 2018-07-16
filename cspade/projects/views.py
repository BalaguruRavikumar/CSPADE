from django.shortcuts import render, redirect, get_object_or_404
# from django.contrib.auth.decorators import login_required
import os
from django.db import models
from django.views.decorators.csrf import csrf_exempt
from django.forms import ModelForm
from django import forms
from django.http import HttpResponse
import pdb,json
import pandas as pd
from pubchempy import get_properties
from projects.models import Project
import numpy as np
from rdkit import Chem
from rdkit.Chem import MACCSkeys
from rdkit.Chem.AtomPairs import Pairs
from rdkit import DataStructs
from rdkit.Chem import AllChem
from rdkit.Chem.Fingerprints import FingerprintMols
from scipy.cluster.hierarchy import dendrogram, linkage, to_tree
from projects.tasks import process_smiles
from django.dispatch.dispatcher import receiver
from django.conf import settings
import yaml
from django.contrib import messages
from django.conf import settings
from django.core.files import File
import math
import csv
import StringIO
import string
from collections import Counter


class ProjectForm(ModelForm):

	def clean_data_file(self):

		txtfile = self.cleaned_data['data_file']
		if txtfile:
			try:
				df = pd.read_csv(StringIO.StringIO(txtfile.read()),index_col = 'Compound',sep='\t')
			except Exception as e:
				raise forms.ValidationError('Wrong File Format/content,Please check the help section on supported file format/type')

			duplicate = [k for k,v in Counter(df.index.values).items() if v>1]
			if len(duplicate) > 0:
				raise forms.ValidationError('File has duplicate entries')	
				
			file_type = txtfile.content_type.split('/')[0]

			if len(txtfile.name.split('.')) == 1:

				raise forms.ValidationError(_("File type is not supported,Only tab delimited '.txt' files are allowed."))

			if file_type in settings.TASK_UPLOAD_FILE_TYPES:
				if txtfile._size > settings.TASK_UPLOAD_FILE_MAX_SIZE:
					raise forms.ValidationError(('Please keep filesize under %s. Current filesize %s') % (filesizeformat(settings.TASK_UPLOAD_FILE_MAX_SIZE), filesizeformat(txtfile._size)))
			else:
				raise forms.ValidationError(("File type is not supported,Only tab delimited '.txt' files are allowed."))

		return txtfile

	class Meta:
		model = Project
		fields = [ 'data_file']

class ProjectUpdateForm(ModelForm):

	class Meta:
		model = Project
		fields = [ 'feature','layout','style','branch_thickness','branch_color','node_radius','node_color','label_size']


def _delete_file(path):
   """ Deletes file from filesystem. """
   if os.path.isfile(path):
       os.remove(path)

@receiver(models.signals.post_delete, sender=Project)
def delete_file(sender, instance, *args, **kwargs):
    """ Deletes data files on `post_delete` """
    if instance.data_file:
        _delete_file(instance.data_file.path)


def scale_activity(num):
    val = "%.2f" % (math.ceil(num * 100) / 100)
    if num == 0: return [0,val]
    elif num >= 10000: return [1, val]
    elif  1000 < num <= 10000: return [1, val]
    elif  100 < num <= 1000: return [2, val]
    elif  10 < num <= 100: return [3, val]
    elif  1 < num <= 10: return [4, val]
    else:  return [5, val]

def scale_activity_dss(num):
    val = "%.2f" % (math.ceil(num * 100) / 100)
    return [num/10, val]

def scale_activity_auc(num):
    val = "%.2f" % (math.ceil(num * 100) / 100)
    return [num, val]

def Daylight_fp(mol,rc_names):
    fp = [FingerprintMols.FingerprintMol(x) for x in mol]
    tc_df = pd.DataFrame(index=rc_names, columns=rc_names).fillna(0)
    
    for c1 in range(len(fp)):
            tc_df[rc_names[c1]] = [DataStructs.FingerprintSimilarity(fp[c1],fp[c2]) for c2 in range(len(fp))]
    
    clusters = linkage(tc_df.as_matrix(columns=None), "ward")
    clust_tree = to_tree( clusters , rd=False )
    d3Dendro = dict(children=[], name=" ")
    add_node(clust_tree, d3Dendro )
    label_tree(d3Dendro["children"][0],rc_names)
    
    return d3Dendro

def Atompair_fp(mol,rc_names):
    fp = [Pairs.GetAtomPairFingerprint(x) for x in mol]
    tc_df = pd.DataFrame(index=rc_names, columns=rc_names).fillna(0)
    
    for c1 in range(len(fp)):
        tc_df[rc_names[c1]] = [DataStructs.DiceSimilarity(fp[c1],fp[c2]) for c2 in range(len(fp))]
    
    clusters = linkage(tc_df.as_matrix(columns=None), "ward")
    clust_tree = to_tree( clusters , rd=False )
    d3Dendro = dict(children=[], name=" ")
    add_node(clust_tree, d3Dendro )
    label_tree(d3Dendro["children"][0],rc_names)
    
    return d3Dendro

def MACCS_fp(mol,rc_names):
	fp = [MACCSkeys.GenMACCSKeys(x) for x in mol]
	tc_df = pd.DataFrame(index=rc_names, columns=rc_names).fillna(0)

	for c1 in range(len(fp)):
		tc_df[rc_names[c1]] = [DataStructs.FingerprintSimilarity(fp[c1],fp[c2]) for c2 in range(len(fp))]

	clusters = linkage(tc_df.as_matrix(columns=None), "ward")
	clust_tree = to_tree( clusters , rd=False )
	d3Dendro = dict(children=[], name=" ")
	add_node(clust_tree, d3Dendro )
	label_tree(d3Dendro["children"][0],rc_names)

	return d3Dendro         

def ECFP4_fp(mol,rc_names):
	fp = [AllChem.GetMorganFingerprint(x,2) for x in mol]
	tc_df = pd.DataFrame(index=rc_names, columns=rc_names).fillna(0)

	for c1 in range(len(fp)):
		tc_df[rc_names[c1]] = [DataStructs.DiceSimilarity(fp[c1],fp[c2]) for c2 in range(len(fp))]

	clusters = linkage(tc_df.as_matrix(columns=None), "ward")
	clust_tree = to_tree( clusters , rd=False )
	d3Dendro = dict(children=[], name=" ")
	add_node(clust_tree, d3Dendro )
	label_tree(d3Dendro["children"][0],rc_names)

	return d3Dendro 

def ECFP6_fp(mol,rc_names):
	fp = [AllChem.GetMorganFingerprint(x,3) for x in mol]
	tc_df = pd.DataFrame(index=rc_names, columns=rc_names).fillna(0)

	for c1 in range(len(fp)):
		tc_df[rc_names[c1]] = [DataStructs.DiceSimilarity(fp[c1],fp[c2]) for c2 in range(len(fp))]
	clusters = linkage(tc_df.as_matrix(columns=None), "ward")
	clust_tree = to_tree( clusters , rd=False )
	d3Dendro = dict(children=[], name=" ")
	add_node(clust_tree, d3Dendro )
	label_tree(d3Dendro["children"][0],rc_names)

	return d3Dendro 

def add_node(node, parent ):
	newNode = dict( node_id=node.id, children=[])
	parent["children"].append(newNode)
	if node.left: add_node( node.left, newNode)
	if node.right: add_node( node.right, newNode)

def label_tree(n,rc_names):
	if len(n["children"]) == 0:leafNames = [rc_names[n["node_id"]] ]

	else: leafNames = reduce(lambda ls, c: ls + label_tree(c,rc_names), n["children"], [])

	if len(leafNames) == 1:
		n["name"] =  "-".join(sorted(map(str, leafNames)))

	del n["node_id"]
	  
	return leafNames

def Json_Newick_tree(data):
    string_tree1 = str(data).upper()
    string_tree = string_tree1.replace('NAME','name').replace('CHILDREN','children')
    chara_rem = "':name children{}"
    string_tree2 = string_tree.translate(string.maketrans("", "", ), chara_rem)
    nwk_tree = string_tree2.replace('[]','').replace('[','(').replace(']',')').replace('(,','(').replace(',,',',')
    
    return [data, nwk_tree[1:]]

def load_example(request, template_name='projects/project_list.html'):
	if not request.session.exists(request.session.session_key):
		request.session.create()
	
	form = ProjectForm(request.POST or None,request.FILES)
	if request.GET:
		am = request.GET['am'].encode()
	else:
		am = 'DSS'

	if am == 'IC50':
		url = os.path.join(os.path.dirname(os.path.dirname(__file__)),'static/example/example_data_IC50.txt')
		header = 'SH_1:Parental,SH_1:320X,SH_1:1280X,Annotation,Smiles,PubChem_CID'
		example = Project.objects.create(data_file=File(open(url)),session_id=request.session.session_key,compounds=75,example=True,example_type= 'IC50', header=header,activity_measure='IC50')
	elif am == 'IC50_smiles':
		url = os.path.join(os.path.dirname(os.path.dirname(__file__)),'static/example/example_IC50_smiles.txt')
		header = 'SH_1:Parental,SH_1:320X,SH_1:1280X,Annotation,Smiles,PubChem_CID'
		example = Project.objects.create(data_file=File(open(url)),session_id=request.session.session_key,compounds=30,example=True,example_type= 'IC50_smiles',header=header,activity_measure='IC50')
		
	elif am == 'compounds':
		url = os.path.join(os.path.dirname(os.path.dirname(__file__)),'static/example/compounds.txt')
		header = 'Smiles,PubChem_CID'
		example = Project.objects.create(data_file=File(open(url)),session_id=request.session.session_key,compounds=30,example=True,example_type= 'compounds',header=header,activity_measure='')
		
	else:
		url = os.path.join(os.path.dirname(os.path.dirname(__file__)),'static/example/example_data_DSS.txt')
		header = 'SHI-1 parental,SHI-1 320 Ara-C,SHI-1 1280 Ara-C,Annotation,Smiles,PubChem_CID'
		example = Project.objects.create(data_file=File(open(url)),session_id=request.session.session_key,compounds=75,example=True,example_type= 'DSS',header=header,activity_measure='DSS')
	messages.success(request,'File created successfully,please wait while your file is being processed')
		# messages.info(request,'Please wait for your file to be processed,after you file is processed,you will notice the icon turn from red to green')
	return redirect('project_list')

	return render(request, template_name)




# @login_required(login_url='/')
def project_list(request, template_name='projects/project_list.html'):
	try:
		if not request.session.exists(request.session.session_key):
			request.session.create()

		if request.method == 'POST':
			form = ProjectForm(request.POST or None,request.FILES)
			if form.is_valid():
				obj=form.save(commit=False)
				obj.session_id = request.session.session_key
				obj.save()
				df = pd.read_table(obj.data_file,index_col = 'Compound')
				obj.compounds = len(df.index)
				obj.save()
				process_smiles.delay(obj.id)
				messages.success(request,'File created successfully,please wait while your file is being processed')
				return redirect('project_list')
			else:
				if form.errors:
					messages.error(request,form.errors['data_file'][0])

		else:
			form = ProjectForm()	
		data = {}
		data['object_list'] = Project.objects.filter(session_id=request.session.session_key)
		data['form'] = form
		data['nbar'] = 'project'
	except Exception as e:
			messages.error(request,e)
	# data['Example'] = Project.objects.get(pk='example')
	return render(request, template_name, data)

# @login_required(login_url='/')
def project_create(request, template_name='projects/project_form.html'):

	form = ProjectForm(request.POST or None,request.FILES)

	if form.is_valid():
		obj=form.save(commit=False)
		obj.save()
		df = pd.read_table(obj.data_file,index_col = 'Compound')
		obj.compounds = len(df.index)
		obj.save()
		# process_smiles.delay(obj.id)
		return redirect('project_list')
			
	return render(request, template_name, {'form':form})


# @login_required(login_url='/')
def project_update(request, pk, template_name='projects/project_form.html'):
	project = get_object_or_404(Project, pk=pk)
	form = ProjectUpdateForm({'feature':request.POST['treetype'],'layout':request.POST['mode'],'style':request.POST['view'],'branch_thickness':request.POST['bthickness'],'branch_color':request.POST['branchcolorpicker'],'node_radius':request.POST['nthickness'],'node_color':request.POST['nodecolorpicker'],'label_size':request.POST['nlabels']}, instance=project)
	if form.is_valid():
		form.save()
		messages.success(request,'Workspace saved')
		return redirect('project_visualize',pk=project.id)
	return render(request, template_name, {'form':form})



# @login_required(login_url='/')
def project_preview(request, pk, template_name='projects/project_preview.html'):
	project = get_object_or_404(Project, pk=pk)
	if(request.session.session_key == project.session.session_key):
		request.session['pid'] = pk
	else:
		return redirect('project_list')

	if project.activity_measure:
		activity = project.activity_measure.encode()
	else:
		activity = 'DSS'
	return render(request, template_name, {'project':project,'activity':activity})

# @login_required(login_url='/')
def project_delete(request, pk, template_name='projects/project_confirm_delete.html'):
	project = get_object_or_404(Project, pk=pk)
	if request.method=='POST':
		project.delete()
		return redirect('project_list')
	return render(request, template_name, {'object':project})

# @login_required(login_url='/')
@csrf_exempt
def getsmiles(request):
	project = get_object_or_404(Project, pk=json.loads(request.body)['id'])
	#project = get_object_or_404(Project, pk=request.GET['id'].encode())
	if project.example:
		if project.example_type == 'IC50':
			df = pd.read_json('static/example/example_data_IC50.json',orient='index')
		elif project.example_type == 'IC50_smiles':
			df = pd.read_json('static/example/example_IC50_smiles.json',orient='index')
		elif project.example_type == 'compounds':
			df = pd.read_json('static/example/compounds.json',orient='index')
		else:
			df = pd.read_json('static/example/example_data_DSS.json',orient='index')
		#something
	else:
		# if project.smiles_data:
		df = pd.read_json(project.smiles_data,orient='index')
	

	df['Compound'] = df.index	
	data =df.to_json(orient='records')
	cols = df.columns.tolist()
	anno = list(set(df.columns.values.tolist()).intersection(['Annotation']))
	if len(anno) != 0:
		ind2remove = [cols.index('Smiles'), cols.index('PubChem_CID'),cols.index('Compound'),cols.index('Annotation')]
	else:
		ind2remove = [cols.index('Smiles'), cols.index('PubChem_CID'),cols.index('Compound')]
	# targets = [x for i,x in enumerate(cols) if i not in ind2remove]
	for i in sorted(ind2remove, reverse=True):
		del cols[i]
	cols.reverse()

	
	if len(anno) != 0:
		cols_ord = ['Compound','PubChem_CID','Smiles'] + cols + ['Annotation']
	else:
		cols_ord = ['Compound','PubChem_CID','Smiles'] + cols

	return HttpResponse(json.dumps({'data':data,'columns':cols_ord}),content_type="application/json")

# @login_required(login_url='/')
@csrf_exempt
def updatesmiles(request):
	project = Project.objects.get(pk=request.session['pid'])

	params = yaml.safe_load(request.body)
	df = pd.read_json(json.dumps(params['data']), orient='record')

	df.index = df['Compound']
	df.index.name = 'Compound'
	df = df.drop(['uid','boundindex','uniqueid','visibleindex','Compound','PubChem_CID'],axis=1)
	# if not project.d3_data:
	#Input Paramaters:

	activity_meas = params['activity'] #IC50 #EC50 #Ki #Kd

	#Output json variable:
	tree_data = {}

	#Activity column names:
	attname = list(set(df.columns.values.tolist()) - set(['Smiles','Annotation']))
	#Activity Scaling:
	if (activity_meas == 'IC50') or (activity_meas == 'Ki') or (activity_meas == 'Kd') or (activity_meas == 'EC50'):
		for x in range(len(attname)):
			df[str(attname[x])] = [scale_activity(float(i)) for i in df[str(attname[x])] ]
			tree_data[str(attname[x])] = df[str(attname[x])].to_dict()
		tree_data['uactivity'] = [5,4,3,2,1]
	elif activity_meas == 'DSS':
		for x in range(len(attname)):
			df[str(attname[x])] = [scale_activity_dss(float(i)) for i in df[str(attname[x])] ]
			tree_data[str(attname[x])] = df[str(attname[x])].to_dict()
	elif activity_meas == 'AUC':
		for x in range(len(attname)):
			df[str(attname[x])] = [scale_activity_auc(float(i)) for i in df[str(attname[x])] ]
			tree_data[str(attname[x])] = df[str(attname[x])].to_dict()

	#Compound Finger-prints:
	smiles = df.Smiles.to_dict()
	rc_names = smiles.keys()

	try:
		cmpd_mol = [Chem.MolFromSmiles(value) for value in smiles.itervalues()]
		maccs_mat = MACCS_fp(cmpd_mol, rc_names)
		ec4_mat = ECFP4_fp(cmpd_mol, rc_names)
		ec6_mat = ECFP6_fp(cmpd_mol, rc_names)
		day_mat = Daylight_fp(cmpd_mol, rc_names)
		atompair_mat = Atompair_fp(cmpd_mol, rc_names)

		#SVG output of the compounds: obabel -:"CCCCCC=CC=C1C(C=CC1=O)CC=CCCCC(=O)O" -O 15D-PGJ1.svg -xC -xe
		babel_cmd = '/usr/local/bin/obabel -:"'
		path_file = settings.BASE_DIR + '/static/cmpd_svg/'+project.id
		if not os.path.exists(path_file):
			os.makedirs(path_file)
		img_file = {}
		for i in range(0,len(smiles.keys())):
		    print(i)
		    img_file[smiles.keys()[i]] = '/static/cmpd_svg/'+project.id+'/'+str(i) +'.svg'
		    smi = str(smiles.values()[i])
		    # outfile = '\" -O '+ path_file+'/'+ str(i) +'.svg' + ' -P -xr1 -xc1 -xC -xe'
		    outfile = '\" -O '+ path_file+'/'+ str(i) +'.svg' + ' -P -xr1 -xc1'
		    cmd =  babel_cmd + smi+ outfile
		    print cmd 
		    os.system(cmd)

		tree_data['img'] = img_file
		tree_data['maccs'] = Json_Newick_tree(maccs_mat)
		tree_data['ecfp4'] = Json_Newick_tree(ec4_mat)
		tree_data['ecfp6'] = Json_Newick_tree(ec6_mat)
		tree_data['day'] = Json_Newick_tree(day_mat)
		tree_data['atompair'] = Json_Newick_tree(atompair_mat)
		tree_data['cname'] = rc_names
		tree_data['in_par'] = [activity_meas]

		#Annotation:
		anno = list(set(df.columns.values.tolist()).intersection(['Annotation']))

		if len(anno) != 0:tree_data['Annotation'] = df.dropna().Annotation.to_dict()

		orddf = project.header.split(',')
		if len(anno) != 0:
			orddf.remove('Annotation')
		orddf.remove('Smiles')
		orddf.remove('PubChem_CID')
		tree_data['order'] = orddf
		# json.dump(tree_data,open("example_cluster.json", "w"),sort_keys=True, indent=4)
		project.d3_data = json.dumps(tree_data,sort_keys=True, indent=4)
		project.save()
		update = {'update':'success'}
	except Exception as e:
		# messages.error(request,e)
		update = {'update':'error'}

	


	return HttpResponse(json.dumps(update),content_type="application/json")

# @login_required(login_url='/')

def project_visualize(request, pk, template_name='projects/project_visualize.html'):
	project = get_object_or_404(Project, pk=pk)
	return render(request, template_name, {'project':project})

# @login_required(login_url='/')
# load tree data
@csrf_exempt
def loadtree(request):
	project = get_object_or_404(Project, pk=request.GET['id'].encode())
	# if request.method == 'GET' and 'example' in request.GET:
	# 	if request.GET['example'].encode() == 'true':
	# 		data = json.dumps(json.load(open('static/example/example_cluster.json')),sort_keys=True, indent=4)
	# else:
	data = 	project.d3_data
	return HttpResponse(data,content_type="application/json")



#export function to convert svg to pdf
@csrf_exempt
def export(request):
	# Get data from client side via POST variables
	svg = request.POST.get("svg")
	temp_file = tempfile.NamedTemporaryFile(mode='w+t', dir=PDF_PATH, delete=False)
	temp_pdf = tempfile.NamedTemporaryFile(dir=PDF_PATH, delete=False)
	temp_file.write(plaintext)

	subprocess.call('rst2pdf ' + temp_file.name +' -s '+ STYLESHEET_PATH +' -o ' + temp_pdf.name, shell=True)
	pdf = open(temp_pdf.name, 'rb')

	response = HttpResponse(pdf.read(), mimetype='application/force-download')
	response['Content-Disposition'] = 'attachment; filename=output.pdf'
	response['Content-Length'] = os.stat(temp_pdf.name).st_size


	return response
