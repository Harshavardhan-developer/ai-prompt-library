from django.urls import path
from .views import prompt_list, prompt_detail, prompt_create

urlpatterns = [
    path('', prompt_list, name='list'),              # GET /prompts/
    path('create/', prompt_create, name='create'),    # POST /prompts/create/
    path('<uuid:id>/', prompt_detail, name='detail'), # GET /prompts/{id}/
]
