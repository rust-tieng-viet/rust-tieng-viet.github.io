# `format!()`

Đây là một trong những macro được dùng nhiều nhất trong Rust.

`format!()` giúp khởi tạo một `String`. Tham số đầu tiên của `format!` là chuỗi định dạng. 
Sức mạnh của format string này ở trong các `{}`.

Xem các ví dụ sau:

```rust,editable
# fn main() {
format!("test");
format!("hello {}", "world!");
format!("x = {}, y = {y}", 10, y = 30);

let z = 100;
format!("z = {z}");
# }
```

## `.to_string()` để convert một giá trị thành String

Để convert một giá trị thành `String`, thay vì sử dụng `format!()` thì người ta hay sử dụng 
[to_string](https://doc.rust-lang.org/std/string/trait.ToString.html). 
Method này sẽ sử dụng [Display](https://doc.rust-lang.org/std/fmt/trait.Display.html) formatting trait.

```rust,editable
# fn main() {
// Thay vì
format!("single string");

// Sử dụng
"single string".to_string();
# }
```

# References

- https://doc.rust-lang.org/std/macro.format.html
