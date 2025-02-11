"use client"

import { useRef } from "react"
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Upload, X, File } from "lucide-react"

interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export default function FileUpload({ files, onFilesChange }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      onFilesChange([...files, ...newFiles])
    }
  }

  const removeFile = (indexToRemove: number) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove)
    onFilesChange(newFiles)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
      
      {files.length > 0 && (
        <ScrollArea className="w-full border rounded-lg mb-4 bg-gray-50">
          <div className="p-2 space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-white rounded-md p-2 shadow-sm"
              >
                <div className="flex items-center space-x-2 truncate">
                  <File className="w-4 h-4 text-blue-500" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      
      <Button
        variant="outline"
        size="sm"
        className="w-full bg-gray-50 hover:bg-gray-100"
        onClick={handleUploadClick}
      >
        <Upload className="w-4 h-4 mr-2" />
        {files.length === 0 ? "Upload files" : "Upload more files"}
      </Button>
    </div>
  )
}