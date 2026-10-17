import random
from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict
from datetime import datetime, timedelta

app = FastAPI(title="StaticFlow API Engine", version="4.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db: Dict[str, Dict[int, Dict[str, Any]]] = {}
counters: Dict[str, int] = {}

FIRST = ["James","Mary","John","Patricia","Robert","Jennifer","Michael","Linda","William","Elizabeth",
         "David","Barbara","Richard","Susan","Joseph","Jessica","Thomas","Sarah","Charles","Karen",
         "Christopher","Lisa","Daniel","Nancy","Matthew","Betty","Anthony","Margaret","Mark","Sandra",
         "Donald","Ashley","Steven","Kimberly","Paul","Emily","Andrew","Donna","Joshua","Michelle",
         "Kevin","Carol","Brian","Dorothy","George","Melissa","Timothy","Deborah","Edward","Stephanie"]
LAST = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez",
        "Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin",
        "Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson"]
GRADES = ["A+","A","A-","B+","B","B-","C+","C","C-","D","F"]
DEPARTMENTS = ["Engineering","Marketing","Sales","HR","Finance","Operations","Design","Legal","Support","Research"]
POSITIONS = ["Intern","Junior","Associate","Mid-Level","Senior","Lead","Manager","Director","VP","CTO"]
CATEGORIES = ["Electronics","Clothing","Food","Books","Sports","Home","Garden","Toys","Health","Automotive"]
STATUSES_ORDER = ["pending","processing","shipped","delivered","cancelled"]
STATUSES_TASK = ["todo","in-progress","in-review","done","blocked"]
PRIORITIES = ["low","medium","high","critical"]
DIAGNOSES = ["Flu","Common Cold","Allergy","Asthma","Diabetes","Hypertension","Migraine","Fracture","Anemia","Arthritis"]
GENRES = ["Fiction","Non-Fiction","Science","History","Fantasy","Mystery","Romance","Thriller","Biography","Self-Help"]
GENDERS = ["M","F","Other"]
PRODUCT_NAMES = ["Laptop","Headphones","Keyboard","Mouse","Monitor","Tablet","Phone","Camera","Speaker","Watch",
                 "Charger","Cable","Case","Stand","Hub","Adapter","Microphone","Webcam","Router","SSD"]
ADJECTIVES = ["Pro","Ultra","Max","Lite","Plus","Mini","Elite","Prime","Core","Edge"]
SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","Computer Science","English","History","Economics",
            "Psychology","Philosophy","Statistics","Data Structures","Algorithms","Database Systems",
            "Operating Systems","Networks","Machine Learning","Artificial Intelligence","Calculus","Linear Algebra"]


def next_id(entity: str) -> int:
    counters.setdefault(entity, 0)
    counters[entity] += 1
    return counters[entity]


def random_name(i: int) -> str:
    return f"{FIRST[i % len(FIRST)]} {LAST[(i * 7 + 3) % len(LAST)]}"


def random_email(name: str, domain: str, i: int) -> str:
    clean = name.lower().replace(" ", ".")
    return f"{clean}{i}@{domain}"


def random_date(days_back: int = 365) -> str:
    d = datetime.utcnow() - timedelta(days=random.randint(0, days_back))
    return d.isoformat() + "Z"


