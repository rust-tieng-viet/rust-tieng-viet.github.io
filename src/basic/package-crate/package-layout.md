# Package layout

Được mô tả trong [Cargo book](https://doc.rust-lang.org/cargo/guide/project-layout.html), một crate trong Rust sẽ có layout như sau, chúng ta nên follow theo những conventions này.

```
.
├── Cargo.lock
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── main.rs
│   ├── helper.rs
│   ├── utils/
│   │   ├── mod.rs
│   │   └── math.rs
│   └── bin/
│       ├── named-executable.rs
│       └── another-executable.rs
├── benches/
│   ├── large-input.rs
│   └── multi-file-bench.rs
├── examples/
│   ├── simple.rs
│   └── complex.rs
└── tests/
    ├── some-integration-tests.rs
    └── multi-file-test/
        ├── main.rs
        └── test_module.rs
```

- `Cargo.toml` và `Cargo.lock` dược đặt ở thư mục gốc của package. Thường trong các crate người ta sẽ hướng dẫn bạn thêm một dòng `crate_name = "<version>"` bên dưới section `[dependencies]` hoặc `[dev-dependencies]`. Không nên đụng đến file `Cargo.lock`.
- Source code được đặt trong thư mục `src`.
- File chính của library crate `src/lib.rs`.
- File chính của binary crate `src/main.rs`.
- Benchmarks được đặt trong thư mục `benches`.
- Code ví dụ (examples) được đặt trong thư mục `examples`.
- Integration tests được đặt trong thư mục `tests`.
- `helper.rs` và `utils/` được gọi là các module. Nếu module là một thư mục gồm nhiều file khác, file `mod.rs` được coi như là file index của module đó. Xem thêm về modules [tại đây](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html). 