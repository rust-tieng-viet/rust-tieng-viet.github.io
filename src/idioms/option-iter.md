# Iterating over Option

`Option<T>` trong Rust implement `IntoIterator`, điều này cho phép chúng ta sử dụng `Option` trong các iterator chains một cách elegant và expressive.

## Cơ bản

`Option<T>` hoạt động như một iterator có 0 hoặc 1 phần tử:

```rust
fn main() {
    let some = Some(5);
    let none: Option<i32> = None;

    // Some(5) iterate 1 lần
    for value in some {
        println!("Value: {}", value); // Prints: Value: 5
    }

    // None không iterate lần nào
    for value in none {
        println!("This won't print");
    }
}
```

## Tại sao hữu dụng?

### 1. Combining với iterator methods

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let filter_value = Some(3);

    let result: Vec<i32> = numbers
        .into_iter()
        .filter(|&n| n > 2)
        .chain(filter_value)  // Thêm Option vào iterator chain
        .collect();

    println!("{:?}", result); // [3, 4, 5, 3]
}
```

### 2. FlatMap với Option

```rust
fn parse_number(s: &str) -> Option<i32> {
    s.parse().ok()
}

fn main() {
    let strings = vec!["1", "two", "3", "four", "5"];

    let numbers: Vec<i32> = strings
        .iter()
        .flat_map(|s| parse_number(s))  // flat_map tự động unwrap Option
        .collect();

    println!("{:?}", numbers); // [1, 3, 5]
}
```

### 3. Filter_map alternative

```rust
fn main() {
    let values = vec![Some(1), None, Some(3), None, Some(5)];

    // Cách 1: filter + map
    let sum1: i32 = values.iter()
        .filter(|v| v.is_some())
        .map(|v| v.unwrap())
        .sum();

    // Cách 2: filter_map (idiomatic)
    let sum2: i32 = values.iter()
        .filter_map(|&v| v)
        .sum();

    // Cách 3: flatten (Option implements IntoIterator)
    let sum3: i32 = values.iter()
        .flatten()
        .sum();

    println!("{}, {}, {}", sum1, sum2, sum3); // 9, 9, 9
}
```

## Use Cases thực tế

### 1. Optional configuration

```rust
#[derive(Debug)]
struct Config {
    host: String,
    port: u16,
}

impl Config {
    fn from_env() -> Self {
        let custom_host = std::env::var("HOST").ok();
        let custom_port = std::env::var("PORT").ok()
            .and_then(|s| s.parse().ok());

        let default_host = "localhost".to_string();
        let default_port = 8080;

        // Sử dụng chain để ưu tiên custom values
        Config {
            host: custom_host.into_iter()
                .chain(Some(default_host))
                .next()
                .unwrap(),
            port: custom_port.into_iter()
                .chain(Some(default_port))
                .next()
                .unwrap(),
        }
    }
}
```

### 2. Collecting optional values

```rust
fn get_user_by_id(id: u32) -> Option<String> {
    match id {
        1 => Some("Alice".to_string()),
        2 => Some("Bob".to_string()),
        _ => None,
    }
}

fn main() {
    let user_ids = vec![1, 3, 2, 5];

    // Collect tất cả users tồn tại
    let users: Vec<String> = user_ids
        .into_iter()
        .filter_map(get_user_by_id)
        .collect();

    println!("{:?}", users); // ["Alice", "Bob"]
}
```

### 3. Chaining operations

```rust
fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 {
        None
    } else {
        Some(a / b)
    }
}

fn main() {
    let result = divide(10.0, 2.0)
        .into_iter()
        .map(|x| x * 2.0)
        .map(|x| x + 1.0)
        .next();

    println!("{:?}", result); // Some(11.0)

    let error = divide(10.0, 0.0)
        .into_iter()
        .map(|x| x * 2.0)
        .next();

    println!("{:?}", error); // None
}
```

### 4. Flattening nested Options

```rust
fn main() {
    let nested = vec![
        Some(Some(1)),
        Some(None),
        None,
        Some(Some(4)),
    ];

    // Flatten 2 levels
    let flat: Vec<i32> = nested
        .into_iter()
        .flatten()  // Option<Option<i32>> -> Option<i32>
        .flatten()  // Option<i32> -> i32
        .collect();

    println!("{:?}", flat); // [1, 4]
}
```

## So sánh các approaches

### Kiểm tra và unwrap

```rust
// ❌ Verbose và unsafe
let value = if option.is_some() {
    option.unwrap()
} else {
    default_value
};

