# `RefMut<T>`

```rust
use std::cell::{RefCell, RefMut};

let c = RefCell::new((5, 'b'));
{
    let b1: RefMut<'_, (u32, char)> = c.borrow_mut();
    let mut b2: RefMut<'_, u32> = RefMut::map(b1, |t| &mut t.0);
    assert_eq!(*b2, 5);
    *b2 = 42;
}
assert_eq!(*c.borrow(), (42, 'b'));
```

https://doc.rust-lang.org/std/cell/struct.RefMut.html