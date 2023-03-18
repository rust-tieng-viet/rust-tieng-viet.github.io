# Using Trait Bounds to Conditionally Implement Methods

Ta có thể implement 1 method có điều kiện cho bất kỳ type nào
có implement một trait khác cụ thể. Ví dụ để dễ hiểu hơn dưới đây:

```rust,editable
use std::fmt::Display;

struct Pair<T> {
  x: T,
  y: T,
}

impl<T> Pair<T> {
  fn new(x: T, y: T) -> Self {
    Self { x, y }
  }
}

impl<T: Display + PartialOrd> Pair<T> {
  fn cmp_display(&self) {
    if self.x >= self.y {
      println!("The largest member is x = {}", self.x);
    } else {
      println!("The largest member is y = {}", self.y);
    }
  }
}
```

`impl<T> Pair<T>` implement function `new` trả về kiểu dữ liệu `Pair<T>` với `T` là generic (bất kỳ kiểu dữ liệu nào.

`impl<T: Display + PartialOrd> Pair<T>` implement function `cmp_display`
cho mọi generic `T` với `T` đã được implement `Display + PartialOrd`
trước đó rồi (do đó mới có thể sử dụng các behavior của
`Display` (`println!("{}")`) và `PartialOrd` (`>`, `<`, ...) được.
