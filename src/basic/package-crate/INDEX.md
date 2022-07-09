# Packages và Crates

**Package** là một hoặc nhiều crates. Một package gồm một file `Cargo.toml` mô tả cách để build các crates đó.

**Crate** có thể là một binary crate hoặc library crate.

- **binary crate** có thể được compile thành binary và có thể thực thi được, ví dụ như một command-line hoặc server. Một binary crate bắt buộc phải có một hàm `main()`
- **library crate** không cần hàm `main()`. Library crate dùng để share các tính năng cho các project khác. 
