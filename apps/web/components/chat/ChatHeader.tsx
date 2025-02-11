import { Bot } from "lucide-react"

export function ChatHeader() {
    return (
        <div className="flex items-center gap-2 px-6 py-4 border-b bg-white dark:bg-gray-950">
            <Bot className="w-6 h-6 text-gray-900 dark:text-gray-200" />
            <h1 className="text-xl font-semibold">AI chat</h1>
        </div>
    )
}