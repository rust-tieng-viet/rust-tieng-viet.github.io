# Mệnh đề `where`

Một bound có thể được chỉ dẫn sau mệnh đề `where` ngay trước `{` của function.

`where` giúp cho việc định nghĩa các generic types và bounds một cách rõ ràng hơn.

```rust
fn printer<T>(t: T) 
where
    T: Display + Display
{
    println!("{:?}", t);
}
```

```rust
impl <A: TraitB + TraitC, D: TraitE + TraitF> MyTrait<A, D> for YourType {}

// Expressing bounds with a `where` clause
impl <A, D> MyTrait<A, D> for YourType where
    A: TraitB + TraitC,
    D: TraitE + TraitF {}
```