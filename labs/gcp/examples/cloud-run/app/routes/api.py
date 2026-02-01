"""API endpoints."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Header, Depends, status
from pydantic import BaseModel, Field

from app.config import settings

router = APIRouter()


class Item(BaseModel):
    """Item model."""
    id: int
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)


class ItemList(BaseModel):
    """Item list response."""
    items: List[Item]
    total: int


# In-memory storage (replace with database in production)
items_db: List[Item] = [
    Item(id=1, name="Widget", description="A useful widget", price=9.99),
    Item(id=2, name="Gadget", description="An amazing gadget", price=19.99),
]


async def verify_api_key(x_api_key: str = Header(...)):
    """Verify API key from header."""
    if not settings.api_key:
        # If no API key configured, skip validation (development only)
        if settings.environment == "development":
            return True
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key not configured"
        )
    
    if x_api_key != settings.api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    return True


@router.get("/items", response_model=ItemList)
async def list_items(
    skip: int = 0,
    limit: int = 10,
    authenticated: bool = Depends(verify_api_key)
):
    """
    List items.
    
    Requires X-API-Key header for authentication.
    """
    total = len(items_db)
    items = items_db[skip : skip + limit]
    
    return {
        "items": items,
        "total": total
    }


@router.get("/items/{item_id}", response_model=Item)
async def get_item(
    item_id: int,
    authenticated: bool = Depends(verify_api_key)
):
    """Get item by ID."""
    for item in items_db:
        if item.id == item_id:
            return item
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Item {item_id} not found"
    )


@router.post("/items", response_model=Item, status_code=status.HTTP_201_CREATED)
async def create_item(
    item: Item,
    authenticated: bool = Depends(verify_api_key)
):
    """Create a new item."""
    # Check if ID already exists
    if any(i.id == item.id for i in items_db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Item with ID {item.id} already exists"
        )
    
    items_db.append(item)
    return item


@router.put("/items/{item_id}", response_model=Item)
async def update_item(
    item_id: int,
    updated_item: Item,
    authenticated: bool = Depends(verify_api_key)
):
    """Update an existing item."""
    for i, item in enumerate(items_db):
        if item.id == item_id:
            items_db[i] = updated_item
            return updated_item
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Item {item_id} not found"
    )


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: int,
    authenticated: bool = Depends(verify_api_key)
):
    """Delete an item."""
    for i, item in enumerate(items_db):
        if item.id == item_id:
            items_db.pop(i)
            return
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Item {item_id} not found"
    )
