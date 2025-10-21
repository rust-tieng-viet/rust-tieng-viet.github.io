# First high-performance data pipelines in Rust

Xây dựng data pipeline hiệu năng cao là một trong những use case phổ biến của Rust trong lĩnh vực data engineering. Với tốc độ gần như C/C++, memory safety, và hệ sinh thái phong phú, Rust là lựa chọn tuyệt vời để xây dựng các data pipeline xử lý lượng lớn dữ liệu.

Trong bài này, chúng ta sẽ xây dựng một data pipeline đơn giản nhưng mạnh mẽ để:
1. Đọc dữ liệu từ CSV file
2. Xử lý và transform dữ liệu
3. Ghi kết quả ra Parquet format (columnar storage hiệu năng cao)

## Cài đặt dependencies

Tạo project mới:

```bash
cargo new data-pipeline
cd data-pipeline
```

Thêm dependencies vào `Cargo.toml`:

```toml
[dependencies]
polars = { version = "0.43", features = ["lazy", "parquet", "csv"] }
anyhow = "1.0"
```

- [`polars`](../crates/polars.md): DataFrame library hiệu năng cao, tương tự như Pandas
- `anyhow`: Error handling đơn giản và tiện lợi

## Ví dụ 1: Pipeline cơ bản

Tạo file `src/main.rs`:

```rust
use polars::prelude::*;
use anyhow::Result;

fn main() -> Result<()> {
    // Đọc CSV file
    let df = CsvReader::from_path("sales_data.csv")?
        .has_header(true)
        .finish()?;

    println!("Dữ liệu gốc:");
    println!("{:?}", df);

    // Transform: tính tổng revenue theo category
    let result = df
        .lazy()
        .group_by([col("category")])
        .agg([
            col("revenue").sum().alias("total_revenue"),
            col("quantity").sum().alias("total_quantity"),
            col("revenue").mean().alias("avg_revenue"),
        ])
        .sort("total_revenue", Default::default())
        .collect()?;

    println!("\nKết quả sau khi xử lý:");
    println!("{:?}", result);

    // Ghi ra Parquet file
    let mut file = std::fs::File::create("output.parquet")?;
    ParquetWriter::new(&mut file).finish(&mut result.clone())?;

    println!("\n✅ Đã ghi kết quả vào output.parquet");

    Ok(())
}
```

Tạo file dữ liệu mẫu `sales_data.csv`:

```csv
category,product,revenue,quantity
Electronics,Laptop,1200,2
Electronics,Mouse,25,10
Books,Novel,15,5
Books,Textbook,80,3
Electronics,Keyboard,75,4
Books,Magazine,5,20
```

Chạy pipeline:

```bash
cargo run
```

## Ví dụ 2: Pipeline với Lazy Evaluation

Lazy evaluation giúp tối ưu performance bằng cách chỉ thực hiện computation khi cần thiết:

```rust
use polars::prelude::*;
use anyhow::Result;

fn process_large_dataset() -> Result<()> {
    let lazy_df = LazyCsvReader::new("large_dataset.csv")
        .has_header(true)
        .finish()?;

    // Định nghĩa pipeline (chưa thực thi)
    let result = lazy_df
        .filter(col("revenue").gt(100))  // Lọc revenue > 100
        .select([
            col("date"),
            col("category"),
            col("revenue"),
            (col("revenue") * lit(0.1)).alias("tax"),  // Tính 10% tax
            (col("revenue") * lit(0.9)).alias("net_revenue"),
        ])
        .group_by([col("category")])
        .agg([
            col("net_revenue").sum().alias("total_net_revenue"),
            col("revenue").count().alias("transaction_count"),
        ])
        .sort("total_net_revenue", SortOptions::default().with_order_descending(true))
        .collect()?;  // Thực thi tại đây

    println!("{:?}", result);
    Ok(())
}

fn main() -> Result<()> {
    process_large_dataset()?;
    Ok(())
}
```

**Ưu điểm của lazy evaluation:**
- Polars tự động tối ưu query plan
- Chỉ đọc columns cần thiết
- Có thể parallel processing tự động
- Giảm memory usage

## Ví dụ 3: Pipeline với Error Handling

Trong production, error handling rất quan trọng:

```rust
use polars::prelude::*;
use anyhow::{Context, Result};

fn read_and_validate_data(path: &str) -> Result<DataFrame> {
    let df = CsvReader::from_path(path)
        .context(format!("Không thể đọc file: {}", path))?
        .has_header(true)
        .finish()
        .context("Lỗi parse CSV")?;

    // Validate schema
    if !df.get_column_names().contains(&"revenue") {
        anyhow::bail!("Thiếu column 'revenue'");
    }

    Ok(df)
}

fn transform_data(df: DataFrame) -> Result<DataFrame> {
    df.lazy()
        .select([
            col("category"),
            col("revenue"),
            col("quantity"),
        ])
        .filter(col("revenue").gt(0))  // Lọc bỏ invalid data
        .filter(col("quantity").gt(0))
        .collect()
        .context("Lỗi transform data")
}

fn save_to_parquet(df: &mut DataFrame, path: &str) -> Result<()> {
    let file = std::fs::File::create(path)
        .context(format!("Không thể tạo file: {}", path))?;

    ParquetWriter::new(&file)
        .finish(df)
        .context("Lỗi ghi Parquet file")?;

    Ok(())
}

fn main() -> Result<()> {
    println!("🚀 Bắt đầu data pipeline...");

    let df = read_and_validate_data("sales_data.csv")?;
    println!("✅ Đọc dữ liệu thành công: {} rows", df.height());

    let mut result = transform_data(df)?;
    println!("✅ Transform thành công: {} rows", result.height());

    save_to_parquet(&mut result, "output.parquet")?;
    println!("✅ Đã lưu vào output.parquet");

    Ok(())
}
```

