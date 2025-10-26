# Zero-Cost Abstractions

Zero-cost abstractions là một trong những principles quan trọng nhất của Rust: bạn có thể viết high-level code với abstractions mạnh mẽ, nhưng không phải trả giá về performance. Compiler tối ưu abstractions thành machine code hiệu quả như hand-written low-level code.

## Nguyên tắc

> "What you don't use, you don't pay for. And further: What you do use, you couldn't hand code any better."
> - Bjarne Stroustrup

Trong Rust:
- Abstractions không có runtime overhead
- Compiler inline và optimize tối đa
- High-level code = Low-level performance

## Iterator Chains vs Loops

### Loop thủ công

```rust
fn sum_of_squares_manual(numbers: &[i32]) -> i32 {
    let mut sum = 0;
    for i in 0..numbers.len() {
        let n = numbers[i];
        if n % 2 == 0 {
            sum += n * n;
        }
    }
    sum
}
```

### Iterator chain (zero-cost!)

```rust
fn sum_of_squares_iterator(numbers: &[i32]) -> i32 {
    numbers.iter()
        .filter(|n| *n % 2 == 0)
        .map(|n| n * n)
        .sum()
}

fn main() {
    let nums = vec![1, 2, 3, 4, 5, 6];

    let manual = sum_of_squares_manual(&nums);
    let iterator = sum_of_squares_iterator(&nums);

    assert_eq!(manual, iterator);  // 56
    println!("Result: {}", iterator);

    // Cả hai compile thành CÙNG machine code!
}
```

## Compiler Optimization

Compiler Rust optimize iterator chains qua:

### 1. Inlining

```rust
// High-level code
let result: i32 = (1..=100)
    .filter(|x| x % 2 == 0)
    .map(|x| x * x)
    .sum();

// Compiler tối ưu thành tương đương:
let mut result = 0;
for x in 1..=100 {
    if x % 2 == 0 {
        result += x * x;
    }
}
```

### 2. Loop Fusion

```rust
// Nhiều operations
let result: Vec<_> = data
    .iter()
    .map(|x| x + 1)
    .filter(|x| x % 2 == 0)
    .map(|x| x * 2)
    .collect();

// Compiler merge thành single loop
// Không có intermediate allocations!
```

## Generic Functions - Zero Overhead

```rust
// Generic function
fn print_value<T: std::fmt::Display>(value: T) {
    println!("{}", value);
}

fn main() {
    print_value(42);           // Monomorphized cho i32
    print_value("hello");      // Monomorphized cho &str
    print_value(3.14);         // Monomorphized cho f64

    // Compiler tạo 3 versions riêng biệt
    // Mỗi version được inline và optimize
    // Zero runtime cost!
}
```

## Trait Objects vs Generics

### Static Dispatch (zero-cost)

```rust
trait Process {
    fn process(&self) -> i32;
}

struct AddOne;
struct Double;

impl Process for AddOne {
    fn process(&self, value: i32) -> i32 {
        value + 1
    }
}

impl Process for Double {
    fn process(&self, value: i32) -> i32 {
        value * 2
    }
}

// ✅ Static dispatch - zero cost
fn apply_static<T: Process>(processor: &T, value: i32) -> i32 {
    processor.process(value)  // Compile-time dispatch
}

fn main() {
    let add = AddOne;
    let result = apply_static(&add, 10);  // Direct function call!
    println!("{}", result);
}
```

### Dynamic Dispatch (có runtime cost)

```rust
// ❌ Dynamic dispatch - runtime overhead
fn apply_dynamic(processor: &dyn Process, value: i32) -> i32 {
    processor.process(value)  // Virtual function call
}

fn main() {
    let add = AddOne;
    let result = apply_dynamic(&add as &dyn Process, 10);
    println!("{}", result);
}
```

## Newtype Pattern - Zero Cost

```rust
struct UserId(u64);
struct ProductId(u64);

fn get_user(id: UserId) -> String {
    format!("User {}", id.0)
}

fn main() {
    let user = UserId(123);

    // Type safety với zero runtime cost
    // Compiled code giống như truyền u64 trực tiếp!
    println!("{}", get_user(user));
}
```

## Smart Pointers

### Box<T> - Heap Allocation

```rust
fn main() {
    let x = Box::new(5);

    // Box chỉ là pointer wrapper
    // Deref tự động - zero cost!
    println!("{}", *x);

    // Compiled thành simple pointer operations
}
```

### Rc<T> - Reference Counting

```rust
use std::rc::Rc;

fn main() {
    let data = Rc::new(vec![1, 2, 3]);
    let data2 = Rc::clone(&data);

    // Reference counting có cost (increment/decrement)
    // Nhưng efficient và predictable!
}
```

## Data Processing Pipeline - Zero Cost

