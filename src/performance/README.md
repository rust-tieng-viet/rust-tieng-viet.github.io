# Tối ưu Hiệu suất (Performance)

Hiệu suất là một trong những lý do chính mà nhiều developer chọn Rust. Ngôn ngữ này cung cấp khả năng kiểm soát low-level như C/C++ nhưng với sự an toàn về memory và thread. Tuy nhiên, để tận dụng tối đa sức mạnh của Rust, bạn cần hiểu cách đo lường và tối ưu hóa hiệu suất.

## Tại sao Hiệu suất Quan trọng?

Trong thế giới phần mềm hiện đại, hiệu suất ảnh hưởng trực tiếp đến:

- **Trải nghiệm người dùng**: Ứng dụng phản hồi nhanh = người dùng hài lòng
- **Chi phí vận hành**: Code chạy nhanh hơn = ít server hơn = tiết kiệm tiền
- **Khả năng mở rộng**: Xử lý được nhiều requests hơn với cùng tài nguyên
- **Tác động môi trường**: Tiêu thụ ít năng lượng hơn

## Triết lý Tối ưu hóa

> "Premature optimization is the root of all evil." - Donald Knuth

Nhưng:

> "Mediocre benchmarking is far better than no benchmarking."

**Nguyên tắc vàng:**
1. **Đo lường trước khi tối ưu** - Đừng đoán, hãy dùng data
2. **Tối ưu điểm nghẽn (bottlenecks)** - 20% code chiếm 80% runtime
3. **Benchmark sau mỗi thay đổi** - Xác nhận cải thiện thực sự
4. **Giữ cân bằng** - Đừng hy sinh maintainability cho 1% performance

## Nội dung Chương này

Chương này bao gồm các chủ đề sau:

### 1. [Đo lường Hiệu suất (Benchmarking)](./benchmarking.md)

Học cách đo lường hiệu suất chính xác với các công cụ:
- **Criterion**: Benchmarking framework mạnh mẽ nhất
- **Divan**: Công cụ hiện đại, đơn giản và nhanh
- **Hyperfine**: So sánh command-line programs
- **Built-in benchmarks**: Rust nightly benchmarks

Bạn sẽ học:
- Cách thiết lập benchmark đúng cách
- Chọn metrics phù hợp (wall-time, CPU cycles, memory)
- Tránh những lỗi thường gặp
- Continuous benchmarking trong CI/CD

### 2. [Cấu hình Build để Tối ưu](./build-configuration.md)

Tối ưu hiệu suất **mà không cần thay đổi code** thông qua Cargo configuration:

- **Tăng tốc độ runtime**: LTO, codegen-units, PGO
- **Giảm kích thước binary**: opt-level, strip symbols
- **Tăng tốc compile time**: Fast linkers (mold, lld)
- **Alternative allocators**: jemalloc, mimalloc

Đây là những cải thiện dễ dàng nhất và hiệu quả nhất để bắt đầu!

## Lộ trình Học tập

Nếu bạn mới bắt đầu với performance optimization trong Rust, đây là lộ trình đề xuất:

1. **Bắt đầu với Build Configuration** (dễ nhất, không cần code)
   - Thêm LTO và codegen-units vào release profile
   - Thử alternative allocators
   - Cài đặt fast linker

2. **Học Benchmarking** (kỹ năng cốt lõi)
   - Thiết lập Criterion hoặc Divan
   - Tạo benchmark cho hot paths
   - So sánh trước và sau optimization

3. **Áp dụng vào Dự án Thực tế**
   - Profile code với các công cụ profiling
   - Tìm bottlenecks
   - Tối ưu từng phần một
   - Benchmark để xác nhận cải thiện

## Công cụ Hỗ trợ

### Benchmarking
- [Criterion](https://github.com/bheisler/criterion.rs) - Feature-rich benchmarking
- [Divan](https://github.com/nvzqz/divan) - Modern và đơn giản
- [Hyperfine](https://github.com/sharkdp/hyperfine) - Command-line benchmarking
- [Bencher](https://bencher.dev/) - Continuous benchmarking service

### Profiling
- [flamegraph](https://github.com/flamegraph-rs/flamegraph) - Visualize performance
- [cargo-flamegraph](https://github.com/flamegraph-rs/flamegraph) - Easy profiling
- [perf](https://perf.wiki.kernel.org/) - Linux profiler
- [Instruments](https://developer.apple.com/instruments/) - macOS profiler

### Analysis
- [cargo-bloat](https://github.com/RazrFalcon/cargo-bloat) - Binary size analysis
- [cargo-llvm-lines](https://github.com/dtolnay/cargo-llvm-lines) - LLVM IR analysis
- [cargo-expand](https://github.com/dtolnay/cargo-expand) - Macro expansion

## Tài nguyên Thêm

### Documentation
- [The Rust Performance Book](https://nnethercote.github.io/perf-book/) - Tài liệu gốc đầy đủ
- [Rust Compiler Performance](https://nnethercote.github.io/perf-book/compile-times.html)
- [Cargo Book - Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)

### Cộng đồng
- [Rust Performance Discord](https://discord.gg/rust-lang)
- [r/rust](https://reddit.com/r/rust) - Subreddit với nhiều discussion về performance
- [Rust Internals Forum](https://internals.rust-lang.org/)

## Case Studies

Các ví dụ thực tế về performance optimization trong Rust:

- **[ripgrep](https://github.com/BurntSushi/ripgrep)**: Grep tool nhanh hơn grep/ag nhiều lần
- **[fd](https://github.com/sharkdp/fd)**: Find replacement nhanh gấp nhiều lần
- **[tokio](https://tokio.rs/)**: Async runtime với performance cao
- **[rustc](https://github.com/rust-lang/rust)**: Rust compiler liên tục được tối ưu

## Bắt đầu Ngay

Nếu bạn muốn tăng performance ngay lập tức mà không cần tìm hiểu sâu:

1. Thêm vào `Cargo.toml`:
```toml
[profile.release]
lto = "thin"
codegen-units = 1
```

2. Cài đặt fast linker:
```bash
# Linux
sudo apt install mold

# Add to .cargo/config.toml
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
```

3. Benchmark để đo lường:
```bash
cargo install hyperfine
hyperfine './target/release/myapp'
```

Đơn giản vậy thôi! Bây giờ hãy đi sâu vào từng chủ đề để hiểu rõ hơn.

---

**Ghi chú:** Nội dung trong chương này được tổng hợp và dịch từ [The Rust Performance Book](https://nnethercote.github.io/perf-book/) của Nicholas Nethercote, với các ví dụ và giải thích được Việt hóa để phù hợp với độc giả Việt Nam.
