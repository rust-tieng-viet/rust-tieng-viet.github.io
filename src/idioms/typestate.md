# Typestate Pattern

Typestate pattern encode runtime state của một object vào compile-time type, cho phép compiler verify rằng object được sử dụng đúng cách. Pattern này đặc biệt hữu ích cho state machines, builders, và protocols.

## Vấn đề

Runtime state checking dễ dẫn đến bugs:

```rust
// ❌ Runtime state checking
struct Connection {
    url: String,
    connected: bool,
}

impl Connection {
    fn new(url: String) -> Self {
        Connection {
            url,
            connected: false,
        }
    }

    fn connect(&mut self) {
        if self.connected {
            panic!("Already connected!");  // Runtime error!
        }
        println!("Connecting to {}", self.url);
        self.connected = true;
    }

    fn send(&self, data: &str) {
        if !self.connected {
            panic!("Not connected!");  // Runtime error!
        }
        println!("Sending: {}", data);
    }
}

fn main() {
    let mut conn = Connection::new("localhost".to_string());

    // ❌ Có thể gọi send trước khi connect - runtime panic!
    // conn.send("data");

    conn.connect();
    conn.send("Hello");

    // ❌ Có thể connect lại - runtime panic!
    // conn.connect();
}
```

## Giải pháp: Typestate Pattern

```rust
// ✅ Compile-time state checking
struct Disconnected;
struct Connected;

struct Connection<State> {
    url: String,
    state: std::marker::PhantomData<State>,
}

impl Connection<Disconnected> {
    fn new(url: String) -> Self {
        Connection {
            url,
            state: std::marker::PhantomData,
        }
    }

    fn connect(self) -> Connection<Connected> {
        println!("Connecting to {}", self.url);
        Connection {
            url: self.url,
            state: std::marker::PhantomData,
        }
    }
}

impl Connection<Connected> {
    fn send(&self, data: &str) {
        println!("Sending: {}", data);
    }

    fn disconnect(self) -> Connection<Disconnected> {
        println!("Disconnecting from {}", self.url);
        Connection {
            url: self.url,
            state: std::marker::PhantomData,
        }
    }
}

fn main() {
    let conn = Connection::new("localhost".to_string());

    // ❌ Compile error - send không available khi Disconnected!
    // conn.send("data");

    let conn = conn.connect();

    // ✅ OK - send available khi Connected
    conn.send("Hello");

    // ❌ Compile error - connect không available khi đã Connected!
    // conn.connect();

    let conn = conn.disconnect();

    // ❌ Compile error - send không available sau disconnect!
    // conn.send("data");
}
```

## Builder Pattern với Typestate

```rust
// States
struct NoUrl;
struct HasUrl;
struct NoAuth;
struct HasAuth;

struct HttpClient<UrlState, AuthState> {
    url: Option<String>,
    api_key: Option<String>,
    _url_state: std::marker::PhantomData<UrlState>,
    _auth_state: std::marker::PhantomData<AuthState>,
}

impl HttpClient<NoUrl, NoAuth> {
    fn new() -> Self {
        HttpClient {
            url: None,
            api_key: None,
            _url_state: std::marker::PhantomData,
            _auth_state: std::marker::PhantomData,
        }
    }
}

impl<AuthState> HttpClient<NoUrl, AuthState> {
    fn url(self, url: String) -> HttpClient<HasUrl, AuthState> {
        HttpClient {
            url: Some(url),
            api_key: self.api_key,
            _url_state: std::marker::PhantomData,
            _auth_state: std::marker::PhantomData,
        }
    }
}

impl<UrlState> HttpClient<UrlState, NoAuth> {
    fn api_key(self, key: String) -> HttpClient<UrlState, HasAuth> {
        HttpClient {
            url: self.url,
            api_key: Some(key),
            _url_state: std::marker::PhantomData,
            _auth_state: std::marker::PhantomData,
        }
    }
}

// Chỉ có thể build khi có đủ cả URL và Auth
impl HttpClient<HasUrl, HasAuth> {
    fn build(self) -> ConfiguredClient {
        ConfiguredClient {
            url: self.url.unwrap(),
            api_key: self.api_key.unwrap(),
        }
    }
}

struct ConfiguredClient {
    url: String,
    api_key: String,
}

impl ConfiguredClient {
    fn get(&self, path: &str) {
        println!("GET {}/{} with key {}", self.url, path, self.api_key);
    }
}

fn main() {
    // ✅ Compiler enforce phải set cả url và api_key
    let client = HttpClient::new()
        .url("https://api.example.com".to_string())
        .api_key("secret123".to_string())
        .build();

    client.get("users");

    // ❌ Compile error - thiếu api_key!
    // let client = HttpClient::new()
    //     .url("https://api.example.com".to_string())
    //     .build();

    // ❌ Compile error - thiếu url!
    // let client = HttpClient::new()
    //     .api_key("secret123".to_string())
    //     .build();
}
```

