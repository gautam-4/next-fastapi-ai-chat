# AI Chat Interface Template

A Turborepo starter template for an AI chat interface featuring **Next.js** frontend and **FastAPI** backend. The FastAPI backend currently returns a dummy response, making it easy to test and extend with real AI models.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: FastAPI, Python
- **Build Tool**: Turborepo
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- pnpm (v6 or higher)
- Python (v3.8 or higher)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/gautam-4/next-fastapi-ai-chat.git
    cd next-fastapi-ai-chat
    ```

2. Install dependencies:

    ```sh
    pnpm install
    ```

3. Set up the FastAPI backend:

    For Unix-based systems:

    ```sh
    pnpm --filter server setup:unix
    ```

    For Windows:

    ```sh
    pnpm --filter server setup:windows
    ```

### Running the Application

1. Start the Next frontend and FastAPI backend:

    ```sh
    pnpm dev
    ```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.