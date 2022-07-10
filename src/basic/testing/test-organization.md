# Tổ chức Tests

Testing là một kỹ năng phức tạp. Nhiều lập trình viên sử dụng nhiều thuật ngữ khác nhau
và tổ chức code tests khác nhau. Cộng đồng Rust đặt ra hai loại tests:

- *Unit tests*: nhỏ và tập trung vào một function, module độc lập tại một thời điểm.
- *Integration tests*: tests nằm ngoài thư viện của bạn, sử dụng thư viện của bạn để tests như thể là một chương trình thực tế sẽ thực sự sử dụng. Chỉ test trên public interface và tập trung vào cả 1 module cho một test.

{{#include ./unit-tests.md}}
{{#include ./integration-tests.md}}
{{#include ./doc-tests.md}}
