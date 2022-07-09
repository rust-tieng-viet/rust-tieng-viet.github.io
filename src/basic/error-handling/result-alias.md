# Result alias

Rust cho phép chúng ta tạo [alias](https://doc.rust-lang.org/rust-by-example/types/alias.html).
Việc alias `Result` sẽ tiết kiệm chúng ta rất nhiều thời gian, 
nhất là trong cùng một module và ta đang cố reuse `Result` nhiều lần.

```rust
use std::num::ParseIntError;

// Define a generic alias for a `Result` with the error type `ParseIntError`.
type AliasedResult<T> = Result<T, ParseIntError>;

// Use the above alias to refer to our specific `Result` type.
fn multiply(a: &str, b: &str) -> AliasedResult<i32> {
  a.parse::<i32>().and_then(|first| {
    b.parse::<i32>().map(|second| first * second)
  })
}

fn print(result: AliasedResult<i32>) {
  match result {
    Ok(n)  => println!("n is {}", n),
    Err(e) => println!("Error: {}", e),
  }
}

fn main() {
  print(multiply("10", "2"));
  print(multiply("t", "2"));
}
```
