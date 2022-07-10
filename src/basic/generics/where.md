# Mệnh đề `where`

Một bound có thể được chỉ dẫn sau mệnh đề `where` ngay trước `{` của function.

`where` giúp cho việc định nghĩa các generic types và bounds một cách rõ ràng hơn.

```rust
# use std::fmt::Display;
# use core::fmt::Debug;
fn printer<T>(t: T) 
where
    T: Display + Debug
{
    println!("{:?}", t);
}
```

```rust,editable
impl <A: TraitB + TraitC, D: TraitE + TraitF> MyTrait<A, D> for YourType {}

// Expressing bounds with a `where` clause
impl <A, D> MyTrait<A, D> for YourType where
    A: TraitB + TraitC,
    D: TraitE + TraitF {}
```