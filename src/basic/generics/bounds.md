# Bounds

Cái này rất khó giải thích bằng tiếng Việt bằng một từ đơn giản.
Khi sử dụng genenic, type parameter thường phải sử dụng các trait
như các ràng buộc, giới hạn (bounds) để quy định chức năng (functionality) của kiểu
đang được implement.

Trong ví dụ sau sử dụng trait `Display` để in, vì thế ta cần `T` bị ràng buộc (bound)
bởi `Display`. Có nghĩa là, ta cần tham số có kiểu `T` 
và `T` *bắt buộc* phải đã được implement `Display`.


```rust
# use std::fmt::Display;
fn printer<T: Display>(t: T) {
    println!("{}", t);
}
# fn main() {}
```

Bounding giới hạn lại generic type. 

```rust,compile_fail
# use std::fmt::Display;
// T phải được impl `Display`
struct S<T: Display>(T);

// error[E0277]: `Vec<{integer}>` doesn't implement `std::fmt::Display`
let s = S(vec![1]);
```

## `T: Display + Debug`

Để bounding nhiều trait, ta sử dụng `+`. 
Ví dụ sau có nghĩa `T` phải được implement trait `Display` và `Debug`.

```rust
# use std::fmt::Display;
# use core::fmt::Debug;
fn printer<T: Display + Debug>(t: T) {
    println!("{:?}", t);
}
```