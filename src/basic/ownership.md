# Ownership

_Ownership_ là một trong những tính năng đặc trưng của Rust, đây là cách giúp Rust đảm bảo memory safety mà không cần đến garbage collector.

# Ownership là gì?

Ownership là một concept mới. Tất cả programs đều cần phải quản lý
memory mà nó sử dụng trong lúc thực thi. Một vài ngôn ngữ sử dụng
garbage collection để tìm và giải phóng bộ nhớ lúc runtime, một số
ngôn ngữ khác thì lập trình viên phải tự chi định (allocate) và giải
phóng (free) bộ nhớ. Rust đi theo một hướng khác, memory được quản lý
bởi một ownership system gồm tập rules được compiler sử dụng để kiểm
tra (check) lúc compile. Bằng cách này thì Rust ép chúng ta viết code theo một
cách an toàn memory-safe, Rust sẽ bắt lỗi ở lúc complie.
Càng hiểu được concept của ownership, thì dần
dần chúng ta có thể viết được code an toàn và hiệu quả hơn.

Để tìm hiểu kỹ hơn về Ownership, bạn có thể đọc Rust Book tại
đây cực kỳ chi tiết:
[https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ownership-rules)

### Ownership Rules

Nói đơn giản về _ownership rules_ thì có một số điều cơ bản sau:

- Mỗi giá trị trong Rust đều có một biến gọi là owner của nó.
- Chỉ có một owner tại một thời điểm.
- Khi owner ra khỏi scope, giá trị sẽ bị hủy.

### Borrow checker

Bằng cách theo dõi data sử dụng thông qua bộ rules,
borrow checker có thể xác định khi nào data cần được khởi tạo
(initialized) và khi nào cần được giải phóng (freed, or dropped).  
Thực tế sẽ có một trong ba trường hợp sau khi bạn sử dụng variable:
tự move data và bỏ ownership; copy data sang một variable khác;
hoặc sử dụng reference (con trỏ) đến data và vẫn giữ ownership,
cho mượn (borrow) nó một thời gian.

Chỉ cần nhớ hai quy tắc quan trọng:

1. Khi truyền một variable (thay vì reference tới variable) cho một function khác, ta sẽ mất quyền ownership. Function đó sẽ là owner của variable này và bạn không thể sử dụng lại được nữa ở context cũ.
2. Khi truyền một reference tới variable, bạn có thể **immutable** borrow không giới hạn; hoặc **mutable** borrow một lần.

Ví dụ: đoạn chương trình sau sẽ không compile được

```rust
fn hold_my_vec<T>(_: Vec<T>) {}

fn main() {
  let x = vec![1, 2, 3];
  hold_my_vec(x);

  let z = x.get(0);
  println!("Got: {:?}", z);
}
```

Compiler sẽ báo lỗi như sau: `rustc main.rs`

```rust
error[E0382]: borrow of moved value: `x`
    --> main.rs:7:13
  |
4 |  let x = vec![1, 2, 3];
  |      - move occurs because `x` has type `Vec<i32>`, which does not implement the `Copy` trait
5 |  hold_my_vec(x);
  |              - value moved here
6 |
7 |  let z = x.get(0);
  |          ^^^^^^^^ value borrowed here after move
  |
  = note: borrow occurs due to deref coercion to `[i32]`
```

Lỗi nói rằng `Vec<i32>` không implement
[Copy trait](https://doc.rust-lang.org/std/marker/trait.Copy.html),
vì thế data sẽ được di chuyển (move) hoặc mượn (borrow) vào function
`hold_my_vec()`. Do đó dòng 7 không thể thực hiện được do `x` được
được move vào trong function kia.

Mặc dùng không thể implement `Copy` trait, `Vec` vẫn có
[Clone trait](https://doc.rust-lang.org/core/clone/trait.Clone.html).
Chỉ để cho code chạy được thì đây là một cách nhanh để compiler ngưng báo lỗi.
Lưu ý thì việc clone thường sẽ tốn khá nhiều chi phí, nhất là đối với những object lớn.

```rust
fn hold_my_vec<T>(_: Vec<T>) {}

fn main() {
  let x = vec![1, 2, 3];
  hold_my_vec(x.clone()); // <-- x.clone()

  let z = x.get(0);
  println!("Got: {:?}", z);
}
```

Trong trường hợp này thì function `hold_my_vec` không làm gì ngoài
việc take ownership. Có một cách tốt hơn là **references.** Thay vì
để function take ownership, ta có thể cho nó mượn giá trị.
Chúng ta sẽ truyền vào một reference — a borrowed value.

```rust
fn hold_my_vec<T>(_: &Vec<T>) {}

fn main() {
  let x = vec![1, 2, 3];
  hold_my_vec(&x); // <--- &x

  let z = x.get(0);
  println!("Got: {:?}", z);
}
```

Với cách này thì chúng ta sẽ để function mượn trong khi
vẫn có thể tiếp tục sử sử dụng trong chương trình.

Bạn có thể đọc thêm về [Ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html),
[References and Borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#references-and-borrowing) và
[The Slice Type](https://doc.rust-lang.org/book/ch04-03-slices.html#the-slice-type) tại the Rust Book.
