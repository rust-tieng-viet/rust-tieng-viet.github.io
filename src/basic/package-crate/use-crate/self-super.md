### `self::`, `super::`

Mặc định thì `use` sẽ import đường dẫn tuyệt đối, bắt đầu từ crate root.
`self` và `super` thường dùng để import mod theo vị trí tương đối.

```rust,no_run
// src/level_1/level_2/mod.rs

use self::hello_1;
use super::super::level3::hello_2;
```