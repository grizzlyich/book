Что исправлено:
- Django storage переключён на STORAGES для новых версий Django.
- cover/avatar теперь отдаются полным URL.
- Cloudinary будет использоваться для новых загрузок после redeploy.

Что сделать после заливки:
1. В Render -> Environment добавить:
   CLOUDINARY_CLOUD_NAME=dmag3nzbc
   CLOUDINARY_API_KEY=343463691416468
   CLOUDINARY_API_SECRET=...твой secret...
2. Сделать Manual Deploy -> Deploy latest commit
3. Загрузить НОВУЮ картинку для книги.
4. Проверить, что в img src появился URL вида https://res.cloudinary.com/...

Важно:
- старые картинки, загруженные до Cloudinary, могут остаться со старыми /media/ URL.
- их лучше загрузить заново.
