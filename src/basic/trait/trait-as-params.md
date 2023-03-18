# Traits as Parameters

Trở lại ví dụ Typescript ở đầu tiên, với Trait bạn đã có thể define
một function chấp nhận tham số là nhiều kiểu dữ liệu khác nhau.
Nói theo một cách khác, bạn không cần biết kiểu dữ liệu,
bạn cần biết kiểu dữ liệu đó mang các behavior nào thì đúng hơn.

```rust,editable
fn notify(data: &impl Summary) {
  println!("News: {}", data.summarize());
}

fn main() {
  let news = NewsArticle {};
  notify(news);
}
```

Ở đây, thay vì cần biết `data` là type nào (`NewsArticle` hay `Tweet`?),
ta chỉ cần cho Rust compiler biết là `notify` sẽ chấp nhận mọi
**type có implement** `trait Summary`, mà trait Summary có behavior `.summarize()`,
do đó ta có thể sử dụng method `.summary()` bên trong function.
