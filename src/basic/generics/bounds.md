# Bounds

Cái này rất khó giải thích bằng tiếng Việt bằng một từ đơn giản.
Khi sử dụng tổng quát hóa, type parameter thường phải sử dụng các trait
như các ràng buộc, giới hạn (bounds) để quy định chức năng (functionality) của kiểu
đang được implement.

Trong ví dụ sau sử dụng trait `Display` để in, vì thế ta cần `T` bị ràng buộc (bound)
bởi `Display`. Có nghĩa là, ta cần tham số có kiểu `T` 
và `T` *bắt buộc* phải đã được implement `Display`.


```rust
fn printer<T: Display>(t: T) {
    println!("{}", t);
}
```

Bounding giới hạn lại generic type. 

```rust
// T phải được impl `Display`
struct S<T: Display>(T);

// Lỗi do `Vec<T>` không được implement `Display`.
let s = S(vec![1]);
```

## `T: Display + Debug`

Để bounding nhiều trait, ta sử dụng `+`. 
Ví dụ sau có nghĩa `T` phải được implement trait `Display` và `Debug`.

```rust
fn printer<T: Display + Display>(t: T) {
    println!("{:?}", t);
}
```