## Data Pipeline States

```rust
use std::marker::PhantomData;

// Pipeline states
struct New;
struct Validated;
struct Transformed;
struct Ready;

struct DataPipeline<State> {
    data: Vec<String>,
    state: PhantomData<State>,
}

impl DataPipeline<New> {
    fn new(data: Vec<String>) -> Self {
        println!("Creating new pipeline with {} records", data.len());
        DataPipeline {
            data,
            state: PhantomData,
        }
    }

    fn validate(self) -> Result<DataPipeline<Validated>, String> {
        println!("Validating {} records...", self.data.len());

        for record in &self.data {
            if record.is_empty() {
                return Err("Found empty record".to_string());
            }
        }

        Ok(DataPipeline {
            data: self.data,
            state: PhantomData,
        })
    }
}

impl DataPipeline<Validated> {
    fn transform(self) -> DataPipeline<Transformed> {
        println!("Transforming {} records...", self.data.len());

        let data = self.data
            .into_iter()
            .map(|s| s.to_uppercase())
            .collect();

        DataPipeline {
            data,
            state: PhantomData,
        }
    }
}

impl DataPipeline<Transformed> {
    fn prepare(self) -> DataPipeline<Ready> {
        println!("Preparing {} records...", self.data.len());

        DataPipeline {
            data: self.data,
            state: PhantomData,
        }
    }
}

impl DataPipeline<Ready> {
    fn execute(self) {
        println!("Executing pipeline:");
        for (i, record) in self.data.iter().enumerate() {
            println!("  [{}] {}", i + 1, record);
        }
        println!("Pipeline complete!");
    }
}

fn main() -> Result<(), String> {
    let data = vec![
        "alice".to_string(),
        "bob".to_string(),
        "charlie".to_string(),
    ];

    // ✅ Compiler enforce correct order!
    let pipeline = DataPipeline::new(data)
        .validate()?
        .transform()
        .prepare()
        .execute();

    // ❌ Compile error - không thể skip steps!
    // let pipeline = DataPipeline::new(data)
    //     .transform();  // Error: transform not available on New state

    // ❌ Compile error - không thể execute trước khi ready!
    // let pipeline = DataPipeline::new(data)
    //     .validate()?
    //     .execute();  // Error: execute not available on Validated state

    Ok(())
}
```

## File Processor với Typestate

```rust
use std::marker::PhantomData;

// States
struct Closed;
struct Open;
struct Written;

struct FileProcessor<State> {
    path: String,
    content: Option<String>,
    state: PhantomData<State>,
}

impl FileProcessor<Closed> {
    fn new(path: String) -> Self {
        FileProcessor {
            path,
            content: None,
            state: PhantomData,
        }
    }

    fn open(self) -> FileProcessor<Open> {
        println!("Opening file: {}", self.path);
        FileProcessor {
            path: self.path,
            content: Some(String::new()),
            state: PhantomData,
        }
    }
}

impl FileProcessor<Open> {
    fn write(mut self, data: &str) -> FileProcessor<Written> {
        println!("Writing to file: {}", data);
        if let Some(ref mut content) = self.content {
            content.push_str(data);
        }

        FileProcessor {
            path: self.path,
            content: self.content,
            state: PhantomData,
        }
    }
}

impl FileProcessor<Written> {
    fn close(self) {
        println!("Closing file: {}", self.path);
        if let Some(content) = self.content {
            println!("Final content ({} bytes): {}", content.len(), content);
        }
    }

    fn write_more(self, data: &str) -> FileProcessor<Written> {
        println!("Writing more to file: {}", data);
        let mut content = self.content.unwrap();
        content.push_str(data);

        FileProcessor {
            path: self.path,
            content: Some(content),
            state: PhantomData,
        }
    }
}

fn main() {
    let file = FileProcessor::new("output.txt".to_string())
        .open()
        .write("Hello, ")
        .write_more("World!")
        .close();

    // ❌ Compile error - write không available khi Closed!
    // let file = FileProcessor::new("test.txt".to_string())
    //     .write("data");
}
```

