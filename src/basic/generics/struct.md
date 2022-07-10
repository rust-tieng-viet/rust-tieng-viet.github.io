# Generic Struct

Giống như function, ta cũng có thể sử dụng generic type cho
Struct

```rust
struct Point<T> {
  x: T,
  y: T,
}

fn main() {
  let point_a = Point { x: 0, y: 0 }; // T is a int type
  let point_b = Point { x: 0.0, y: 0.0 }; // T is a float type
}
```

