# `Saturating<T>`

Khi nhìn vào ví dụ này, khi cộng (`+`) hoặc trừ (`-`) hai số unsigned `u8` có thể dẫn đến tràn số (overflow) [(playground)](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=c62ff328d54f469ee00bb87dcd5aeaee):

```rust
fn main() {
    println!("{:?}", 10_u8 - 20_u8);
}
```

```
--> src/main.rs:2:22
  |
2 |     println!("{:?}", 10_u8 - 20_u8);
  |                      ^^^^^^^^^^^^^ attempt to compute `10_u8 - 20_u8`, which would overflow
```

Tương tự, nếu ta cố gắng cộng hai `int`, điều này cũng có thể gây ra lỗi tương tự. Ví dụ [(playground)](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=44b339ddf71420cbe307bb0639be32cf):

```rust
fn main() {
    println!("{:?}", i32::MAX + 1);
}
```

```
--> src/main.rs:2:22
  |
2 |     println!("{:?}", i32::MAX + 1);
  |                      ^^^^^^^^^^^^ attempt to compute `i32::MAX + 1_i32`, which would overflow
```

[`Saturating<T>`](https://doc.rust-lang.org/std/num/struct.Saturating.html) là một bọc toán học với chức năng bão hòa. Các phép toán như `+` trên các giá trị `u32` được thiết kế để không bao giờ tràn số, và trong một số cấu hình debug, tràn số được phát hiện và dẫn đến một sự cố. Trong khi hầu hết các phép toán thuộc loại này, một số mã cụ thể mong muốn và phụ thuộc vào toán học bão hòa.

([playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=ac1050dae945a7a9d7333f8539fda6f9))
```rust
use std::num::Saturating;

fn main() {
	let a = Saturating(10_u8);
	let b = Saturating(20_u8);

    println!("{:?}", a - b); // 0

	// Giá trịgốc có thể được truy xuất thông qua `.0`
	let res = (a - b).0;    // 0
}
```

Một ví dụ khác là cố gắng `+` gây tràn số khi giá trị kết quả lớn hơn **giá trị tối đa** của kiểu dữ liệu số đó ([playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=ab0d99413f36d53839569f314b0aa1c9)):

```rust
use std::num::Saturating;

fn main() {
	let max = Saturating(u32::MAX);
	let one = Saturating(1u32);
	
	assert_eq!(u32::MAX, (max + one).0);
}
```

### Một số methods hữu ích khác

`Saturating<T>::MIN` và `Saturating<T>::MAX` trả về giá trị nhỏ nhất và lớn nhất có thể được biểu diễn bởi kiểu số nguyên này:

```rust
use std::num::Saturating;

assert_eq!(<Saturating<usize>>::MIN, Saturating(usize::MIN));
assert_eq!(<Saturating<usize>>::MAX, Saturating(usize::MAX));
```

`pow`:

```rust
use std::num::Saturating;

assert_eq!(Saturating(3usize).pow(4), Saturating(81));
assert_eq!(Saturating(3i8).pow(5), Saturating(127));
```
