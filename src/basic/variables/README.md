# Variables

Variables trong Rust có kiểu dữ liệu tĩnh.
Ta khai báo kiểu dữ liệu trong lúc khai báo biến.
Trong đa số các trường hợp compiler có thể đoán được kiểu dữ liệu
nên đôi khi ta có thể bỏ qua.

```rust
# fn main() {
let an_integer = 1u32;
let a_boolean = true;
let unit = ();

// copy `an_integer` into `copied_integer`
let copied_integer = an_integer;
# }
```

Mọi biến đều phải được sử dụng, nếu không, compiler sẽ warning.
Để skip warning, thêm dấu underscore ở đầu tên biến.

```rust
# fn check_error() {}
# fn main() {
// The compiler warns about unused variable bindings; these warnings can
// be silenced by prefixing the variable name with an underscore
let _unused_variable = 3u32;

// Skip the result of function
let _ = check_error();
# }
```

{{#include ./mut.md}}

## Scope

Giá trị của variables có thể được xác định tùy theo scope.
Scope là một tập hợp các dòng code nằm trong `{}`.

```rust,editable
let a = 1;

{
    let a = 2;
    println!("inner: a = {}", a); // 2
}

println!("outer: a = {}", a); // 1
```

## Return trong scope

Ta cũng có thể return giá trị trong một scope cho một variable.

```rust,editable
let a = {
    let y = 10;
    let z = 100;

    y + z
};

println!("a = {}", a);
```
