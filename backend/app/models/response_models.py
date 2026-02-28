from pydantic import BaseModel
from typing import List, Optional

class EarningsCallSummary(BaseModel):
    tone: str                         
    confidence_level: str             
    key_positives: List[str]          
    key_concerns: List[str]           
    forward_guidance: str
    capacity_utilization: str
    growth_initiatives: List[str]     
    disclaimer: Optional[str] = None  