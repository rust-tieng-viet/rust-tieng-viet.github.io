# Rig - Framework để xây dựng LLM Applications

[Rig](https://rig.rs/) là một open-source Rust library giúp đơn giản hóa và tăng tốc việc phát triển các ứng dụng AI sử dụng Large Language Models. Rig cung cấp các components có sẵn, modular để implement các hệ thống AI phức tạp.

## Đặc điểm chính

### 1. Unified API cho Multiple Providers

Rig hỗ trợ nhiều LLM providers thông qua một API nhất quán:

```rust
use rig::{completion::Prompt, providers::openai};

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    // Khởi tạo OpenAI client
    let openai_client = openai::Client::from_env();

    let gpt4 = openai_client.agent("gpt-4")
        .preamble("You are a helpful assistant.")
        .build();

    // Gửi prompt
    let response = gpt4
        .prompt("Explain Rust ownership in simple terms")
        .await?;

    println!("{}", response);

    Ok(())
}
```

**Providers được hỗ trợ:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Cohere
- Google (Gemini)
- Local models (Ollama)

### 2. RAG (Retrieval-Augmented Generation)

Rig có built-in support cho vector stores, cho phép similarity search và retrieval hiệu quả:

```rust
use rig::{
    embeddings::EmbeddingsBuilder,
    providers::openai::{Client, TEXT_EMBEDDING_ADA_002},
    vector_store::{in_memory_store::InMemoryVectorStore, VectorStore},
};

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let openai_client = Client::from_env();

    // Tạo vector store
    let mut vector_store = InMemoryVectorStore::default();

    // Thêm documents
    let embeddings = EmbeddingsBuilder::new(TEXT_EMBEDDING_ADA_002.clone())
        .simple_document("id-1", "Rust is a systems programming language")
        .simple_document("id-2", "Rust has ownership and borrowing")
        .simple_document("id-3", "Cargo is Rust's package manager")
        .build(&openai_client)
        .await?;

    vector_store.add_documents(embeddings).await?;

    // Search similar documents
    let results = vector_store
        .top_n("Tell me about Rust memory safety", 2)
        .await?;

    for (score, doc) in results {
        println!("Score: {}, Doc: {}", score, doc);
    }

    Ok(())
}
```

### 3. Multi-Agent Systems

Rig cho phép orchestrate nhiều agents để giải quyết complex tasks:

```rust
use rig::providers::openai::Client;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let client = Client::from_env();

    // Researcher agent
    let researcher = client.agent("gpt-4")
        .preamble("You are a research specialist. Gather and analyze information.")
        .build();

    // Writer agent
    let writer = client.agent("gpt-4")
        .preamble("You are a technical writer. Create clear documentation.")
        .build();

    // Workflow: Research -> Write
    let research = researcher
        .prompt("Research Rust async programming")
        .await?;

    let article = writer
        .prompt(&format!("Write an article based on: {}", research))
        .await?;

    println!("{}", article);

    Ok(())
}
```

### 4. Tool Calling / Function Calling

Rig hỗ trợ function calling để LLM có thể gọi external tools:

```rust
use rig::{completion::ToolDefinition, tool};

// Define a tool
#[derive(Debug, serde::Deserialize)]
struct WeatherArgs {
    location: String,
}

#[tool]
fn get_weather(args: WeatherArgs) -> String {
    format!("Weather in {} is sunny", args.location)
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let client = openai::Client::from_env();

    let agent = client.agent("gpt-4")
        .preamble("You are a helpful assistant with access to weather information.")
        .tool(get_weather)
        .build();

    let response = agent
        .prompt("What's the weather in Hanoi?")
        .await?;

    println!("{}", response);

    Ok(())
}
```

## Kiến trúc Rig

Rig được thiết kế với các components modular:

```
┌─────────────────────────────────────────┐
│           Application Layer              │
├─────────────────────────────────────────┤
│  Agents  │  Chains  │  Tools  │  RAG    │
├─────────────────────────────────────────┤
│         Completion Providers             │
│  OpenAI │ Anthropic │ Cohere │ Local   │
├─────────────────────────────────────────┤
│           Vector Stores                  │
│  In-Memory │ MongoDB │ Qdrant │ etc.   │
└─────────────────────────────────────────┘
```

## Use Cases

### 1. Chatbot với Context

```rust
use rig::providers::openai::Client;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let client = Client::from_env();

    let chatbot = client.agent("gpt-4")
        .preamble("You are a helpful coding assistant specializing in Rust.")
        .temperature(0.7)
        .max_tokens(500)
        .build();

    // Multiple turns conversation
    let response1 = chatbot.prompt("What is borrowing in Rust?").await?;
    println!("Bot: {}\n", response1);

    let response2 = chatbot.prompt("Can you give me an example?").await?;
    println!("Bot: {}\n", response2);

    Ok(())
}
```

### 2. Document QA System

```rust
use rig::{
    embeddings::EmbeddingsBuilder,
    providers::openai::{Client, TEXT_EMBEDDING_ADA_002},
    vector_store::in_memory_store::InMemoryVectorStore,
};

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let client = Client::from_env();
    let mut vector_store = InMemoryVectorStore::default();

    // Index documents
    let docs = vec![
        "Rust was created by Graydon Hoare at Mozilla Research",
        "First stable release was in May 2015",
        "Rust is used at companies like Microsoft, Amazon, and Meta",
    ];

    let embeddings = EmbeddingsBuilder::new(TEXT_EMBEDDING_ADA_002.clone())
        .simple_documents(docs)
        .build(&client)
        .await?;

    vector_store.add_documents(embeddings).await?;

    // Query
    let results = vector_store
        .top_n("When was Rust released?", 1)
        .await?;

    println!("Answer: {}", results[0].1);

    Ok(())
}
```

## Ưu điểm

✅ **Type Safety**: Leverage Rust's type system cho LLM workflows
✅ **Performance**: Zero-cost abstractions và efficient memory usage
✅ **Modularity**: Mix and match components theo nhu cầu
✅ **Provider Agnostic**: Dễ dàng switch giữa các providers
✅ **Production Ready**: Built with reliability và scalability in mind

## Cài đặt

Thêm vào `Cargo.toml`:

```toml
[dependencies]
rig-core = "0.1.0"

# Choose your provider
openai-api-rs = "5.0.0"  # For OpenAI
# anthropic-sdk = "0.2.0"  # For Anthropic
```

## Resources

- **Website**: [https://rig.rs/](https://rig.rs/)
- **GitHub**: [https://github.com/0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig)
- **Documentation**: [https://docs.rs/rig-core](https://docs.rs/rig-core)
- **Examples**: [GitHub Examples](https://github.com/0xPlaygrounds/rig/tree/main/examples)

## Kết luận

Rig là một framework mạnh mẽ và flexible để xây dựng LLM applications trong Rust. Với các components có sẵn cho RAG, multi-agent systems, và tool calling, Rig giúp bạn nhanh chóng phát triển các ứng dụng AI production-ready với all the benefits của Rust.
