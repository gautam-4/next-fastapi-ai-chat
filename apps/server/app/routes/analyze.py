from fastapi import APIRouter, UploadFile, Form, File
from typing import List, Optional
import pandas as pd
import json
from io import BytesIO
import imghdr

router = APIRouter()

async def process_file(file: UploadFile) -> dict:
    """Process different file types and return relevant information."""
    content = await file.read()
    file_extension = file.filename.split('.')[-1].lower()
    
    try:
        if file_extension in ['csv']:
            df = pd.read_csv(BytesIO(content))
            return {
                "file_type": "csv",
                "filename": file.filename,
                "rows": len(df),
                "columns": len(df.columns),
                "column_names": list(df.columns),
                "sample_data": df.head(3).to_dict(orient='records')
            }
        
        elif file_extension in ['xlsx', 'xls']:
            df = pd.read_excel(BytesIO(content))
            return {
                "file_type": "xlsx",  # Changed to match frontend type
                "filename": file.filename,
                "rows": len(df),
                "columns": len(df.columns),
                "column_names": list(df.columns),
                "sample_data": df.head(3).to_dict(orient='records')
            }
        
        elif file_extension in ['json']:
            data = json.loads(content.decode())
            return {
                "file_type": "json",
                "filename": file.filename,
                "structure": type(data).__name__,  # list or dict
                "size": len(data) if isinstance(data, list) else len(data.keys()),
                "sample": str(data)[:200] + "..." if len(str(data)) > 200 else str(data)
            }
        
        # Handle PDF, DOC, DOCX, PPT, PPTX with dummy data
        elif file_extension in ['pdf']:
            return {
                "file_type": "pdf",
                "filename": file.filename,
                "pages": 0,  # Dummy value
                "word_count": 0  # Dummy value
            }
        elif file_extension in ['doc', 'docx']:
            return {
                "file_type": "docx",
                "filename": file.filename,
                "word_count": 0,  # Dummy value
                "paragraph_count": 0  # Dummy value
            }
        elif file_extension in ['ppt', 'pptx']:
            return {
                "file_type": "pptx",
                "filename": file.filename,
                "slides": 0  # Dummy value
            }
        
        # Check if it's an image file
        elif imghdr.what(None, h=content) is not None:
            return {
                "file_type": "image",
                "filename": file.filename,
                "detected_format": imghdr.what(None, h=content),
                "width": 0,  # Dummy value
                "height": 0  # Dummy value
            }
        
        else:
            return {
                "file_type": "unknown",
                "filename": file.filename,
                "size_bytes": len(content)
            }
            
    except Exception as e:
        return {
            "file_type": "error",
            "filename": file.filename,
            "error": str(e)
        }
    finally:
        await file.seek(0)  # Reset file pointer

@router.post("/analyze")
async def analyze_data(
    message: Optional[str] = Form(None),
    files: List[UploadFile] = File(default=[])
):
    try:
        response = {}

        # Process message if provided
        if message:
            response["message_analysis"] = {
                "mock_analysis": f"Analyzed message: '{message}'"
            }

        # Process files if provided
        if files:
            file_analyses = []
            mock_responses = []
            
            for file in files:
                result = await process_file(file)
                file_analyses.append(result)
                mock_responses.append(f"- {file.filename} ({result['file_type']})")
            
            response["file_analyses"] = file_analyses
            
            # Create mock model response
            if message:
                mock_responses.insert(0, f"Analyzed message: '{message}'")
            if files:
                mock_responses.insert(1 if message else 0, f"Processed {len(files)} files:")
            response["mock_model_response"] = "\n".join(mock_responses)

        return {
            "status": "success",
            "response": response
        }

    except Exception as e:
        return {
            "status": "error",
            "response": {
                "error": str(e)
            }
        }