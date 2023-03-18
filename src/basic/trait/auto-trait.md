# Auto Traits

Auto traits là các trait đánh dấu (marker trait) được tự động triển khai cho mọi kiểu dữ liệu,
trừ khi kiểu dữ liệu hoặc một kiểu dữ liệu mà nó chứa được khai báo tường minh là không impl bằng cách sử dụng `negative_impls`.

Ta cần bật feature `auto_traits` để khai báo auto trait.

```rust
#![feature(auto_traits)]

auto trait Valid {}
```

Sau đó, ta có thể triển khai `trait Valid` cho các kiểu dữ liệu khác nhau:

```rust
#![feature(auto_traits)]
#![feature(negative_impls)]
# auto trait Valid {}

struct True;
struct False;

// Negative impl
// Có nghĩa là Valid không được auto impl cho struct False
impl !Valid for False {}

// Nếu T được impl trait Valid, thì MaybeValid<T> cũng được impl trait Valid
struct MaybeValid<T>(T);

fn must_be_valid<T: Valid>(_t: T) { }

fn main() {
    // Hoạt động
    must_be_valid(MaybeValid(True));

    // Báo lỗi - do `False` không được impl trait Valid
    // must_be_valid(MaybeValid(False));
}
```

Auto trait `Valid`, sẽ tự động impl cho mọi `struct`, `enum`, ...

## References

- https://doc.rust-lang.org/beta/unstable-book/language-features/auto-traits.html
