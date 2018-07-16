from django.conf.urls import patterns, url

from projects import views

urlpatterns = patterns('',
	url(r'^$', views.project_list, name='project_list'),
	url(r'^new$', views.project_create, name='project_new'),
	url(r'^edit/(?P<pk>.*)$', views.project_update, name='project_edit'),
	url(r'^delete/(?P<pk>.*)$', views.project_delete, name='project_delete'),
	url(r'^preview/$', views.project_preview),
	url(r'^preview/(?P<pk>.*)$', views.project_preview, name='project_preview'),
	url(r'^getsmiles/$', views.getsmiles, name='getsmiles'),
	url(r'^updatesmiles/$', views.updatesmiles, name='updatesmiles'),
	url(r'^visualize/(?P<pk>.*)$', views.project_visualize, name='project_visualize'),
	url(r'^loadtree/$', views.loadtree, name='loadtree'),
	url(r'^load_example/$', views.load_example, name='load_example'),
	url(r'^export/$', views.export, name='export'),
)