# Sử dụng Enum để chứa nhiều loại dữ liệu

Trong Rust, `Vec<T>` chỉ có thể chứa các phần tử cùng type `T`. Khi cần lưu nhiều loại dữ liệu khác nhau trong cùng một Vec, ta có thể sử dụng **Enum** để wrap các types khác nhau.

## Vấn đề: Vec chỉ chứa một type

```rust
fn main() {
    // ❌ Compile error - Vec chỉ chứa một type
    // let mixed = vec![42, "hello", 3.14];

    // Phải tạo nhiều Vecs riêng biệt
    let integers = vec![1, 2, 3];
    let strings = vec!["a", "b", "c"];
    let floats = vec![1.0, 2.0, 3.0];

    // Khó quản lý và xử lý
}
```

## Giải pháp: Sử dụng Enum

```rust
#[derive(Debug)]
enum Value {
    Integer(i32),
    Float(f64),
    Text(String),
}

fn main() {
    // ✅ Vec chứa nhiều loại dữ liệu khác nhau
    let values = vec![
        Value::Integer(42),
        Value::Float(3.14),
        Value::Text(String::from("hello")),
        Value::Integer(100),
    ];

    // Xử lý từng value
    for value in &values {
        match value {
            Value::Integer(n) => println!("Integer: {}", n),
            Value::Float(f) => println!("Float: {}", f),
            Value::Text(s) => println!("Text: {}", s),
        }
    }
}
```

Output:
```
Integer: 42
Float: 3.14
Text: hello
Integer: 100
```

## Ví dụ thực tế: Spreadsheet Cell

```rust
#[derive(Debug, Clone)]
enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
    Bool(bool),
    Empty,
}

fn main() {
    // Một row trong spreadsheet
    let row = vec![
        SpreadsheetCell::Text(String::from("Name")),
        SpreadsheetCell::Int(42),
        SpreadsheetCell::Float(3.14159),
        SpreadsheetCell::Bool(true),
        SpreadsheetCell::Empty,
    ];

    // Process row
    for (i, cell) in row.iter().enumerate() {
        print!("Cell {}: ", i);
        match cell {
            SpreadsheetCell::Int(n) => println!("{}", n),
            SpreadsheetCell::Float(f) => println!("{:.2}", f),
            SpreadsheetCell::Text(s) => println!("'{}'", s),
            SpreadsheetCell::Bool(b) => println!("{}", b),
            SpreadsheetCell::Empty => println!("(empty)"),
        }
    }
}
```

Output:
```
Cell 0: 'Name'
Cell 1: 42
Cell 2: 3.14
Cell 3: true
Cell 4: (empty)
```

## Data Engineering: Mixed Data Types

```rust
#[derive(Debug, Clone)]
enum DataValue {
    String(String),
    Integer(i64),
    Float(f64),
    Boolean(bool),
    Null,
}

impl DataValue {
    fn as_string(&self) -> String {
        match self {
            DataValue::String(s) => s.clone(),
            DataValue::Integer(n) => n.to_string(),
            DataValue::Float(f) => f.to_string(),
            DataValue::Boolean(b) => b.to_string(),
            DataValue::Null => String::from("NULL"),
        }
    }

    fn is_null(&self) -> bool {
        matches!(self, DataValue::Null)
    }
}

// Một record trong dataset
type Record = Vec<DataValue>;

fn main() {
    let records: Vec<Record> = vec![
        vec![
            DataValue::Integer(1),
            DataValue::String("Alice".to_string()),
            DataValue::Float(75.5),
            DataValue::Boolean(true),
        ],
        vec![
            DataValue::Integer(2),
            DataValue::String("Bob".to_string()),
            DataValue::Float(82.3),
            DataValue::Boolean(false),
        ],
        vec![
            DataValue::Integer(3),
            DataValue::String("Charlie".to_string()),
            DataValue::Null,
            DataValue::Boolean(true),
        ],
    ];

    // Print table
    println!("ID | Name    | Score | Active");
    println!("---|---------|-------|-------");

    for record in &records {
        for (i, value) in record.iter().enumerate() {
            if i > 0 {
                print!(" | ");
            }
            print!("{:<7}", value.as_string());
        }
        println!();
    }
}
```

Output:
```
ID | Name    | Score | Active
---|---------|-------|-------
1       | Alice   | 75.5    | true
2       | Bob     | 82.3    | false
3       | Charlie | NULL    | true
```

