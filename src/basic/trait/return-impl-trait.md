# Returning Types that Implement Traits

Chúng ta cũng có thể sử dụng `impl Trait` cho giá trị được trả về của function.

```rust,editable
fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("ahihi"),
        reply: false,
        retweet: false,
    }
}
```

Được đọc là: function `returns_summarizable()` trả về bất kỳ kiểu dữ liệu nào có `impl Summary`.
Tuy nhiên bạn chỉ có thể return về hoặc `Tweet`
hoặc `NewsArticle` do cách implement của compiler. Code sau sẽ có lỗi:

```rust,editable
fn returns_summarizable(switch: bool) -> impl Summary {
    if switch { NewsArticle {} }
		else { Tweet {} }
}
```

Rust Book có một chương riêng để xử lý vấn đề này: [Chapter 17: Using Trait Objects That Allow for Values of Different Types](https://doc.rust-lang.org/book/ch17-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types)

