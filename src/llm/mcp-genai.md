# Model Context Protocol (MCP) và genai Library trong Rust

Sự phát triển của AI Agent Engineering vào năm 2025 và 2026 đã định hình lại cách chúng ta tích hợp LLMs vào phần mềm. Hai mảnh ghép quan trọng nhất trong hệ sinh thái Rust hiện tại là **Model Context Protocol (MCP)** (giao thức chuẩn hóa kết nối) và **genai** (thư viện LLM client siêu nhẹ).

---

## 1. Model Context Protocol (MCP) là gì?

**Model Context Protocol (MCP)** là một tiêu chuẩn nguồn mở (open standard protocol) được Anthropic công bố, hoạt động giống như một cổng "USB-C" cho các mô hình AI. 

Thay vì viết các tích hợp riêng biệt (custom integrations) cho mỗi công cụ (Tools) hoặc nguồn dữ liệu (Data Sources) của từng Agent, MCP cung cấp một protocol thống nhất (dựa trên JSON-RPC 2.0) giúp LLM tự động khám phá và sử dụng:
* 🛠️ **Tools**: Các hàm thực thi (executable functions) mà mô hình có thể gọi (ví dụ: chạy shell command, query database).
* 📂 **Resources**: Dữ liệu đọc (read-only data) mà mô hình có thể xem (ví dụ: local files, API responses, log files).
* 📝 **Prompts**: Các template gợi ý có sẵn giúp định hình hành vi của mô hình.

### Kiến trúc MCP (MCP Architecture)

```text
┌─────────────────┐           ┌──────────────┐           ┌─────────────────┐
│                 │  JSON-RPC │              │  JSON-RPC │   MCP Server    │
│    MCP Host     │ ────────> │  MCP Client  │ ────────> │ (Database/File) │
│ (Claude Desktop/│ <──────── │ (Rust App)   │ <──────── │   MCP Server    │
│  Cursor IDE)    │           │              │           │   (Web Search)  │
└─────────────────┘           └──────────────┘           └─────────────────┘
```

---

## 2. Xây dựng một MCP Server bằng Rust

Trong Rust, bạn có thể triển khai một MCP Server bằng cách sử dụng giao thức JSON-RPC hoặc thông qua crate `mcp-sdk-rs` (hoặc build custom handler). Dưới đây là ví dụ xây dựng một MCP Server cung cấp Tool để truy vấn thông tin hệ thống.

### Cài đặt Dependencies (`Cargo.toml`)

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
schemars = "0.8" # Để tạo JSON Schema tự động từ Rust Structs
anyhow = "1.0"
```

### Triển khai MCP Server Code

Dưới đây là một Server đơn giản đọc từ `stdin` và ghi ra `stdout` theo chuẩn MCP:

```rust,ignore
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::io::{self, BufRead};
use anyhow::Result;

#[derive(Serialize, Deserialize, Debug)]
struct JsonRpcRequest {
    jsonrpc: String,
    method: String,
    params: Option<serde_json::Value>,
    id: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize, Debug)]
struct JsonRpcResponse {
    jsonrpc: String,
    result: Option<serde_json::Value>,
    error: Option<serde_json::Value>,
    id: Option<serde_json::Value>,
}

#[tokio::main]
async fn main() -> Result<()> {
    let stdin = io::stdin();
    let mut reader = stdin.lock();
    let mut line = String::new();

    // Vòng lặp xử lý các yêu cầu JSON-RPC từ MCP Client
    while reader.read_line(&mut line)? > 0 {
        let request: JsonRpcRequest = match serde_json::from_str(&line) {
            Ok(req) => req,
            Err(e) => {
                eprintln!("❌ Failed to parse JSON-RPC: {}", e);
                line.clear();
                continue;
            }
        };

        let response = handle_mcp_request(request).await;
        println!("{}", serde_json::to_string(&response)?);
        
        line.clear();
    }

    Ok(())
}

