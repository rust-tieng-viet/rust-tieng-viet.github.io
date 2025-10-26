# RAII Guards

RAII (Resource Acquisition Is Initialization) là một pattern quan trọng trong Rust, đảm bảo resources được giải phóng tự động khi object ra khỏi scope. RAII guards sử dụng pattern này để quản lý locks, files, connections và các resources khác một cách an toàn.

## RAII trong Rust

Rust enforces RAII - khi một object đi ra khỏi scope, destructor của nó được gọi tự động:

```rust
struct Resource {
    name: String,
}

impl Resource {
    fn new(name: &str) -> Self {
        println!("Acquiring resource: {}", name);
        Resource {
            name: name.to_string(),
        }
    }
}

impl Drop for Resource {
    fn drop(&mut self) {
        println!("Releasing resource: {}", self.name);
    }
}

fn main() {
    println!("Program start");

    {
        let _r = Resource::new("database");
        println!("Using resource");
    }  // Resource tự động được drop ở đây

    println!("Program end");
}
```

Output:
```
Program start
Acquiring resource: database
Using resource
Releasing resource: database
Program end
```

## Mutex Guards

Standard library sử dụng RAII guards cho mutex locks:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            // lock() trả về MutexGuard
            let mut num = counter.lock().unwrap();
            *num += 1;
            // MutexGuard tự động unlock khi ra khỏi scope
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

## Custom RAII Guard

Tạo custom guard cho database connection:

```rust
use std::fmt;

struct DatabaseConnection {
    name: String,
}

impl DatabaseConnection {
    fn new(name: &str) -> Self {
        println!("Opening database connection: {}", name);
        DatabaseConnection {
            name: name.to_string(),
        }
    }

    fn execute(&self, query: &str) {
        println!("[{}] Executing: {}", self.name, query);
    }
}

impl Drop for DatabaseConnection {
    fn drop(&mut self) {
        println!("Closing database connection: {}", self.name);
    }
}

fn main() {
    {
        let db = DatabaseConnection::new("postgres");
        db.execute("SELECT * FROM users");
        db.execute("INSERT INTO logs VALUES (...)");
        // Connection tự động close khi db ra khỏi scope
    }

    println!("Connection đã được đóng");
}
```

## File Guards trong Data Engineering

```rust
use std::fs::File;
use std::io::{self, BufReader, BufRead, Write};

struct CsvWriter {
    file: File,
    records_written: usize,
}

impl CsvWriter {
    fn new(path: &str) -> io::Result<Self> {
        println!("Opening CSV file for writing: {}", path);
        let file = File::create(path)?;
        Ok(CsvWriter {
            file,
            records_written: 0,
        })
    }

    fn write_record(&mut self, record: &str) -> io::Result<()> {
        writeln!(self.file, "{}", record)?;
        self.records_written += 1;
        Ok(())
    }
}

impl Drop for CsvWriter {
    fn drop(&mut self) {
        println!(
            "Closing CSV file. Total records written: {}",
            self.records_written
        );
        // File tự động flush và close
    }
}

fn main() -> io::Result<()> {
    {
        let mut writer = CsvWriter::new("output.csv")?;
        writer.write_record("name,age,city")?;
        writer.write_record("Alice,30,NYC")?;
        writer.write_record("Bob,25,SF")?;
        // File tự động close khi writer ra khỏi scope
    }

    println!("File đã được đóng và flushed");
    Ok(())
}
```

## Timer Guard cho Performance Tracking

```rust
use std::time::Instant;

struct Timer {
    name: String,
    start: Instant,
}

impl Timer {
    fn new(name: &str) -> Self {
        println!("Starting timer: {}", name);
        Timer {
            name: name.to_string(),
            start: Instant::now(),
        }
    }
}

impl Drop for Timer {
    fn drop(&mut self) {
        let duration = self.start.elapsed();
        println!("Timer '{}' finished: {:.2?}", self.name, duration);
    }
}

fn process_data() {
    let _timer = Timer::new("process_data");

    // Simulate work
    let mut sum = 0;
    for i in 0..1_000_000 {
        sum += i;
    }

    println!("Processing complete, sum = {}", sum);
    // Timer tự động print elapsed time khi function return
}

fn main() {
    process_data();
    println!("Done");
}
```

## Transaction Guard

