# Error Handling Patterns

Rust error handling patterns sử dụng `Result<T, E>` type cùng với các idioms và libraries như `thiserror` và `anyhow` để handle errors một cách idiomatic, type-safe và ergonomic.

## Nguyên tắc

- **Libraries**: Dùng custom error types với `thiserror`
- **Applications**: Dùng `anyhow::Result` cho flexibility
- **Avoid `unwrap()`**: Chỉ dùng khi chắc chắn không fail
- **Contextual errors**: Thêm context cho easier debugging

## Basic Error Handling

### Pattern 1: Result với Standard Errors

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file(path: &str) -> io::Result<String> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn main() {
    match read_file("data.txt") {
        Ok(contents) => println!("Contents: {}", contents),
        Err(e) => eprintln!("Error reading file: {}", e),
    }
}
```

### Pattern 2: Custom Error Enum

```rust
#[derive(Debug)]
enum DataError {
    IoError(std::io::Error),
    ParseError(String),
    ValidationError(String),
}

impl std::fmt::Display for DataError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            DataError::IoError(e) => write!(f, "IO error: {}", e),
            DataError::ParseError(msg) => write!(f, "Parse error: {}", msg),
            DataError::ValidationError(msg) => write!(f, "Validation error: {}", msg),
        }
    }
}

impl std::error::Error for DataError {}

impl From<std::io::Error> for DataError {
    fn from(error: std::io::Error) -> Self {
        DataError::IoError(error)
    }
}

fn process_data(data: &str) -> Result<i32, DataError> {
    if data.is_empty() {
        return Err(DataError::ValidationError("Data is empty".to_string()));
    }

    data.parse::<i32>()
        .map_err(|_| DataError::ParseError(format!("Cannot parse: {}", data)))
}

fn main() {
    match process_data("42") {
        Ok(num) => println!("Parsed: {}", num),
        Err(e) => eprintln!("Error: {}", e),
    }
}
```

## Using `thiserror` - For Libraries

`thiserror` giúp define custom error types dễ dàng hơn:

```toml
[dependencies]
thiserror = "1.0"
```

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum DataError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Parse error: {0}")]
    Parse(String),

    #[error("Validation failed: {field} is {reason}")]
    Validation {
        field: String,
        reason: String,
    },

    #[error("Record not found: {0}")]
    NotFound(u64),

    #[error("Database error")]
    Database(#[from] DatabaseError),
}

#[derive(Error, Debug)]
#[error("Database connection failed")]
struct DatabaseError;

// Automatic From implementation nhờ #[from]
fn read_config() -> Result<String, DataError> {
    std::fs::read_to_string("config.toml")?  // Auto convert io::Error
}

fn validate_email(email: &str) -> Result<(), DataError> {
    if !email.contains('@') {
        return Err(DataError::Validation {
            field: "email".to_string(),
            reason: "missing @ symbol".to_string(),
        });
    }
    Ok(())
}

fn main() {
    match validate_email("invalid") {
        Ok(_) => println!("Valid email"),
        Err(e) => eprintln!("Error: {}", e),
        // Output: Error: Validation failed: email is missing @ symbol
    }
}
```

## Using `anyhow` - For Applications

`anyhow` cung cấp error type linh hoạt cho applications:

```toml
[dependencies]
anyhow = "1.0"
```

```rust
use anyhow::{Context, Result, bail, ensure};

fn read_user_from_file(path: &str) -> Result<User> {
    let contents = std::fs::read_to_string(path)
        .context(format!("Failed to read user file: {}", path))?;

    let user: User = serde_json::from_str(&contents)
        .context("Failed to parse user JSON")?;

    ensure!(user.age >= 18, "User must be 18 or older, got {}", user.age);

    if user.name.is_empty() {
        bail!("User name cannot be empty");
    }

    Ok(user)
}

#[derive(serde::Deserialize)]
struct User {
    name: String,
    age: u32,
}

fn main() -> Result<()> {
    let user = read_user_from_file("user.json")?;

    println!("User: {}", user.name);

    Ok(())
}

// Error chain example:
// Error: Failed to read user file: user.json
//
// Caused by:
//     No such file or directory (os error 2)
```

