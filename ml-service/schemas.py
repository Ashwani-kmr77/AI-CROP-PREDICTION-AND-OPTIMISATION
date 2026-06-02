from pydantic import BaseModel
from typing import Optional

class CropInput(BaseModel):
    userId: Optional[str] = None
    farmId: Optional[str] = None
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    soil_type: str
    season: str
    land_area: float
    budget: float