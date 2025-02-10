import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Message } from "@/types"
import { ChatMessage } from "./ChatMessage"
import { WelcomeMessage } from "./WelcomeMessage"
import { LoadingIndicator } from "./LoadingIndicator"

interface MessageListProps {
    messages: Message[]
    isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
    return (
        <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
                {messages.length === 0 && <WelcomeMessage />}
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                ))}
                {isLoading && <LoadingIndicator />}
            </div>
        </ScrollArea>
    )
}