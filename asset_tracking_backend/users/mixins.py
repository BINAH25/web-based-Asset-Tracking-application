from rest_framework import generics
from rest_framework.response import Response
from utils.form_error import *
from rest_framework import status

class SimpleCrudMixin(generics.GenericAPIView):
    
    def get(self, request, *args, **kwargs):
        objects = self.model_class.objects.all().order_by('-created_at')
        serializers = self.serializer_class(objects,many=True)
        return Response(
            {"status": "success", "detail": serializers.data},
            status=200
        )          

         
    def post(self, request,*args, **kwargs):
        form = self.form_class(request.data)
        if form.is_valid():
            form.save()
            return Response(self.serializer_class(form.instance).data,
                    status=status.HTTP_201_CREATED,
                )
        else:
            return Response(
                {"error_message": get_errors_from_form(form)},
                status=200,
            )
            
    def delete(self, request, *args, **kwargs):
        obj_id = request.data.get("id")
        obj = self.model_class.objects.filter(id=obj_id).first()
        if obj:
            try:
                obj.delete()
                return Response({
                    "success_message":
                    f"{self.model_class.__name__} deleted successfully"
                })
            except Exception as e:
                return Response({
                    "error_message":
                    f"{self.model_class.__name__} could not be deleted: {e}"
                })
        return Response({
            "error_message":
            f"{self.model_class.__name__} could not be deleted"
        })