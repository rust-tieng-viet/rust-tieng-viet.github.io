# Functional Programming

Rust không phải là một pure functional programming language như Haskell hay ML, nhưng Rust có rất nhiều concepts từ functional programming, giúp code ngắn gọn, dễ maintain và ít bugs hơn.

## Các đặc điểm Functional Programming trong Rust

- **Immutability by default** - Variables mặc định là immutable
- **First-class functions** - Functions là values
- **Higher-order functions** - Functions nhận/trả về functions khác
- **Iterators** - Lazy evaluation
- **Pattern matching** - Declarative code
- **No null** - `Option<T>` thay vì null
- **Algebraic data types** - Enums với data

## Immutability

```rust
// ✅ Functional style - immutable by default
let x = 5;
let y = x + 1;  // Tạo giá trị mới thay vì modify
let z = y * 2;

println!("{}", z);  // 12

// ❌ Imperative style - mutation
let mut x = 5;
x = x + 1;
x = x * 2;
println!("{}", x);  // 12
```

### Transform thay vì Mutate

```rust
// ✅ Functional - transform
fn add_one_to_all(numbers: Vec<i32>) -> Vec<i32> {
    numbers.into_iter()
        .map(|n| n + 1)
        .collect()
}

// ❌ Imperative - mutate
fn add_one_to_all_mut(numbers: &mut Vec<i32>) {
    for n in numbers.iter_mut() {
        *n += 1;
    }
}
```

## Higher-Order Functions

Functions nhận functions khác làm arguments:

```rust
fn apply_twice<F>(f: F, x: i32) -> i32
where
    F: Fn(i32) -> i32,
{
    f(f(x))
}

fn add_one(x: i32) -> i32 {
    x + 1
}

fn main() {
    let result = apply_twice(add_one, 5);
    println!("{}", result);  // 7
}
```

### Returning Functions

```rust
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

fn main() {
    let add_five = make_adder(5);
    println!("{}", add_five(10));  // 15

    let add_ten = make_adder(10);
    println!("{}", add_ten(10));  // 20
}
```

## Iterators và Lazy Evaluation

Iterators trong Rust là lazy - chỉ compute khi cần:

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // Lazy - chưa execute
    let doubled = numbers.iter()
        .map(|x| {
            println!("Doubling {}", x);
            x * 2
        });

    // Chỉ execute khi collect
    let result: Vec<_> = doubled.collect();
    println!("{:?}", result);
}
```

### Chaining Operations

```rust
fn main() {
    let result: i32 = (1..=10)
        .filter(|x| x % 2 == 0)  // Chỉ số chẵn
        .map(|x| x * x)          // Bình phương
        .sum();                  // Tổng

    println!("{}", result);  // 220 (4 + 16 + 36 + 64 + 100)
}
```

## Combinators

### `map`, `filter`, `fold`

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // map: transform từng phần tử
    let doubled: Vec<_> = numbers.iter()
        .map(|x| x * 2)
        .collect();

    // filter: lọc phần tử
    let evens: Vec<_> = numbers.iter()
        .filter(|x| *x % 2 == 0)
        .collect();

    // fold: reduce về một giá trị
    let sum = numbers.iter()
        .fold(0, |acc, x| acc + x);

    println!("Doubled: {:?}", doubled);  // [2, 4, 6, 8, 10]
    println!("Evens: {:?}", evens);      // [2, 4]
    println!("Sum: {}", sum);             // 15
}
```

### `Option` combinators

```rust
fn main() {
    let maybe_number: Option<i32> = Some(5);

    // map: transform nếu có giá trị
    let doubled = maybe_number.map(|x| x * 2);
    println!("{:?}", doubled);  // Some(10)

    // and_then: chain operations
    let result = Some(5)
        .and_then(|x| Some(x * 2))
        .and_then(|x| if x > 5 { Some(x) } else { None });
    println!("{:?}", result);  // Some(10)

    // filter: giữ nếu match condition
    let filtered = Some(5)
        .filter(|x| *x > 3);
    println!("{:?}", filtered);  // Some(5)
}
```

### `Result` combinators

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}

fn main() {
    let result = divide(10.0, 2.0)
        .map(|x| x * 2.0)  // Transform OK value
        .map_err(|e| format!("Error: {}", e));  // Transform Err value

    println!("{:?}", result);  // Ok(10.0)
}
```

## Pattern Matching

Declarative control flow:

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

fn process(msg: Message) -> String {
    match msg {
        Message::Quit => "Quitting".to_string(),
        Message::Move { x, y } => format!("Moving to ({}, {})", x, y),
        Message::Write(text) => format!("Writing: {}", text),
    }
}

fn main() {
    let msg = Message::Move { x: 10, y: 20 };
    println!("{}", process(msg));
}
```

## Recursion

```rust
// Factorial
fn factorial(n: u64) -> u64 {
    match n {
        0 | 1 => 1,
        n => n * factorial(n - 1),
    }
}

// Tail-recursive (được optimize)
fn factorial_tail(n: u64) -> u64 {
    fn helper(n: u64, acc: u64) -> u64 {
        match n {
            0 | 1 => acc,
            n => helper(n - 1, n * acc),
        }
    }
    helper(n, 1)
}

fn main() {
    println!("{}", factorial(5));       // 120
    println!("{}", factorial_tail(5));  // 120
}
```

## Functional Error Handling

