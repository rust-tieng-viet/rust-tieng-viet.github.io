## Doc comments

Doc comments sẽ được Compiler parse thành [HTML documentation](https://doc.rust-lang.org/rust-by-example/meta/doc.html)
khi render document bằng `cargo doc`.

```rust
/// Generate library docs for the following item.
//! Generate library docs for the enclosing item.
```

Doc comments sẽ cực kỳ hữu ích cho project lớn và cần một hệ thống document chính xác và up to date.

`//!` sẽ generate doc cho crate/mod trong file hiện tại.

{{#playground ./doc-comment.rs}}

Chúng ta có thể thậm chí comment lại example code hoặc cách sử dụng một function nào đó,
code này cũng sẽ được compile và test, đảm bảo được code và document 
luôn luôn chính xác với nhau, một giải pháp khá thông minh.


```rust
/// Adds one to the number given.
///
/// # Examples
///
/// ```
/// let arg = 5;
/// let answer = my_crate::add_one(arg);
///
/// assert_eq!(6, answer);
/// ```
pub fn add_one(x: i32) -> i32 {
    x + 1
}
```
