# Async/Await - Lập trình Bất đồng bộ

Async/await là một trong những tính năng mạnh mẽ nhất của Rust, cho phép viết code bất đồng bộ (asynchronous) một cách dễ đọc và maintainable như code đồng bộ (synchronous) truyền thống.

## Tại sao cần Async Programming?

### Vấn đề với Synchronous Code

```rust,editable
use std::thread;
use std::time::Duration;

fn download_file(url: &str) -> String {
    println!("Đang tải {}...", url);
    // Giả lập download mất 2 giây
    thread::sleep(Duration::from_secs(2));
    format!("Dữ liệu từ {}", url)
}

fn main() {
    let start = std::time::Instant::now();

    // Download tuần tự - mỗi file phải đợi file trước xong
    let file1 = download_file("https://example.com/file1");
    let file2 = download_file("https://example.com/file2");
    let file3 = download_file("https://example.com/file3");

    println!("Tổng thời gian: {:?}", start.elapsed());
    // Kết quả: ~6 giây (2s × 3 files)
}
```

**Vấn đề**: Khi download file1, CPU chỉ ngồi chờ đợi network I/O. Lãng phí tài nguyên!

### Giải pháp với Async

```rust
// Với async/await, ba downloads chạy đồng thời
async fn download_file_async(url: &str) -> String {
    println!("Đang tải {}...", url);
    // Trong khi chờ network I/O, CPU có thể làm việc khác
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
    format!("Dữ liệu từ {}", url)
}

#[tokio::main]
async fn main() {
    let start = std::time::Instant::now();

    // Download song song - không phải đợi nhau
    let (file1, file2, file3) = tokio::join!(
        download_file_async("https://example.com/file1"),
        download_file_async("https://example.com/file2"),
        download_file_async("https://example.com/file3"),
    );

    println!("Tổng thời gian: {:?}", start.elapsed());
    // Kết quả: ~2 giây (chạy song song!)
}
```

**Lợi ích**: Tiết kiệm 4 giây! Từ 6s xuống 2s.

## Khái niệm Cơ bản

### Future là gì?

`Future` là một giá trị đại diện cho một computation có thể chưa hoàn thành. Khi bạn `.await` một Future, bạn đang nói: "Hãy đợi computation này hoàn thành".

```rust
use std::future::Future;

// Mỗi async function trả về một Future
async fn get_number() -> i32 {
    42
}

// Tương đương với:
fn get_number_manual() -> impl Future<Output = i32> {
    async { 42 }
}
```

### `async` Keyword

Biến một function thành async function:

```rust,editable
// Sync function - chạy ngay lập tức
fn compute_sync() -> i32 {
    println!("Computing...");
    1 + 1
}

// Async function - trả về Future, chưa chạy
async fn compute_async() -> i32 {
    println!("Computing async...");
    1 + 1
}

fn main() {
    // Sync: in ra ngay
    let result = compute_sync();
    println!("Sync result: {}", result);

    // Async: KHÔNG in ra gì!
    let future = compute_async();
    // future chưa được execute

    // Cần `.await` hoặc runtime để chạy
    // println!("Async result: {}", future.await); // Lỗi: không thể await ở đây
}
```

**Lưu ý quan trọng**: Async function **KHÔNG tự động chạy**. Chúng lazy và chỉ chạy khi được `.await`.

### `.await` Keyword

Chờ đợi một Future hoàn thành:

```rust
async fn fetch_data() -> String {
    // Giả lập network request
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    "Data".to_string()
}

#[tokio::main]
async fn main() {
    // .await đợi future hoàn thành
    let data = fetch_data().await;
    println!("Received: {}", data);
}
```

**Điều kiện**: Chỉ có thể `.await` bên trong async function hoặc async block.

## Async Runtime

Rust không có built-in async runtime. Bạn cần chọn một runtime như Tokio, async-std, hoặc smol.

### Tokio - Runtime phổ biến nhất

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

```rust
// Attribute macro biến main() thành async
#[tokio::main]
async fn main() {
    println!("Hello from async!");
}

// Tương đương với:
fn main() {
    tokio::runtime::Runtime::new()
        .unwrap()
        .block_on(async {
            println!("Hello from async!");
        })
}
```

## Async Blocks

Tạo Future inline:

```rust,editable
#[tokio::main]
async fn main() {
    // Async block
    let future = async {
        println!("Inside async block");
        42
    };

    let result = future.await;
    println!("Result: {}", result);
}
```

## Xem thêm

- [Async Functions](./async-fn.md) - Chi tiết về async functions
- [Futures và Polling](./futures.md) - Cách Future hoạt động bên trong
- [Tokio Runtime](./tokio.md) - Sử dụng Tokio chi tiết
- [Error Handling](./error-handling.md) - Xử lý lỗi trong async code
- [Concurrency Patterns](./concurrency.md) - Patterns async phổ biến
- [Performance](./performance.md) - Tối ưu async code

## Khi nào nên dùng Async?

✅ **Nên dùng cho:**
- I/O-bound tasks: Network requests, file I/O, database queries
- Web servers: Xử lý nhiều requests đồng thời
- Concurrent operations: Download nhiều files, call nhiều APIs

❌ **Không nên dùng cho:**
- CPU-bound tasks: Tính toán nặng (dùng threads thay vì)
- Simple scripts: Overhead không cần thiết
- Code đơn giản: Sync code dễ đọc hơn

## Tham khảo

- [The Rust Async Book](https://rust-lang.github.io/async-book/)
- [Tokio Tutorial](https://tokio.rs/tokio/tutorial)
- [async-std Book](https://book.async.rs/)
