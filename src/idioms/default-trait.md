# The Default Trait (Default Constructors)

Rust hỗ trợ default constructor thông qua [Default](https://doc.rust-lang.org/stable/std/default/trait.Default.html) trait.

```rust
struct Point {
    x: i32,
    y: i32,
}

impl Default for Point {
    fn default() -> Self {
        Point { x: 0, y: 0 }
    }
}

fn main() {
    let point = Point::default();
    println!("({}, {})", point.x, point.y);
}
```

`Default` còn có thể sử dụng như một derive nếu tất cả các field của struct implement `Default`.

```rust
#[derive(Default)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point = Point::default();
    println!("({}, {})", point.x, point.y);
}
```

Thường với một struct cơ bản chúng ta thường sẽ phải cần cả `new` và `Default` method.
Một ưu điểm của `Default` là struct hoặc enum của chúng ta có thể được sử dụng một cách
generic trong các trường hợp như dưới đây hoặc cho tất cả các [`*or_default()` functions](https://doc.rust-lang.org/stable/std/?search=or_default)
trong standard library.

```rust
fn create<T: Default>() -> T {
    T::default()
}
```
