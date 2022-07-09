# Result `map`

Ta có thể xử lý giá trị bên trong `Result` mà không cần xử lý `Err`, 
trong trường hợp bạn muốn trả `Err` cho hàm bên trên đó tự lý.

```rust
use std::num::ParseIntError;

fn multiply(a: &str, b: &str) -> Result<i32, ParseIntError> {
  match a.parse::<i32>() {
    Ok(first) => {
      match b.parse::<i32>() {
        Ok(second) => Ok(first * second),
        Err(e) => Err(e),
      }
    },
    Err(e) => Err(e),
  }
}

fn print(result: Result<i32, ParseIntError>) {
  match result {
    Ok(n)  => println!("n is {}", n),
    Err(e) => println!("Error: {}", e),
  }
}

fn main() {
  let twenty = multiply("10", "2");
  print(twenty);

  let tt = multiply("t", "2");
  print(tt);
}
```

Thay vào đó ta sử dụng `.map()`, `.and_then()` để đoạn code trên hiệu quả và dễ đọc hơn.

```rust
use std::num::ParseIntError;

fn multiply(a: &str, b: &str) -> Result<i32, ParseIntError> {
  a.parse::<i32>().and_then(|first| {
    b.parse::<i32>().map(|second| first * second)
  })
}

fn print(result: Result<i32, ParseIntError>) {
  match result {
    Ok(n)  => println!("n is {}", n),
    Err(e) => println!("Error: {}", e),
  }
}

fn main() {
    let twenty = multiply("10", "2");
    print(twenty);

    let tt = multiply("t", "2");
    print(tt);
}
```
