import { Button } from "@workspace/ui/components//button"
import { Input } from "@workspace/ui/components//input"
import { Send } from "lucide-react"

interface ChatInputProps {
    input: string
    isLoading: boolean
    onInputChange: (value: string) => void
    onSend: () => void
}

export function ChatInput({ input, isLoading, onInputChange, onSend }: ChatInputProps) {
    return (
        <div className="flex gap-2">
            <Input
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
                disabled={isLoading}
                className="flex-1"
            />
            <Button 
                onClick={onSend}
                disabled={isLoading || !input.trim()}
                className="px-4"
            >
                <Send className="w-4 h-4" />
            </Button>
        </div>
    )
}