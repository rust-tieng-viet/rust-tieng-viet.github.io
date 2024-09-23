# Smart Pointers

*Con trỏ* (pointer) là một khái niệm chung cho một biến chứa một địa chỉ trong bộ nhớ. Địa chỉ này tham chiếu đến (reference), hoặc "trỏ đến" ("points at"), một số dữ liệu khác.

Loại pointer phổ biến nhất trong Rust là reference, được biểu thị bằng ký hiệu `&` và mượn giá trị chúng trỏ đến. Chúng không có bất kỳ khả năng đặc biệt nào ngoài việc tham chiếu đến dữ liệu, không tốn bất kỳ chi phí (overhead) nào.

*Smart pointers* là các **kiểu dữ liệu** hoạt động như một con trỏ nhưng có thêm metadata và method. Khái niệm về smart pointers không phải là đặc thù riêng của Rust: smart pointers xuất phát từ C++ và tồn tại trong các ngôn ngữ khác nữa.

Rust có nhiều loại Smart Pointers được định nghĩa trong standard library. Khác với reference, Smart Pointers **sở hữu (own)** luôn dữ liệu, bạn sẽ thường thấy smart pointers có kiểu `Rc<T>`, `Box<T>` với `T` là kiểu dữ liệu gốc nó chứa bên trong.

Để khám phá khái niệm chung, chúng ta sẽ xem xét một số ví dụ khác nhau của smart points, chẳng hạn như

- *Reference counting* ([`Rc<T>`](./rc.md)): loại con trỏ này cho phép dữ liệu có nhiều owner bằng cách theo dõi số lượng owner và, khi không còn owner nào nữa, clean up giá trị đó.
- [`Box<T>`](./box.md) allocation giá trị trên heap.
- [`Ref<T>`](./ref.md) và [`RefMut<T>`](./refmut.md) cho phép kiểu được borrow lúc runtime thay vì compile time.