## Transaction State Machine

```rust
use std::marker::PhantomData;

struct Idle;
struct Active;
struct Committed;
struct RolledBack;

struct Transaction<State> {
    id: u64,
    operations: Vec<String>,
    state: PhantomData<State>,
}

impl Transaction<Idle> {
    fn new(id: u64) -> Self {
        Transaction {
            id,
            operations: Vec::new(),
            state: PhantomData,
        }
    }

    fn begin(self) -> Transaction<Active> {
        println!("BEGIN TRANSACTION {}", self.id);
        Transaction {
            id: self.id,
            operations: self.operations,
            state: PhantomData,
        }
    }
}

impl Transaction<Active> {
    fn execute(mut self, operation: &str) -> Self {
        println!("EXEC [{}]: {}", self.id, operation);
        self.operations.push(operation.to_string());
        self
    }

    fn commit(self) -> Transaction<Committed> {
        println!("COMMIT {} ({} operations)", self.id, self.operations.len());
        Transaction {
            id: self.id,
            operations: self.operations,
            state: PhantomData,
        }
    }

    fn rollback(self) -> Transaction<RolledBack> {
        println!("ROLLBACK {} ({} operations)", self.id, self.operations.len());
        Transaction {
            id: self.id,
            operations: self.operations,
            state: PhantomData,
        }
    }
}

impl Transaction<Committed> {
    fn summary(&self) {
        println!("Transaction {} committed successfully:", self.id);
        for (i, op) in self.operations.iter().enumerate() {
            println!("  {}. {}", i + 1, op);
        }
    }
}

impl Transaction<RolledBack> {
    fn summary(&self) {
        println!("Transaction {} rolled back. {} operations discarded.",
                 self.id, self.operations.len());
    }
}

fn main() {
    // Successful transaction
    let tx = Transaction::new(1)
        .begin()
        .execute("INSERT INTO users VALUES (1, 'Alice')")
        .execute("INSERT INTO orders VALUES (100, 1)")
        .commit();

    tx.summary();

    println!();

    // Failed transaction
    let tx = Transaction::new(2)
        .begin()
        .execute("UPDATE balance SET amount = 1000")
        .rollback();

    tx.summary();

    // ❌ Compile error - không thể execute trên Idle state!
    // let tx = Transaction::new(3)
    //     .execute("INSERT ...");

    // ❌ Compile error - không thể commit đã committed transaction!
    // tx.commit();
}
```

## Database Connection Pool với Typestate

