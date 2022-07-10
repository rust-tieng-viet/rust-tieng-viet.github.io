## Integration Tests

Integration tests nằm hoàn toàn bên ngoài thư viện của bạn.
Mục đích của integration tests nhằm kiểm tra các thành phần của
thư viện của bạn hoạt động cùng với nhau có chính xác không.

Để bắt đầu viết integration tests, tạo thư mục `tests` nằm cùng cấp với `src`.

Trong thư mục `tests`, cargo sẽ compile mỗi file thành một thành một crate độc lập.

File: tests/integration_test.rs

```rust
use adder;

#[test]
fưn it_adds_two() {
  assert_eq!(4, adder::adder(2, 2));
}
```

Ở đây chúng ta import `use adder` thay vì `use crate::` 
do file integration test này là một crate độc lập.

Chạy `cargo test`

```
$ cargo test
   Compiling adder v0.1.0 (file:///projects/adder)
    Finished test [unoptimized + debuginfo] target(s) in 1.31s
     Running unittests (target/debug/deps/adder-1082c4b063a8fbe6)

running 1 test
test tests::test_adder ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/integration_test.rs (target/debug/deps/integration_test-1082c4b063a8fbe6)

running 1 test
test it_adds_two ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests adder

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00sđ
```

Do integration tests phải import thư viện để chạy test code, crate bắt buộc phải có `src/lib.rs`.
Các binary crates không thể test theo cách này.

Do đó các project Rust họ thường tổ chức theo kiểu build binary từ `src/main.rs` và import trực tiếp logic từ `src/lib.rs`.

#### References

- [Submodules in Integration Tests](https://doc.rust-lang.org/book/ch11-03-test-organization.html#submodules-in-integration-tests)
- [Integration Tests for Binary Crates](https://doc.rust-lang.org/book/ch11-03-test-organization.html#integration-tests-for-binary-crates)
