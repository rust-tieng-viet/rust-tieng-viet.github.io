# Trait

Rust có nhiều loại data types như primitives (`i8`, `i32`, `str`, ...), struct, enum và các loại kết hợp (aggregate) như tuples và array. Mọi types không có mối liên hệ nào với nhau. Các data types có các phương thức (methods) để tính toán hay convert từ loại này sang loại khác, nhưng chỉ để cho tiện lợi hơn, method chỉ là các function. Bạn sẽ làm gì nếu một tham số là nhiều loại kiểu dữ liệu? Một số ngôn ngữ như Typescript hay Python sẽ có cách sử dụng Union type như thế này:

```typescript
function notify(data: string | number) {
  if (typeof data == 'number') {
    // ...
  } else if (typeof data == 'number') {
    // ...
  }
}
```

Còn trong Rust thì sao?

![Trait implementations for Display](https://i.imgur.com/ZKHSRQK.png)

# Trait là gì?

Có thể bạn đã thấy qua trait rồi: `Debug`, `Copy`, `Clone`, ... là các trait.

Trait là một cơ chế abstract để thêm các tính năng (functionality) hay hành vi (behavior)
khác nhau vào các kiểu dữ liệu (types) và tạo nên các mối quan hệ giữa chúng.

Trait thường đóng 2 vai trò:

1. Giống như là interfaces trong Java hay C# (fun fact: lần đầu tiên nó được gọi là `interface`). Ta có thể kế thừa (inheritance) interface, nhưng không kế thừa được implementation của interface*.* Cái này giúp Rust có thể hỗ trợ [OOP](https://stevedonovan.github.io/rust-gentle-intro/object-orientation.html). Nhưng có một chút khác biệt, nó không hẳn là interface.
2. Vai trò này phổ biến hơn, trait đóng vai trò là generic constraints. Dễ hiểu hơn, ví dụ, bạn định nghĩa một function, tham số là một _kiểu dữ liệu bất kỳ_ nào đó, không quan tâm, miễn sau kiểu dữ liệu đó phải có phương thức `method_this()`, `method_that()` nào đó cho tui. _Kiểu dữ liệu nào đó_ gọi là _genetic type_. Function có chứa tham số generic type đó được gọi là _generic function_. Và việc ràng buộc phải có `method_this()`, `method_that()` , ... gọi là _generic constraints_. Mình sẽ giải thích rõ cùng với các ví dụ sau dưới đây.

Để gắn một trait vào một type, bạn cần implement nó.
Bởi vì `Debug` hay `Copy` quá phổ biến, nên Rust có attribute để tự động implement:

```rust
#[derive(Debug)]
struct MyStruct {
  number: usize,
}
```

Nhưng một số trait phức tạp hơn bạn cần định nghĩa cụ thể
bằng cách `impl` nó. Ví dụ bạn có trait `Add`
([std::ops::Add](https://doc.rust-lang.org/std/ops/trait.Add.html#implementors))
để add 2 type lại với nhau. Nhưng Rust sẽ không biết cách bạn add 2
type đó lại như thế nào, bạn cần phải tự định nghĩa:

```rust
use std::ops::Add;

#[derive(Debug, PartialEq)]
struct MyStruct {
  number: usize,
}

impl Add for MyStruct {    // <-- here
  type Output = Self;
  fn add(self, other: Self) -> Self {
    Self { number: self.number + other.number }
  }
}

fn main() {
  let a1 = MyStruct { number: 1 };
  let a2 = MyStruct { number: 2 };
  let a3 = MyStruct { number: 3 };

  assert_eq!(a1 + a2, a3);
}
```

Note: Mình sẽ gọi **Define Trait** là việc định nghĩa,
khai báo một trait mới trong Rust (`trait Add`).
**Implement Trait** là việc khai báo nội dung của function được
liệu kê trong Trait cho một kiểu dữ liệu cụ thể nào đó (`impl Add for MyStruct`).


# Chi tiết

- [Khai báo Trait](./define-a-trait.md)
- [Implement Trait cho một Type](./impl-trait.md)
- [Default Implementations](./default-impls.md)
- [Traits as Parameters](./trait-as-params.md)
- [Trait Bound](./trait-bound.md)
- [Multiple Trait Bound](./multiple-trait-bound.md)
- [`where` Clauses](./where-clauses.md)
- [Returning Types that Implement Traits](./return-impl-trait.md)
- [Using Trait Bounds to Conditionally Implement Methods](./conditionally-impl.md)
- [Blanket implementations](./blanked-impl.md)
- [Trait Inheritance](./trait-inheritance.md)
- [Supertraits](./supertraits.md)
- [Auto Trait](./auto-trait.md)
- [Copy, Clone](./copy-clone.md)
- [String và &str](./string-str.md)
- [FromStr](./fromstr.md)
- [Display]()


# Kết

Compiler sử dụng trait bound để kiểm tra các kiểu dữ liệu được sử dụng trong code có đúng behavior không.
Trong Python hay các ngôn ngữ dynamic typed khác, ta sẽ gặp lỗi lúc runtime nếu chúng ta gọi các method mà
kiểu dữ liệu đó không có hoặc không được định nghĩa.

Bạn có chắc chắn là `a` dưới đây có method `summarize()` hay không?
Nhớ rằng typing hint của Python3 chỉ có tác dụng là nhắc nhở cho lập trình viên thôi.

```python
# Python
func print_it(a: Union[NewsArticle, Tweet]):
  print(a.summarize())

print_it(1)
print_it("what")
```

Do đó Rust bắt được mọi lỗi lúc compile time và force chúng ta phải fix hết trước khi chương trình chạy.
Do đó chúng ta không cần phải viết thêm code để kiểm tra behavior (hay sự tồn tại của method)
trước khi sử dụng lúc runtime nữa, tăng cường được performance mà không phải từ bỏ tính flexibility của generics.

Xem về [Struct](./struct.md).
