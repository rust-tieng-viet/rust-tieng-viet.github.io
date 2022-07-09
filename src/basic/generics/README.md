# Generics

Generics là một khái niệm để tổng quát hóa các kiểu dữ liệu 
hoặc tính năng cho các trường hợp rộng hơn. Tổng quát hóa cực kỳ hữu ích
trong việc giảm số lượng code duplication. Một trong những ví dụ phổ
biến nhất của tổng quát hóa là tổng quát một function có thể input nhiều loại
kiểu dữ liệu khác nhau (type parameters).

Generic type parameters thường được biểu diễn dưới dạng `<T>`.

Ví dụ, định nghĩa một *generic function* `foo` nhận một tham số `T` của mọi kiểu dữ liệu.

```rust
fn foo<T>(arg: T) { ... }
```

Xem các trang sau để biết chi tiết về generic type 
được ứng dụng trong các trường hợp khác nhau như thế nào.