import json
import redis
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Prompt, Tag

redis_client = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

def get_view_count(prompt_id):
    key = f"prompt:{prompt_id}:views"
    count = redis_client.get(key)
    return int(count) if count else 0

@require_http_methods(["GET"])
def prompt_list(request):
    prompts = Prompt.objects.all()
    tag_filter = request.GET.get('tag')
    if tag_filter:
        prompts = prompts.filter(tags__name=tag_filter)
    
    data = []
    for prompt in prompts:
        item = prompt.to_dict()
        item['view_count'] = get_view_count(prompt.id)
        data.append(item)
    
    return JsonResponse(data, safe=False)

@require_http_methods(["GET"])
def prompt_detail(request, id):
    try:
        prompt = Prompt.objects.get(id=id)
    except Prompt.DoesNotExist:
        return JsonResponse({'error': 'Prompt not found'}, status=404)
    
    key = f"prompt:{id}:views"
    view_count = redis_client.incr(key)
    
    data = prompt.to_dict()
    data['view_count'] = view_count
    return JsonResponse(data)

@csrf_exempt
@require_http_methods(["POST"])
def prompt_create(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    complexity = data.get('complexity')
    tags = data.get('tags', [])
    
    errors = {}
    if len(title) < 3:
        errors['title'] = 'Title must be at least 3 characters'
    if len(content) < 20:
        errors['content'] = 'Content must be at least 20 characters'
    if not isinstance(complexity, int) or not 1 <= complexity <= 10:
        errors['complexity'] = 'Complexity must be between 1 and 10'
    
    if errors:
        return JsonResponse({'errors': errors}, status=400)
    
    prompt = Prompt.objects.create(
        title=title,
        content=content,
        complexity=complexity
    )
    
    for tag_name in tags:
        tag, _ = Tag.objects.get_or_create(name=tag_name.lower().strip())
        prompt.tags.add(tag)
    
    return JsonResponse({
        'message': 'Prompt created successfully',
        'id': str(prompt.id)
    }, status=201)
