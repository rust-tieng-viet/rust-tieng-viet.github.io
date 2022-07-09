# Variables

Variables trong Rust có kiểu dữ liệu tĩnh. 
Ta khai báo kiểu dữ liệu trong lúc khai báo biến. 
Trong đa số các trường hợp compiler có thể đoán được kiểu dữ liệu
nên đôi khi ta có thể bỏ qua.

```rust
let an_integer = 1u32;
let a_boolean = true;
let unit = ();

// copy `an_integer` into `copied_integer`
let copied_integer = an_integer;
```

Mọi biến đều phải được sử dụng, nếu không, compiler sẽ warning.
Để skip warning, thêm dấu underscore ở đầu tên biến.

```rust
// The compiler warns about unused variable bindings; these warnings can
// be silenced by prefixing the variable name with an underscore
let _unused_variable = 3u32;

// Skip the result of function
let _ = check_error();
```

## `mut`

Mọi biến trong Rust mặc định là immutable, có nghĩa là không thể thay đổi, 
không thể gán bằng một giá trị khác. 

```rust
let a = 1;
a = 2;

// error[E0384]: cannot assign twice to immutable variable `a`
//  --> src/main.rs:4:1
//   |
// 3 | let a = 1;
//   |     -
//   |     |
//   |     first assignment to `a`
//   |     help: consider making this binding mutable: `mut a`
// 4 | a = 2;
//   | ^^^^^ cannot assign twice to immutable variable
```


Để có thể thay đổi giá trị của biến, ta thêm từ khóa `mut` sau `let`. 

```rust
let mut a = 1;
a = 2;

println!("a = {}", a);
```

Ta cũng có thể khai báo lại biến đó để assign lại giá trị mới:

```rust
let a = 1;
let a = a + 1;
```

## Scope

Giá trị của variables có thể được xác định tùy theo scope.
Scope là một tập hợp các dòng code nằm trong `{}`.

```rust
let a = 1;

{
    let a = 2;
    println!("inner: a = {}", a); // 2
}

println!("outer: a = {}", a); // 1
```

## Return trong scope

Ta cũng có thể return giá trị trong một scope cho một variable.

```rust
let a = {
    let y = 10;
    let z = 100;

    y + z
};

println!("a = {}", a);
```