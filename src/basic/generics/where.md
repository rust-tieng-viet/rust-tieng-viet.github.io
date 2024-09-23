# Mệnh đề `where`

Mệnh đề `where` được sử dụng để làm rõ ràng hơn trong việc định nghĩa các generic types và bounds.
Nó cho phép chúng ta chỉ định các bound một cách tường minh ngay trước hàm, giúp cho mã nguồn trở nên dễ đọc và hiểu hơn.

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