```rust
use std::cell::RefCell;

struct Database {
    data: RefCell<Vec<String>>,
}

struct Transaction<'a> {
    db: &'a Database,
    changes: Vec<String>,
    committed: bool,
}

impl Database {
    fn new() -> Self {
        Database {
            data: RefCell::new(Vec::new()),
        }
    }

    fn begin_transaction(&self) -> Transaction {
        println!("BEGIN TRANSACTION");
        Transaction {
            db: self,
            changes: Vec::new(),
            committed: false,
        }
    }

    fn get_data(&self) -> Vec<String> {
        self.data.borrow().clone()
    }
}

impl<'a> Transaction<'a> {
    fn insert(&mut self, value: String) {
        println!("INSERT: {}", value);
        self.changes.push(value);
    }

    fn commit(mut self) {
        println!("COMMIT");
        let mut data = self.db.data.borrow_mut();
        data.extend(self.changes.drain(..));
        self.committed = true;
    }
}

impl<'a> Drop for Transaction<'a> {
    fn drop(&mut self) {
        if !self.committed {
            println!("ROLLBACK - transaction was not committed");
        }
    }
}

fn main() {
    let db = Database::new();

    // Transaction được commit
    {
        let mut tx = db.begin_transaction();
        tx.insert("Record 1".to_string());
        tx.insert("Record 2".to_string());
        tx.commit();
    }

    println!("Data after commit: {:?}", db.get_data());

    // Transaction bị rollback
    {
        let mut tx = db.begin_transaction();
        tx.insert("Record 3".to_string());
        // Không commit - sẽ tự động rollback
    }

    println!("Data after rollback: {:?}", db.get_data());
}
```

## Scoped Thread Guard

```rust
use std::thread;
use std::sync::mpsc;

struct Worker {
    name: String,
    handle: Option<thread::JoinHandle<()>>,
}

impl Worker {
    fn new(name: &str) -> Self {
        let name_clone = name.to_string();
        let handle = thread::spawn(move || {
            println!("Worker {} started", name_clone);
            thread::sleep(std::time::Duration::from_millis(100));
            println!("Worker {} finished", name_clone);
        });

        Worker {
            name: name.to_string(),
            handle: Some(handle),
        }
    }
}

impl Drop for Worker {
    fn drop(&mut self) {
        println!("Waiting for worker {} to finish...", self.name);
        if let Some(handle) = self.handle.take() {
            handle.join().unwrap();
        }
        println!("Worker {} cleaned up", self.name);
    }
}

fn main() {
    {
        let _worker1 = Worker::new("A");
        let _worker2 = Worker::new("B");
        println!("Workers created");
        // Workers tự động joined khi ra khỏi scope
    }

    println!("All workers finished");
}
```

## Data Pipeline Guard

```rust
use std::time::Instant;

struct PipelineStage {
    name: String,
    start_time: Instant,
    items_processed: usize,
}

impl PipelineStage {
    fn new(name: &str) -> Self {
        println!("▶ Starting stage: {}", name);
        PipelineStage {
            name: name.to_string(),
            start_time: Instant::now(),
            items_processed: 0,
        }
    }

    fn process_item(&mut self) {
        self.items_processed += 1;
    }
}

impl Drop for PipelineStage {
    fn drop(&mut self) {
        let duration = self.start_time.elapsed();
        let rate = if duration.as_secs() > 0 {
            self.items_processed as f64 / duration.as_secs_f64()
        } else {
            0.0
        };

        println!(
            "✓ Finished stage: {} | Items: {} | Duration: {:.2?} | Rate: {:.2} items/sec",
            self.name, self.items_processed, duration, rate
        );
    }
}

fn process_pipeline(data: &[i32]) {
    {
        let mut stage1 = PipelineStage::new("Extract");
        for _ in data {
            stage1.process_item();
        }
    }

    {
        let mut stage2 = PipelineStage::new("Transform");
        for _ in data {
            stage2.process_item();
            // Simulate work
            std::thread::sleep(std::time::Duration::from_micros(10));
        }
    }

    {
        let mut stage3 = PipelineStage::new("Load");
        for _ in data {
            stage3.process_item();
        }
    }
}

fn main() {
    let data: Vec<i32> = (1..=1000).collect();
    println!("Processing pipeline with {} items\n", data.len());

    process_pipeline(&data);

    println!("\nPipeline complete");
}
```

## Resource Pool Guard

