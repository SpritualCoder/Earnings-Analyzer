from pydantic import BaseModel
from typing import List, Optional

class EarningsCallSummary(BaseModel):
    tone: str                          # optimistic / cautious / neutral / pessimistic
    confidence_level: str              # high / medium / low
    key_positives: List[str]           # 3-5 items
    key_concerns: List[str]            # 3-5 items
    forward_guidance: str
    capacity_utilization: str
    growth_initiatives: List[str]      # 2-3 items
    disclaimer: Optional[str] = None  # e.g. "Section not found in document"