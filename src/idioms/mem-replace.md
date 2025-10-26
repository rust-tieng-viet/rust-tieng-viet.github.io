# mem::replace và mem::take

`std::mem::replace` và `std::mem::take` là hai functions hữu ích giúp thay thế giá trị trong một mutable reference mà không cần clone, đặc biệt hữu dụng khi làm việc với ownership.

## mem::replace

`mem::replace` lấy giá trị hiện tại và thay thế bằng giá trị mới, trả về giá trị cũ:

```rust
use std::mem;

fn main() {
    let mut v = vec![1, 2, 3];

    let old_v = mem::replace(&mut v, vec![4, 5, 6]);

    println!("Old: {:?}", old_v); // [1, 2, 3]
    println!("New: {:?}", v);      // [4, 5, 6]
}
```

### Signature

```rust
pub fn replace<T>(dest: &mut T, src: T) -> T
```

## mem::take

`mem::take` là shorthand cho `mem::replace(&mut dest, Default::default())`:

```rust
use std::mem;

fn main() {
    let mut v = vec![1, 2, 3];

    let old_v = mem::take(&mut v);

    println!("Old: {:?}", old_v); // [1, 2, 3]
    println!("New: {:?}", v);      // []
}
```

### Signature

```rust
pub fn take<T: Default>(dest: &mut T) -> T
```

## Use Cases

### 1. Modify enum variants

Một trong những use case phổ biến nhất là khi cần modify một enum variant:

```rust
use std::mem;

enum State {
    Active { count: u32 },
    Inactive,
}

impl State {
    fn increment(&mut self) {
        // Lấy ownership của self để pattern match
        let old_state = mem::take(self);

        *self = match old_state {
            State::Active { count } => State::Active { count: count + 1 },
            State::Inactive => State::Active { count: 1 },
        };
    }
}

fn main() {
    let mut state = State::Inactive;
    state.increment();

    if let State::Active { count } = state {
        println!("Count: {}", count); // Count: 1
    }
}
```

Nếu không dùng `mem::take`, bạn sẽ gặp borrow checker error:

```rust
// ❌ Compile error!
fn increment_wrong(&mut self) {
    *self = match self {
        // Error: cannot move out of `*self` which is behind a mutable reference
        State::Active { count } => State::Active { count: count + 1 },
        State::Inactive => State::Active { count: 1 },
    };
}
```

### 2. Implement methods on structs với owned fields

```rust
use std::mem;

struct Buffer {
    data: Vec<u8>,
}

impl Buffer {
    fn process(&mut self) -> Vec<u8> {
        // Lấy data ra để xử lý, thay bằng empty vec
        let data = mem::take(&mut self.data);

        // Process data
        let processed = data.into_iter()
            .map(|b| b.wrapping_add(1))
            .collect();

        processed
    }
}

fn main() {
    let mut buffer = Buffer {
        data: vec![1, 2, 3],
    };

    let result = buffer.process();
    println!("Processed: {:?}", result);     // [2, 3, 4]
    println!("Buffer now: {:?}", buffer.data); // []
}
```

### 3. Swap values

Sử dụng `mem::replace` để swap values:

```rust
use std::mem;

fn main() {
    let mut a = 5;
    let mut b = 10;

    // Swap using mem::replace
    let temp = mem::replace(&mut a, mem::replace(&mut b, a));

    println!("a: {}, b: {}", a, b); // a: 10, b: 5

    // Hoặc đơn giản hơn, dùng std::mem::swap
    mem::swap(&mut a, &mut b);
    println!("a: {}, b: {}", a, b); // a: 5, b: 10
}
```

### 4. Avoid clone trong loops

```rust
use std::mem;

struct Node {
    value: i32,
    next: Option<Box<Node>>,
}

impl Node {
    fn into_values(self) -> Vec<i32> {
        let mut values = Vec::new();
        let mut current = Some(Box::new(self));

        while let Some(mut node) = current {
            values.push(node.value);
            // Take ownership of next without cloning
            current = mem::take(&mut node.next);
        }

        values
    }
}

fn main() {
    let list = Node {
        value: 1,
        next: Some(Box::new(Node {
            value: 2,
            next: Some(Box::new(Node {
                value: 3,
                next: None,
            })),
        })),
    };

    let values = list.into_values();
    println!("{:?}", values); // [1, 2, 3]
}
```

### 5. Working with Option

```rust
use std::mem;

struct Cache {
    data: Option<String>,
}

impl Cache {
    fn take_data(&mut self) -> Option<String> {
        mem::take(&mut self.data)
    }

    fn replace_data(&mut self, new_data: String) -> Option<String> {
        mem::replace(&mut self.data, Some(new_data))
    }
}

fn main() {
    let mut cache = Cache {
        data: Some("Hello".to_string()),
    };

    // Lấy data ra khỏi cache
    let data = cache.take_data();
    println!("Taken: {:?}", data);        // Some("Hello")
    println!("Cache: {:?}", cache.data);  // None

    // Replace với data mới
    let old = cache.replace_data("World".to_string());
    println!("Old: {:?}", old);           // None
    println!("Cache: {:?}", cache.data);  // Some("World")
}
```

## mem::replace vs clone

```rust
use std::mem;

fn process_with_clone(data: &mut Vec<i32>) {
    let copy = data.clone();  // ❌ Expensive: allocates new memory
    // Process copy...
}

fn process_with_replace(data: &mut Vec<i32>) {
    let owned = mem::replace(data, Vec::new()); // ✅ No allocation
    // Process owned...
}
```

## So sánh mem::take vs mem::replace

| Feature | `mem::take` | `mem::replace` |
|---------|-------------|----------------|
| Yêu cầu | `T: Default` | Bất kỳ `T` nào |
| Giá trị thay thế | `Default::default()` | Giá trị tùy chỉnh |
| Use case | Khi muốn giá trị mặc định | Khi cần giá trị cụ thể |

## Khi nào nên dùng?

✅ **Nên dùng khi:**
- Cần move value ra khỏi mutable reference
- Muốn tránh clone expensive values
- Làm việc với enums có multiple variants
- Implement state machines

❌ **Không cần dùng khi:**
- Type implement `Copy`
- Có thể dùng `Option::take()` (cho `Option` types)
- Clone là acceptable

## Pattern thực tế: Option::take()

Với `Option<T>`, có thể dùng method `take()` thay vì `mem::take()`:

```rust
struct Handler {
    resource: Option<String>,
}

impl Handler {
    fn consume(&mut self) -> Option<String> {
        // Cả hai cách đều work

        // Cách 1: Option::take()
        self.resource.take()

        // Cách 2: mem::take() - ít common hơn cho Option
        // std::mem::take(&mut self.resource)
    }
}
```

## Best Practices

1. **Prefer `mem::take` khi có `Default`**: Ngắn gọn hơn `mem::replace`
2. **Document side effects**: Ghi rõ function modifies state
3. **Consider `Option::take()`**: Cho `Option` types
4. **Combine với pattern matching**: Rất hữu dụng với enums

## Tham khảo

- [std::mem::replace](https://doc.rust-lang.org/std/mem/fn.replace.html)
- [std::mem::take](https://doc.rust-lang.org/std/mem/fn.take.html)
- [std::mem::swap](https://doc.rust-lang.org/std/mem/fn.swap.html)
