### Re-export

Một trường hợp đặt biệt là sử dụng `pub use` là re-exporting, 
khi bạn thiết kế một module bạn có thể export một số thứ từ module khác (*) từ module của bạn. 
Do đó người sử dụng có thể sử dụng các module khác đó ngay từ module của bạn.

Module khác (*) đó có thể là một internal module, internal crate hoặc external crate.

```rust
// src/utils.rs
pub use log::*;

```

```rust
// src/main.rs
use crate::utils::info;

fn main() {
    info!("...");
}
```

Pattern này được sử dụng khá nhiều ở các thư viện lớn. 
Nó giúp ẩn đi các internal module phức tạp của library đối với user.
Bởi vì user sẽ không cần quan tâm đến cấu trúc directory phức tạp khi sử dụng một library nào đó.