# Closure

Hay còn được gọi là **anonymous functions** hay **lambda functions**.
Khác với function bình thường, kiểu dữ liệu của tham số đầu vào 
và kiểu dữ liệu trả ra là không bắt buộc.

Function bình thường:

```rust
fn get_square_value(i: i32) -> i32 {
  i * i
}

fn main() {
  let x = 2;
  println!("{}", get_square_value(x));
}
```

Closure:

```rust
fn main() {
  let x = 2;

  let square = |i: i32| -> i32 {
      i * i
  };

  println!("{}", square(x));
}
```

### Closure không cần data type

```rust
fn main() {
  let x = 2;

  let square = |i| {
    i * i
  };

  println!("{}", square(x));
}
```

Tham số của của closure được đặt giữa 2 dấu: `|` và `|`. 

### Closure không có tham số

Với closure không có tham số, ta viết như sau: 

```rust
let func = || { 1 + 1 };
```

### Closure chỉ có một mệnh đề 

Dấu ngoặc `{}` cũng không bắt buộc nếu nội dung của closure chỉ có một mệnh đề.

```rust
let func = || 1 + 1;
```

### Vừa định nghĩa, vừa thực thi

```rust
fn main() {
  let x = 2;

  let square = |i| -> i32 { // ⭐️ nhưng bắt buộc khai báo return type
    i * i
  }(x);

  println!("{}", square);
}
```