```rust
use std::marker::PhantomData;

struct Uninitialized;
struct Initialized;
struct Connected;

struct ConnectionPool<State> {
    max_connections: usize,
    active_connections: usize,
    state: PhantomData<State>,
}

impl ConnectionPool<Uninitialized> {
    fn new() -> Self {
        ConnectionPool {
            max_connections: 0,
            active_connections: 0,
            state: PhantomData,
        }
    }

    fn with_capacity(self, max: usize) -> ConnectionPool<Initialized> {
        println!("Initializing pool with capacity: {}", max);
        ConnectionPool {
            max_connections: max,
            active_connections: 0,
            state: PhantomData,
        }
    }
}

impl ConnectionPool<Initialized> {
    fn connect(self) -> ConnectionPool<Connected> {
        println!("Connecting to database...");
        ConnectionPool {
            max_connections: self.max_connections,
            active_connections: 0,
            state: PhantomData,
        }
    }
}

impl ConnectionPool<Connected> {
    fn acquire(&mut self) -> Option<PooledConnection> {
        if self.active_connections < self.max_connections {
            self.active_connections += 1;
            println!("Acquired connection ({}/{})",
                     self.active_connections, self.max_connections);
            Some(PooledConnection {
                id: self.active_connections,
            })
        } else {
            println!("Pool exhausted!");
            None
        }
    }

    fn release(&mut self) {
        if self.active_connections > 0 {
            self.active_connections -= 1;
            println!("Released connection ({}/{})",
                     self.active_connections, self.max_connections);
        }
    }

    fn stats(&self) {
        println!("Pool stats: {}/{} active",
                 self.active_connections, self.max_connections);
    }
}

struct PooledConnection {
    id: usize,
}

impl PooledConnection {
    fn query(&self, sql: &str) {
        println!("[Conn {}] Executing: {}", self.id, sql);
    }
}

fn main() {
    let mut pool = ConnectionPool::new()
        .with_capacity(3)
        .connect();

    if let Some(conn1) = pool.acquire() {
        conn1.query("SELECT * FROM users");
    }

    if let Some(conn2) = pool.acquire() {
        conn2.query("SELECT * FROM orders");
    }

    pool.stats();
    pool.release();
    pool.stats();

    // ❌ Compile error - acquire không available trên Uninitialized!
    // let mut pool = ConnectionPool::new();
    // pool.acquire();
}
```

## Best Practices

### 1. Use PhantomData cho zero-cost states

```rust
use std::marker::PhantomData;

struct MyType<State> {
    data: String,
    state: PhantomData<State>,  // Zero runtime cost!
}
```

### 2. Consume self cho state transitions

```rust
impl MyType<StateA> {
    // ✅ Consume self - không thể dùng old state sau transition
    fn transition(self) -> MyType<StateB> {
        MyType {
            data: self.data,
            state: PhantomData,
        }
    }
}
```

### 3. Document state transitions

```rust
/// A connection that can be in one of three states:
/// - `Disconnected`: Initial state, can call `connect()`
/// - `Connected`: Can call `send()` and `disconnect()`
/// - After `disconnect()`, returns to `Disconnected` state
struct Connection<State> { /* ... */ }
```

### 4. Provide helpful error messages

```rust
// Use type aliases cho clearer errors
type DisconnectedConnection = Connection<Disconnected>;
type ConnectedConnection = Connection<Connected>;
```

## Ưu điểm

- ✅ **Compile-time safety** - Impossible states không thể represent
- ✅ **Zero runtime cost** - PhantomData không chiếm memory
- ✅ **Self-documenting** - States rõ ràng trong type signature
- ✅ **API misuse prevention** - Compiler prevent incorrect usage
- ✅ **Refactoring safety** - Changes caught tại compile-time

## Nhược điểm

- ❌ **Complexity** - More types và boilerplate
- ❌ **Flexibility** - Khó dynamic state transitions
- ❌ **Learning curve** - Requires understanding của advanced types

## Khi nào dùng Typestate?

### ✅ Nên dùng khi:

1. **State machines** - Rõ ràng states và transitions
2. **Builders** - Enforce required fields
3. **Protocols** - Network protocols, file formats
4. **Resources** - Database connections, file handles
5. **Multi-step processes** - Data pipelines, workflows

### ❌ Không phù hợp khi:

1. **Simple state** - Boolean flag đủ
2. **Dynamic transitions** - State phụ thuộc runtime data
3. **Many states** - Too many types
4. **Prototype code** - Overhead quá cao

## Tổng kết

Typestate pattern là idiom mạnh mẽ trong Rust:
- Encode states vào types
- Compiler verify correct usage
- Zero runtime overhead
- Prevent entire classes of bugs

Best practices:
1. Use PhantomData cho state markers
2. Consume self trong transitions
3. Document states và transitions
4. Provide clear type aliases
5. Balance complexity vs safety

## References

- [Typestate Pattern - Embedded Rust Book](https://docs.rust-embedded.org/book/static-guarantees/typestate-programming.html)
- [Type-Driven Development](https://www.manning.com/books/type-driven-development-with-idris)
- [Session Types](https://en.wikipedia.org/wiki/Session_type)
