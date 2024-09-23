# Xử lý lỗi

Có rất nhiều cách để deal với error trong Rust. Bạn vui lòng xem trong các trang tiếp theo,
mặc dù có nhiều cách để xử lý tùy theo các trường hợp khác nhau, có một quy luật chung:

- `panic` hầu hết hữu ích trong khi tests (panic khi test fail) hoặc đối mặt với các lỗi không thể xử lý được.
- `Option` khi một giá trị nào đó là không bắt buộc hoặc thiếu các giá trị này vẫn không gây lỗi cho chương trình. Chỉ sử dụng `unwrap()` khi prototyping hoặc các trường hợp chắc chắn luôn luôn có giá trị. Tuy nhiên `expect()` thì ổn hơn bởi nó giúp chúng ta bỏ thêm error message khi có biến. 
- Khi có khả năng một function nào đó có thể lỗi, và người gọi function bắt buộc phải xử lý lỗi đó, hãy sử dụng `Result`. Vui lòng chỉ sử dụng `unwrap()` và `expect()` trong khi test hoặc prototype.

### Nội dung

- [panic](./panic.md)
- [Option](./option.md)
- [Result](./result.md)
  - [Result map](./result-map.md)
  - [Result alias](./result-alias.md)
- [Boxing error](./boxing-error.md)
- [Custom error](./custom-error.md)