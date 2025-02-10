from fastapi import UploadFile
import pandas as pd
from io import BytesIO
from typing import Dict, Any

async def process_file(file: UploadFile) -> Dict[str, Any]:
    """Process different file types and return basic information."""
    content = await file.read()
    extension = file.filename.split('.')[-1].lower()
    
    try:
        # Basic file type detection based on extension
        if extension in ['csv']:
            df = pd.read_csv(BytesIO(content))
            return {
                "file_type": "csv",
                "filename": file.filename,
                "rows": len(df),
                "columns": len(df.columns)
            }
            
        elif extension in ['xlsx', 'xls']:
            df = pd.read_excel(BytesIO(content))
            return {
                "file_type": "xlsx",
                "filename": file.filename,
                "rows": len(df),
                "columns": len(df.columns)
            }
            
        elif extension in ['pdf']:
            return {
                "file_type": "pdf",
                "filename": file.filename,
                "pages": 0,  # Dummy value
                "word_count": 0  # Dummy value
            }
            
        elif extension in ['doc', 'docx']:
            return {
                "file_type": "docx",
                "filename": file.filename,
                "word_count": 0,  # Dummy value
                "paragraph_count": 0  # Dummy value
            }
            
        elif extension in ['ppt', 'pptx']:
            return {
                "file_type": "pptx",
                "filename": file.filename,
                "slides": 0  # Dummy value
            }
            
        elif extension in ['jpg', 'jpeg', 'png', 'gif']:
            return {
                "file_type": "image",
                "filename": file.filename,
                "detected_format": extension,
                "width": 0,  # Dummy value
                "height": 0  # Dummy value
            }
            
        elif extension in ['json']:
            return {
                "file_type": "json",
                "filename": file.filename,
                "structure": "object"  # Dummy value
            }
            
        else:
            return {
                "file_type": "unknown",
                "filename": file.filename
            }
            
    except Exception as e:
        return {
            "file_type": "error",
            "filename": file.filename,
            "error": str(e)
        }
    finally:
        await file.seek(0)