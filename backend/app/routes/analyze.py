import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_extractor import extract_text_from_pdf
from app.services.gemini_service import analyze_earnings_call
from app.models.response_models import EarningsCallSummary

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_CONTENT_TYPES = ["application/pdf"]
MAX_FILE_SIZE_MB = 20
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


@router.post("/analyze", response_model=EarningsCallSummary)
async def analyze_document(file: UploadFile = File(...)):

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Only PDF files are accepted."
        )

    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum allowed size is {MAX_FILE_SIZE_MB}MB."
        )

    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    logger.info(f"Received file: {file.filename}, size: {len(file_bytes)} bytes")

    try:
        text = extract_text_from_pdf(file_bytes)
        logger.info(f"Extracted {len(text)} characters from document")
    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=f"Text extraction failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected extraction error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unexpected error during document processing."
        )

    try:
        summary = analyze_earnings_call(text)
        logger.info("Gemini analysis completed successfully")
        return summary
    except ValueError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Analysis parsing error: {str(e)}"
        )
    except RuntimeError as e:
        raise HTTPException(
            status_code=502,
            detail=f"LLM service error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unexpected error during analysis."
        )