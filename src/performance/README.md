# Tối ưu Hiệu suất

Performance là một trong những lý do chính nhiều người chọn Rust. Nhưng viết Rust không tự động có nghĩa là code chạy nhanh - vẫn cần biết cách đo lường và tối ưu đúng chỗ.

## Tại sao quan tâm đến performance?

Code chạy nhanh thì:
- User hài lòng hơn (ai cũng ghét app chậm)
- Tiết kiệm tiền server
- Scale dễ hơn
- Tiêu thụ ít điện hơn (tốt cho môi trường)

Nhưng cũng đừng quá ám ảnh về performance. Có câu nói kinh điển của Donald Knuth: "Premature optimization is the root of all evil" - Tối ưu sớm là gốc rễ mọi tội lỗi.

## Triết lý

Nguyên tắc chung:
1. **Đo trước khi tối ưu** - Đừng đoán mò, phải có data
2. **Tối ưu bottleneck** - 20% code chiếm 80% runtime, tìm ra 20% đó
3. **Verify bằng benchmark** - Đừng tin "cảm giác"
4. **Cân bằng** - Đừng vì 1% performance mà làm code khó maintain

Và một câu hay khác: "Mediocre benchmarking is far better than no benchmarking" - Đo tầm tầm vẫn tốt hơn không đo.

## Trong chương này

### [Đo lường Hiệu suất (Benchmarking)](./benchmarking.md)

Học cách đo lường chính xác với các công cụ:
- **Criterion** - Thư viện benchmark phổ biến nhất
- **Divan** - Alternative mới, đơn giản hơn
- **Hyperfine** - So sánh command-line programs

Đây là skill cơ bản nhất. Không biết đo thì không biết code có nhanh hơn không.

### [Cấu hình Build](./build-configuration.md)

Cải thiện performance **mà không cần sửa code**, chỉ config Cargo:
- Tăng tốc độ chạy: LTO, codegen-units, allocators
- Giảm kích thước binary: opt-level, strip
- Tăng tốc compile: mold, lld

Đây là cách dễ nhất để bắt đầu. Vài dòng config có thể cải thiện 10-20%.

## Nên bắt đầu từ đâu?

Nếu mới học về performance trong Rust:

**Bước 1: Build configuration** (dễ nhất)

Thêm vào `Cargo.toml`:
```toml
[profile.release]
lto = "thin"
codegen-units = 1
```

Cài fast linker:
```bash
sudo apt install mold  # Linux
```

**Bước 2: Học benchmark**

Cài Criterion hoặc Divan, viết vài benchmark đơn giản. Chạy thử xem code nào nhanh hơn.

**Bước 3: Áp dụng vào project thật**

Profile code, tìm bottleneck, tối ưu từng phần. Benchmark để verify cải thiện.

## Công cụ hữu ích

### Benchmarking
- [Criterion](https://github.com/bheisler/criterion.rs)
- [Divan](https://github.com/nvzqz/divan)
- [Hyperfine](https://github.com/sharkdp/hyperfine)

### Profiling
- [flamegraph](https://github.com/flamegraph-rs/flamegraph) - Visualize performance bottlenecks
- [cargo-flamegraph](https://github.com/flamegraph-rs/flamegraph) - Dễ dùng hơn
- perf (Linux), Instruments (macOS)

### Analysis
- [cargo-bloat](https://github.com/RazrFalcon/cargo-bloat) - Xem binary to ở đâu
- [cargo-llvm-lines](https://github.com/dtolnay/cargo-llvm-lines) - LLVM IR analysis

## Quick wins

Muốn tăng performance ngay mà không tìm hiểu sâu? Thử mấy cái này:

**1. Chắc chắn dùng release mode**
```bash
cargo build --release
cargo run --release
```

**2. Config Cargo tốt hơn**
```toml
[profile.release]
lto = "thin"
codegen-units = 1
```

**3. Thử alternative allocator**
```toml
[dependencies]
mimalloc = "0.1"
```

```rust
use mimalloc::MiMalloc;

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;
```

**4. Cài fast linker**

Giảm compile time 50-80% mà không ảnh hưởng runtime.

## Case studies

Vài project nổi tiếng về performance:
- **ripgrep** - Grep replacement, nhanh hơn grep gấp nhiều lần
- **fd** - Find replacement
- **exa** - ls replacement

Đọc source code của các project này sẽ học được nhiều thứ hay.

## Tài nguyên

- [The Rust Performance Book](https://nnethercote.github.io/perf-book/) - Nguồn gốc của nội dung trong chương này
- [Rust Compiler Performance](https://nnethercote.github.io/perf-book/compile-times.html)
- [Cargo Book - Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)

## Lưu ý

Performance optimization là nghệ thuật, không có công thức chung. Mỗi app khác nhau, mỗi workload khác nhau. Cái chạy tốt ở project này chưa chắc tốt ở project kia.

Quan trọng nhất: **đo lường**. Đừng tin vào intuition, đừng tin vào "best practices" mù quáng. Benchmark và profile để biết thực tế như thế nào.

---

**Ghi chú:** Nội dung được tổng hợp từ [The Rust Performance Book](https://nnethercote.github.io/perf-book/) của Nicholas Nethercote, điều chỉnh cho phù hợp với người đọc Việt Nam.
