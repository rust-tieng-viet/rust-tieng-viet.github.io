# Generic Functions

Định nghĩa một generic function bằng cách khai báo generic type `<T>` sau tên của function.

```rust,no_run
fn foo<T>(arg: T) { ... }
```

Sử dụng generic function đôi khi yêu cầu chỉ định kiểu dữ liệu tường minh cho tham số đó.
Đôi khi là do function được gọi trả về kiểu dữ liệu là generic, hoặc compiler không có
đủ thông tin. Thực thi một function và chỉ định tường minh có cú pháp như sau:

```rust,no_run
function_name::<A, B>()
```

Ví dụ:

```rust,editable
fn print_me<T: ToString>(content: T) {
    println!("{}", content.to_string());
}

fn main() {
    print_me::<i32>(100);
    print_me::<u64>(1_000_000);
}
```

Cú pháp `<T: ToString>` có nghĩa là: function `print_me` chấp nhận mọi tham số có
kiểu `T`, miễn sau `T` được implement trait 
[ToString](https://doc.rust-lang.org/std/string/trait.ToString.html).

Một ví dụ khác phức tạp hơn từ [Rust By Example](https://doc.rust-lang.org/rust-by-example/generics/gen_fn.html)

```rust,editable
struct A;          // Type tường minh `A`.
struct S(A);       // Type tường minh `S`.
struct SGen<T>(T); // Type Generic `SGen`.

// Các function sau sẽ take ownership của variable
// sau đó thoát ra khỏi scope {}, sau đó giải phóng variable.

// Định nghĩa function `reg_fn` nhận tham số `_s` có kiểu `S`.
// Không có `<T>` vì vậy đây không phải là một generic function.
fn reg_fn(_s: S) {}

// Định nghĩa function `gen_spec_t` nhận tham số `_s` có kiểu `SGen<T>`.
// Ở đây tường minh kiểu `A` cho `S`, và bởi vì `A` không được khai báo 
// như là một generic type parameter cho `gen_spec_t`, 
// nên đây cũng không phải là một generic function.
fn gen_spec_t(_s: SGen<A>) {}

// Định nghĩa function `gen_spec_i32` nhận tham số `_s` có kiểu `SGen<i32>`.
// Giống như ở trên, ta khai báo tường minh `i32` cho `T`.
// Bởi vì `i32` không phải là một a generic type, nên function này cũng không
// phải là một genenic function.
fn gen_spec_i32(_s: SGen<i32>) {}

// Định nghĩa một `generic` function, nhận tham số `_s` có kiểu `SGen<T>`.
// Bởi vì `SGen<T>` được đứng trước bởi `<T>`, nên function này generic bởi `T`.
fn generic<T>(_s: SGen<T>) {}

fn main() {
    // Gọi non-generic functions
    reg_fn(S(A));          // Concrete type.
    gen_spec_t(SGen(A));   // Implicitly specified type parameter `A`.
    gen_spec_i32(SGen(6)); // Implicitly specified type parameter `i32`.

    // Chỉ định cụ thể parameter `char` cho `generic()`.
    generic::<char>(SGen('a'));

    // Chỉ định cụ thể `char` to `generic()`.
    generic(SGen('c'));
}
```