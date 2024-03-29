# [`Result`](https://doc.rust-lang.org/std/result/)

Tương tự như `Option`.
Một kết quả trả về ([`Result`](https://doc.rust-lang.org/std/result/))
của một function thường sẽ có hai trường hợp:

- thành công ([`Ok`](https://doc.rust-lang.org/std/result/enum.Result.html#variant.Ok)) và trả về kết quả
- hoặc lỗi ([`Err`](https://doc.rust-lang.org/std/result/enum.Result.html#variant.Err)) và trả về thông tin lỗi.

[`Result`](https://doc.rust-lang.org/std/result/) là một phiên bản cao cấp hơn của `Option`.
Nó mô tả *lỗi gì* đang xảy ra thay vì khả năng *tồn tại* giá trị hay không.


```rust
enum Result<T, E> {
  Ok(T),
  Err(E),
}
```

Ví dụ

{{#playground ./result-example.rs}}

Như bạn thấy thì `main()` cũng có thể return về `Result<(), &'static str>`

### `.unwrap()`

Ví dụ trên nhưng sử dụng `.unwrap()` , chủ động panic (crash) dừng chương trình nếu gặp lỗi.

```rust,editable
fn main() -> Result<(), &'static str> {
  let who = "duyet";
  let age = get_age(who).unwrap();
  println!("{} is {}", who, age);

  Ok(())
}
```

### `.expect()`

Giống như `unwrap()`: chủ động panic (crash) dừng chương trình nếu gặp lỗi và kèm theo message. Sẽ rất có ích, nhất là khi có quá nhiều unwrap, bạn sẽ không biết nó panic ở đâu.

```rust,editable
fn main() -> Result<(), &'static str> {
  let who = "ngan";
  let age = get_age(who).expect("could not get age");
  println!("{} is {}", who, age);

  Ok(())
}
```

Xem thêm mọi method khác của [`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) [tại đây](https://doc.rust-lang.org/std/result/enum.Result.html).

{{#include ./result-to-option.md}}

{{#include ./question-mark.md}}