def generate_record(entity: str, i: int) -> Dict[str, Any]:
    name = random_name(i)

    generators = {
        "students": lambda: {
            "name": name,
            "email": random_email(name, "university.edu", i),
            "age": random.randint(18, 28),
            "grade": GRADES[i % len(GRADES)],
            "gpa": round(random.uniform(2.0, 4.0), 2),
            "major": DEPARTMENTS[i % len(DEPARTMENTS)],
            "year": ["Freshman", "Sophomore", "Junior", "Senior"][i % 4],
            "marks": {
                SUBJECTS[i % len(SUBJECTS)]: random.randint(40, 100),
                SUBJECTS[(i + 3) % len(SUBJECTS)]: random.randint(40, 100),
                SUBJECTS[(i + 7) % len(SUBJECTS)]: random.randint(40, 100),
                SUBJECTS[(i + 11) % len(SUBJECTS)]: random.randint(40, 100),
                SUBJECTS[(i + 15) % len(SUBJECTS)]: random.randint(40, 100),
            },
            "subjects": [
                SUBJECTS[i % len(SUBJECTS)],
                SUBJECTS[(i + 3) % len(SUBJECTS)],
                SUBJECTS[(i + 7) % len(SUBJECTS)],
                SUBJECTS[(i + 11) % len(SUBJECTS)],
                SUBJECTS[(i + 15) % len(SUBJECTS)],
            ],
            "enrolledAt": random_date(730),
        },
        "products": lambda: {
            "name": f"{ADJECTIVES[i % len(ADJECTIVES)]} {PRODUCT_NAMES[i % len(PRODUCT_NAMES)]}",
            "description": f"High-quality {PRODUCT_NAMES[i % len(PRODUCT_NAMES)].lower()}",
            "price": round(random.uniform(4.99, 1999.99), 2),
            "category": CATEGORIES[i % len(CATEGORIES)],
            "inStock": random.random() > 0.15,
            "rating": round(random.uniform(1.0, 5.0), 1),
            "reviews": random.randint(0, 5000),
        },
        "users": lambda: {
            "name": name,
            "email": random_email(name, "example.com", i),
            "role": ["admin", "editor", "viewer", "moderator"][i % 4],
            "isActive": random.random() > 0.1,
            "lastLogin": random_date(30),
        },
        "tasks": lambda: {
            "title": f"Task #{i}: {['Fix bug','Add feature','Write docs','Review PR','Update deps','Refactor','Deploy','Test','Design UI','Optimize'][i % 10]}",
            "description": f"Detailed description for task {i}",
            "status": STATUSES_TASK[i % len(STATUSES_TASK)],
            "priority": PRIORITIES[i % len(PRIORITIES)],
            "assignee": random_name(i + 50),
            "dueDate": random_date(90),
        },
        "orders": lambda: {
            "customerId": (i % 50) + 1,
            "total": round(random.uniform(9.99, 999.99), 2),
            "status": STATUSES_ORDER[i % len(STATUSES_ORDER)],
            "items": random.randint(1, 10),
            "orderedAt": random_date(180),
        },
        "employees": lambda: {
            "name": name,
            "email": random_email(name, "company.com", i),
            "department": DEPARTMENTS[i % len(DEPARTMENTS)],
            "position": POSITIONS[i % len(POSITIONS)],
            "salary": random.randint(35, 180) * 1000,
            "startDate": random_date(1800),
        },
        "posts": lambda: {
            "title": f"{'How to ' if i % 2 == 0 else 'Understanding '}{['React','Python','Docker','AWS','GraphQL','TypeScript','K8s','Redis','Postgres','Next.js'][i % 10]}",
            "body": f"In-depth article about topic {i}.",
            "authorId": (i % 20) + 1,
            "published": random.random() > 0.2,
            "views": random.randint(10, 50000),
        },
        "patients": lambda: {
            "name": name,
            "age": random.randint(1, 95),
            "gender": GENDERS[i % len(GENDERS)],
            "diagnosis": DIAGNOSES[i % len(DIAGNOSES)],
            "bloodType": ["A+","A-","B+","B-","O+","O-","AB+","AB-"][i % 8],
        },
        "books": lambda: {
            "title": f"The {ADJECTIVES[i % len(ADJECTIVES)]} {['Journey','Code','Algorithm','System','Network','Database','Framework','Protocol','Interface','Engine'][i % 10]}",
            "author": random_name(i + 200),
            "isbn": f"978-{random.randint(1000000000, 9999999999)}",
            "genre": GENRES[i % len(GENRES)],
            "pages": random.randint(80, 900),
        },
        "comments": lambda: {
            "postId": (i % 30) + 1,
            "authorName": random_name(i + 300),
            "body": ["Great article!", "Very helpful.", f"Question about point {i % 5 + 1}."][i % 3],
            "likes": random.randint(0, 200),
        },
        "items": lambda: {
            "name": f"Item {i}",
            "description": f"Auto-generated item #{i}",
            "value": round(random.uniform(1.0, 100.0), 2),
            "category": CATEGORIES[i % len(CATEGORIES)],
        },
    }

    gen = generators.get(entity, generators["items"])
    return gen()


