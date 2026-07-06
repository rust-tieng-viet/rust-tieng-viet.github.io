# Trait Inheritance

```rust,ignore
pub trait B: A {}
```

Cái này không hẳn gọi là _Trait Inheritance_, cái này đúng hơn gọi là "cái nào implement cái `B` thì cũng nên implement cái `A`". `A` và `B` vẫn là 2 trait độc lập nên vẫn phải implemenet cả 2.

```rust,ignore
impl B for Z {}
impl A for Z {}
```

Inheritance thì không được khuyến khích sử dụng.

