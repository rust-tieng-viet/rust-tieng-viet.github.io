# Default Implementations

Đôi khi bạn cần có default behavior mà không cần phải implement content cho từng type mỗi khi cần sử dụng:

```rust,editable
pub trait Summary {
  fn summarize(&self) -> String {
    String::from("(Read more...)")
  }
}

pub struct NewsArticle {
  pub headline: String,
  pub location: String,
  pub author: String,
  pub content: String,
}

impl Summary for NewsArticle {}; // <-- sử dụng {}

fn main() {
  let article = NewsArticle { ... };
  println!("New article: {}", article.summarize());
  // New article: (Read more...)
}
```