def seed(entity: str, count: int = 100) -> None:
    """Dynamically seed up to `count` records. Grows as needed."""
    db.setdefault(entity, {})
    current = len(db[entity])
    if current >= count:
        return
    for i in range(current, count):
        rid = next_id(entity)
        record = generate_record(entity, i)
        record["id"] = rid
        record.setdefault("createdAt", random_date())
        db[entity][rid] = record


# ═══════════════════════ ROUTES ═══════════════════════

@app.get("/")
async def root():
    return {
        "service": "StaticFlow API Engine",
        "version": "4.0.0",
        "status": "healthy",
        "docs": "/docs",
        "active_entities": {n: len(r) for n, r in db.items()},
        "usage": "GET /api/v1/{entity}?limit=N  (limit can be 1 to 10000)",
    }


@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.post("/api/v1/generate")
async def generate(request: Request):
    body = await request.json()
    return {"success": True, "message": "Handled by Next.js", "prompt": body.get("prompt", "")}


@app.get("/api/v1/entities")
async def list_entities():
    return {"entities": [{"name": n, "count": len(r)} for n, r in db.items()]}


@app.post("/api/v1/{entity}/seed")
async def seed_entity(entity: str, count: int = Query(default=100, ge=1, le=10000)):
    entity = entity.lower()
    db.setdefault(entity, {})
    db[entity].clear()
    counters[entity] = 0
    seed(entity, count)
    return {"message": f"Seeded {count} {entity}", "count": len(db[entity]), "entity": entity}


# ── GET all — limit matches whatever the user requests ──
@app.get("/api/v1/{entity}")
async def get_all(
    entity: str,
    limit: int = Query(default=100, ge=1, le=10000),
    offset: int = Query(default=0, ge=0),
):
    entity = entity.lower()
    # Auto-seed to match the requested limit
    seed(entity, limit)
    items = list(db[entity].values())
    return {
        "data": items[offset : offset + limit],
        "total": len(items),
        "limit": limit,
        "offset": offset,
        "entity": entity,
    }


@app.get("/api/v1/{entity}/{item_id}")
async def get_one(entity: str, item_id: int):
    entity = entity.lower()
    seed(entity, 100)
    if item_id not in db[entity]:
        raise HTTPException(404, f"{entity} #{item_id} not found")
    return {"data": db[entity][item_id]}


@app.post("/api/v1/{entity}")
async def create_item(entity: str, request: Request):
    entity = entity.lower()
    seed(entity, 100)
    body = await request.json()
    rid = next_id(entity)
    body["id"] = rid
    body["createdAt"] = datetime.utcnow().isoformat() + "Z"
    db[entity][rid] = body
    return {"data": body, "message": f"{entity} created"}


@app.put("/api/v1/{entity}/{item_id}")
async def update_item(entity: str, item_id: int, request: Request):
    entity = entity.lower()
    seed(entity, 100)
    if item_id not in db[entity]:
        raise HTTPException(404, f"{entity} #{item_id} not found")
    body = await request.json()
    body["id"] = item_id
    body["updatedAt"] = datetime.utcnow().isoformat() + "Z"
    db[entity][item_id] = body
    return {"data": body, "message": f"{entity} updated"}


@app.delete("/api/v1/{entity}/{item_id}")
async def delete_item(entity: str, item_id: int):
    entity = entity.lower()
    seed(entity, 100)
    if item_id not in db[entity]:
        raise HTTPException(404, f"{entity} #{item_id} not found")
    removed = db[entity].pop(item_id)
    return {"data": removed, "message": f"{entity} deleted"}