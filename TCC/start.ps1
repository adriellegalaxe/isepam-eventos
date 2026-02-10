# Activate virtual environment
& "C:\Users\walte\Documents\TCC\.venv\Scripts\Activate.ps1"

# Navigate to backend directory
cd "C:\Users\walte\Documents\TCC\backend_django"

# Start Django server on port 8000
python manage.py runserver 0.0.0.0:8000
