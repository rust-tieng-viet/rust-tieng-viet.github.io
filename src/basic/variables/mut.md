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
