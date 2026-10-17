.PHONY: help dev build start install backend security clean docker test lint format

help: ## Show this help message
	@echo "⚡ StaticFlow — Available Commands"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	npm install
	cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt

dev: ## Start frontend dev server
	npm run dev

backend: ## Start backend AI engine
	cd backend && source venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000

docker-dev: ## Start dev containers (Postgres, Redis, Ollama)
	docker-compose -f docker-compose.dev.yml up -d

docker-down: ## Stop dev containers
	docker-compose -f docker-compose.dev.yml down

docker-full: ## Start full stack in Docker
	docker-compose up --build -d

build: ## Build Next.js for production
	npm run build

start: ## Start production server
	npm run start

lint: ## Run ESLint
	npm run lint

format: ## Format all code with Prettier
	npm run format

type-check: ## Run TypeScript type checking
	npm run type-check

db-push: ## Push Prisma schema to database
	npx prisma db push

db-generate: ## Generate Prisma client
	npx prisma generate

db-seed: ## Seed database with initial data
	npx tsx prisma/seed.ts

db-studio: ## Open Prisma Studio
	npx prisma studio

security: ## Run security scan
	cd security-engine && docker-compose up --build

test: ## Run all tests
	npm run type-check
	cd backend && source venv/bin/activate && pytest

clean: ## Clean all build artifacts
	rm -rf .next node_modules/.cache
	rm -rf backend/__pycache__ backend/app/__pycache__
	find . -name "*.pyc" -delete
	@echo "✅ Cleaned!"

setup: install docker-dev db-generate db-push db-seed ## Full first-time setup
	@echo ""
	@echo "🎉 StaticFlow setup complete!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:8000"
	@echo "   Run 'make dev' to start developing"
