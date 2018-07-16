# from django.contrib import admin

# # Register your models here.
# from .models import Project
# from projects.tasks import process_smiles

# class ProjectModelAdmin(admin.ModelAdmin):
# 	list_display=["__str__"]
# 	class Meta:
# 		model = Project

# 	def save_model(self, request, obj, form, change):
# 		process_smiles.delay(obj.id)
# 		super(ProjectModelAdmin, self).save_model(request, obj, form, change)

# admin.site.register(Project,ProjectModelAdmin)