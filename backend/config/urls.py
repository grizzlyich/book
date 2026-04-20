from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def home(request):
    return JsonResponse({
        'service': 'BookSwap API',
        'version': '1.0.0',
        'docs': '/api/docs/',
        'schema': '/api/schema/',
        'health': '/api/health/',
    })


def health(request):
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/health/', health),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/auth/', include('users.urls')),
    path('api/books/', include('books.urls')),
    path('api/exchanges/', include('exchanges.urls')),
    path('api/reviews/', include('reviews.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