```rust
#[derive(Debug, Clone)]
struct Record {
    id: u64,
    value: f64,
    active: bool,
}

fn process_records(records: &[Record]) -> Vec<f64> {
    records.iter()
        .filter(|r| r.active)           // Zero-cost filter
        .filter(|r| r.value > 100.0)    // Chain filters
        .map(|r| r.value * 1.1)         // Transform
        .collect()                       // Single allocation
}

fn main() {
    let records = vec![
        Record { id: 1, value: 150.0, active: true },
        Record { id: 2, value: 50.0, active: true },
        Record { id: 3, value: 200.0, active: false },
        Record { id: 4, value: 120.0, active: true },
    ];

    let results = process_records(&records);
    println!("Processed: {:?}", results);
    // [165.0, 132.0]

    // Compiler optimize thành efficient loop
    // Không có intermediate collections!
}
```

## Benchmark: Iterator vs Loop

```rust
use std::time::Instant;

fn benchmark_iterator(data: &[i32]) -> i32 {
    data.iter()
        .filter(|&&x| x % 2 == 0)
        .map(|&x| x * x)
        .sum()
}

fn benchmark_loop(data: &[i32]) -> i32 {
    let mut sum = 0;
    for &x in data {
        if x % 2 == 0 {
            sum += x * x;
        }
    }
    sum
}

fn main() {
    let data: Vec<i32> = (1..=1_000_000).collect();

    // Benchmark iterator
    let start = Instant::now();
    let result1 = benchmark_iterator(&data);
    let duration1 = start.elapsed();

    // Benchmark loop
    let start = Instant::now();
    let result2 = benchmark_loop(&data);
    let duration2 = start.elapsed();

    assert_eq!(result1, result2);

    println!("Iterator: {:?}", duration1);
    println!("Loop:     {:?}", duration2);
    // Performance gần như giống nhau!
}
```

## Closure Optimization

### Zero-cost closures

```rust
fn apply_operation<F>(data: &[i32], op: F) -> Vec<i32>
where
    F: Fn(i32) -> i32,
{
    data.iter().map(|&x| op(x)).collect()
}

fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // Closure được inline!
    let doubled = apply_operation(&numbers, |x| x * 2);

    println!("{:?}", doubled);
    // Compiled thành direct operations - zero overhead!
}
```

## Const Generics - Compile-time Computation

```rust
struct Matrix<T, const ROWS: usize, const COLS: usize> {
    data: [[T; COLS]; ROWS],
}

impl<T: Default + Copy, const ROWS: usize, const COLS: usize> Matrix<T, ROWS, COLS> {
    fn new() -> Self {
        Matrix {
            data: [[T::default(); COLS]; ROWS],
        }
    }
}

fn main() {
    // Size checked tại compile-time
    let matrix1: Matrix<f64, 3, 3> = Matrix::new();
    let matrix2: Matrix<f64, 5, 5> = Matrix::new();

    // Zero runtime overhead cho size checks!
}
```

## Option và Result - Zero Cost

### Option<T>

```rust
fn find_value(data: &[i32], target: i32) -> Option<usize> {
    for (i, &value) in data.iter().enumerate() {
        if value == target {
            return Some(i);
        }
    }
    None
}

fn main() {
    let numbers = vec![10, 20, 30, 40];

    match find_value(&numbers, 30) {
        Some(index) => println!("Found at index: {}", index),
        None => println!("Not found"),
    }

    // Option được optimize thành simple enum
    // Không có heap allocation hoặc indirection!
}
```

## Parallel Iterators với Rayon - Near Zero Cost

```rust
use rayon::prelude::*;

fn sum_sequential(data: &[i32]) -> i32 {
    data.iter().map(|&x| x * x).sum()
}

fn sum_parallel(data: &[i32]) -> i32 {
    data.par_iter().map(|&x| x * x).sum()
}

fn main() {
    let data: Vec<i32> = (1..=10_000_000).collect();

    let start = std::time::Instant::now();
    let seq = sum_sequential(&data);
    println!("Sequential: {:?}", start.elapsed());

    let start = std::time::Instant::now();
    let par = sum_parallel(&data);
    println!("Parallel:   {:?}", start.elapsed());

    assert_eq!(seq, par);

    // Parallel faster với minimal overhead!
}
```

## Match Expression - Zero Cost

```rust
enum DataType {
    Integer(i64),
    Float(f64),
    Text(String),
}

fn process_data(data: DataType) -> String {
    match data {
        DataType::Integer(n) => format!("Int: {}", n),
        DataType::Float(f) => format!("Float: {:.2}", f),
        DataType::Text(s) => format!("Text: {}", s),
    }
}

fn main() {
    let values = vec![
        DataType::Integer(42),
        DataType::Float(3.14),
        DataType::Text("hello".to_string()),
    ];

    for value in values {
        println!("{}", process_data(value));
    }

    // Match compiled thành efficient jump table
    // Zero overhead vs if-else chain!
}
```

