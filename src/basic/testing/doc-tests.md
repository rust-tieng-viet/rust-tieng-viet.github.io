## Doc Tests

Rust cũng hỗ trợ execute code ví dụ trên document như là một test.
Đây là giải pháp cực kỳ thông minh giúp đảm bảo example code luôn up to date 
và nó có hoạt động.

```rust
/// Function that adding two number
///
/// # Example
///
/// ```
/// use adder::adder;
/// 
/// assert_eq!(4, adder(2, 2));
/// ```
pub fn adder(a: i32, b: i32) -> i32 {
    a + b
}
```

Khi chạy `cargo test` hoặc `cargo test --doc`, cargo sẽ compile
phần example code này thành một crate test và thực thi nó.

Mặc định nếu không chỉ định ngôn ngữ cho block code thì rustdoc sẽ
ngầm định nó là Rust code. Do đó

```````md
```
let x = 5;
```
```````

sẽ tương đương với

```````
```rust
let x = 5;
```
```````

### Ẩn một phần của example code

Đôi lúc bạn sẽ cần example code gọn hơn, 
ẩn bớt một số logic mà bạn chuẩn bị để code có thể chạy được, 
tránh làm distract của người xem.

```
/// ```
/// /// Some documentation.
/// # fn foo() {} // this function will be hidden
/// println!("Hello, World!");
/// ```
```

Chúng ta thêm `#` ở phần đầu của dòng code muốn ẩn đi trong generate doc,
nó vẫn sẽ được compile như mình thường.


### Sử dụng `?` trong doc tests

`?` chỉ có thể được sử dụng khi function trả về `Result<T, E>`. Hãy sử dụng cách sau:

```
/// A doc test using ?
///
/// ```
/// use std::io;
/// fn main() -> io::Result<()> {
///     let mut input = String::new();
///     io::stdin().read_line(&mut input)?;
///     Ok(())
///  }
/// ```
```

Cùng với việc sử dụng `#` như ở trên, chúng ta có thể ẩn đi bớt logic.

```
/// A doc test using ?
///
/// ```
/// # use std::io;
/// # fn main() -> io::Result<()> {
/// let mut input = String::new();
/// io::stdin().read_line(&mut input)?;
/// # Ok(())
/// # }
/// ```
```

### References

- <https://doc.rust-lang.org/rustdoc/write-documentation/documentation-tests.html>
