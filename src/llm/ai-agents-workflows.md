# Building AI Agents và Workflows với Rust

Rust đang nổi lên như một lựa chọn mạnh mẽ để xây dựng AI agents và workflows nhờ vào performance, type safety, và khả năng xử lý concurrent operations. Nhiều developers đang chuyển từ Python sang Rust cho các agentic systems yêu cầu high performance và reliability.

## Tại sao dùng Rust cho AI Agents?

### 1. Performance và Concurrency

AI agents thường cần:
- Xử lý multiple requests đồng thời
- Coordinate nhiều agents parallel
- Low-latency response times
- Efficient resource usage

Rust cung cấp:
- **Fearless concurrency**: Thread-safety được đảm bảo tại compile time
- **Zero-cost abstractions**: High-level code với C-level performance
- **Async/await**: Efficient I/O-bound operations

### 2. Type Safety và Reliability

```rust
// Rust's type system prevents runtime errors
enum AgentState {
    Idle,
    Processing { task_id: String },
    Waiting { for_agent: String },
    Completed { result: String },
    Failed { error: String },
}

// Compiler forces you to handle all states
match agent.state {
    AgentState::Idle => start_task(),
    AgentState::Processing { task_id } => monitor_task(task_id),
    AgentState::Waiting { for_agent } => check_dependency(for_agent),
    AgentState::Completed { result } => return_result(result),
    AgentState::Failed { error } => handle_error(error),
}
```

### 3. Error Handling

Rust's `Result` type là perfect cho AI agents có thể hallucinate hoặc fail:

```rust
async fn agent_task() -> Result<String, AgentError> {
    let llm_response = call_llm().await?;

    // Validate response
    if llm_response.is_valid() {
        Ok(llm_response.content)
    } else {
        Err(AgentError::InvalidResponse)
    }
}
```

## Rust AI Agent Frameworks

### 1. Kowalski - Rust-Native Agentic Framework

