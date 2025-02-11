import { Message } from "@/types"
import { FileIcon } from "lucide-react"

interface ChatMessageProps {
    message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
    return (
        <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100"
                }`}
            >
                {message.content}
                {message.files && message.files.length > 0 && (
                    <div className="mt-2 space-y-2">
                        {message.files.map((file, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-2 p-2 rounded bg-opacity-10 bg-white"
                            >
                                <FileIcon className="w-4 h-4" />
                                <span className="text-sm truncate">{file.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}