# Turbofish ::&lt;&gt;

![Rust Turbofish](https://blog.duyet.net/static/a4e75d7d370caf2b035a94ab66138e47/3fe5e/rust-turbofish.webp)

Trong trường hợp bạn cần chỉ định kiểu dữ liệu cho một generic function, method, struct, hoặc enum, 
Rust có một cú pháp đặc biệt để làm điều này gọi là turbofish. Quy tắc là khi nào bạn thấy

```rust,editable
$ident<T>
```

trong bất kỳ định nghĩa nào, thì bạn có thể sử dụng nó dưới dạng

```rust,editable
$ident::<T>
```

để chỉ định kiểu dữ liệu cho generic parameter. Sau đây là một số ví dụ để làm rõ hơn.

# Generic Function

Ví dụ function `std::mem::size_of()` có definition như sau:

```rust,editable
pub fn size_of<T>() -> usize
```

Khi gọi `size_of` với turbofish:

```rust,editable
std::mem::size_of::<u32>()
// 4
```

sẽ cho ta biết size của u32 theo số bytes.

# Generic Method

Phương thức `parse()` của `str` bạn cũng sẽ hay gặp cách sử dụng với cú pháp turbofish:

```rust,editable
fn parse<F>(&self) -> Result<F, F::Err> where F: FromStr
```

Chúng ta có thể sử dụng turbofish để mô tả kiểu dữ liệu sẽ được parsed từ `str`

```rust,editable
"1234".parse::<u32>()
```

Một ví dụ phổ biến nữa là `collect()` của `Iterator`

```rust,editable
fn collect<B>(self) -> B where B: FromIterator<Self::Item> 
```

Bởi vì compiler đã biết kiểu dữ liệu của `Self::Item` mà ta đang collect rồi, 
chúng ta thường không cần ghi ra. Thay vào đó là sử dụng `_` để compiler tự động infer ra. Ví dụ:

```rust,editable
let a = vec![1u8, 2, 3, 4];

a.iter().collect::<Vec<_>>();
```

Sẵn tiện nói về `Iterator` chúng ta cũng có thể sử dụng turbofish syntax với `sum()` và `product()`.

```rust,editable
fn sum<S>(self) -> S where S: Sum<Self::Item>
fn product<P>(self) -> P where P: Product<Self::Item>
```

Cú pháp như sau:

```rust,editable
[1, 2, 3, 4].iter().sum::<u32>()
[1, 2, 3, 4].iter().product::<u32>()
```

# Generic Struct

Trong trường hợp compiler không có đủ thông tin để infer khi tạo generic struct, 
chúng ta cũng có thể sử dụng turbofish syntax. Ví dụ struct `Vec` có định nghĩa như sau

```rust,editable
pub struct Vec<T> { /* fields omitted */ }
```

Ví dụ để khởi tạo `Vec` mới với `Vec::new()` ta có thể viết

```rust,editable
Vec::<u8>::new()
```

Nhớ là ta bỏ turbofish sau `Vec::` không phải sau method `new` 
bởi vì struct sử dụng generic type chứ không phải method `new`. 
Hơi bựa nhưng nó vẫn thỏa quy tắc của turbofish. Một ví dụ khác

```rust,editable
std::collections::HashSet::<u8>::with_capacity(10) 
```

Ta đang tạo một `Hashset` với 10 phần tử, bởi vì `Hashset` struct có định nghĩa như sau

```rust,editable
pub struct HashSet<T, S = RandomState> { /* fields omitted */ } 
```

Chúng ta có thể sử dụng cú pháp này với mọi Rust collections.

# Generic Enum

Tuy nhiên Enum lại không theo quy tắc trên, bởi vì enum trong Rust không được 
scoped tại enum name, do đó ta đặt turbofish sau enum variant. 
Ví dụ hãy xem enum `Result` được dùng rất nhiều trong Rust

```rust,editable
#[must_use]
pub enum Result<T, E> {
  Ok(T),
  Err(E),
}
```

Chúng ta sử dụng như thế này:

```rust,editable
Result::Ok::<u8, ()>(10)
Result::Err::<u8, ()>(())
```

Và bởi vì `Result` thường được prelude (import sẵn)
trong Rust, thực tế mọi người sẽ viết như thế này:

```rust,editable
Ok::<u8, ()>(10)
Err::<u8, ()>(()) 
```

# References

- [Generic Types, Traits, and Lifetimes](https://doc.rust-lang.org/book/ch10-00-generics.html#generic-types-traits-and-lifetimes)
- [Generics in the rust book](https://doc.rust-lang.org/book/generics.html)
- [Rust syntax index](https://doc.rust-lang.org/book/syntax-index.html)
- <https://matematikaadit.github.io/posts/rust-turbofish.html>
- <https://techblog.tonsser.com/posts/what-is-rusts-turbofish>
