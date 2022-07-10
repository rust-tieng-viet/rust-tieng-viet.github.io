# Toán tử `?`

Khi viết code mà có quá nhiều functions trả về [`Result`](./result.md), việc handle Err sẽ khá nhàm chán. Toán tử chấm hỏi [?](https://doc.rust-lang.org/std/ops/trait.Try.html) cho phép dừng function tại vị trí đó và return cho function cha nếu [`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) ở vị trí đó là Err.

Nó sẽ thay thế đoạn code sau:

```rust,editable
use std::fs::File;
use std::io::prelude::*;
use std::io;

struct Info {
  name: String,
  age: i32,
  rating: i32,
}

fn write_info(info: &Info) -> io::Result<()> {
  // Early return on error
  let mut file = match File::create("my_best_friends.txt") {
    Err(e) => return Err(e),
    Ok(f) => f,
  };
  if let Err(e) = file.write_all(format!("name: {}\n", info.name).as_bytes()) {
    return Err(e)
  }
  if let Err(e) = file.write_all(format!("age: {}\n", info.age).as_bytes()) {
    return Err(e)
  }
  if let Err(e) = file.write_all(format!("rating: {}\n", info.rating).as_bytes()) {
    return Err(e)
  }
  Ok(())
}
```

thành

```rust,editable
use std::fs::File;
use std::io::prelude::*;
use std::io;

struct Info {
  name: String,
  age: i32,
  rating: i32,
}

fn write_info(info: &Info) -> io::Result<()> {
  let mut file = File::create("my_best_friends.txt")?;
  // Early return on error
  file.write_all(format!("name: {}\n", info.name).as_bytes())?;
  file.write_all(format!("age: {}\n", info.age).as_bytes())?;
  file.write_all(format!("rating: {}\n", info.rating).as_bytes())?;
  Ok(())
}
```

Gọn đẹp hơn rất nhiều.

Toán tử `?` sẽ unwrap giá trị `Ok`, hoặc return giá trị `Err` ở vị trí gần toán tử đó.

`?` chỉ có thể được dùng trong function có kiểu dữ liệu trả về là [`Result`](https://doc.rust-lang.org/std/result/enum.Result.html).