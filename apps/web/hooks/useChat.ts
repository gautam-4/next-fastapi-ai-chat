import { useState, useCallback } from "react"
import { Message } from "@/types"
import { analyzeData } from "@/services/api"

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])

    const handleFilesChange = useCallback((files: File[]) => {
        setSelectedFiles(files)
    }, [])

    const handleSend = async () => {
        const trimmedInput = input.trim()
        if ((!trimmedInput && selectedFiles.length === 0) || isLoading) return

        setIsLoading(true)
        const userMessage: Message = { 
            role: "user", 
            content: trimmedInput,
            files: selectedFiles 
        }

        try {
            setMessages(prev => [...prev, userMessage])
            setInput("")
            setSelectedFiles([]) // Clear files after adding them to the message

            const assistantMessage = await analyzeData(trimmedInput, selectedFiles)
            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error:', error)
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, there was an error processing your request.",
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return {
        messages,
        input,
        isLoading,
        selectedFiles,
        handleFilesChange,
        handleSend,
        setInput,
    }
}