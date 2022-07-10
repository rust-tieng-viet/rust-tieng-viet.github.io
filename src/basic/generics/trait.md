# Generic Trait

Trait cũng có thể được tổng quát hóa.

```rust,editable,compile_fail
// Non-copyable types.
struct Empty;
struct Null;

// A trait generic over `T`.
trait DoubleDrop<T> {
    // Định nghĩa một method trên type hiện tại, method nhận
    // một giá trị khác cũng có kiểu `T` và không làm gì với nó.
    fn double_drop(self, _: T);
}

// Implement `DoubleDrop<T>` cho mọi generic parameter `T` và
// caller `U`.
impl<T, U> DoubleDrop<T> for U {
    // Method này take ownership của cả 2 arguments,
    // sau đó giải phóng bộ nhớ cho cả 2, do ra khỏi scope {}
    // mà không làm gì cả.
    fn double_drop(self, _: T) {}
}

fn main() {
    let empty = Empty;
    let null  = Null;

    // Deallocate `empty` and `null`.
    empty.double_drop(null);

    // TODO: uncomment
    // empty;
    // null;
}
```