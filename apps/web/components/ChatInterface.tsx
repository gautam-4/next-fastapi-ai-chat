"use client"

import { ChatHeader } from "@/components/chat/ChatHeader"
import { MessageList } from "@/components/chat/MessageList"
import { ChatInput } from "@/components/chat/ChatInput"
import FileUpload from "@/components/FileUpload"
import { useChat } from "@/hooks/useChat"

export default function ChatInterface() {
    const {
        messages,
        input,
        isLoading,
        selectedFiles,
        handleFilesChange,
        handleSend,
        setInput,
    } = useChat()

    return (
        <div className="flex flex-col w-full h-full">
            <ChatHeader />
            <MessageList messages={messages} isLoading={isLoading} />
            <div className="border-t bg-white p-4">
                <div className="max-w-3xl mx-auto space-y-4">
                    <FileUpload 
                        files={selectedFiles} 
                        onFilesChange={handleFilesChange} 
                    />
                    <ChatInput
                        input={input}
                        isLoading={isLoading}
                        onInputChange={setInput}
                        onSend={handleSend}
                    />
                </div>
            </div>
        </div>
    )
}