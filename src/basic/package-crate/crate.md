# Crate


Một **crate** có thể là một **binary crate** hoặc **library crate**.
    - **binary crate** có thể được compile thành binary và có thể thực thi được, ví dụ như một command-line hoặc server. Một binary crate bắt buộc phải có một hàm `main`
    - **library crate** không có hàm `main`, nó cũng compile thành binary. Library crate dùng để share tính năng cho nhiều project khác. 

Crate thường được publish trên <https://crates.io>.

## Init crate

Để init một crate mới ta sử dụng cargo:

- `cargo new crate_name`: binary crate.
- `cargo new crate_name --lib`: library crate.

## Layout của **binary crate** và **library crate**

```
// Binary crate

├── Cargo.toml
└── src
    └── main.rs
```

```
// Library crate

├── Cargo.toml
└── src
    └── lib.rs
```

Một crate có thể vừa có `lib.rs` và vừa có `main.rs`.

Binary crate khi `cargo build` hoặc `cargo run` sẽ build ra một file binary bỏ trong `./target/debug/<crate_name>`. 

Khi build cho production, ta thêm `--release` lúc này cargo sẽ build thành binary bỏ trong `./target/release/<crate_name>`. 

`debug` hay `release` được gọi là các build target. Build trong `release` sẽ được apply nhiều optimization hơn, kích thước nhỏ hơn, chạy nhanh hơn nhưng compile lâu hơn.