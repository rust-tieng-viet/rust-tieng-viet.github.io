# Generic Implementation

Giống như function, ta cũng có thể sử dụng generic type cho
implementation

```rust
struct S; // Kiểu tường minh `S`
struct GenericVal<T>(T); // Generic type `GenericVal`

// impl cho GenericVal, chúng ta có thể chỉ định cụ thể kiểu dữ liệu cho type parameters:
impl GenericVal<f32> {} // `f32`
impl GenericVal<S> {} // `S` được định nghĩa ở trên

// cần khai báo `<T>` để duy trì tính tổng quát
impl<T> GenericVal<T> {}
```

Một ví dụ khác

```rust
struct GenVal<T> {
    gen_val: T,
}

// impl of GenVal for a generic type `T`
impl<T> GenVal<T> {
    fn value(&self) -> &T {
        &self.gen_val
    }
}

fn main() {
    let x = GenVal { gen_val: 3i32 };
    let y = GenVal::<u32> { gen_val: 6 };

    println!("{}, {}", x.value(), y.value());
}
```