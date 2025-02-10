export interface Message {
    role: "user" | "assistant"
    content: string
    files?: File[]
}