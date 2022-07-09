# Vectors

Vector có để được xem là re-sizable array nhưng mọi phần tử trong vec phải có cùng kiểu dữ liệu.

Vector là một generic type: `Vec<T>`, `T` có thể là bất kỳ kiểu dữ liệu nào. Ví dụ một vector chứa `i32` được viết là `Vec<i32>`.

## Tạo vector rỗng

```rust
let a = Vec::new(); // 1.With new() keyword
let b = vec![]; // 2.Using the vec! macro
```

## Tạo vector với kiểu dữ liệu

```rust
let a2: Vec<i32> = Vec::new();
let b2: Vec<i32> = vec![];
let b3 = vec![1i32, 2, 3]; // Khai báo kiểu cho phần tử đầu tiên

let b4 = vec![0; 10]; // Vec chứa mười số 0
```

## In vector

```rust
let c = vec![5, 4, 3, 2, 1];
println!("vec = {:?}", c);
```

## Push và Pop

```rust
let mut d: Vec<i32> = vec![];
d.push(1);
d.push(2);
d.pop();
```

## Kiểm tra kích thước của vector


```rust
let d = vec![0; 10];

println!("len = {}", d.len());
```