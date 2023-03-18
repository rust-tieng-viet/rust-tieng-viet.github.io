# Trait Bound

Một syntax sugar khác mà ta có thể sử dụng thay cho `&impl Summary` ở trên,
gọi là _trait bound_, bạn sẽ bắt gặp nhiều trong Rust document:

```rust,editable
pub fn notify<T: Summary>(item: &T) {
  println!("News: {}", item.summarize());
}
```

Đầu tiên chúng ta định nghĩa trait bound bằng cách định nghĩa
một generic type parameter trước, sau đó là `:` trong ngoặc `<` và `>`.
Ta có thể đọc là: `item` có kiểu generic là `T` và `T` phải được `impl Summary`.

- `notify<T>(` khai báo generic type `T`
- `notify<T: Summary>(` generic type được implement `trait Summary`

Cú pháp này có thể dài hơn và không dễ đọc như `&impl Summary`, nhưng hãy xem ví dụ dưới đây:

```rust,editable
pub fn notify(item1: &impl Summary, item2: &impl Summary) {}  // (1)
pub fn notify<T: Summary>(item1: &T, item2: &T) {}            // (2)
```

Dùng _trait bound_ giúp ta tái sử dụng lại `T`,
mà còn giúp force `item1` và `item2` có cùng kiểu dữ liệu,
đây là cách duy nhất (cả 2 đều là `NewsArticle` hoặc cả 2 đều là `Tweet`) mà (1) không thể.
