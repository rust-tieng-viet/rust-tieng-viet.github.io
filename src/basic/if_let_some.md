### if let Some(x) = x

Có thể bạn sẽ gặp pattern này nhiều khi đọc code Rust.
Nếu giá trị của `x` là `Some` thì sẽ destruct 
giá trị đó bỏ vào biến `x` nằm trong scope của `if`.

```rust
fn get_data() -> Option<String> {
    Some("ok".to_string())
}

if let Some(data) = get_data() {
    println!("data = {}", data);
} else {
    println!("no data");
}
```

