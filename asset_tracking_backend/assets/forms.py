from assets.models import *
from django import forms

class TagForm(forms.ModelForm):

    class Meta:
        model = Tag
        fields = ['tag_id','tag_name']
        
