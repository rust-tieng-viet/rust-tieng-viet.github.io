# Temporary mutability

Thường chúng ta sẽ cần phải prepare hoặc process dữ liệu, nhưng sau đó chúng ta không cần tính mutable nữa, để tránh lỗi phát sinh ngoài ý muốn.

Temporary mutability giúp chúng ta tạo một biến mutable trong một phạm vi nhất định, sau đó biến đó sẽ trở thành immutable.

Nested block:

```rust
let data = {
    let mut data = get_vec();
    data.sort();
    data
};

// Here `data` is immutable.
```

Variable rebinding:

```rust
let mut data = get_vec();
data.sort();
let data = data;

// Here `data` is immutable.
```

# Ưu điểm

Giúp tránh side effect. Compiler sẽ báo lỗi nếu chúng ta vô tình thay đổi giá trị của biến immutable.