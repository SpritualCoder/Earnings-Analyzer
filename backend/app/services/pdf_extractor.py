import io
import pdfplumber
from pdf2image import convert_from_bytes
import pytesseract
from PIL import Image
import logging
import os

logger = logging.getLogger(__name__)

MIN_TEXT_LENGTH = 100  # If extracted text is less than this, fallback to OCR


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Try direct text extraction first.
    If text is too short or empty, fallback to OCR.
    """
    text = _extract_direct(file_bytes)

    if len(text.strip()) < MIN_TEXT_LENGTH:
        logger.info("Direct extraction insufficient, falling back to OCR...")
        text = _extract_via_ocr(file_bytes)

    if not text.strip():
        raise ValueError("Could not extract any text from the document.")

    return text.strip()


def _extract_direct(file_bytes: bytes) -> str:
    """Extract text directly from PDF using pdfplumber."""
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        logger.warning(f"Direct PDF extraction failed: {e}")
    return text


# def _extract_via_ocr(file_bytes: bytes) -> str:
#     """Convert PDF pages to images and run OCR on each."""
#     text = ""
#     try:
#         images = convert_from_bytes(file_bytes, dpi=300)
#         for i, image in enumerate(images):
#             logger.info(f"Running OCR on page {i + 1}/{len(images)}...")
#             page_text = pytesseract.image_to_string(image, lang="eng")
#             text += page_text + "\n"
#     except Exception as e:
#         logger.warning(f"OCR extraction failed: {e}")
#     return text
# def _extract_via_ocr(file_bytes: bytes) -> str:
#     """Convert PDF pages to images and run OCR on each."""
#     text = ""
#     try:
#         images = convert_from_bytes(
#             file_bytes,
#             dpi=300,
#             poppler_path=r"C:\poppler\poppler-25.12.0\Library\bin"  # 🔥 ADD THIS
#         )

#         for i, image in enumerate(images):
#             logger.info(f"Running OCR on page {i + 1}/{len(images)}...")
#             page_text = pytesseract.image_to_string(image, lang="eng")
#             text += page_text + "\n"

#     except Exception as e:
#         logger.warning(f"OCR extraction failed: {e}")

#     return text
def _extract_via_ocr(file_bytes: bytes) -> str:
    """Convert PDF pages to images and run OCR on each."""
    text = ""
    try:
        # Use local Windows path only in development, None on Linux (Render)
        poppler_path = None
        if os.name == "nt":  # Windows
            poppler_path = r"C:\poppler\poppler-25.12.0\Library\bin"

        images = convert_from_bytes(
            file_bytes,
            dpi=300,
            poppler_path=poppler_path  # None on Linux = uses system install
        )

        for i, image in enumerate(images):
            logger.info(f"Running OCR on page {i + 1}/{len(images)}...")
            page_text = pytesseract.image_to_string(image, lang="eng")
            text += page_text + "\n"

    except Exception as e:
        logger.warning(f"OCR extraction failed: {e}")

    return text
