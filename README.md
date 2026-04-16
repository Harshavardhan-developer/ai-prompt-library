🤖 AI Prompt Library

A full-stack web application for managing and organizing AI image generation prompts. Built with Django, Angular, PostgreSQL, and Redis.

[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?style=flat-square&logo=docker)](https://docker.com)
[![Angular](https://img.shields.io/badge/Angular-15-red?style=flat-square&logo=angular)](https://angular.io)
[![Django](https://img.shields.io/badge/Django-4.2-green?style=flat-square&logo=django)](https://djangoproject.com)

## ✨ Features

- **📚 Prompt Management**: Create, view, and organize AI image generation prompts
- **🎨 Complexity Indicators**: Visual badges showing prompt difficulty (1-10 scale)
- **🔢 Live View Counter**: Redis-powered view tracking that updates in real-time
- **🏷️ Tagging System**: Categorize prompts with multiple tags
- **📱 Responsive UI**: Clean, modern interface with Tailwind CSS
- **🐳 Docker Support**: One-command setup with Docker Compose

## 🛠️ Tech Stack

### Frontend
- **Angular 15** - Modern web framework
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe JavaScript

### Backend
- **Django 4.2** - Python web framework (Function-based views, no DRF)
- **PostgreSQL 14** - Relational database
- **Redis 7** - In-memory cache for view counters
- **django-cors-headers** - Cross-origin resource sharing

### DevOps
- **Docker & Docker Compose** - Containerization
- **Gunicorn** - WSGI HTTP Server
- **WhiteNoise** - Static file serving

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone "https://github.com/Harshavardhan-developer/ai-prompt-library"
   cd ai-prompt-library
2. Start all services

docker-compose up --build
Access the application

Frontend: http://localhost:4200
Backend API: http://localhost:8000/prompts/
Django Admin: http://localhost:8000/admin/
Create a superuser (optional)

docker-compose exec backend python manage.py createsuperuser
📁 Project Structure
ai-prompt-library/
├── backend/                  # Django Backend
│   ├── config/              # Project settings
│   ├── prompts/             # Main app (models, views, urls)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── manage.py
├── frontend/                # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # UI Components
│   │   │   ├── services/    # API Services
│   │   │   └── ...
│   ├── Dockerfile
│   └── angular.json
└── docker-compose.yml       # Orchestration
🔌 API Endpoints
Method	Endpoint	Description
GET	/prompts/	List all prompts (with optional ?tag=anime filter)
POST	/prompts/create/	Create new prompt
GET	/prompts/{id}/	Get single prompt (increments view counter)
Request/Response Example
Create Prompt:

POST /prompts/create/
Content-Type: application/json

{
  "title": "Cyberpunk City",
  "content": "A detailed futuristic city with neon lights...",
  "complexity": 8,
  "tags": ["cyberpunk", "city"]
}
Response:

{
  "message": "Prompt created successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
🏗️ Architecture Decisions
Why Redis for View Counts?
Performance: In-memory storage prevents database write bottlenecks
Separation: View counters don't need ACID guarantees like prompt data
Scalability: Can be replaced with analytics pipeline later
Why Function-Based Views (No DRF)?
Simplicity: Clear request/response flow without framework abstraction
Learning: Demonstrates core Django capabilities
Control: Explicit handling of JSON responses and CORS
Database Schema
Prompt: UUID primary key, title, content, complexity, created_at
Tag: Many-to-Many relationship with Prompts
View Counter: Redis key-value (separate from PostgreSQL)
🎯 Validation Rules
Field	Rule	Error Message
Title	Min 3 characters	"Title must be at least 3 characters"
Content	Min 20 characters	"Content must be at least 20 characters"
Complexity	Integer 1-10	"Complexity must be between 1 and 10"
🐛 Troubleshooting
Issue: relation "prompts_prompt" does not exist
Fix: Run migrations manually

docker-compose exec backend python manage.py migrate
Issue: 405 Method Not Allowed on POST
Fix: Ensure URL ends with trailing slash (/api/prompts/create/)

Issue: CORS errors in browser
Fix: Update CORS_ALLOWED_ORIGINS in backend/config/settings.py

👨‍💻 Development
Running without Docker
Backend:

cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Frontend:

cd frontend
npm install
ng serve
📝 License
MIT License - feel free to use this project for learning or commercial purposes.

🙏 Acknowledgments
Assignment from Emplay for Full Stack Developer Intern position
Built with Django and Angular best practices