## JSON-like Data Structure

```rust
#[derive(Debug, Clone)]
enum JsonValue {
    Null,
    Bool(bool),
    Number(f64),
    String(String),
    Array(Vec<JsonValue>),
    Object(Vec<(String, JsonValue)>),
}

impl JsonValue {
    fn pretty_print(&self, indent: usize) {
        let spaces = " ".repeat(indent);
        match self {
            JsonValue::Null => print!("null"),
            JsonValue::Bool(b) => print!("{}", b),
            JsonValue::Number(n) => print!("{}", n),
            JsonValue::String(s) => print!("\"{}\"", s),
            JsonValue::Array(arr) => {
                println!("[");
                for (i, item) in arr.iter().enumerate() {
                    print!("{}", " ".repeat(indent + 2));
                    item.pretty_print(indent + 2);
                    if i < arr.len() - 1 {
                        println!(",");
                    } else {
                        println!();
                    }
                }
                print!("{}]", spaces);
            }
            JsonValue::Object(obj) => {
                println!("{{");
                for (i, (key, value)) in obj.iter().enumerate() {
                    print!("{}\"{}\": ", " ".repeat(indent + 2), key);
                    value.pretty_print(indent + 2);
                    if i < obj.len() - 1 {
                        println!(",");
                    } else {
                        println!();
                    }
                }
                print!("{}}}", spaces);
            }
        }
    }
}

fn main() {
    let data = JsonValue::Object(vec![
        ("name".to_string(), JsonValue::String("Alice".to_string())),
        ("age".to_string(), JsonValue::Number(30.0)),
        ("active".to_string(), JsonValue::Bool(true)),
        ("scores".to_string(), JsonValue::Array(vec![
            JsonValue::Number(85.5),
            JsonValue::Number(92.0),
            JsonValue::Number(78.5),
        ])),
        ("address".to_string(), JsonValue::Object(vec![
            ("city".to_string(), JsonValue::String("NYC".to_string())),
            ("zip".to_string(), JsonValue::Number(10001.0)),
        ])),
    ]);

    data.pretty_print(0);
    println!();
}
```

## Log Events với Enum

```rust
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone)]
enum LogLevel {
    Info,
    Warning,
    Error,
}

#[derive(Debug, Clone)]
enum LogEvent {
    Message {
        level: LogLevel,
        message: String,
        timestamp: u64,
    },
    Metric {
        name: String,
        value: f64,
        timestamp: u64,
    },
    Error {
        error: String,
        stack_trace: Option<String>,
        timestamp: u64,
    },
}

impl LogEvent {
    fn info(message: &str) -> Self {
        LogEvent::Message {
            level: LogLevel::Info,
            message: message.to_string(),
            timestamp: Self::now(),
        }
    }

    fn metric(name: &str, value: f64) -> Self {
        LogEvent::Metric {
            name: name.to_string(),
            value,
            timestamp: Self::now(),
        }
    }

    fn error(error: &str, stack_trace: Option<String>) -> Self {
        LogEvent::Error {
            error: error.to_string(),
            stack_trace,
            timestamp: Self::now(),
        }
    }

    fn now() -> u64 {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs()
    }

    fn format(&self) -> String {
        match self {
            LogEvent::Message { level, message, timestamp } => {
                format!("[{:?}] {} - {}", level, timestamp, message)
            }
            LogEvent::Metric { name, value, timestamp } => {
                format!("[METRIC] {} - {}: {}", timestamp, name, value)
            }
            LogEvent::Error { error, stack_trace, timestamp } => {
                let mut output = format!("[ERROR] {} - {}", timestamp, error);
                if let Some(trace) = stack_trace {
                    output.push_str(&format!("\n{}", trace));
                }
                output
            }
        }
    }
}

fn main() {
    let mut events: Vec<LogEvent> = Vec::new();

    // Log different types of events
    events.push(LogEvent::info("Application started"));
    events.push(LogEvent::metric("cpu_usage", 45.2));
    events.push(LogEvent::info("Processing request"));
    events.push(LogEvent::metric("response_time_ms", 123.5));
    events.push(LogEvent::error(
        "Database connection failed",
        Some("at main.rs:42".to_string()),
    ));

    // Print all events
    for event in &events {
        println!("{}", event.format());
    }
}
```

