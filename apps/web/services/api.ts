import { Message } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Define supported document types with type safety
type SupportedMimeTypes = {
    [key: string]: DocumentType;
}

type DocumentType = 
    | 'pdf' 
    | 'doc' 
    | 'docx' 
    | 'ppt' 
    | 'pptx' 
    | 'xls' 
    | 'xlsx' 
    | 'odt' 
    | 'odp' 
    | 'ods' 
    | 'rtf' 
    | 'txt' 
    | 'csv' 
    | 'json' 
    | 'unknown';

const SUPPORTED_DOCUMENT_TYPES: SupportedMimeTypes = {
    // PDF files
    'application/pdf': 'pdf',
    
    // Microsoft Office formats
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    
    // OpenDocument formats
    'application/vnd.oasis.opendocument.text': 'odt',
    'application/vnd.oasis.opendocument.presentation': 'odp',
    'application/vnd.oasis.opendocument.spreadsheet': 'ods',
    
    // Rich Text Format
    'application/rtf': 'rtf',
    
    // Plain text
    'text/plain': 'txt',
    
    // CSV and JSON (existing support)
    'text/csv': 'csv',
    'application/json': 'json'
}

export class APIError extends Error {
    constructor(public status: number, message: string) {
        super(message)
        this.name = 'APIError'
    }
}

export class NetworkError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'NetworkError'
    }
}

export class UnsupportedFileError extends Error {
    constructor(filename: string, type: string) {
        super(`Unsupported file type: ${type} for file ${filename}`)
        this.name = 'UnsupportedFileError'
    }
}

interface FileAnalysis {
    file_type: DocumentType;
    filename: string;
    pages?: number;
    word_count?: number;
    paragraph_count?: number;
    slides?: number;
    rows?: number;
    columns?: number;
    structure?: string;
}

interface APIResponse {
    status: 'success' | 'error';
    response: {
        error?: string;
        mock_model_response?: string;
        message_analysis?: {
            mock_analysis: string;
        };
        file_analyses?: FileAnalysis[];
    };
}

const getFileType = (file: File): DocumentType => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    // Check if the MIME type is supported
    if (mimeType in SUPPORTED_DOCUMENT_TYPES) {
        return SUPPORTED_DOCUMENT_TYPES[mimeType] || 'unknown';
    }
    
    // Fallback to extension checking for some common cases
    const extensionToType: { [key: string]: DocumentType } = {
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'docx',
        'ppt': 'ppt',
        'pptx': 'pptx',
        'xls': 'xls',
        'xlsx': 'xlsx',
        'odt': 'odt',
        'odp': 'odp',
        'ods': 'ods',
        'rtf': 'rtf',
        'txt': 'txt',
        'csv': 'csv',
        'json': 'json'
    };
    
    return extension && extension in extensionToType 
        ? extensionToType[extension] || 'unknown'
        : 'unknown';
}

const validateFiles = (files: File[]): void => {
    files.forEach(file => {
        const fileType = getFileType(file);
        if (fileType === 'unknown') {
            throw new UnsupportedFileError(file.name, file.type);
        }
    });
}

const formatFileAnalysis = (analysis: FileAnalysis): string => {
    const { file_type, filename } = analysis;
    
    switch (file_type) {
        case 'pdf':
            return `Processed ${filename} (${analysis.pages} pages, ${analysis.word_count} words)`;
        
        case 'doc':
        case 'docx':
        case 'odt':
        case 'rtf':
            return `Processed ${filename} (${analysis.word_count} words, ${analysis.paragraph_count} paragraphs)`;
        
        case 'ppt':
        case 'pptx':
        case 'odp':
            return `Processed ${filename} (${analysis.slides} slides)`;
        
        case 'csv':
        case 'xlsx':
        case 'xls':
        case 'ods':
            return `Processed ${filename} (${analysis.rows} rows, ${analysis.columns} columns)`;
        
        case 'json':
            return `Processed ${filename} (${analysis.structure})`;
        
        default:
            return `Processed ${filename}`;
    }
}

export const analyzeData = async (
    message?: string,
    files: File[] = []
): Promise<Message> => {
    try {
        // Validate files before proceeding
        validateFiles(files);
        
        const formData = new FormData();

        // Only append message if it exists and is not empty
        if (message?.trim()) {
            formData.append('message', message.trim());
        }

        // Append files with their detected type
        files.forEach(file => {
            formData.append('files', file);
            formData.append('fileTypes', getFileType(file));
        });

        // Validate that at least one of message or files is provided
        if (!message?.trim() && files.length === 0) {
            throw new Error('Please provide either a message or files to analyze.');
        }

        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new APIError(
                response.status,
                `API Error: ${response.status} ${response.statusText}`
            );
        }

        const data: APIResponse = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.response.error || 'Error processing request');
        }

        // Format the response for the chat interface
        let content = '';
        if (data.response.mock_model_response) {
            content = data.response.mock_model_response;
        } else if (data.response.message_analysis || data.response.file_analyses) {
            const parts: string[] = [];
            
            if (data.response.message_analysis) {
                parts.push(data.response.message_analysis.mock_analysis);
            }
            
            if (data.response.file_analyses) {
                data.response.file_analyses.forEach((analysis) => {
                    parts.push(formatFileAnalysis(analysis));
                });
            }
            
            content = parts.join('\n');
        } else {
            content = 'Analysis completed successfully.';
        }

        return {
            role: "assistant",
            content
        };
    } catch (error) {
        // Handle fetch network errors
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new NetworkError(
                'Unable to connect to the server. Please ensure the backend service is running.'
            );
        }
        
        // Handle API errors
        if (error instanceof APIError) {
            throw error;
        }

        // Handle unsupported file errors
        if (error instanceof UnsupportedFileError) {
            throw error;
        }

        // Handle other errors
        throw new Error(
            error instanceof Error ? error.message : 
            'An unexpected error occurred while analyzing the data. Please try again later.'
        );
    }
}