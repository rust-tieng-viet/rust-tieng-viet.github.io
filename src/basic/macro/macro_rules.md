# `macro_rules!`

`macro_rules!` là một macro cho phép định nghĩa một macro khác. Với macro này, bạn có thể tạo ra các macros như `println!` hoặc `vec!`.

```rust
// This is a simple macro named `say_hello`.
macro_rules! say_hello {
    // `()` indicates that the macro takes no argument.
    () => {
        // The macro will expand into the contents of this block.
        println!("Hello!");
    };
}

fn main() {
    // This call will expand into `println!("Hello");`
    say_hello!()
}
```

Trong đó `say_hello` là tên của macro bạn đang định nghĩa.
Sau đó, bạn có thể xác định các rule cho macro trong các block code phía sau.
Các quy tắc này được xác định bằng cách sử dụng các pattern và các rule. Pattern được sử dụng để so khớp với các biểu thức mà macro được áp dụng. Rule được sử dụng để chỉ định mã được tạo ra bởi macro khi so khớp với pattern.


```rust
// This is a simple macro named `say_hello`.
macro_rules! say_hello {
    // `()` indicates that the macro takes no argument.
    () => {
        // The macro will expand into the contents of this block.
        println!("Hello!");
    };

    ($name: expr) => {
        println!("Hello {}!", $name);
    };
}

fn main() {
    // This call will expand into `println!("Hello {}", "Duyet");`
    say_hello!("Duyet")
}
```

Trong ví dụ trên, khi gọi `say_hello!("Duyet")` được so khớp với pattern `($name: expr)` do đó sau khi biên dịch,
đoạn mã được thực thi sẽ là `println!("Hello {}!", "Duyet");`

## Repeat `*`, `+`

Dưới đây là một ví dụ khác về cách sử dụng macro_rules! để định nghĩa một macro trong Rust:

```rust
macro_rules! vec_of_strings {
    ( $( $x:expr ),* ) => {
        vec![ $( $x.to_string() ),* ]
    };
}

fn main() {
    let fruits = vec_of_strings!["apple", "banana", "cherry"];
    println!("{:?}", fruits);
}
```

Trong đó, pattern `$( $x:expr ),*` so khớp với một danh sách các biểu thức được chuyển vào macro, 
được phân tách bằng dấu phẩy `,`. Rule `vec![ $( $x.to_string() ),* ]` được sử dụng để tạo ra một `Vec` 
các chuỗi được chuyển đổi từ các biểu thức được truyền vào.


Khi biên dịch, macro `vec_of_strings!` được mở rộng và tạo ra một `Vec` chứa các chuỗi `"apple"`, `"banana"`, và `"cherry"`. 
Kết quả khi chạy chương trình sẽ là `["apple", "banana", "cherry"]` .

## Đệ quy macros

Dưới đây là một ví dụ về cách sử dụng đệ quy trong macro_rules! để tạo ra các macro phức tạp hơn:

```rust
macro_rules! countdown {
    ($x:expr) => {
        println!("{}", $x);
    };
    ($x:expr, $($rest:expr),+) => {
        println!("{}", $x);
        countdown!($($rest),*);
    };
}

fn main() {
    countdown!(5, 4, 3, 2, 1);
}
```

Trong quy tắc macro `countdown!`, chúng ta sử dụng cấu trúc `$x:expr`
để lấy giá trị biểu thức được truyền vào và in ra nó bằng lệnh `println!`.
Sau đó, chúng ta sử dụng cấu trúc `$($rest:expr),+` để lấy danh sách các biểu thức còn lại,
và gọi lại macro `countdown!` với danh sách này.
Quá trình đệ quy này sẽ tiếp tục cho đến khi danh sách các biểu thức truyền vào rỗng,
khi đó macro sẽ không còn gọi lại chính nó nữa.

## References

- https://doc.rust-lang.org/rust-by-example/macros.html
