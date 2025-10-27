# llm - Unified LLM Interface Crate

[llm](https://docs.rs/llm/latest/llm/) là một Rust crate cung cấp unified interface để làm việc với nhiều Large Language Model providers khác nhau. Crate này giúp đơn giản hóa việc integrate multiple LLM services vào application của bạn.

## Đặc điểm chính

### 1. Multiple Provider Support

llm crate hỗ trợ rất nhiều providers thông qua một API nhất quán:

**Supported Providers:**
- OpenAI (GPT-4, GPT-3.5, etc.)
- Anthropic (Claude 3.5 Sonnet, Claude 3 Opus, etc.)
- Ollama (Local models)
- DeepSeek
- xAI (Grok)
- Phind
- Groq
- Google (Gemini)
- Cohere
- Mistral
- ElevenLabs

### 2. Builder Pattern API

Sử dụng builder pattern để cấu hình requests một cách rõ ràng và type-safe:

```rust
use llm::{
    client::Client,
    provider::openai::OpenAI,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Khởi tạo client
    let client = Client::builder()
        .provider(OpenAI::new(env::var("OPENAI_API_KEY")?))
        .build()?;

    // Tạo completion request
    let response = client
        .completion()
        .model("gpt-4")
        .prompt("Explain Rust ownership in simple terms")
        .temperature(0.7)
        .max_tokens(500)
        .send()
        .await?;

    println!("{}", response.text());

    Ok(())
}
```

### 3. Request Validation

llm crate tự động validate requests trước khi gửi, giúp catch errors sớm:

```rust
use llm::client::Client;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::from_env()?;

    // Validation sẽ kiểm tra:
    // - Model name có valid không
    // - Temperature trong range [0, 2]
    // - Max tokens không vượt quá giới hạn
    let response = client
        .completion()
        .model("gpt-4")
        .temperature(0.7)  // OK
        // .temperature(3.0)  // ❌ Sẽ error: temperature must be between 0 and 2
        .max_tokens(100)
        .prompt("Hello, world!")
        .send()
        .await?;

    Ok(())
}
```

### 4. Retry Logic với Exponential Backoff

Built-in retry mechanism với exponential backoff và jitter cho resilience:

```rust
use llm::client::Client;
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::builder()
        .retry_config(
            llm::retry::RetryConfig::default()
                .max_retries(3)
                .initial_delay(Duration::from_millis(500))
                .max_delay(Duration::from_secs(10))
                .use_jitter(true)
        )
        .build()?;

    // Tự động retry nếu có network errors hoặc rate limits
    let response = client
        .completion()
        .model("gpt-4")
        .prompt("Hello!")
        .send()
        .await?;

    Ok(())
}
```

## Use Cases

### 1. Multi-Provider Support

Dễ dàng switch giữa các providers:

```rust
use llm::{
    client::Client,
    provider::{openai::OpenAI, anthropic::Anthropic},
};

async fn compare_models() -> Result<(), Box<dyn std::error::Error>> {
    let prompt = "What is Rust's ownership system?";

    // OpenAI GPT-4
    let openai_client = Client::builder()
        .provider(OpenAI::from_env()?)
        .build()?;

    let gpt4_response = openai_client
        .completion()
        .model("gpt-4")
        .prompt(prompt)
        .send()
        .await?;

    println!("GPT-4: {}\n", gpt4_response.text());

    // Anthropic Claude
    let anthropic_client = Client::builder()
        .provider(Anthropic::from_env()?)
        .build()?;

    let claude_response = anthropic_client
        .completion()
        .model("claude-3-5-sonnet-20241022")
        .prompt(prompt)
        .send()
        .await?;

    println!("Claude: {}\n", claude_response.text());

    Ok(())
}
```

### 2. Streaming Responses

Hỗ trợ streaming cho real-time output:

```rust
use llm::client::Client;
use futures_util::StreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::from_env()?;

    let mut stream = client
        .completion()
        .model("gpt-4")
        .prompt("Write a haiku about Rust programming")
        .stream()
        .await?;

    print!("Response: ");
    while let Some(chunk) = stream.next().await {
        let chunk = chunk?;
        print!("{}", chunk.text());
        std::io::Write::flush(&mut std::io::stdout())?;
    }
    println!();

    Ok(())
}
```

### 3. Function Calling

Sử dụng function calling để LLM có thể invoke tools:

```rust
use llm::{client::Client, function::Function};
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::from_env()?;

    // Define function
    let weather_function = Function::builder()
        .name("get_weather")
        .description("Get the current weather for a location")
        .parameter("location", "string", "The city name")
        .build();

    let response = client
        .completion()
        .model("gpt-4")
        .prompt("What's the weather in Hanoi?")
        .function(weather_function)
        .send()
        .await?;

    if let Some(function_call) = response.function_call() {
        println!("Function: {}", function_call.name);
        println!("Arguments: {}", function_call.arguments);

        // Execute function
        match function_call.name.as_str() {
            "get_weather" => {
                let args: serde_json::Value =
                    serde_json::from_str(&function_call.arguments)?;
                println!("Getting weather for: {}", args["location"]);
            }
            _ => {}
        }
    }

    Ok(())
}
```

### 4. Evaluation & Scoring

Built-in capabilities để evaluate LLM outputs:

```rust
use llm::{client::Client, evaluation::Evaluator};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::from_env()?;

    let response = client
        .completion()
        .model("gpt-4")
        .prompt("Explain memory safety")
        .send()
        .await?;

    // Evaluate response quality
    let evaluator = Evaluator::new(&client);

    let relevance_score = evaluator
        .score_relevance("Explain memory safety", response.text())
        .await?;

    println!("Relevance score: {}/10", relevance_score);

    Ok(())
}
```

### 5. Serving as REST API

Serve bất kỳ LLM backend nào như một REST API với OpenAI-compatible format:

```rust
use llm::server::Server;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Start server on port 8080
    let server = Server::builder()
        .port(8080)
        .provider(/* your provider */)
        .build()?;

    println!("Server running on http://localhost:8080");

    // Clients có thể gọi như OpenAI API:
    // POST http://localhost:8080/v1/chat/completions

    server.run().await?;

    Ok(())
}
```

## Configuration

### Environment Variables

```bash
# OpenAI
export OPENAI_API_KEY="sk-..."

# Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."

# Groq
export GROQ_API_KEY="gsk_..."

# Local Ollama
export OLLAMA_HOST="http://localhost:11434"
```

### Cargo.toml

```toml
[dependencies]
llm = "0.5.0"
tokio = { version = "1.0", features = ["full"] }
futures-util = "0.3"
serde_json = "1.0"
```

## Ưu điểm

✅ **Unified Interface**: Một API cho tất cả providers
✅ **Type Safety**: Rust's type system bảo vệ bạn khỏi errors
✅ **Resilience**: Built-in retry và error handling
✅ **Validation**: Request validation trước khi gửi
✅ **Flexibility**: Dễ dàng switch providers
✅ **Production Ready**: Được thiết kế cho production use

## Nhược điểm

⚠️ **Abstraction Overhead**: Có thể không expose tất cả provider-specific features
⚠️ **Learning Curve**: Cần học builder pattern API
⚠️ **Dependencies**: Thêm dependencies vào project

## Khi nào nên dùng?

**Nên dùng llm crate khi:**
- Muốn support multiple LLM providers
- Cần unified interface để dễ switch providers
- Muốn built-in retry và validation
- Xây dựng production systems cần resilience

**Có thể dùng provider SDK trực tiếp khi:**
- Chỉ dùng một provider duy nhất
- Cần access provider-specific features
- Muốn minimize dependencies

## Resources

- **Documentation**: [https://docs.rs/llm](https://docs.rs/llm)
- **Crates.io**: [https://crates.io/crates/llm](https://crates.io/crates/llm)
- **GitHub**: Check the crate documentation for repository link

## Kết luận

llm crate là một excellent choice khi bạn cần làm việc với multiple LLM providers trong Rust. Với unified API, built-in resilience, và type safety, nó giúp xây dựng robust LLM applications một cách nhanh chóng và an toàn.
