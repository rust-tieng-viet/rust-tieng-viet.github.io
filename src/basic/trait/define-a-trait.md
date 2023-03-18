# Khai báo / định nghĩa một Trait

Nhắc lại là Trait định nghĩa các hành vi (behavior).
Các types khác nhau có thể chia sẻ cùng cá hành vi.
Định nghĩa một trait giúp **nhóm** các hành vi để làm một việc gì đó.

Theo ví dụ của Rust Book, ví dụ ta các struct chứa nhiều loại text:

- `NewsArticle` struct chứa news story, và
- `Tweet` struct có thể chứa tối đa 280 characters cùng với metadata.

Bây giờ chúng ta cần viết 1 crate name có tên là `aggregator`
có thể hiển thị summaries của data có thể store trên `NewsArticle`
hoặc `Tweet` instance. Chúng ta cần định nghĩa method `summarize`
trên mỗi instance. Để định nghĩa một trait, ta dùng `trait` theo sau
là trait name; dùng keyword `pub` nếu định nghĩa một public trait.

```rust,editable
pub trait Summary {
  fn summarize(&self) -> String;
}
```

Trong ngoặc, ta định nghĩa các method signatures để định nghĩa hành vi:
`fn summarize(&self) -> String`. Ta có thể định nghĩa nội dung của function.
Hoặc không, ta dùng `;` kết thúc method signature, để bắt buộc type nào
implement `trait Summary` đều phải định nghĩa riêng cho nó,
bởi vì mỗi type (`NewsArticle` hay `Tweet`) đều có cách riêng để `summarize`. Mỗi trait có thể có nhiều method.
