# use crate

Để sử dụng (import) một crate từ <https://crates.io>, ví dụ <https://crates.io/crates/log>.

### 1. Thêm crate vào `Cargo.toml`

Có 2 cách

**Cách 1:** Edit trực tiếp file `Cargo.toml`

```toml
[dependencies]
log = "0.4"
```

**Cách 2:** Sử dụng `cargo add`, cargo sẽ tự động update file `Cargo.toml` cho bạn

```bash
cargo add log
```

```toml
[dependencies]
log = "0.4.17"
```

Để thêm crate vào dev dependencies (dùng cho tests), ta thêm `--dev` vào lệnh:

```bash
cargo add --dev log
```

```toml
[dev-dependencies]
log = "0.4.17"
```

### 2. Sử dụng crate trong code

```rust
fn main() {
    log::info!("hello");
    log::error!("oops");
}
```

Sử dụng keyword `use`. Chức năng chính của `use` là bind lại full path 
của element vào một tên mới, để chúng ta không cần phải lặp lại một tên dài mỗi lần sử dụng.

```rust
use log::info;
use log::error;

fn main() {
    info!("hello");
    error!("oops");
}
```

Nhóm các import lại với nhau:

```rust
use log::{info, error};

fn main() {
    info!("hello");
    error!("oops");
}
```

Import mọi thứ được public trong crate/module. Cách này thường hay tránh bởi 
sẽ khó biết được function, struct, ... nào đó đang thuộc crate nào, ngoại trừ các `prelude::*`.

```rust
use log::*;

fn main() {
    info!("hello");
    error!("oops");
}
```

### `use` trong scope

`use` cũng thường được sử dụng import element vào trong scope hiện tại.

```rust
fn hello() -> String {
  "Hello, world!".to_string()
}

#[cfg(test)]
mod tests {
  use super::hello; // Import the `hello()` function into the scope
    
  #[test]
  fn test_hello() {
    assert_eq!("Hello, world!", hello()); // If not using the above `use` statement, we can run same via `super::hello()`
  }
}
```

Bạn sẽ sẽ hay gặp:

```rust
// ...

#[cfg(test)]
mod tests {
  use super::*;
  use log::info;
    
  // ...
}
```

{{#include ./self-super.md}}

{{#include ./pub-use.md}}