## Pattern: Error Context

### Với `anyhow`

```rust
use anyhow::{Context, Result};

fn load_dataset(id: u64) -> Result<Vec<Record>> {
    let path = format!("data_{}.csv", id);

    let file = std::fs::File::open(&path)
        .with_context(|| format!("Failed to open dataset {}", id))?;

    let mut reader = csv::Reader::from_reader(file);

    let records: Vec<Record> = reader.deserialize()
        .collect::<Result<Vec<_>, _>>()
        .with_context(|| format!("Failed to parse CSV for dataset {}", id))?;

    ensure!(!records.is_empty(), "Dataset {} is empty", id);

    Ok(records)
}

#[derive(serde::Deserialize)]
struct Record {
    id: u64,
    value: String,
}
```

### Custom Context Chain

```rust
use anyhow::{Result, Context};

fn process_pipeline(input_path: &str, output_path: &str) -> Result<()> {
    extract(input_path)
        .context("Extract stage failed")?;

    transform()
        .context("Transform stage failed")?;

    load(output_path)
        .context("Load stage failed")?;

    Ok(())
}

fn extract(path: &str) -> Result<()> {
    std::fs::read_to_string(path)
        .with_context(|| format!("Cannot read input file: {}", path))?;
    Ok(())
}

fn transform() -> Result<()> {
    // Transform logic
    Ok(())
}

fn load(path: &str) -> Result<()> {
    std::fs::write(path, "data")
        .with_context(|| format!("Cannot write output file: {}", path))?;
    Ok(())
}
```

## Pattern: Error Conversion

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum PipelineError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("CSV error: {0}")]
    Csv(#[from] csv::Error),

    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("Parse error: {0}")]
    Parse(#[from] std::num::ParseIntError),
}

fn read_csv(path: &str) -> Result<Vec<Vec<String>>, PipelineError> {
    let file = std::fs::File::open(path)?;  // Auto convert io::Error
    let mut reader = csv::Reader::from_reader(file);

    let mut records = Vec::new();
    for result in reader.records() {
        let record = result?;  // Auto convert csv::Error
        records.push(record.iter().map(|s| s.to_string()).collect());
    }

    Ok(records)
}

fn parse_numbers(data: &str) -> Result<Vec<i32>, PipelineError> {
    data.split(',')
        .map(|s| s.trim().parse::<i32>())
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.into())  // Auto convert ParseIntError
}
```

## Pattern: Result Extensions

```rust
trait ResultExt<T> {
    fn log_error(self) -> Self;
    fn with_field(self, field: &str, value: &str) -> Self;
}

impl<T, E: std::fmt::Display> ResultExt<T> for Result<T, E> {
    fn log_error(self) -> Self {
        if let Err(ref e) = self {
            eprintln!("Error occurred: {}", e);
        }
        self
    }

