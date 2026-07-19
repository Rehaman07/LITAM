import sys

with open('backend/settings.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix SECRET_KEY and DEBUG
content = content.replace("SECRET_KEY = 'django-insecure-!q5rljiys+_8lk^o*xqpc1f-!%nrmbl_y$)54nvs_x)o02b5^d'", "SECRET_KEY = config('SECRET_KEY')")
content = content.replace('DEBUG = config("DEBUG", default=True, cast=bool)', 'DEBUG = config("DEBUG", default=False, cast=bool)')

parts = content.split('MIDDLEWARE = [')
if len(parts) > 2:
    top_part = parts[0]
    middle_part = 'MIDDLEWARE = [' + parts[1]
    bottom_part = 'MIDDLEWARE = [' + parts[2]
    
    bottom_remainder = bottom_part.split('USE_TZ = True')[-1]
    
    content = top_part + middle_part + bottom_remainder

with open('backend/settings.py', 'w', encoding='utf-8') as f:
    f.write(content)
