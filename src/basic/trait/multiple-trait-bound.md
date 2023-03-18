# Specifying Multiple Trait Bounds with the + Syntax

Ta có cú pháp `+` nếu muốn generic `T` có được impl nhiều trait khác nhau.
Ví dụ ta muốn `item` phải có cả `Summary` lẫn `Display`

```rust,editable
pub fn notify(item: &(impl Summary + Display)) {}
pub fn notify<T: Summary + Display>(item: &T) {}
```