    fn with_field(self, field: &str, value: &str) -> Self {
        if let Err(ref e) = self {
            eprintln!("Error in {} ({}): {}", field, value, e);
        }
        self
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let result = process_user("user123")
        .log_error()
        .with_field("user_id", "user123")?;

    Ok(())
}

fn process_user(id: &str) -> Result<(), Box<dyn std::error::Error>> {
    // Processing logic
    Ok(())
}
```

## Pattern: Early Return với `?`

```rust
use anyhow::Result;

fn validate_and_process(data: &str) -> Result<i32> {
    // Early returns với ?
    let trimmed = data.trim();

    ensure!(!trimmed.is_empty(), "Input is empty");

    let number: i32 = trimmed.parse()
        .context("Failed to parse as integer")?;

    ensure!(number > 0, "Number must be positive, got {}", number);
    ensure!(number < 1000, "Number too large: {}", number);

    Ok(number * 2)
}

fn main() -> Result<()> {
    let result = validate_and_process("  42  ")?;
    println!("Result: {}", result);

    Ok(())
}
```

## Pattern: Multiple Error Types

```rust
use anyhow::Result;

fn complex_operation() -> Result<String> {
    // Có thể mix nhiều error types khác nhau
    let file_contents = std::fs::read_to_string("config.toml")?;  // io::Error

    let config: Config = toml::from_str(&file_contents)?;  // toml::Error

    let response = reqwest::blocking::get(&config.url)?;  // reqwest::Error

    let data = response.text()?;  // reqwest::Error

    Ok(data)
}

#[derive(serde::Deserialize)]
struct Config {
    url: String,
}
```

## Pattern: Fallback với `or_else`

```rust
use anyhow::Result;

fn read_config() -> Result<String> {
    // Try primary source
    std::fs::read_to_string("config.toml")
        .or_else(|_| {
            // Fallback to backup
            println!("Primary config not found, using backup");
            std::fs::read_to_string("config.backup.toml")
        })
        .or_else(|_| {
            // Last resort: default config
            println!("No config files found, using defaults");
            Ok(String::from("[default]"))
        })
}
```

## Pattern: Collect Results

```rust
use anyhow::Result;

fn process_files(paths: &[&str]) -> Result<Vec<String>> {
    // Collect results - dừng tại error đầu tiên
    paths.iter()
        .map(|path| std::fs::read_to_string(path))
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.into())
}

fn process_files_continue(paths: &[&str]) -> Vec<Result<String>> {
    // Process tất cả, collect các results
    paths.iter()
        .map(|path| {
            std::fs::read_to_string(path)
                .map_err(|e| e.into())
        })
        .collect()
}

fn main() -> Result<()> {
    let paths = vec!["file1.txt", "file2.txt", "file3.txt"];

    // Stop on first error
    let results = process_files(&paths)?;

    // Or continue processing
    let all_results = process_files_continue(&paths);
    for (i, result) in all_results.iter().enumerate() {
        match result {
            Ok(contents) => println!("File {}: {} bytes", i, contents.len()),
            Err(e) => eprintln!("File {}: Error - {}", i, e),
        }
    }

    Ok(())
}
```

## Real-World Example: Data Pipeline

```rust
use anyhow::{Context, Result, bail};
use thiserror::Error;

#[derive(Error, Debug)]
enum PipelineError {
    #[error("Validation failed: {0}")]
    Validation(String),

    #[error("Processing error at row {row}: {message}")]
    Processing { row: usize, message: String },

    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    Csv(#[from] csv::Error),
}

struct DataPipeline {
    input_path: String,
    output_path: String,
}

impl DataPipeline {
    fn new(input: &str, output: &str) -> Self {
        DataPipeline {
            input_path: input.to_string(),
            output_path: output.to_string(),
        }
    }

    fn run(&self) -> Result<PipelineStats> {
        println!("Starting pipeline...");

        let records = self.extract()
            .context("Extract stage failed")?;

        let processed = self.transform(records)
            .context("Transform stage failed")?;

        self.load(&processed)
            .context("Load stage failed")?;

        Ok(PipelineStats {
            records_processed: processed.len(),
            records_written: processed.len(),
        })
    }

    fn extract(&self) -> Result<Vec<Record>, PipelineError> {
        let file = std::fs::File::open(&self.input_path)?;
        let mut reader = csv::Reader::from_reader(file);

        let mut records = Vec::new();
        for result in reader.deserialize() {
            let record: Record = result?;
            records.push(record);
        }

        if records.is_empty() {
            return Err(PipelineError::Validation(
                "No records found in input file".to_string()
            ));
        }

        Ok(records)
    }

    fn transform(&self, records: Vec<Record>) -> Result<Vec<Record>, PipelineError> {
        let mut processed = Vec::new();

        for (i, mut record) in records.into_iter().enumerate() {
            // Validate
            if record.value < 0.0 {
                return Err(PipelineError::Processing {
                    row: i,
                    message: format!("Negative value: {}", record.value),
                });
            }

            // Transform
            record.value *= 1.1;
            processed.push(record);
        }

        Ok(processed)
    }

