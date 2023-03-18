# Blanket implementations

Ta cũng có thể implement 1 trait có điều kiện cho bất kỳ kiểu dữ liệu
nào có implement một trait khác rồi. Implementation của một trait cho
1 kiểu dữ liệu khác thỏa mãn trait bound được gọi là _blanket implementations_
và được sử dụng rộng rãi trong Rust standard library.
Hơi xoắn não nhưng hãy xem ví dụ dưới đây.

Ví dụ: `ToString` trait trong
[Rust standard library](https://doc.rust-lang.org/src/alloc/string.rs.html#2390),
nó được implement cho mọi kiểu dữ liệu nào có được implement `Display` trait.

```rust,editable
impl<T: Display> ToString for T {
  // --snip--
}
```

Có nghĩa là, với mọi type có `impl Display`, ta có hiển nhiên thể sử dụng được các thuộc tính của `trait ToString`.

```rust,editable
let s = 3.to_string(); // do 3 thoaỏa manãn Display
```

Do `3` thỏa mãn điều kiện là đã được `impl Display for i32`.
([https://doc.rust-lang.org/std/fmt/trait.Display.html#impl-Display-11](https://doc.rust-lang.org/std/fmt/trait.Display.html#impl-Display-11))