// ✅ Idiomatic
let value = option.unwrap_or(default_value);
```

### Iterate và collect

```rust
let options = vec![Some(1), None, Some(3)];

// ❌ Manual loop
let mut result = Vec::new();
for opt in options {
    if let Some(val) = opt {
        result.push(val);
    }
}

// ✅ Using flatten
let result: Vec<i32> = options.into_iter().flatten().collect();
```

## Advanced: Custom iteration

```rust
struct MaybeValue<T> {
    value: Option<T>,
}

impl<T> MaybeValue<T> {
    fn new(value: Option<T>) -> Self {
        MaybeValue { value }
    }

    fn process<F, U>(self, f: F) -> Option<U>
    where
        F: FnOnce(T) -> U,
    {
        self.value.into_iter().map(f).next()
    }
}

fn main() {
    let maybe = MaybeValue::new(Some(5));
    let result = maybe.process(|x| x * 2);
    println!("{:?}", result); // Some(10)

    let empty = MaybeValue::new(None);
    let result = empty.process(|x: i32| x * 2);
    println!("{:?}", result); // None
}
```

## Option methods tương tự iterator

`Option` cung cấp nhiều methods tương tự iterator:

```rust
fn main() {
    let value = Some(5);

    // map
    let doubled = value.map(|x| x * 2);
    println!("{:?}", doubled); // Some(10)

    // filter
    let filtered = value.filter(|&x| x > 3);
    println!("{:?}", filtered); // Some(5)

    // and_then (flatMap)
    let result = value.and_then(|x| {
        if x > 3 {
            Some(x * 2)
        } else {
            None
        }
    });
    println!("{:?}", result); // Some(10)
}
```

## Kết hợp với Result

```rust
fn parse_and_double(s: &str) -> Option<i32> {
    s.parse::<i32>()
        .ok()  // Result -> Option
        .map(|n| n * 2)
}

fn main() {
    let strings = vec!["1", "two", "3"];

    let numbers: Vec<i32> = strings
        .iter()
        .filter_map(|s| parse_and_double(s))
        .collect();

    println!("{:?}", numbers); // [2, 6]
}
```

## Performance notes

Iterate over `Option` không có overhead so với if-let hay match:

```rust
// Tất cả đều compile thành cùng assembly code:

// 1. Using iterator
for value in option {
    process(value);
}

// 2. Using if-let
if let Some(value) = option {
    process(value);
}

// 3. Using match
match option {
    Some(value) => process(value),
    None => {}
}
```

## Best Practices

1. **Use `flatten()`** thay vì `filter_map(|x| x)` cho clarity
2. **Use `filter_map()`** khi cần transform + filter
3. **Combine với iterator chains** cho expressive code
4. **Avoid unnecessary unwrap** - let iterator handle `None`

## Common patterns

```rust
fn main() {
    let options = vec![Some(1), None, Some(3), None, Some(5)];

    // Sum của tất cả Some values
    let sum: i32 = options.iter().flatten().sum();
    println!("Sum: {}", sum); // 9

    // Count số lượng Some values
    let count = options.iter().flatten().count();
    println!("Count: {}", count); // 3

    // Find first Some value
    let first = options.iter().flatten().next();
    println!("First: {:?}", first); // Some(1)

    // Check có ít nhất 1 Some value
    let has_some = options.iter().flatten().next().is_some();
    println!("Has some: {}", has_some); // true
}
```

## Tham khảo

- [Option documentation](https://doc.rust-lang.org/std/option/enum.Option.html)
- [Iterator trait](https://doc.rust-lang.org/std/iter/trait.Iterator.html)
- [IntoIterator for Option](https://doc.rust-lang.org/std/option/enum.Option.html#impl-IntoIterator)