    fn load(&self, records: &[Record]) -> Result<(), PipelineError> {
        let file = std::fs::File::create(&self.output_path)?;
        let mut writer = csv::Writer::from_writer(file);

        for record in records {
            writer.serialize(record)?;
        }

        writer.flush()?;
        Ok(())
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct Record {
    id: u64,
    name: String,
    value: f64,
}

struct PipelineStats {
    records_processed: usize,
    records_written: usize,
}

fn main() -> Result<()> {
    let pipeline = DataPipeline::new("input.csv", "output.csv");

    match pipeline.run() {
        Ok(stats) => {
            println!("Pipeline completed successfully!");
            println!("  Processed: {}", stats.records_processed);
            println!("  Written: {}", stats.records_written);
        }
        Err(e) => {
            eprintln!("Pipeline failed: {}", e);
            eprintln!("\nError chain:");
            for cause in e.chain() {
                eprintln!("  - {}", cause);
            }
            return Err(e);
        }
    }

    Ok(())
}
```

## Best Practices

### 1. Use `?` for propagation

```rust
// ✅ Clean và concise
fn read_data(path: &str) -> Result<String> {
    let data = std::fs::read_to_string(path)?;
    Ok(data)
}

// ❌ Verbose
fn read_data_verbose(path: &str) -> Result<String> {
    match std::fs::read_to_string(path) {
        Ok(data) => Ok(data),
        Err(e) => Err(e.into()),
    }
}
```

### 2. Add context cho errors

```rust
// ✅ Helpful error messages
use anyhow::Context;

fn load_user(id: u64) -> Result<User> {
    let path = format!("users/{}.json", id);
    let data = std::fs::read_to_string(&path)
        .with_context(|| format!("Failed to load user {}", id))?;

    serde_json::from_str(&data)
        .with_context(|| format!("Failed to parse user {}", id))
}
```

### 3. Avoid `unwrap()` trong production code

```rust
// ❌ Dangerous
let value = some_operation().unwrap();

// ✅ Handle errors properly
let value = some_operation()
    .context("Operation failed")?;

// ✅ Or provide default
let value = some_operation().unwrap_or_default();
```

### 4. Use `thiserror` cho libraries

```rust
// Library code - concrete error types
#[derive(Error, Debug)]
pub enum MyLibError {
    #[error("Configuration error: {0}")]
    Config(String),

    #[error("Network error: {0}")]
    Network(#[from] std::io::Error),
}

pub fn library_function() -> Result<(), MyLibError> {
    // ...
    Ok(())
}
```

### 5. Use `anyhow` cho applications

```rust
// Application code - flexible errors
use anyhow::Result;

fn main() -> Result<()> {
    let config = load_config()?;
    let data = fetch_data(&config)?;
    process(data)?;
    Ok(())
}
```

## When to Use What?

| Use Case | Recommendation |
|----------|---------------|
| **Library code** | `thiserror` - Concrete error types |
| **Application code** | `anyhow` - Flexible error handling |
| **Need error details** | `thiserror` - Callers handle variants |
| **Just propagate errors** | `anyhow` - Simple error passing |
| **Error context** | Both - Use `.context()` |
| **Multiple error types** | `anyhow` - Easy mixing |

## Tổng kết

Error handling patterns trong Rust:
- ✅ Type-safe với `Result<T, E>`
- ✅ `thiserror` cho custom errors
- ✅ `anyhow` cho application errors
- ✅ Context cho better debugging
- ✅ `?` operator cho propagation

Best practices:
1. Use `?` thay vì `unwrap()`
2. Add context với `.context()`
3. `thiserror` cho libraries, `anyhow` cho apps
4. Handle errors, không ignore
5. Provide helpful error messages

## References

- [Error Handling - The Rust Book](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
- [thiserror](https://docs.rs/thiserror)
- [anyhow](https://docs.rs/anyhow)
- [Error Handling Survey](https://blog.yoshuawuyts.com/error-handling-survey/)
