# Đo lường Hiệu suất (Benchmarking)

Benchmarking là quá trình so sánh hiệu suất của hai hoặc nhiều chương trình thực hiện cùng một công việc. Nó giúp chúng ta trả lời câu hỏi quan trọng: "Thay đổi này có làm chương trình chạy nhanh hơn không?"

## Tại sao cần Benchmarking?

Khi tối ưu hóa code, chúng ta thường dựa vào cảm giác hoặc giả định rằng một đoạn code "có vẻ nhanh hơn". Tuy nhiên, hiệu suất thực tế có thể khác xa với dự đoán của chúng ta. Benchmarking cung cấp dữ liệu cụ thể để đưa ra quyết định chính xác.

> "Mediocre benchmarking is far better than no benchmarking."
> Đo lường tầm thường vẫn tốt hơn nhiều so với không đo lường gì cả.

## Các yếu tố cần chuẩn bị

### 1. Workloads (Khối lượng công việc)

Bạn cần có **nhiều loại workload đại diện cho cách sử dụng thực tế** của chương trình. Tốt nhất là sử dụng dữ liệu đầu vào từ thực tế (real-world inputs).

**Các loại workload:**
- **Real-world inputs**: Dữ liệu thực từ người dùng - đây là loại quan trọng nhất
- **Microbenchmarks**: Đo lường từng phần nhỏ của code
- **Stress tests**: Kiểm tra với tải nặng hoặc điều kiện cực đoan

### 2. Chọn Metrics (Chỉ số đo)

Tùy thuộc vào loại chương trình, bạn cần chọn metrics phù hợp:

- **Wall-time** (thời gian thực tế): Dễ hiểu và gần gũi với trải nghiệm người dùng, nhưng có thể biến động cao
- **CPU cycles**: Ổn định hơn, phù hợp cho việc so sánh chi tiết
- **Instruction count**: Variance thấp, tốt cho việc phát hiện những thay đổi nhỏ
- **Memory usage**: Quan trọng cho các ứng dụng xử lý dữ liệu lớn

## Công cụ Benchmarking trong Rust

### 1. Criterion - Công cụ phổ biến nhất

[Criterion](https://github.com/bheisler/criterion.rs) là thư viện benchmarking tiêu chuẩn trong Rust với nhiều tính năng hữu ích.

**Cài đặt:**

```toml
[dev-dependencies]
criterion = "0.5"

[[bench]]
name = "my_benchmark"
harness = false
```

**Ví dụ cơ bản:**

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 1,
        1 => 1,
        n => fibonacci(n-1) + fibonacci(n-2),
    }
}

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("fib 20", |b| b.iter(|| fibonacci(black_box(20))));
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
```

**Chạy benchmark:**

```bash
cargo bench
```

**Giải thích:**
- `black_box()`: Ngăn compiler tối ưu hóa quá mức, đảm bảo code thực sự chạy
- `criterion_group!` và `criterion_main!`: Macro để thiết lập test suite

### 2. Divan - Công cụ hiện đại và đơn giản

[Divan](https://github.com/nvzqz/divan) là một lựa chọn mới, nhanh và đơn giản hơn Criterion.

**Cài đặt:**

```toml
[dev-dependencies]
divan = "0.1"

[[bench]]
name = "example"
harness = false
```

**Ví dụ:**

```rust
fn main() {
    // Run registered benchmarks.
    divan::main();
}

#[divan::bench]
fn parse_num() {
    let input = "42";
    let output: i32 = input.parse().unwrap();
    assert_eq!(output, 42);
}

#[divan::bench]
fn parse_bytes() {
    let input = b"42";
    let output: i32 = std::str::from_utf8(input)
        .unwrap()
        .parse()
        .unwrap();
    assert_eq!(output, 42);
}
```

**Ưu điểm của Divan:**
- Cú pháp đơn giản với attribute `#[divan::bench]` giống `#[test]`
- Hỗ trợ generic types và const generics
- Hiển thị kết quả rõ ràng và trực quan

### 3. Hyperfine - Benchmark cho command-line

