from users.models import *
from django import forms

class InstitutionForm(forms.ModelForm):

    class Meta:
        model = Institution
        fields ='__all__'
        
