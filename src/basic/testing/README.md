# Viết Tests

Rust được thiết kế để đưa tính đúng đắn của chương trình lên hàng đầu.
Như bạn đã thấy với những gì mà borrow checkers của compiler hay hệ thống type
đã làm. Nhưng tính đúng đắn thì cực kỳ phức tạp và Rust không thể đảm bảo hết điều này.

Tuy nhiên, testing lại là một kỹ năng phức tạp. Mục tiêu của 
phần này mình sẽ không bàn đến việc viết good tests như thế nào, 
chúng ta sẽ bàn về những gì mà Rust cung cấp để giúp chúng ta viết tests, 
những công cụ, macros, chạy tests, cách tổ chức unit tests 
và integration tests.
