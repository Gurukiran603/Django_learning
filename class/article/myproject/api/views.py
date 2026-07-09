from rest_framework.decorators import api_view #to use http methods like get, post, put, delete
from rest_framework.response import Response #to send response to the client/ to display the json data in the browser
from rest_framework import status #to send status code to the client/ replacement of message modules
from .models import *
from .serializers import *

@api_view(['GET','POST']) #READ,CREATE
def employee_read_create(request):
    if request.method == 'GET':
        emp = Employee.objects.all() #extraxted all the records
        serializer = EmployeeSerializer(emp,many=True) #serialized the data(convertin python data to jason data) , many=True because we are serializing multiple records
        return Response(serializer.data) #sending the response to the client / .data --> it represents that python data is converted to json data
    elif request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data) #it is used to deserialize the data (converting json data to python data) , data=request.data because we are getting the data from the client
        if serializer.is_valid(): #it is used to check the validation of the data
            serializer.save() #it is used to save the data to the database
            return Response(serializer.data, status=status.HTTP_201_CREATED) #sending the response to the client with status code 201 (created)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) #sending the response to the client with status code 400 (bad request) and also sending the error message to the client

@api_view(['GET','PUT','DELETE']) #READ,UPDATE,DELETE
def employee_update_delete(request,pk):
    try:
        emp = Employee.objects.get(id=pk) #extraxted the record with the given primary key
        #get_object_or_404 --> is not used because API doesnot require templates
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, 
                        status=status.HTTP_404_NOT_FOUND ) #sending the response to the client with status code 404 (not found) and also sending the error message to the client
    if request.method == 'GET':
        serializer = EmployeeSerializer(emp) #serialized the data(convertin python data to jason data)
        return Response(serializer.data) #sending the response to the client / .data --> it represents that python data is converted to json data


        
    elif request.method == 'PUT':
        serializer = EmployeeSerializer(emp, data=request.data) #it is used to deserialize the data (converting json data to python data) , data=request.data because we are getting the data from the client
        if serializer.is_valid(): #it is used to check the validation of the data
            serializer.save() #it is used to save the data to the database
            return Response(serializer.data) #sending the response to the client
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) #sending the response to the client with status code 400 (bad request) and also sending the error message to the client



    elif request.method == 'DELETE':
        emp.delete() #it is used to delete the record from the database
        return Response(status=status.HTTP_204_NO_CONTENT) #sending the response to the client with status code 204 (no content) because we are not sending any data to the client after deleting the record