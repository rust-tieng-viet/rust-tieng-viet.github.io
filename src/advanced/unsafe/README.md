# Unsafe Rust

Unsafe Rust cho phép bạn bỏ qua một số kiểm tra an toàn của compiler để đạt được hiệu suất cao hơn hoặc tương tác với code bên ngoài Rust. Tuy nhiên, bạn cần chịu trách nhiệm đảm bảo tính đúng đắn của code.

## Tại sao cần Unsafe?

Rust's safety guarantees có một số giới hạn:

1. **Performance**: Đôi khi cần tối ưu bỏ qua bounds checking
2. **FFI**: Gọi C libraries không an toàn theo định nghĩa
3. **Low-level operations**: Thao tác trực tiếp với memory
4. **Hardware interaction**: Embedded programming, kernel development

## Năm Unsafe Superpowers

Unsafe Rust cho phép bạn làm 5 điều mà safe Rust không cho phép:

### 1. Dereferencing Raw Pointers

```rust,editable
fn main() {
    let mut num = 5;

    // Tạo raw pointers (an toàn)
    let r1 = &num as *const i32;      // immutable raw pointer
    let r2 = &mut num as *mut i32;    // mutable raw pointer

    // Dereferencing raw pointer (KHÔNG an toàn)
    unsafe {
        println!("r1 points to: {}", *r1);
        *r2 = 10;
        println!("r2 changed value to: {}", *r2);
    }
}
```

**Nguy hiểm**: Raw pointers có thể null, dangling, hoặc unaligned!

### 2. Gọi Unsafe Functions

```rust,editable
// Khai báo unsafe function
unsafe fn dangerous() {
    println!("Doing something dangerous!");
}

fn main() {
    // Phải gọi trong unsafe block
    unsafe {
        dangerous();
    }
}
```

### 3. Truy cập/Modify Mutable Static Variables

```rust,editable
static mut COUNTER: u32 = 0;

fn add_to_counter(inc: u32) {
    unsafe {
        COUNTER += inc; // Có thể gây data race!
    }
}

fn main() {
    add_to_counter(3);

    unsafe {
        println!("COUNTER: {}", COUNTER);
    }
}
```

**Cảnh báo**: Mutable static có thể gây data races trong multi-threaded code!

### 4. Implementing Unsafe Traits

```rust,editable
// Unsafe trait
unsafe trait Foo {
    fn foo(&self);
}

struct MyType;

// Implement unsafe trait
unsafe impl Foo for MyType {
    fn foo(&self) {
        println!("Foo!");
    }
}

fn main() {
    let my = MyType;
    my.foo(); // Gọi method không cần unsafe
}
```

### 5. Accessing Fields of Unions

```rust,editable
union MyUnion {
    f1: u32,
    f2: f32,
}

fn main() {
    let u = MyUnion { f1: 1 };

    unsafe {
        // Không biết field nào valid
        println!("u.f1: {}", u.f1);
        // println!("u.f2: {}", u.f2); // Có thể in giá trị garbage
    }
}
```

## Best Practices

### 1. Minimize Unsafe Scope

```rust
// ❌ Tránh: Unsafe block lớn
unsafe {
    // 100 lines of code
}

// ✅ Tốt hơn: Unsafe block nhỏ nhất có thể
let result = unsafe {
    *raw_pointer
};
// Xử lý result ở safe code
```

### 2. Abstraction Pattern

Wrap unsafe code trong safe API:

```rust,editable
pub struct SafeVec<T> {
    ptr: *mut T,
    len: usize,
    capacity: usize,
}

impl<T> SafeVec<T> {
    // Safe API
    pub fn push(&mut self, value: T) {
        if self.len == self.capacity {
            self.grow();
        }

        unsafe {
            // Unsafe implementation ẩn bên trong
            std::ptr::write(self.ptr.add(self.len), value);
        }

        self.len += 1;
    }

    fn grow(&mut self) {
        // Implementation with unsafe code...
    }
}
```

### 3. Document Safety Invariants

```rust
/// # Safety
///
/// `ptr` must be valid for reads of `len` elements of type `T`.
/// `ptr` must be properly aligned.
/// `len` must not exceed the allocation size.
unsafe fn read_slice<T>(ptr: *const T, len: usize) -> Vec<T> {
    let mut vec = Vec::with_capacity(len);
    std::ptr::copy_nonoverlapping(ptr, vec.as_mut_ptr(), len);
    vec.set_len(len);
    vec
}
```

## Common Patterns

### Transmute - Chuyển đổi Type

```rust,editable
use std::mem;

fn main() {
    // Chuyển f32 thành u32 bit pattern
    let f: f32 = 3.14;

    let bits: u32 = unsafe {
        mem::transmute(f)
    };

    println!("f32 {:.2} as u32 bits: 0x{:08x}", f, bits);
}
```

**Nguy hiểm**: Transmute không kiểm tra gì cả. Rất dễ gây UB (Undefined Behavior)!

### Raw Pointer Arithmetic

```rust,editable
fn main() {
    let arr = [1, 2, 3, 4, 5];
    let ptr = arr.as_ptr();

    unsafe {
        // Pointer arithmetic
        for i in 0..5 {
            let elem = ptr.add(i);
            println!("Element {}: {}", i, *elem);
        }
    }
}
```

## Undefined Behavior (UB)

Actions gây UB trong unsafe code:

- ❌ Dereferencing null/dangling pointers
- ❌ Data races
- ❌ Breaking pointer aliasing rules
- ❌ Using uninitialized memory
- ❌ Invalid values (e.g., `bool` không phải 0 hoặc 1)
- ❌ Calling foreign functions không đúng cách

**UB = Game Over**: Compiler có thể assume UB never happens và optimize sai!

## Tools để Debug Unsafe Code

### 1. Miri

Interpreter phát hiện UB:

```bash
cargo install miri
cargo +nightly miri test
```

### 2. AddressSanitizer

Phát hiện memory errors:

```bash
RUSTFLAGS="-Z sanitizer=address" cargo +nightly build
```

### 3. ThreadSanitizer

Phát hiện data races:

```bash
RUSTFLAGS="-Z sanitizer=thread" cargo +nightly build
```

## Khi nào dùng Unsafe?

✅ **Hợp lý:**
- Implement low-level data structures (Vec, HashMap)
- FFI bindings
- Optimize performance critical code
- Interact với hardware

❌ **Tránh:**
- Shortcuts vì lười implement trait bounds
- "Compiler bắt bẻ quá" - suy nghĩ lại design!
- Chưa hiểu rõ tại sao cần

## Nguyên tắc Vàng

> **"Unsafe không có nghĩa là unreviewed"**
>
> Mọi unsafe block cần:
> 1. Comment giải thích TẠI SAO cần unsafe
> 2. Document safety invariants
> 3. Code review kỹ càng
> 4. Test coverage cao

## Tham khảo

- [The Rustonomicon](https://doc.rust-lang.org/nomicon/) - The Dark Arts of Unsafe Rust
- [Rust Reference - Unsafe](https://doc.rust-lang.org/reference/unsafe-code.html)
- [Miri Documentation](https://github.com/rust-lang/miri)
