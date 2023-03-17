# Project đầu tiên

Sau khi [cài đặt Rust](./installation.md) thành công, bạn có thể bắt đầu sử dụng [Cargo](../basic/cargo) (một công cụ quản lý gói mạnh mẽ được tích hợp sẵn trong Rust) để khởi tạo project hello world đầu tiên.

## Bước 1: Tạo một package mới

Để bắt đầu với Cargo, bạn cần tạo một package mới bằng lệnh **`cargo new <name>`**. Ví dụ, để tạo một package mới với tên là `hello_world`, bạn chạy lệnh sau đây:

```bash
$ cargo new hello_world
# Created binary (application) `hello_world` package
```

Cargo sẽ tạo ra một package mới với một file **`Cargo.toml`** và một thư mục **`src`**. File **`Cargo.toml`** chứa tất cả các thông tin liên quan đến package của bạn.

```bash
$ tree .
.
├── Cargo.toml
└── src
    └── main.rs

2 directories, 2 files
```

Hãy xem nội dung của `src/main.rs`

```rust
fn main() {
    println!("Hello, world!");
}
```

## Bước 2: Biên dịch và chạy chương trình

Tiếp theo, để biên dịch chương trình của bạn, hãy chạy lệnh **`cargo build`**. Sau khi quá trình biên dịch kết thúc, Cargo sẽ tạo ra một thư mục mới có tên **`target`**, chứa tệp thực thi của chương trình.

```bash
$ cargo build

# Compiling hello_world v0.1.0 (/Users/duyet/project/hello_world)
#    Finished dev [unoptimized + debuginfo] target(s) in 0.67s
```

Để chạy chương trình, bạn có thể sử dụng lệnh **`./target/debug/<name>`**. Ví dụ, để chạy chương trình `hello_world`, bạn có thể chạy lệnh sau đây:

```bash
$ ./target/debug/hello_world
# Hello, world!
```

Kết quả sẽ hiển thị trên màn hình là "_Hello, world!_". Ngoài ra, bạn cũng có thể biên dịch và chạy chương trình chỉ trong một bước bằng cách sử dụng lệnh **`cargo run`**.

```bash
$ cargo run
# Hello, world!
```

## References

- [First Steps with Cargo](https://doc.rust-lang.org/cargo/getting-started/first-steps.html)
