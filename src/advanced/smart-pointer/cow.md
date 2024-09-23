# [`Cow`] - clone-on-write smart pointer

[`Cow`] là một smart pointer enum cực kỳ tiện dụng, được định nghĩa là "clone on write".
Nó sẽ trả về `&str` nếu bạn không cần một `String`, hoặc trả về một
`String` nếu bạn cần `String`. Tương tự với array `&[]` và `Vec`, v.v.

Đây là định nghĩa của [`Cow`]:

```rust
pub enum Cow<'a, B>
where
    B: 'a + ToOwned + ?Sized,
 {
    Borrowed(&'a B),
    Owned(<B as ToOwned>::Owned),
}
```

Hãy phân tích `B`:

`'a` có nghĩa là `Cow` làm việc được với references.

Trait `ToOwned` có nghĩa type này có thể convert thành owned type.
  Ví dụ, `str` thường là một reference (`&str`) hoặc bạn có thể convert nó thành owned `String`.

`?Sized`, có nghĩa là có thể có `Sized` hoặc là không. 
  Hầu hết mọi type trong Rust đều là `Sized`, nhưng type như là `str` thì không.
  Vì thế chúng ta cần `&` cho `str`, bởi vì compiler không biết kích thước của `str`.
  Nếu bạn cần một trait có thể sử dụng giá trị nào tương tư như `str`, bạn thêm `?Sized`.

Tiếp theo là `enum` variant: một giá trị `Cow` có thể là `Borrowed` hoặc `Owned`.

Ví dụ bạn có một function trả về giá trị `Cow<'static, str>`. 

```rust
fn cow_function() -> Cow<'static, str> {
    // ...
}
```

Nếu bạn yêu cầu function đó trả về `"My message".into()`, 
nó sẽ xem `"My message"` là một `str`. Đây là một `Borrowed` type,
do đó variant sẽ là `Cow::Borrowed(&'static str)`.

```rust
fn cow_function() -> Cow<'static, str> {
    "My message".into()
}
```

Còn nếu bạn trả về

```rust
fn cow_function() -> Cow<'static, str> {
    format!("{}", "My message").into()
}
```

lúc này kết quả trả về sẽ là `String`, bởi vì `format!()` trả về `String`. 
Variant sẽ là `Cow::Owned`.

## Lợi ích của `Cow`

*Copy on write* là một kỹ thuật giúp tối ưu hoá, nhất là trong các 
trường hợp reading nhiều hơn writing. Ý tưởng chính là không copy
object ngay lập tức, mà chỉ reference (borrow) đến object gốc, khi cần
một lượng lớn tác vụ reading. Và chỉ khi cần đến tác vụ writing (ít xảy ra hơn),
object mới được copy và thay đổi. Tác vụ để thay đổi giá trị object sẽ copy, di chuyển
object trong bộ nhớ là một tác vụ nặng, tốn kém. Do đó, ưu điểm của kỹ thuật này là
các tác vụ reading object rất nhanh do chỉ sử dụng reference (borrow) đến giá trị gốc.


## References
- <https://doc.rust-lang.org/std/borrow/enum.Cow.html>
- <https://github.com/Dhghomon/easy_rust#cow>

[`Cow`]: https://doc.rust-lang.org/std/borrow/enum.Cow.html
