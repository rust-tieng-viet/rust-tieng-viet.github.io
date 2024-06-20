# [`tokio`]

[`tokio`] là một asynchronous runtime, giúp viết ứng dụng async trong Rust.

## Cài đặt

```bash
cargo add tokio --features full
```

Hoặc

```toml
# File: Cargo.toml

[dependencies]
tokio = { version = "1", features = ["full"] }
```

## Ví dụ

```rust
#[tokio::main]
async fn main() {
    // This is running on a core thread.

    let blocking_task = tokio::task::spawn_blocking(|| {
        // This is running on a blocking thread.
        // Blocking here is ok.
    });

    // We can wait for the blocking task like this:
    // If the blocking task panics, the unwrap below will propagate the
    // panic.
    blocking_task.await.unwrap();
}
```

## Ví dụ: Socket server

Ví dụ sau lấy từ document của [`tokio`], một server đơn giản nhận kết nối từ client và trả về một thông báo.

```rust
{{#include ./tokio-example/src/main.rs}}
```

Trên terminal:

```bash
cargo run
```

Trên một terminal khác:

```bash
(printf "PING\r\n";) | nc localhost 6379
```

## References

- [Tokio Tutorial](https://tokio.rs/tokio/tutorial)
- [Tokio Mini-Redis](https://tokio.rs/tokio/tutorial/setup)

[`tokio`]: https://tokio.rs