## Best Practices

### 1. Prefer iterators over manual loops

```rust
// ✅ Zero-cost và clear intent
let sum: i32 = data.iter().filter(|&&x| x > 0).sum();

// ❌ Verbose và dễ bugs
let mut sum = 0;
for &x in data {
    if x > 0 {
        sum += x;
    }
}
```

### 2. Use generics cho reusable code

```rust
// ✅ Generic - monomorphized tại compile-time
fn process<T: std::fmt::Display>(value: T) {
    println!("{}", value);
}

// ❌ Trait object - runtime overhead
fn process_dyn(value: &dyn std::fmt::Display) {
    println!("{}", value);
}
```

### 3. Chain operations

```rust
// ✅ Chaining - compiler optimize
let result = data
    .iter()
    .filter(|x| x.is_valid())
    .map(|x| x.transform())
    .collect();

// ❌ Intermediate collections - allocations
let filtered: Vec<_> = data.iter().filter(|x| x.is_valid()).collect();
let mapped: Vec<_> = filtered.iter().map(|x| x.transform()).collect();
```

### 4. Leverage type system

```rust
// ✅ Newtype - compile-time safety, zero runtime cost
struct UserId(u64);

fn get_user(id: UserId) { }

// ❌ Primitive type - dễ nhầm lẫn
fn get_user_raw(id: u64) { }
```

## Ví dụ thực tế: ETL Pipeline

```rust
#[derive(Debug, Clone)]
struct Customer {
    id: u64,
    name: String,
    age: u32,
    revenue: f64,
}

fn extract_transform_load(customers: &[Customer]) -> Vec<(String, f64)> {
    customers
        .iter()
        .filter(|c| c.age >= 18)                    // Filter
        .filter(|c| c.revenue > 1000.0)             // Additional filter
        .map(|c| (c.name.to_uppercase(), c.revenue * 1.1))  // Transform
        .collect()                                  // Load
}

fn main() {
    let customers = vec![
        Customer { id: 1, name: "Alice".to_string(), age: 25, revenue: 5000.0 },
        Customer { id: 2, name: "Bob".to_string(), age: 17, revenue: 2000.0 },
        Customer { id: 3, name: "Charlie".to_string(), age: 30, revenue: 500.0 },
        Customer { id: 4, name: "Diana".to_string(), age: 28, revenue: 3000.0 },
    ];

    let result = extract_transform_load(&customers);

    for (name, revenue) in result {
        println!("{}: ${:.2}", name, revenue);
    }

    // ALICE: $5500.00
    // DIANA: $3300.00

    // Entire pipeline compiled thành efficient loop
    // Single pass qua data
    // Minimal allocations
}
```

## Assembly Comparison

Xem compiler output với `cargo asm` hoặc Compiler Explorer (godbolt.org):

```rust
pub fn iterator_sum(data: &[i32]) -> i32 {
    data.iter().filter(|&&x| x > 0).sum()
}

pub fn loop_sum(data: &[i32]) -> i32 {
    let mut sum = 0;
    for &x in data {
        if x > 0 {
            sum += x;
        }
    }
    sum
}

// Cả hai functions compile thành CÙNG assembly code!
```

## Khi nào abstractions CÓ cost?

### 1. Dynamic dispatch

```rust
// Runtime overhead do virtual function calls
fn process(handler: &dyn Handler) {
    handler.handle();  // Indirect call
}
```

### 2. Excessive allocations

```rust
// Mỗi step allocate new Vec
let step1: Vec<_> = data.iter().map(|x| x + 1).collect();
let step2: Vec<_> = step1.iter().map(|x| x * 2).collect();
let step3: Vec<_> = step2.iter().filter(|&&x| x > 10).collect();
```

### 3. Unnecessary clones

```rust
// Clone toàn bộ data mỗi iteration
for item in data.clone() {  // ❌
    // ...
}
```

## Tổng kết

Zero-cost abstractions trong Rust:
- ✅ High-level code = Low-level performance
- ✅ Iterators nhanh như loops
- ✅ Generics không có runtime overhead
- ✅ Newtypes không có cost
- ✅ Smart abstractions được optimize tối đa

Best practices:
1. Prefer iterators và chaining
2. Use generics cho static dispatch
3. Leverage type system
4. Trust the optimizer
5. Measure khi optimization quan trọng

Rust motto: "Zero-cost abstractions - you don't pay for what you don't use!"

## References

- [Zero-Cost Abstractions](https://blog.rust-lang.org/2015/05/11/traits.html)
- [Iterator Performance](https://doc.rust-lang.org/book/ch13-04-performance.html)
- [Compiler Explorer](https://godbolt.org/)
- [Rust Performance Book](https://nnethercote.github.io/perf-book/)