[Hyperfine](https://github.com/sharkdp/hyperfine) là công cụ tuyệt vời để đo lường wall-time của toàn bộ chương trình từ command line.

**Cài đặt:**

```bash
cargo install hyperfine
```

**Sử dụng:**

```bash
# So sánh hai phiên bản của chương trình
hyperfine './target/release/myapp-v1' './target/release/myapp-v2'

# Với warmup runs
hyperfine --warmup 3 './target/release/myapp'

# So sánh với tham số khác nhau
hyperfine --prepare 'cargo build --release' 'cargo run --release'
```

**Kết quả mẫu:**

```
Benchmark 1: ./target/release/myapp-v1
  Time (mean ± σ):     142.3 ms ±   2.1 ms    [User: 98.2 ms, System: 43.5 ms]
  Range (min … max):   139.8 ms … 147.2 ms    20 runs

Benchmark 2: ./target/release/myapp-v2
  Time (mean ± σ):      89.7 ms ±   1.8 ms    [User: 62.1 ms, System: 27.2 ms]
  Range (min … max):    87.4 ms …  93.5 ms    32 runs

Summary
  './target/release/myapp-v2' ran
    1.59 ± 0.04 times faster than './target/release/myapp-v1'
```

### 4. Built-in Benchmarks (Nightly-only)

Rust có sẵn framework benchmarking, nhưng chỉ hoạt động trên nightly compiler.

```rust
#![feature(test)]
extern crate test;

#[cfg(test)]
mod tests {
    use super::*;
    use test::Bencher;

    #[bench]
    fn bench_add_two(b: &mut Bencher) {
        b.iter(|| add_two(2));
    }
}
```

## Best Practices (Thực hành tốt nhất)

### 1. Benchmark từng thay đổi riêng lẻ

Đừng thay đổi nhiều thứ cùng lúc. Benchmark từng thay đổi một để biết chính xác cái gì tạo ra sự khác biệt.

### 2. Sử dụng release mode

Luôn chạy benchmark với release build:

```bash
cargo bench  # Tự động dùng release mode
# hoặc
cargo run --release
```

### 3. Giữ hệ thống ổn định

- Đóng các ứng dụng không cần thiết
- Không chạy benchmark trong khi làm việc khác
- Chú ý đến CPU throttling (điều chỉnh tốc độ CPU)
- Chạy nhiều lần để có kết quả trung bình đáng tin cậy

### 4. Theo dõi xu hướng, không chỉ số liệu tuyệt đối

Quan trọng hơn việc "chương trình chạy trong 100ms" là "phiên bản mới nhanh hơn 20%".

### 5. Benchmark trên nhiều workload

Tối ưu hóa có thể cải thiện một trường hợp nhưng làm chậm trường hợp khác. Luôn kiểm tra nhiều loại input.

## Ví dụ thực tế: So sánh hai cách implement

Giả sử chúng ta muốn so sánh hai cách tính tổng các số chẵn trong một vector:

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn sum_even_iter(numbers: &[i32]) -> i32 {
    numbers.iter()
        .filter(|&&x| x % 2 == 0)
        .sum()
}

fn sum_even_loop(numbers: &[i32]) -> i32 {
    let mut sum = 0;
    for &num in numbers {
        if num % 2 == 0 {
            sum += num;
        }
    }
    sum
}

fn benchmark_sum_even(c: &mut Criterion) {
    let numbers: Vec<i32> = (0..10000).collect();

    c.bench_function("sum_even_iter", |b| {
        b.iter(|| sum_even_iter(black_box(&numbers)))
    });

    c.bench_function("sum_even_loop", |b| {
        b.iter(|| sum_even_loop(black_box(&numbers)))
    });
}

criterion_group!(benches, benchmark_sum_even);
criterion_main!(benches);
```

## Continuous Benchmarking (Benchmark liên tục)

Để theo dõi hiệu suất qua thời gian, xem xét sử dụng các dịch vụ như:

- **[Bencher](https://bencher.dev/)**: Continuous benchmarking service
- **[CodSpeed](https://codspeed.io/)**: Hỗ trợ cả Criterion và Divan
- **GitHub Actions**: Tự động chạy benchmark trên mỗi commit

## Kết luận

Benchmarking là kỹ năng quan trọng trong việc tối ưu hóa hiệu suất. Hãy nhớ rằng:

1. **Đo lường trước khi tối ưu hóa** - Đừng đoán mò
2. **Chọn công cụ phù hợp** - Criterion/Divan cho chi tiết, Hyperfine cho tổng quan
3. **Benchmark thường xuyên** - Theo dõi hiệu suất qua thời gian
4. **Giữ kết quả để so sánh** - Xu hướng quan trọng hơn con số tuyệt đối

> "Good benchmarking is hard, but mediocre benchmarking is far better than no benchmarking."

Hãy bắt đầu với những benchmark đơn giản, và dần dần cải thiện khi bạn hiểu rõ hơn về đặc điểm hiệu suất của chương trình.

---

**Tài liệu tham khảo:**
- [The Rust Performance Book - Benchmarking](https://nnethercote.github.io/perf-book/benchmarking.html)
- [Criterion.rs Documentation](https://bheisler.github.io/criterion.rs/book/)
- [Divan Documentation](https://docs.rs/divan/latest/divan/)
- [Hyperfine Repository](https://github.com/sharkdp/hyperfine)
