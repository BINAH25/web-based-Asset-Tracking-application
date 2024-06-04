from assets.models import *
from django import forms

class TagForm(forms.ModelForm):

    class Meta:
        model = Tag
        fields = ['tag_id','tag_name']
        
class ProductForm(forms.ModelForm):

    class Meta:
        model = Product
        fields = ['tag','serial_number','product_name']
        
