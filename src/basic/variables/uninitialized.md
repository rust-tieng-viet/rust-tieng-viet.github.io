# uninitialized variable

Variable mà chưa được gán giá trị được gọi là uninitialized variable.

```rust
fn main() {
  let my_variable; // ⚠️
}
```

Rust sẽ không compile và bạn sẽ không thể sử dụng cho đến khi `my_variable` được gán giá trị nào đó. Ta có thể lợi dụng điều này:

- Khai báo uninitialized variable.
- Gán giá trị cho nó trong 1 scope khác
- Vẫn giữ được giá trị của của variable đó khi ra khỏi scope.

```rust
fn main() {
  let my_number;
  {
    my_number = 100;
  }

  println!("{}", my_number);
}
```

Hoặc phức tạp hơn

```rust
fn loop_then_return(mut counter: i32) -> i32 {
  loop {
    counter += 1;
    if counter % 50 == 0 {
      break;
    }
  }

  counter
}

fn main() {
  let my_number;

  {
    // Pretend we need to have this code block
    let number = {
      // Pretend there is code here to make a number
      // Lots of code, and finally:
      57
    };

    my_number = loop_then_return(number);
  }

  println!("{}", my_number); // 100
}
```
