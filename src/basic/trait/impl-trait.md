# Implement Trait cho một Type

Bây giờ ta định implement các method của trait Summary cho từng type.
Ví dụ dưới đây ta có `struct NewsArticle` và `struct Tweet`,
và ta định nghĩa `summarize` cho 2 struct này.

```rust,editable
{{#include aggregator.rs:summary}}
```

Implement trait cho type giống như `impl` bình thường,
chỉ có khác là ta thêm **trait name** và keyword `for` sau `impl`.
Bây giờ Summary đã được implement cho `NewsArticle` và `Tweet`,
người sử dụng crate đã có thể sử dụng các phương thức của trait như các method function bình thường.
Chỉ một điều khác biệt là bạn cần mang trait đó vào cùng scope hiện tại cùng với type để có thể sử dụng.
Ví dụ:

```rust,editable
{{#include aggregator.rs:main}}
```

Rust Playground: [https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=dc563051aecebae4344776c06fb1b49d](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=dc563051aecebae4344776c06fb1b49d)

Chúng ta có thể implement trait cho mọi type khác bất kỳ, ví dụ implement `Summary` cho `Vec<T>` trong scope của crate hiện tại.

```rust,editable
pub trait Summary {
  fn summarize(&self) -> String;
}

impl<T> Summary for Vec<T> {    // <-- local scope
  fn summarize(&self) -> String {
    format!("There are {} items in vec", self.len())
  }
}

fn main() {
  let vec = vec![1i32, 2i32];
  println!("{}", vec.summarize());
  // There are 2 items in vec
}
```

Rust Playground: [https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=dcaa812fab222ec0c713a38b066bda20](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=dcaa812fab222ec0c713a38b066bda20)

Bạn sẽ không thể implement external traits trên external types.
Ví dụ ta không thể implement `Display` cho `Vec<T>` bởi vì
`Display` và `Vec<T>` được định nghĩa trong standard library,
trong trong crate hiện tại. Rule này giúp tránh chống chéo và chắc chắn
rằng không ai có thể break code của người khác và ngược lại.
