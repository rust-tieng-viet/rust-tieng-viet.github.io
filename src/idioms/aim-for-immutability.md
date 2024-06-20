# Aim For Immutability in Rust

Immutable code giúp dễ test, parallelize, dễ refactor, và dễ đọc hơn. Chúng ta không cần lo lắng quá nhiều về side effect.

Rust ép chúng ta sử dụng immutable code mặc định, sử dụng từ khoá `mut` khi chúng ta cần mutable. Trong khi hầu hết các ngôn ngữ khác làm ngược lại.

```rust
fn main() {
    let mut x = 42;
    black_box(&mut x);
    println!("{}", x);
}

fn black_box(x: &mut i32) {
    *x = 23;
}
```

# Vì sao chúng ta cần tránh sử dụng mutable?

Vì chúng ta hầu hết sử dụng state rất nhiều để xử lý logic.

Vấn đề là con người rất khó để theo dõi state khi chuyển từ giá trị này sang giá trị khác,
dẫn đến nhầm lẫn hoặc sai sót.

Immutable code giúp chúng ta giảm thiểu lỗi, giúp chúng ta dễ dàng theo dõi logic.

Trong Rust, variable mặc định là immutable, chúng ta cần sử dụng từ khoá `mut` để khai báo mutable.

```rust
let x = 100;
x = 200; // error: re-assignment of immutable variable `x`
```

# Move thay về `mut`

Vẫn sẽ an toàn nếu chúng ta chọn "move" variable vào function hoặc struct để lý. Bằng cách này chúng ta có thể tránh việc sử dụng `mut` và copy giá trị, nhất là với các struct lớn.

```rust
fn black_box(x: i32) {
    println!("{}", x);
}

fn main() {
    let x = 42;
    black_box(x);
}
```

# Đừng ngại `.copy()`

Nếu bạn có sự lựa chọn giữa `mut` và `.copy()`, đôi khi copy không quá tệ như bạn nghĩ.

Chương trình có thể chậm đi một chút, tuy nhiên immutability có thể giúp bạn tránh khỏi vài ngày debug và nhức đầu.

[Tricks with ownership in Rust](http://xion.io/post/code/rust-borrowchk-tricks.html)

# References

- https://corrode.dev/blog/immutability/
- http://xion.io/post/code/rust-borrowchk-tricks.html