## Database Row với Mixed Types

```rust
#[derive(Debug, Clone)]
enum SqlValue {
    Integer(i64),
    Real(f64),
    Text(String),
    Blob(Vec<u8>),
    Null,
}

impl SqlValue {
    fn type_name(&self) -> &str {
        match self {
            SqlValue::Integer(_) => "INTEGER",
            SqlValue::Real(_) => "REAL",
            SqlValue::Text(_) => "TEXT",
            SqlValue::Blob(_) => "BLOB",
            SqlValue::Null => "NULL",
        }
    }

    fn to_sql(&self) -> String {
        match self {
            SqlValue::Integer(n) => n.to_string(),
            SqlValue::Real(f) => f.to_string(),
            SqlValue::Text(s) => format!("'{}'", s.replace('\'', "''")),
            SqlValue::Blob(_) => "<binary data>".to_string(),
            SqlValue::Null => "NULL".to_string(),
        }
    }
}

type Row = Vec<SqlValue>;

struct Table {
    columns: Vec<String>,
    rows: Vec<Row>,
}

impl Table {
    fn new(columns: Vec<String>) -> Self {
        Table {
            columns,
            rows: Vec::new(),
        }
    }

    fn insert(&mut self, row: Row) {
        assert_eq!(row.len(), self.columns.len(), "Row size mismatch");
        self.rows.push(row);
    }

    fn print(&self) {
        // Print header
        for (i, col) in self.columns.iter().enumerate() {
            if i > 0 {
                print!(" | ");
            }
            print!("{:<15}", col);
        }
        println!();

        // Print separator
        println!("{}", "-".repeat(self.columns.len() * 18));

        // Print rows
        for row in &self.rows {
            for (i, value) in row.iter().enumerate() {
                if i > 0 {
                    print!(" | ");
                }
                print!("{:<15}", value.to_sql());
            }
            println!();
        }
    }
}

fn main() {
    let mut users = Table::new(vec![
        "id".to_string(),
        "name".to_string(),
        "age".to_string(),
        "salary".to_string(),
        "notes".to_string(),
    ]);

    users.insert(vec![
        SqlValue::Integer(1),
        SqlValue::Text("Alice".to_string()),
        SqlValue::Integer(30),
        SqlValue::Real(75000.50),
        SqlValue::Text("Team lead".to_string()),
    ]);

    users.insert(vec![
        SqlValue::Integer(2),
        SqlValue::Text("Bob".to_string()),
        SqlValue::Integer(25),
        SqlValue::Real(60000.00),
        SqlValue::Null,
    ]);

    users.insert(vec![
        SqlValue::Integer(3),
        SqlValue::Text("Charlie".to_string()),
        SqlValue::Null,
        SqlValue::Real(80000.75),
        SqlValue::Text("Senior dev".to_string()),
    ]);

    users.print();
}
```

Output:
```
id              | name            | age             | salary          | notes
----------------------------------------------------------------------
1               | 'Alice'         | 30              | 75000.5         | 'Team lead'
2               | 'Bob'           | 25              | 60000           | NULL
3               | 'Charlie'       | NULL            | 80000.75        | 'Senior dev'
```

## Configuration Values

```rust
#[derive(Debug, Clone)]
enum ConfigValue {
    String(String),
    Integer(i64),
    Float(f64),
    Boolean(bool),
    Array(Vec<ConfigValue>),
    Map(Vec<(String, ConfigValue)>),
}

impl ConfigValue {
    fn as_string(&self) -> Option<&str> {
        if let ConfigValue::String(s) = self {
            Some(s)
        } else {
            None
        }
    }

    fn as_int(&self) -> Option<i64> {
        if let ConfigValue::Integer(n) = self {
            Some(*n)
        } else {
            None
        }
    }

    fn as_bool(&self) -> Option<bool> {
        if let ConfigValue::Boolean(b) = self {
            Some(*b)
        } else {
            None
        }
    }

    fn get(&self, key: &str) -> Option<&ConfigValue> {
        if let ConfigValue::Map(map) = self {
            map.iter()
                .find(|(k, _)| k == key)
                .map(|(_, v)| v)
        } else {
            None
        }
    }
}

fn main() {
    let config = ConfigValue::Map(vec![
        ("app_name".to_string(), ConfigValue::String("MyApp".to_string())),
        ("port".to_string(), ConfigValue::Integer(8080)),
        ("debug".to_string(), ConfigValue::Boolean(true)),
        ("allowed_hosts".to_string(), ConfigValue::Array(vec![
            ConfigValue::String("localhost".to_string()),
            ConfigValue::String("127.0.0.1".to_string()),
        ])),
        ("database".to_string(), ConfigValue::Map(vec![
            ("host".to_string(), ConfigValue::String("localhost".to_string())),
            ("port".to_string(), ConfigValue::Integer(5432)),
            ("name".to_string(), ConfigValue::String("mydb".to_string())),
        ])),
    ]);

    // Access config values
    if let Some(name) = config.get("app_name").and_then(|v| v.as_string()) {
        println!("App name: {}", name);
    }

    if let Some(port) = config.get("port").and_then(|v| v.as_int()) {
        println!("Port: {}", port);
    }

    if let Some(db) = config.get("database") {
        if let Some(db_host) = db.get("host").and_then(|v| v.as_string()) {
            println!("Database host: {}", db_host);
        }
    }
}
```