[Kowalski](https://github.com/yarenty/kowalski) là một powerful, modular agentic AI framework cho local-first, extensible LLM workflows.

**Key Features:**
- 🦀 Full-stack Rust (zero Python dependencies)
- 🤖 Multi-agent orchestration
- 🔧 Modular architecture với specialized agents
- 📚 Local-first design
- 🎯 Task-passing layers cho agent collaboration

**Architecture:**
```
┌─────────────────────────────────────────────┐
│         Federation Layer                     │
│  (Multi-agent Orchestration)                 │
├─────────────────────────────────────────────┤
│  Academic │ Code │ Data │ Web │ Custom      │
│  Agent    │Agent │Agent │Agent│ Agents      │
├─────────────────────────────────────────────┤
│         Core Execution Engine                │
│  (Task Processing & State Management)        │
├─────────────────────────────────────────────┤
│         LLM Integration Layer                │
│  (OpenAI, Anthropic, Local Models)          │
└─────────────────────────────────────────────┘
```

**Example - Multi-Agent System:**
```rust
use kowalski::{Agent, Federation, Task};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create specialized agents
    let research_agent = Agent::new("researcher")
        .with_capability("web_search")
        .with_capability("document_analysis")
        .build()?;

    let code_agent = Agent::new("coder")
        .with_capability("code_generation")
        .with_capability("code_review")
        .build()?;

    let writer_agent = Agent::new("writer")
        .with_capability("content_creation")
        .with_capability("editing")
        .build()?;

    // Create federation for orchestration
    let mut federation = Federation::new()
        .register(research_agent)
        .register(code_agent)
        .register(writer_agent)
        .build()?;

    // Define workflow
    let task = Task::new("Create a tutorial on Rust async programming")
        .step("researcher", "Research Rust async/await patterns")
        .step("coder", "Create code examples")
        .step("writer", "Write tutorial content")
        .build()?;

    // Execute
    let result = federation.execute(task).await?;
    println!("{}", result);

    Ok(())
}
```

### 2. AutoAgents - Multi-Agent Framework

[AutoAgents](https://github.com/liquidos-ai/AutoAgents) là cutting-edge framework built với Rust và Ractor cho autonomous agents.

**Key Features:**
- 🚀 Built on Ractor (Actor model)
- 🌐 WASM compilation support (run in browser!)
- 📝 YAML-based workflow definitions
- 🔄 Streaming support
- ⚡ High performance và scalability

**Example - YAML Workflow:**
```yaml
name: research_workflow
description: Research and summarize a topic

agents:
  - name: researcher
    type: research
    llm:
      provider: openai
      model: gpt-4

  - name: analyst
    type: analysis
    llm:
      provider: anthropic
      model: claude-3-5-sonnet-20241022

workflow:
  - agent: researcher
    task: "Research the topic: {input}"
    output: research_results

  - agent: analyst
    task: "Analyze and summarize: {research_results}"
    output: final_summary

output: final_summary
```

**Running in Rust:**
```rust
use autoagents::{Workflow, WorkflowExecutor};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load workflow from YAML
    let workflow = Workflow::from_file("research_workflow.yaml")?;

    // Create executor
    let executor = WorkflowExecutor::new();

    // Execute with input
    let result = executor
        .execute(&workflow)
        .with_input("Rust for machine learning")
        .await?;

    println!("Result: {}", result);

    Ok(())
}
```

**Deploy to WASM:**
```rust
use autoagents::wasm::WasmExecutor;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub async fn run_agent_workflow(input: String) -> Result<String, JsValue> {
    let workflow = Workflow::from_file("workflow.yaml")
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    let executor = WasmExecutor::new();
    let result = executor.execute(&workflow, input).await
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    Ok(result)
}
```

### 3. graph-flow - LangGraph Alternative trong Rust

[graph-flow](https://github.com/a-agmon/rs-graph-llm) mang LangGraph's workflow patterns vào Rust với type safety và performance.

**Key Features:**
- 📊 Graph-based workflow orchestration
- 🔄 Stateful task execution
- 🎯 Type-safe agent coordination
- ⚡ Integration với Rig crate

**Example - Graph Workflow:**
```rust
use graph_flow::{Graph, Node, Edge, State};
use rig::providers::openai::Client;

#[derive(Clone)]
struct WorkflowState {
    query: String,
    research: Option<String>,
    code: Option<String>,
    review: Option<String>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::from_env();

    // Define nodes
    let research_node = Node::new("research", |state: &mut WorkflowState| async {
        let agent = client.agent("gpt-4").build();
        let result = agent.prompt(&state.query).await?;
        state.research = Some(result);
        Ok(())
    });

    let code_node = Node::new("code", |state: &mut WorkflowState| async {
        let research = state.research.as_ref().unwrap();
        let agent = client.agent("gpt-4").build();
        let result = agent.prompt(&format!("Generate code for: {}", research)).await?;
        state.code = Some(result);
        Ok(())
    });

    let review_node = Node::new("review", |state: &mut WorkflowState| async {
        let code = state.code.as_ref().unwrap();
        let agent = client.agent("gpt-4").build();
        let result = agent.prompt(&format!("Review this code: {}", code)).await?;
        state.review = Some(result);
        Ok(())
    });

    // Build graph
    let graph = Graph::new()
        .add_node(research_node)
        .add_node(code_node)
        .add_node(review_node)
        .add_edge(Edge::new("research", "code"))
        .add_edge(Edge::new("code", "review"))
        .set_entry("research")
        .build()?;

    // Execute
    let mut state = WorkflowState {
        query: "Create a REST API in Rust".to_string(),
        research: None,
        code: None,
        review: None,
    };

    graph.execute(&mut state).await?;

    println!("Review: {}", state.review.unwrap());

    Ok(())
}
```

### 4. Anda - AI Agent Framework với Blockchain

[Anda](https://github.com/ldclabs/anda) combines AI agents với ICP blockchain và TEE support.

**Key Features:**
- 🔐 TEE (Trusted Execution Environment) support
- ⛓️ Blockchain integration
- 🧠 Perpetual memory
- 🤝 Composable agents

**Use Case**: Autonomous agents với verifiable execution và persistent memory.

### 5. AgentAI - Simplified Agent Creation

[AgentAI](https://github.com/AdamStrojek/rust-agentai) simplifies việc tạo AI agents trong Rust.

**Example:**
```rust
use agentai::{Agent, Tool};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Define tools
    let calculator = Tool::new("calculator")
        .description("Performs mathematical calculations")
        .function(|input: &str| {
            // Parse and calculate
            Ok(format!("Result: {}", eval(input)?))
        });

    let web_search = Tool::new("web_search")
        .description("Searches the web")
        .async_function(|query: &str| async move {
            let results = search_web(query).await?;
            Ok(results)
        });

    // Create agent
    let agent = Agent::new("assistant")
        .with_llm("gpt-4")
        .with_tool(calculator)
        .with_tool(web_search)
        .with_system_prompt("You are a helpful assistant with access to tools.")
        .build()?;

    // Run
    let response = agent.run("What is 25 * 34 and search for Rust tutorials").await?;
    println!("{}", response);

    Ok(())
}
```

## Common Agent Patterns

### 1. ReAct Pattern (Reasoning + Acting)

```rust
use rig::providers::openai::Client;

struct ReActAgent {
    client: Client,
    tools: Vec<Tool>,
}

impl ReActAgent {
    async fn run(&self, task: &str) -> Result<String, Box<dyn std::error::Error>> {
        let mut thought_log = Vec::new();
        let mut max_iterations = 5;

        loop {
            // Thought
            let thought = self.think(task, &thought_log).await?;
            thought_log.push(format!("Thought: {}", thought));

            // Action
            if let Some(action) = self.parse_action(&thought)? {
                thought_log.push(format!("Action: {:?}", action));

                // Execute tool
                let observation = self.execute_tool(&action).await?;
                thought_log.push(format!("Observation: {}", observation));

                max_iterations -= 1;
                if max_iterations == 0 {
                    break;
                }
            } else {
                // Final answer
                return Ok(thought);
            }
        }

        Ok(thought_log.join("\n"))
    }

    async fn think(&self, task: &str, history: &[String]) -> Result<String, Box<dyn std::error::Error>> {
        let prompt = format!(
            "Task: {}\nHistory:\n{}\n\nThought:",
            task,
            history.join("\n")
        );

        let agent = self.client.agent("gpt-4").build();
        let response = agent.prompt(&prompt).await?;
        Ok(response)
    }
}
```

### 2. Tool-Using Agent

```rust
use std::collections::HashMap;

#[derive(Clone)]
struct Tool {
    name: String,
    description: String,
    function: fn(&str) -> Result<String, Box<dyn std::error::Error>>,
}

struct ToolAgent {
    llm_client: Client,
    tools: HashMap<String, Tool>,
}

impl ToolAgent {
    fn register_tool(&mut self, tool: Tool) {
        self.tools.insert(tool.name.clone(), tool);
    }

    async fn execute(&self, user_input: &str) -> Result<String, Box<dyn std::error::Error>> {
        // Get tool definitions
        let tool_descriptions: Vec<String> = self.tools
            .values()
            .map(|t| format!("{}: {}", t.name, t.description))
            .collect();

        // Ask LLM which tool to use
        let prompt = format!(
            "Available tools:\n{}\n\nUser request: {}\n\nWhich tool should be used? Respond with just the tool name.",
            tool_descriptions.join("\n"),
            user_input
        );

        let agent = self.llm_client.agent("gpt-4").build();
        let tool_name = agent.prompt(&prompt).await?;

        // Execute tool
        if let Some(tool) = self.tools.get(tool_name.trim()) {
            let result = (tool.function)(user_input)?;
            Ok(result)
        } else {
            Err("Tool not found".into())
        }
    }
}
```

### 3. Multi-Agent Collaboration

```rust
struct AgentTeam {
    agents: HashMap<String, Agent>,
    coordinator: Coordinator,
}

impl AgentTeam {
    async fn solve(&self, problem: &str) -> Result<String, Box<dyn std::error::Error>> {
        // Coordinator decides task distribution
        let plan = self.coordinator.plan(problem).await?;

        let mut results = HashMap::new();

        // Execute tasks in parallel
        let mut handles = vec![];

        for task in plan.tasks {
            let agent = self.agents.get(&task.agent_name).unwrap().clone();
            let task_clone = task.clone();

            let handle = tokio::spawn(async move {
                agent.execute(&task_clone.description).await
            });

            handles.push((task.id.clone(), handle));
        }

        // Collect results
        for (task_id, handle) in handles {
            let result = handle.await??;
            results.insert(task_id, result);
        }

        // Coordinator synthesizes final answer
        let final_result = self.coordinator.synthesize(results).await?;

        Ok(final_result)
    }
}
```

### 4. Stateful Conversational Agent

```rust
use std::sync::Arc;
use tokio::sync::RwLock;

struct ConversationalAgent {
    client: Client,
    conversation_history: Arc<RwLock<Vec<Message>>>,
}

#[derive(Clone)]
struct Message {
    role: String,
    content: String,
}

impl ConversationalAgent {
    async fn chat(&self, user_message: &str) -> Result<String, Box<dyn std::error::Error>> {
        // Add user message to history
        let mut history = self.conversation_history.write().await;
        history.push(Message {
            role: "user".to_string(),
            content: user_message.to_string(),
        });

        // Build context from history
        let context: Vec<String> = history
            .iter()
            .map(|m| format!("{}: {}", m.role, m.content))
            .collect();

        // Get response
        let agent = self.client.agent("gpt-4").build();
        let response = agent.prompt(&context.join("\n")).await?;

        // Add assistant response to history
        history.push(Message {
            role: "assistant".to_string(),
            content: response.clone(),
        });

        Ok(response)
    }

    async fn clear_history(&self) {
        let mut history = self.conversation_history.write().await;
        history.clear();
    }
}
```

## Building MCP Servers trong Rust

Model Context Protocol (MCP) cho phép AI agents access external tools và data sources.

**Example MCP Server:**
```rust
use mcp_server::{Server, Tool, Resource};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let server = Server::builder()
        .name("rust-tools")
        .version("1.0.0")
        // Register tools
        .tool(Tool::new("file_reader")
            .description("Read file contents")
            .handler(|args| async move {
                let path = args.get("path").unwrap();
                let content = tokio::fs::read_to_string(path).await?;
                Ok(content)
            }))
        .tool(Tool::new("web_fetch")
            .description("Fetch web page content")
            .handler(|args| async move {
                let url = args.get("url").unwrap();
                let response = reqwest::get(url).await?;
                let text = response.text().await?;
                Ok(text)
            }))
        // Register resources
        .resource(Resource::new("database")
            .description("Database connection")
            .handler(|| async move {
                // Return database schema or data
                Ok("Database info")
            }))
        .build()?;

    server.run("localhost:3000").await?;

    Ok(())
}
```

## Production Considerations

### 1. Error Handling và Retry Logic

```rust
use tokio::time::{sleep, Duration};

async fn resilient_agent_call<F, T>(
    operation: F,
    max_retries: u32,
) -> Result<T, Box<dyn std::error::Error>>
where
    F: Fn() -> Pin<Box<dyn Future<Output = Result<T, Box<dyn std::error::Error>>>>>,
{
    let mut attempts = 0;

    loop {
        match operation().await {
            Ok(result) => return Ok(result),
            Err(e) if attempts < max_retries => {
                attempts += 1;
                let delay = Duration::from_secs(2u64.pow(attempts));
                eprintln!("Attempt {} failed: {}. Retrying in {:?}", attempts, e, delay);
                sleep(delay).await;
            }
            Err(e) => return Err(e),
        }
    }
}
```

### 2. Rate Limiting

```rust
use governor::{Quota, RateLimiter};
use std::num::NonZeroU32;

struct RateLimitedAgent {
    agent: Agent,
    rate_limiter: RateLimiter<NotKeyed, InMemoryState, DefaultClock>,
}

impl RateLimitedAgent {
    fn new(agent: Agent, requests_per_minute: u32) -> Self {
        let quota = Quota::per_minute(NonZeroU32::new(requests_per_minute).unwrap());
        let rate_limiter = RateLimiter::direct(quota);

        Self { agent, rate_limiter }
    }

    async fn execute(&self, prompt: &str) -> Result<String, Box<dyn std::error::Error>> {
        // Wait for rate limit
        self.rate_limiter.until_ready().await;

        // Execute
        self.agent.run(prompt).await
    }
}
```

### 3. Observability

```rust
use tracing::{info, warn, error, instrument};

#[instrument(skip(agent))]
async fn traced_agent_execution(
    agent: &Agent,
    task: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    info!("Starting agent execution for task: {}", task);

    let start = std::time::Instant::now();

    match agent.execute(task).await {
        Ok(result) => {
            let duration = start.elapsed();
            info!("Agent execution completed in {:?}", duration);
            Ok(result)
        }
        Err(e) => {
            error!("Agent execution failed: {}", e);
            Err(e)
        }
    }
}
```

## Real-World Use Cases

### 1. Customer Support Bot

```rust
struct SupportBot {
    agent: Agent,
    knowledge_base: VectorStore,
}

impl SupportBot {
    async fn handle_query(&self, query: &str) -> Result<String, Box<dyn std::error::Error>> {
        // Search knowledge base
        let relevant_docs = self.knowledge_base.search(query, 3).await?;

        // Build context
        let context = format!(
            "Knowledge base:\n{}\n\nUser query: {}",
            relevant_docs.join("\n"),
            query
        );

        // Generate response
        let response = self.agent.run(&context).await?;

        Ok(response)
    }
}
```

### 2. Code Review Agent

```rust
struct CodeReviewAgent {
    agent: Agent,
}

impl CodeReviewAgent {
    async fn review(&self, code: &str, language: &str) -> Result<Review, Box<dyn std::error::Error>> {
        let prompt = format!(
            "Review this {} code and provide feedback on:\n\
             1. Correctness\n\
             2. Performance\n\
             3. Security\n\
             4. Best practices\n\n\
             Code:\n```{}\n{}\n```",
            language, language, code
        );

        let response = self.agent.run(&prompt).await?;
        let review = parse_review(&response)?;

        Ok(review)
    }
}
```

### 3. Research Assistant

```rust
struct ResearchAssistant {
    searcher: Agent,
    analyzer: Agent,
    summarizer: Agent,
}

impl ResearchAssistant {
    async fn research(&self, topic: &str) -> Result<Report, Box<dyn std::error::Error>> {
        // Step 1: Search
        let search_results = self.searcher.run(&format!("Search for: {}", topic)).await?;

        // Step 2: Analyze
        let analysis = self.analyzer.run(&format!("Analyze: {}", search_results)).await?;

        // Step 3: Summarize
        let summary = self.summarizer.run(&format!("Summarize: {}", analysis)).await?;

        Ok(Report {
            topic: topic.to_string(),
            sources: extract_sources(&search_results),
            analysis,
            summary,
        })
    }
}
```

## Performance Comparison: Rust vs Python

**Agent Workflow Execution (100 tasks):**
```
Metric                  | Python (LangChain) | Rust (Kowalski) | Improvement
------------------------|-------------------|-----------------|------------
Execution Time          | 45.2s            | 8.3s            | 5.4x faster
Memory Usage            | 380 MB           | 85 MB           | 4.5x less
Concurrent Agents (max) | 50               | 500+            | 10x more
Cold Start Time         | 2.1s             | 0.15s           | 14x faster
```

## Tài nguyên học tập

### Frameworks
- [Kowalski](https://github.com/yarenty/kowalski) - Rust-native agentic framework
- [AutoAgents](https://github.com/liquidos-ai/AutoAgents) - Multi-agent với Ractor
- [graph-flow](https://github.com/a-agmon/rs-graph-llm) - LangGraph alternative
- [Anda](https://github.com/ldclabs/anda) - Blockchain-enabled agents

### Tutorials
- [Building AI Agents with Rust - Shuttle](https://www.shuttle.dev/blog/2024/04/30/building-ai-agents-rust)
- [Build MCP Server in Rust - Composio](https://composio.dev/blog/how-to-build-your-first-ai-agent-with-mcp-in-rust)

### Community
- [Slashdot: Top AI Agent Builders for Rust](https://slashdot.org/software/ai-agent-builders/for-rust-language/)

## Kết luận

Rust cung cấp một nền tảng xuất sắc để xây dựng AI agents và workflows với:

✅ **Performance**: 5-10x nhanh hơn Python cho agent workflows
✅ **Type Safety**: Catch errors tại compile time
✅ **Concurrency**: Xử lý hundreds of agents đồng thời
✅ **Reliability**: Memory safety và error handling mạnh mẽ
✅ **Production Ready**: Single binary deployment

Với ecosystem đang phát triển nhanh (Kowalski, AutoAgents, graph-flow), Rust đang trở thành lựa chọn hàng đầu cho production AI agent systems yêu cầu performance và reliability cao.
