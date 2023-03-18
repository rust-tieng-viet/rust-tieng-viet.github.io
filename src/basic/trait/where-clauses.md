# `where` Clauses

Đôi khi bạn sẽ có nhiều genenic type, mỗi generic type lại có nhiều trait bound,
khiến code khó đọc. Rust có một cú pháp `where` cho phép định nghĩa trait bound
phía sau function signature. Ví dụ:

```rust,editable
fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {
```

Với `where` clause:

```rust,editable
fn some_function<T, U>(t: &T, u: &U) -> i32
    where T: Display + Clone,
	  U: Clone + Debug,
{
```