## Processing Mixed Data Types

```rust
#[derive(Debug, Clone)]
enum DataType {
    Int(i64),
    Float(f64),
    String(String),
    Bool(bool),
}

impl DataType {
    fn to_float(&self) -> Option<f64> {
        match self {
            DataType::Int(n) => Some(*n as f64),
            DataType::Float(f) => Some(*f),
            DataType::String(s) => s.parse().ok(),
            DataType::Bool(b) => Some(if *b { 1.0 } else { 0.0 }),
        }
    }

    fn to_string(&self) -> String {
        match self {
            DataType::Int(n) => n.to_string(),
            DataType::Float(f) => f.to_string(),
            DataType::String(s) => s.clone(),
            DataType::Bool(b) => b.to_string(),
        }
    }
}

fn calculate_sum(values: &[DataType]) -> f64 {
    values.iter()
        .filter_map(|v| v.to_float())
        .sum()
}

fn calculate_average(values: &[DataType]) -> Option<f64> {
    let nums: Vec<f64> = values.iter()
        .filter_map(|v| v.to_float())
        .collect();

    if nums.is_empty() {
        None
    } else {
        Some(nums.iter().sum::<f64>() / nums.len() as f64)
    }
}

fn main() {
    let data = vec![
        DataType::Int(10),
        DataType::Float(20.5),
        DataType::String("15".to_string()),
        DataType::Bool(true),  // counts as 1.0
        DataType::Int(30),
    ];

    println!("Values: {:?}", data);
    println!("Sum: {}", calculate_sum(&data));

    if let Some(avg) = calculate_average(&data) {
        println!("Average: {:.2}", avg);
    }
}
```

Output:
```
Values: [Int(10), Float(20.5), String("15"), Bool(true), Int(30)]
Sum: 76.5
Average: 15.30
```

## Message Queue Events

```rust
#[derive(Debug, Clone)]
enum Message {
    Text { user: String, content: String },
    Image { user: String, url: String, size: usize },
    Video { user: String, url: String, duration: u32 },
    System { message: String },
}

impl Message {
    fn user(&self) -> Option<&str> {
        match self {
            Message::Text { user, .. } => Some(user),
            Message::Image { user, .. } => Some(user),
            Message::Video { user, .. } => Some(user),
            Message::System { .. } => None,
        }
    }

    fn format(&self) -> String {
        match self {
            Message::Text { user, content } => {
                format!("[{}]: {}", user, content)
            }
            Message::Image { user, url, size } => {
                format!("[{}] sent an image ({} bytes): {}", user, size, url)
            }
            Message::Video { user, url, duration } => {
                format!("[{}] sent a video ({}s): {}", user, duration, url)
            }
            Message::System { message } => {
                format!("[SYSTEM] {}", message)
            }
        }
    }
}

fn main() {
    let messages: Vec<Message> = vec![
        Message::System {
            message: "Chat room opened".to_string(),
        },
        Message::Text {
            user: "Alice".to_string(),
            content: "Hello everyone!".to_string(),
        },
        Message::Image {
            user: "Bob".to_string(),
            url: "https://example.com/pic.jpg".to_string(),
            size: 1024000,
        },
        Message::Text {
            user: "Charlie".to_string(),
            content: "Nice pic!".to_string(),
        },
        Message::Video {
            user: "Alice".to_string(),
            url: "https://example.com/video.mp4".to_string(),
            duration: 120,
        },
    ];

    for msg in &messages {
        println!("{}", msg.format());
    }

    println!("\n--- User Statistics ---");
    let mut user_messages: std::collections::HashMap<String, usize> =
        std::collections::HashMap::new();

    for msg in &messages {
        if let Some(user) = msg.user() {
            *user_messages.entry(user.to_string()).or_insert(0) += 1;
        }
    }

    for (user, count) in user_messages {
        println!("{}: {} messages", user, count);
    }
}
```

