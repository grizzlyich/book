import os
import uuid
from pathlib import Path
from PIL import Image, UnidentifiedImageError
from django.core.exceptions import ValidationError
from django.utils.html import strip_tags

IMAGE_EXTENSION_MAP = {
    '.jpg': 'JPEG',
    '.jpeg': 'JPEG',
    '.png': 'PNG',
    '.webp': 'WEBP',
}
ALLOWED_IMAGE_EXTENSIONS = set(IMAGE_EXTENSION_MAP.keys())
ALLOWED_IMAGE_MIME_TYPES = {
    'image/jpeg',
    'image/png',
    'image/webp',
}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB


def secure_media_upload_path(prefix: str, filename: str) -> str:
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        ext = '.bin'
    return os.path.join(prefix, f"{uuid.uuid4().hex}{ext}")


def validate_image_upload(file_obj, max_size: int = MAX_IMAGE_SIZE):
    ext = Path(getattr(file_obj, 'name', '')).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError('Разрешены только JPG, PNG и WEBP.')

    if getattr(file_obj, 'size', 0) > max_size:
        raise ValidationError(f'Файл слишком большой. Максимум {max_size // (1024 * 1024)} МБ.')

    content_type = getattr(file_obj, 'content_type', '')
    if content_type and content_type not in ALLOWED_IMAGE_MIME_TYPES:
        raise ValidationError('Недопустимый MIME type файла.')

    current_pos = file_obj.tell() if hasattr(file_obj, 'tell') else None
    try:
        if hasattr(file_obj, 'seek'):
            file_obj.seek(0)
        image = Image.open(file_obj)
        image.verify()
        detected_format = image.format
    except (UnidentifiedImageError, OSError, ValueError):
        raise ValidationError('Файл не является валидным изображением.')
    finally:
        if hasattr(file_obj, 'seek'):
            file_obj.seek(0 if current_pos is None else current_pos)

    expected_format = IMAGE_EXTENSION_MAP.get(ext)
    if expected_format and detected_format != expected_format:
        raise ValidationError('Расширение файла не совпадает с содержимым изображения.')

    return file_obj


def clean_plain_text(value: str, *, field_name: str, max_length: int | None = None, allow_blank: bool = True) -> str:
    if value is None:
        return '' if allow_blank else value

    cleaned = strip_tags(str(value)).strip()
    if not allow_blank and not cleaned:
        raise ValidationError(f'Поле "{field_name}" не может быть пустым.')

    if max_length is not None and len(cleaned) > max_length:
        raise ValidationError(f'Поле "{field_name}" слишком длинное.')

    return cleaned
