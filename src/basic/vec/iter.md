# Iterators

Iterator pattern cho phép bạn thực hiện một số tác vụ trên từng phần tử một cách tuần tự.
Một iterator chịu trách nhiệm về logic của việc lặp qua từng phần tử và xác định khi nào chuỗi đã kết thúc.
Khi bạn sử dụng iterators, bạn không cần phải tái hiện lại logic đó một lần nữa.

Trong Rust, iterators là *lazy*, nghĩa là chúng không có tác dụng gì cho đến khi bạn gọi các phương thức consume iterator (e.g. `sum`, `count`, ...).

```rust
let v1 = vec![1, 2, 3];
let v1_iter = v1.iter(); // lazy

for val in v1_iter {
    println!("Got: {val}");
}
// Got: 1
// Got: 2
// Got: 3
```

## The `Iterator` Trait and the `next` Method

Tất cả iterators được implement một trait tên là `Iterator` được định nghĩa trong standard library. Định nghĩa của trait trông như sau:

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // methods with default implementations elided
}
```

## Consume the Iterator

Phương thức gọi `next` được gọi là *consuming adaptors*.

```rust
let v1 = vec![1, 2, 3];
let v1_iter = v1.iter(); // lazy

let total: i32 = v1_iter.sum(); // Consume
println!("Total: {}", &total);  // Total: 6
```

`v1_iter` không thể sử dụng bởi vì `sum` đã takes ownership của iterator.

## Produce Other Iterators

*Iterator adaptors* là các phương thức được định nghĩa trên trait `Iterator` không consume iterator.
Thay vào đó, chúng produce ra các iterator khác bằng cách thay đổi một ít từ iterator gốc.

```rust
let v1: Vec<i32> = vec![1, 2, 3];

v1.iter().map(|x| x + 1); // new iter
```

```rust
let v1: Vec<i32> = vec![1, 2, 3];

let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();

println!("{:?}", v2); // [2, 3, 4]
```

## References

- [Processing a Series of Items with Iterators](https://doc.rust-lang.org/book/ch13-02-iterators.html)