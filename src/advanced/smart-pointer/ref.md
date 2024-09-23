# `Ref<T>`

```rust
use std::cell::{RefCell, Ref};

let c = RefCell::new((5, 'b'));
let b1: Ref<'_, (u32, char)> = c.borrow();
let b2: Ref<'_, u32> = Ref::map(b1, |t| &t.0);
assert_eq!(*b2, 5)
```

https://doc.rust-lang.org/std/cell/struct.Ref.html