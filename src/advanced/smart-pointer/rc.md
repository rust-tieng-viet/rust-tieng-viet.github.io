# Rc&lt;T&gt;, Reference Counted

[`Rc<T>`] cung cấp giá trị shared ownership của một giá trị kiểu `T`, được cấp phát trên heap. Nếu ta gọi `.clone()` trên `Rc` tạo ra một con trỏ mới đến cùng một phần cấp phát trên heap.

Về lý thuyết [`Rc<T>`] cho phép chúng ta có nhiều "owner" pointer cho cùng một giá trị, thường là giá trị có kích thước lớn.

Về kỹ thuật, [`Rc<T>`] chứa một bộ counter, tự động tăng mỗi khi [`Rc`] được clone và giảm khi giá trị giữ con bỏ bị huỷ hoặc out of scope.  Khi con trỏ `Rc` cuối cùng đến allocation thì con trỏ tự động bị huỷ (destroyed), giá trị được lưu trữ trong phần cấp phát đó (thường được gọi là “inner value”) cũng sẽ bị hủy.

```rust
use std::rc::Rc;

let rc = Rc::new(vec![1.0, 2.0, 3.0]);

// Method-call syntax
let rc2 = rc.clone();
```

Shared references trong Rust mặc định không cho phép mutation, Rc cũng thế. Nếu muốn chúng ta phải đặt [`Cell`](https://doc.rust-lang.org/std/cell/struct.Cell.html "struct std::cell::Cell") hoặc [`RefCell`](https://doc.rust-lang.org/std/cell/struct.RefCell.html "struct std::cell::RefCell") bên trong [`Rc`](https://doc.rust-lang.org/std/rc/struct.Rc.html "struct std::rc::Rc"), xem [ví dụ](https://doc.rust-lang.org/std/cell/index.html#introducing-mutability-inside-of-something-immutable).

```rust
use std::rc::Rc;

struct Data {
    name: String,
    // ...other fields
}

fn main() {
    // Create a reference-counted `Owner`.
    let p1: Rc<Data> = Rc::new(
        Data {
            name: "Duyet".to_string(),
        }
    );

	let p2 = p1.clone();
	let p3 = p1.clone();

	// Drop p1
	drop(p1);

	// Mặc dù đã drop p1 nhưng chúng ta vẫn có thể truy cập đến
	// các giá trị của p2 và p3. Bởi p1 là Rc<Data> tức chỉ chứa
	// con trỏ đến Data. Data sẽ chỉ bị drop sau khi không còn con
	// trỏ nào đến nó nữa.
	println!("p2 {}", p2.name);
    println!("p3 {}", p3.name);
}
```

[`Rc<T>`]: https://doc.rust-lang.org/std/rc/struct.Rc.html
[`Rc`]: https://doc.rust-lang.org/std/rc/struct.Rc.html