async fn handle_mcp_request(req: JsonRpcRequest) -> JsonRpcResponse {
    let result = match req.method.as_str() {
        // 1. Khai báo các Tools có sẵn
        "tools/list" => Some(json!({
            "tools": [
                {
                    "name": "get_system_info",
                    "description": "Lấy thông tin hệ thống (OS, CPU, memory usage)",
                    "inputSchema": {
                        "type": "object",
                        "properties": {}
                    }
                }
            ]
        })),
        
        // 2. Thực thi Tool khi LLM yêu cầu (Tool Calling)
        "tools/call" => {
            let tool_name = req.params.as_ref()
                .and_then(|p| p.get("name"))
                .and_then(|n| n.as_str())
                .unwrap_or("");

            if tool_name == "get_system_info" {
                let info = format!(
                    "System Info: OS={}, Cores={}", 
                    std::env::consts::OS, 
                    num_cpus::get()
                );
                Some(json!({
                    "content": [
                        {
                            "type": "text",
                            "text": info
                        }
                    ]
                }))
            } else {
                None
            }
        }
        _ => None,
    };

    JsonRpcResponse {
        jsonrpc: "2.0".to_string(),
        result,
        error: if result.is_none() { Some(json!({"code": -32601, "message": "Method not found"})) } else { None },
        id: req.id,
    }
}
```

---

## 3. genai: Universal LLM Client Thư viện nhẹ của Rust

[genai](https://github.com/jeremychone/rust-genai) là một Rust library được phát triển bởi Jeremy Chone. Nó cung cấp một giao diện kết nối đồng nhất, tối giản và cực kỳ trực quan đến mọi LLM providers lớn. 

Khác với **Rig** (tập trung vào framework agentic lớn, RAG, workflow phức tạp), **genai** hướng tới sự tối giản: "Chỉ gọi LLM, stream kết quả, và gọi Tools một cách nhanh nhất, sạch nhất".

### Các đặc điểm nổi bật của genai:
* 🔋 **Zero-boilerplate**: Khởi tạo client và gọi mô hình trong chưa đầy 10 dòng code.
* 🌐 **Multi-Provider**: Hỗ trợ đồng thời OpenAI, Anthropic, Gemini, Ollama, Groq.
* ⚡ **Streaming Native**: Hỗ trợ xử lý stream token theo thời gian thực (real-time).
* 🔒 **Type-Safe Tool Calling**: Khai báo và phân tích kết quả gọi hàm an toàn.

### Triển khai Client Gọi LLM & Stream Kết Quả

#### Cài đặt Dependency

```toml
[dependencies]
genai = "0.1.0" # Cập nhật phiên bản mới nhất
tokio = { version = "1", features = ["full"] }
```

#### Gọi LLM thông thường (Standard Completion)

```rust,ignore
use genai::Client;
use genai::chat::{ChatRequest, ChatMessage};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Tự động đọc API keys từ biến môi trường (OPENAI_API_KEY, ANTHROPIC_API_KEY, ...)
    let client = Client::default();

    let chat_req = ChatRequest::new(vec![
        ChatMessage::system("You are a helpful programming assistant."),
        ChatMessage::user("Explain Rust memory model in 2 sentences."),
    ]);

    // Gọi mô hình GPT-4o
    let response = client.exec("gpt-4o", chat_req.clone()).await?;
    println!("OpenAI Response: {}\n", response.content.unwrap_or_default());

    // Switch sang Claude 3.5 Sonnet cực kỳ đơn giản
    let response_claude = client.exec("claude-3-5-sonnet-20241022", chat_req).await?;
    println!("Claude Response: {}", response_claude.content.unwrap_or_default());

    Ok(())
}
```

#### Stream Token theo thời gian thực (Streaming)

```rust,ignore
use genai::Client;
use genai::chat::{ChatRequest, ChatMessage};
use futures::StreamExt; // Cần dùng stream helper

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::default();

    let chat_req = ChatRequest::new(vec![
        ChatMessage::user("Write a Rust macro that logs execution time."),
    ]);

    // Sử dụng `exec_stream` thay vì `exec`
    let mut stream = client.exec_stream("gpt-4o", chat_req).await?;

    while let Some(chunk) = stream.next().await {
        let chunk = chunk?;
        if let Some(text) = chunk.content_text {
            print!("{}", text);
            std::io::Write::flush(&mut std::io::stdout())?;
        }
    }

    println!();
    Ok(())
}
```

---

## 4. Nên chọn Framework nào: Rig hay genai?

| Tiêu chí | Rig Framework | genai Client |
|---|---|---|
| **Mục tiêu chính** | Xây dựng Agent hoàn chỉnh, RAG, Multi-Agent pipelines. | Giao tiếp API LLM thô nhanh chóng, gọn nhẹ, gọi hàm đơn giản. |
| **Độ phức tạp** | Cao hơn (nhiều abstraction lớp trên như VectorStore, AgentBuilder). | Rất thấp (chỉ có Client, ChatRequest, ChatResponse). |
| **Tool Calling** | Tích hợp sâu thông qua macro `#[tool]`. | Hỗ trợ JSON Schema thô hoặc tích hợp nhẹ qua helper. |
| **Phù hợp cho** | AI Agent systems lớn, chatbot nội bộ có RAG phức tạp. | CLI Tools, Web backend nhỏ cần gọi LLM, Microservices. |

---

## 5. Tổng kết

* **Model Context Protocol (MCP)** đang chuẩn hóa cách AI Agents kết nối với cơ sở hạ tầng phần mềm. Việc viết MCP Server bằng Rust đem lại hiệu năng, độ tin cậy và tốc độ xử lý I/O tốt nhất.
* **genai** là thư viện client tuyệt vời giúp đơn giản hóa việc chuyển đổi và tích hợp đa dạng các dòng LLM (OpenAI, Anthropic, Gemini, Ollama) vào ứng dụng Rust của bạn mà không tốn công cài đặt cồng kềnh.

## References
* [Model Context Protocol (MCP) Official Spec](https://modelcontextprotocol.io/)
* [genai GitHub Repository](https://github.com/jeremychone/rust-genai)
* [mcp-rust-sdk (GitHub)](https://github.com/modelcontextprotocol/rust-sdk)
