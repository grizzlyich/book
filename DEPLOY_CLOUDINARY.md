# Cloudinary

1. В Render → book → Environment добавь:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

2. Сделай redeploy backend.

3. Перезагрузи старые картинки заново, если они были загружены до Cloudinary.

4. Во Vercel ничего добавлять не нужно, кроме уже существующего:

```env
VITE_API_BASE_URL=https://book-4awi.onrender.com/api
```