## Best Practices

### 1. Derive useful traits

```rust
// ✅ Derive Debug, Clone khi cần
#[derive(Debug, Clone, PartialEq)]
enum Value {
    Int(i32),
    String(String),
}
```

### 2. Provide helper methods

```rust
enum Value {
    Int(i32),
    Float(f64),
}

impl Value {
    fn as_int(&self) -> Option<i32> {
        if let Value::Int(n) = self {
            Some(*n)
        } else {
            None
        }
    }

    fn to_float(&self) -> f64 {
        match self {
            Value::Int(n) => *n as f64,
            Value::Float(f) => *f,
        }
    }
}
```

### 3. Use pattern matching

```rust
// ✅ Exhaustive match
fn process(value: &Value) {
    match value {
        Value::Int(n) => println!("Integer: {}", n),
        Value::Float(f) => println!("Float: {}", f),
        Value::String(s) => println!("String: {}", s),
    }
}
```

### 4. Consider memory layout

```rust
// ❌ Large size difference - wastes memory
enum Bad {
    Small(u8),        // 1 byte
    Large([u8; 1024]) // 1024 bytes
}
// Size = 1024 + tag + padding

// ✅ Box large variants
enum Better {
    Small(u8),
    Large(Box<[u8; 1024]>)  // Pointer size
}
// Size = 8 + tag + padding (on 64-bit)
```

## Khi nào dùng Enum trong Vec?

### ✅ Nên dùng khi:

1. **Fixed set of types** - Biết trước các types cần lưu
2. **Type-safe operations** - Cần xử lý từng type khác nhau
3. **Pattern matching** - Muốn use exhaustive matching
4. **No trait objects** - Không thể dùng `dyn Trait`

### ❌ Không phù hợp khi:

1. **Too many types** - Enum quá lớn
2. **Dynamic types** - Types chỉ biết runtime
3. **Large variants** - Waste memory
4. **Shared behavior** - Trait objects phù hợp hơn

## So sánh với Trait Objects

### Enum approach

```rust
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
            Shape::Rectangle { width, height } => width * height,
        }
    }
}

let shapes = vec![
    Shape::Circle { radius: 5.0 },
    Shape::Rectangle { width: 10.0, height: 20.0 },
];
```

### Trait object approach

```rust
trait Shape {
    fn area(&self) -> f64;
}

struct Circle { radius: f64 }
struct Rectangle { width: f64, height: f64 }

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}

impl Shape for Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}

let shapes: Vec<Box<dyn Shape>> = vec![
    Box::new(Circle { radius: 5.0 }),
    Box::new(Rectangle { width: 10.0, height: 20.0 }),
];
```

**Enum**: Compile-time dispatch, exhaustive matching, no heap allocation
**Trait object**: Runtime dispatch, extensible, heap allocation

## Tổng kết

Sử dụng Enum để chứa nhiều loại dữ liệu trong Vec:
- ✅ Type-safe và compile-time checked
- ✅ Pattern matching exhaustive
- ✅ No heap allocation (except data inside variants)
- ✅ Clear và explicit về các types có thể chứa

Best practices:
1. Derive useful traits (Debug, Clone, PartialEq)
2. Provide helper methods (as_*, to_*, is_*)
3. Use pattern matching cho type-safe operations
4. Box large variants để tránh waste memory
5. Consider trait objects nếu cần extensibility

Common use cases:
- Mixed data types trong database rows
- JSON/config values
- Log events
- Message queues
- Spreadsheet cells

## References

- [Enums - The Rust Book](https://doc.rust-lang.org/book/ch06-00-enums.html)
- [Using Enums - Rust By Example](https://doc.rust-lang.org/rust-by-example/custom_types/enum.html)
- [Pattern Matching](https://doc.rust-lang.org/book/ch18-00-patterns.html)