## Ví dụ 4: Parallel Processing với Rayon

Xử lý nhiều files cùng lúc:

```rust
use polars::prelude::*;
use rayon::prelude::*;
use anyhow::Result;
use std::path::PathBuf;

fn process_file(path: PathBuf) -> Result<DataFrame> {
    let df = CsvReader::from_path(&path)?
        .has_header(true)
        .finish()?;

    let result = df
        .lazy()
        .group_by([col("category")])
        .agg([col("revenue").sum()])
        .collect()?;

    Ok(result)
}

fn main() -> Result<()> {
    let files = vec![
        PathBuf::from("data1.csv"),
        PathBuf::from("data2.csv"),
        PathBuf::from("data3.csv"),
    ];

    // Xử lý parallel
    let results: Vec<Result<DataFrame>> = files
        .into_par_iter()
        .map(process_file)
        .collect();

    // Kết hợp kết quả
    let mut combined = DataFrame::default();
    for result in results {
        match result {
            Ok(df) => {
                if combined.is_empty() {
                    combined = df;
                } else {
                    combined = combined.vstack(&df)?;
                }
            }
            Err(e) => eprintln!("Lỗi xử lý file: {}", e),
        }
    }

    println!("Tổng hợp: {:?}", combined);
    Ok(())
}
```

## So sánh với Python

Pipeline tương tự trong Python với Pandas:

```python
import pandas as pd

# Đọc CSV
df = pd.read_csv('sales_data.csv')

# Transform
result = df.groupby('category').agg({
    'revenue': ['sum', 'mean'],
    'quantity': 'sum'
}).reset_index()

# Ghi Parquet
result.to_parquet('output.parquet')
```

**Ưu điểm của Rust + Polars:**
- Nhanh hơn 5-10x so với Pandas
- Memory efficient hơn nhiều
- Type safety tại compile time
- Không cần GIL (Global Interpreter Lock) như Python
- Binary nhỏ gọn, dễ deploy

**Nhược điểm:**
- Compile time lâu hơn
- Ecosystem nhỏ hơn Python (nhưng đang phát triển nhanh)
- Learning curve cao hơn

## Best Practices

1. **Sử dụng Lazy Evaluation khi làm việc với large datasets:**
   ```rust
   let result = LazyCsvReader::new("large.csv")
       .finish()?
       .filter(...)
       .select(...)
       .collect()?;
   ```

2. **Streaming cho data quá lớn:**
   ```rust
   let reader = CsvReader::from_path("huge.csv")?
       .has_header(true)
       .with_chunk_size(10_000);  // Đọc từng chunk
   ```

3. **Sử dụng Parquet thay vì CSV cho storage:**
   - Nhanh hơn nhiều khi đọc
   - Tiết kiệm storage (compressed)
   - Preserve data types

4. **Error handling với `anyhow` hoặc `thiserror`:**
   ```rust
   fn process() -> Result<()> {
       let df = read_csv("data.csv")
           .context("Failed to read CSV")?;
       Ok(())
   }
   ```

## Monitoring và Logging

Thêm logging để theo dõi pipeline:

```rust
use polars::prelude::*;
use anyhow::Result;

fn main() -> Result<()> {
    let start = std::time::Instant::now();

    let df = CsvReader::from_path("data.csv")?
        .has_header(true)
        .finish()?;

    println!("⏱️  Đọc CSV: {:?}", start.elapsed());

    let transform_start = std::time::Instant::now();
    let result = df.lazy()
        .group_by([col("category")])
        .agg([col("revenue").sum()])
        .collect()?;

    println!("⏱️  Transform: {:?}", transform_start.elapsed());
    println!("📊 Số rows: {}", result.height());

    Ok(())
}
```

## Tổng kết

Rust + Polars là một stack mạnh mẽ để xây dựng data pipeline:
- ✅ Performance cao
- ✅ Memory safe
- ✅ Dễ deploy (single binary)
- ✅ Ecosystem đang phát triển mạnh

Bắt đầu với các pipeline đơn giản, sau đó mở rộng với streaming, parallel processing, và distributed computing với các tools như DataFusion và Ballista.

## References

- [Polars Documentation](https://docs.pola.rs/)
- [Polars User Guide](https://docs.pola.rs/user-guide/)
- [Are We Data Yet?](https://arewedatayet.com)
- [Apache Arrow](https://arrow.apache.org/)
- [DataFusion](https://datafusion.apache.org/)