```rust
use std::sync::{Arc, Mutex};

struct ConnectionPool {
    connections: Arc<Mutex<Vec<String>>>,
}

struct PooledConnection {
    connection: Option<String>,
    pool: Arc<Mutex<Vec<String>>>,
}

impl ConnectionPool {
    fn new(size: usize) -> Self {
        let mut connections = Vec::new();
        for i in 0..size {
            connections.push(format!("Connection-{}", i));
        }

        ConnectionPool {
            connections: Arc::new(Mutex::new(connections)),
        }
    }

    fn acquire(&self) -> Option<PooledConnection> {
        let mut pool = self.connections.lock().unwrap();
        pool.pop().map(|conn| {
            println!("Acquired: {}", conn);
            PooledConnection {
                connection: Some(conn),
                pool: Arc::clone(&self.connections),
            }
        })
    }

    fn size(&self) -> usize {
        self.connections.lock().unwrap().len()
    }
}

impl PooledConnection {
    fn execute(&self, query: &str) {
        if let Some(conn) = &self.connection {
            println!("[{}] Executing: {}", conn, query);
        }
    }
}

impl Drop for PooledConnection {
    fn drop(&mut self) {
        if let Some(conn) = self.connection.take() {
            println!("Returning to pool: {}", conn);
            let mut pool = self.pool.lock().unwrap();
            pool.push(conn);
        }
    }
}

fn main() {
    let pool = ConnectionPool::new(3);
    println!("Pool size: {}\n", pool.size());

    {
        let conn1 = pool.acquire().unwrap();
        conn1.execute("SELECT * FROM users");

        {
            let conn2 = pool.acquire().unwrap();
            conn2.execute("SELECT * FROM orders");

            println!("\nPool size during usage: {}", pool.size());
            // conn2 returns to pool here
        }

        println!("Pool size after conn2 released: {}", pool.size());
        // conn1 returns to pool here
    }

    println!("\nPool size after all released: {}", pool.size());
}
```

## Defer Pattern với Guards

```rust
struct Defer<F: FnMut()> {
    f: Option<F>,
}

impl<F: FnMut()> Defer<F> {
    fn new(f: F) -> Self {
        Defer { f: Some(f) }
    }
}

impl<F: FnMut()> Drop for Defer<F> {
    fn drop(&mut self) {
        if let Some(mut f) = self.f.take() {
            f();
        }
    }
}

macro_rules! defer {
    ($($body:tt)*) => {
        let _defer = Defer::new(|| {
            $($body)*
        });
    };
}

fn main() {
    println!("Function start");

    defer! {
        println!("This runs at the end!");
    }

    println!("Function middle");

    defer! {
        println!("This also runs at the end!");
    }

    println!("Function end");
    // Defers execute in reverse order (LIFO)
}
```

## Best Practices

### 1. Always implement Drop correctly

```rust
struct FileHandle {
    path: String,
    handle: Option<std::fs::File>,
}

impl Drop for FileHandle {
    fn drop(&mut self) {
        if let Some(_file) = self.handle.take() {
            println!("Closing file: {}", self.path);
            // File automatically closed
        }
    }
}
```

### 2. Use guards cho critical sections

```rust
use std::sync::Mutex;

struct CriticalData {
    data: Mutex<Vec<i32>>,
}

impl CriticalData {
    fn modify(&self) {
        let mut guard = self.data.lock().unwrap();
        guard.push(42);
        // Lock tự động released
    }
}
```

### 3. Document guard lifetime

```rust
/// Returns a guard that holds a lock on the data.
/// The lock is released when the guard is dropped.
struct DataGuard<'a> {
    data: &'a Mutex<String>,
    _guard: std::sync::MutexGuard<'a, String>,
}
```

## Khi nào dùng RAII Guards?

### ✅ Nên dùng khi:

1. **Resource management** - Files, connections, locks
2. **Cleanup logic** - Phải chắc chắn cleanup được gọi
3. **Scoped operations** - Timing, logging, metrics
4. **Transaction semantics** - Commit/rollback
5. **Lock management** - Mutex, RwLock

### ❌ Không phù hợp khi:

1. **Manual control needed** - Cần explicit release
2. **Complex lifecycle** - Guards không đủ flexible
3. **Performance overhead** - Drop có cost cao

## Ưu điểm

- ✅ **Exception safe** - Cleanup luôn được gọi
- ✅ **No memory leaks** - Resources tự động freed
- ✅ **Clear ownership** - Type system enforced
- ✅ **Composable** - Guards có thể nest
- ✅ **Zero-cost** - Compiler optimize away

## Tổng kết

RAII Guards là một idiom cốt lõi trong Rust:
- Đảm bảo resources được cleanup đúng cách
- Type system enforces correct usage
- Tránh resource leaks và bugs
- Đặc biệt quan trọng trong data engineering cho connections, files, transactions

Best practices:
1. Implement Drop trait cho cleanup logic
2. Use guards cho locks và resources
3. Document guard lifetimes
4. Test cleanup behavior
5. Prefer RAII over manual management

## References

- [RAII Guards - Rust Design Patterns](https://rust-unofficial.github.io/patterns/patterns/behavioural/RAII.html)
- [RAII - Rust By Example](https://doc.rust-lang.org/rust-by-example/scope/raii.html)
- [Drop Trait - The Rust Book](https://doc.rust-lang.org/book/ch15-03-drop.html)
