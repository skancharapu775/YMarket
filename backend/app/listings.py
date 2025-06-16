from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_listings():
    return [{"title": "Microwave"}, {"title": "Chair"}]