### Sử dụng `?` operator

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file(path: &str) -> io::Result<String> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}
```

### Chaining với `and_then`

```rust
fn parse_number(s: &str) -> Result<i32, std::num::ParseIntError> {
    s.parse()
}

fn double(n: i32) -> Result<i32, String> {
    Ok(n * 2)
}

fn main() {
    let result = parse_number("42")
        .map_err(|e| e.to_string())
        .and_then(double);

    println!("{:?}", result);  // Ok(84)
}
```

## Closure Capture

```rust
fn main() {
    let x = 5;

    // Capture by reference
    let print_x = || println!("x = {}", x);
    print_x();

    // Capture by move
    let consume_x = move || println!("x = {}", x);
    consume_x();
    // x vẫn có thể dùng vì i32 impl Copy
}
```

## Ví dụ thực tế: Data Processing

```rust
#[derive(Debug)]
struct User {
    id: u32,
    name: String,
    age: u32,
    active: bool,
}

fn main() {
    let users = vec![
        User { id: 1, name: "Alice".to_string(), age: 25, active: true },
        User { id: 2, name: "Bob".to_string(), age: 30, active: false },
        User { id: 3, name: "Charlie".to_string(), age: 35, active: true },
        User { id: 4, name: "Diana".to_string(), age: 28, active: true },
    ];

    // Functional pipeline
    let active_user_names: Vec<String> = users.into_iter()
        .filter(|u| u.active)                    // Chỉ active users
        .filter(|u| u.age >= 30)                 // Age >= 30
        .map(|u| u.name.to_uppercase())          // Uppercase names
        .collect();

    println!("{:?}", active_user_names);  // ["CHARLIE"]
}
```

## Functional vs Imperative

### Imperative style

```rust
fn sum_of_squares_imperative(numbers: &[i32]) -> i32 {
    let mut sum = 0;
    for &n in numbers {
        if n % 2 == 0 {
            sum += n * n;
        }
    }
    sum
}
```

### Functional style

```rust
fn sum_of_squares_functional(numbers: &[i32]) -> i32 {
    numbers.iter()
        .filter(|n| *n % 2 == 0)
        .map(|n| n * n)
        .sum()
}

fn main() {
    let nums = vec![1, 2, 3, 4, 5, 6];

    println!("{}", sum_of_squares_imperative(&nums));  // 56
    println!("{}", sum_of_squares_functional(&nums));  // 56
}
```

**Ưu điểm của functional style:**
- Dễ đọc, dễ hiểu intent
- Ít bugs (không có mutable state)
- Dễ test
- Có thể parallel dễ dàng (với `rayon`)

## Parallel Processing với Rayon

```rust
use rayon::prelude::*;

fn main() {
    let numbers: Vec<i32> = (1..=1000).collect();

    // Sequential
    let sum: i32 = numbers.iter().map(|x| x * x).sum();

    // Parallel - chỉ cần thêm par_iter()!
    let sum_parallel: i32 = numbers.par_iter().map(|x| x * x).sum();

    println!("Sum: {}", sum);
    println!("Sum (parallel): {}", sum_parallel);
}
```

## Best Practices

### 1. Prefer iterators over loops

```rust
// ✅ Functional
let sum: i32 = (1..=10).sum();

// ❌ Imperative
let mut sum = 0;
for i in 1..=11 {
    sum += i;
}
```

### 2. Use combinators

```rust
// ✅ Functional
let result = Some(5)
    .map(|x| x * 2)
    .filter(|x| *x > 5);

// ❌ Imperative
let result = if let Some(x) = Some(5) {
    let doubled = x * 2;
    if doubled > 5 {
        Some(doubled)
    } else {
        None
    }
} else {
    None
};
```

### 3. Immutability when possible

```rust
// ✅ Immutable
let numbers = vec![1, 2, 3];
let doubled: Vec<_> = numbers.iter().map(|x| x * 2).collect();

// ❌ Mutable
let mut numbers = vec![1, 2, 3];
for n in &mut numbers {
    *n *= 2;
}
```

### 4. Chain operations

```rust
// ✅ Chaining
let result = data
    .into_iter()
    .filter(|x| x.is_valid())
    .map(|x| x.process())
    .collect();

// ❌ Intermediate variables
let filtered: Vec<_> = data.into_iter().filter(|x| x.is_valid()).collect();
let processed: Vec<_> = filtered.into_iter().map(|x| x.process()).collect();
```

## Khi nào không nên dùng FP?

1. **Performance critical code** - Imperative có thể nhanh hơn trong một số cases
2. **Quá nhiều allocations** - Iterator chains có thể allocate nhiều
3. **Complex state management** - Mutation có thể clear hơn

## Tổng kết

Functional programming trong Rust:
- ✅ Immutability by default
- ✅ Powerful iterators
- ✅ Rich combinators (map, filter, fold...)
- ✅ Pattern matching
- ✅ Type-safe error handling
- ✅ Easy parallelization

Best practices:
1. Prefer iterators và chaining
2. Use combinators
3. Immutability when possible
4. Declarative over imperative
5. Test pure functions

## References

- [Functional Programming - Rust Book](https://doc.rust-lang.org/book/ch13-00-functional-features.html)
- [Iterators](https://doc.rust-lang.org/book/ch13-02-iterators.html)
- [Closures](https://doc.rust-lang.org/book/ch13-01-closures.html)
- [Rayon](https://github.com/rayon-rs/rayon)
