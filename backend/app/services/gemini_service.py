import os
import json
import logging
from dotenv import load_dotenv
from google import genai
from app.models.response_models import EarningsCallSummary
load_dotenv()
logger = logging.getLogger(__name__)

# gemini free tier limit
MAX_TEXT_LENGTH = 100000



client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_earnings_call(text: str) -> EarningsCallSummary:

    if len(text) > MAX_TEXT_LENGTH:
        logger.warning(f"Text truncated from {len(text)} to {MAX_TEXT_LENGTH} chars")
        text = text[:MAX_TEXT_LENGTH]

    prompt = _build_prompt(text)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        raw = response.text.strip()
        return _parse_response(raw)

    except Exception as e:
        logger.error(f"Gemini API call failed: {e}")
        raise RuntimeError(f"Gemini API error: {str(e)}")

def _build_prompt(text: str) -> str:
    return f"""
You are a senior financial analyst. Analyze the following earnings call transcript or management commentary and return a structured JSON summary.

STRICT RULES:
- Only use information explicitly present in the transcript. Do NOT infer or hallucinate.
- If a section is missing or not discussed, set the value to "Not mentioned in document".
- For lists, if nothing is found, return an empty list [].
- Return ONLY valid JSON. No explanation, no markdown, no code blocks.

Required JSON format:
{{
  "tone": "<one of: optimistic | cautious | neutral | pessimistic>",
  "confidence_level": "<one of: high | medium | low>",
  "key_positives": ["<point 1>", "<point 2>", "<point 3>"],
  "key_concerns": ["<point 1>", "<point 2>", "<point 3>"],
  "forward_guidance": "<summary of revenue, margin, capex outlook if mentioned>",
  "capacity_utilization": "<summary of capacity utilization trends if mentioned>",
  "growth_initiatives": ["<initiative 1>", "<initiative 2>"],
  "disclaimer": "<note any ambiguity, missing sections, or truncation issues>"
}}

Tone assessment guide:
- optimistic: management emphasizes growth, strong results, positive outlook
- cautious: management acknowledges uncertainty, hedges on guidance
- neutral: balanced, factual, no strong directional language
- pessimistic: management highlights risks, declining metrics, weak outlook

Confidence level assessment guide:
- high: specific numbers, clear targets, committed language
- medium: some specifics but with caveats
- low: vague language, many uncertainties, no clear targets

Transcript:
\"\"\"
{text}
\"\"\"
"""


def _parse_response(raw: str) -> EarningsCallSummary:
    # Strip markdown code blocks if present (safety net)
    if raw.startswith("```"):
        lines = raw.split("\n")
        raw = "\n".join(lines[1:-1])  # Remove first and last lines

    try:
        data = json.loads(raw)
        return EarningsCallSummary(**data)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Gemini response as JSON: {e}")
        logger.error(f"Raw response was: {raw}")
        raise ValueError(f"Gemini returned invalid JSON: {str(e)}")
    except Exception as e:
        logger.error(f"Failed to map response to model: {e}")
        raise ValueError(f"Response mapping error: {str(e)}")