# Apache DataFusion và Delta Lake trong Rust

**Apache DataFusion** và **Delta Lake** đại diện cho thế hệ công cụ Data Engineering tiếp theo được xây dựng hoàn toàn bằng Rust. Chúng cung cấp hiệu năng vượt trội, type safety, và khả năng mở rộng tối đa cho các hệ thống xử lý dữ liệu quy mô lớn (large-scale data processing).

---

## 1. Apache DataFusion là gì?

[Apache DataFusion](https://datafusion.apache.org/) là một **extensible query execution framework** (khung thực thi truy vấn có khả năng mở rộng), sử dụng [Apache Arrow](https://arrow.github.io/) làm định dạng dữ liệu in-memory.

Không giống như các database nguyên khối, DataFusion được thiết kế dưới dạng thư viện để bạn tích hợp trực tiếp vào ứng dụng của mình. Nó cung cấp:
* 🗄️ **SQL Support**: Parse và execute các câu lệnh SQL tiêu chuẩn.
* 📊 **DataFrame API**: Giao diện lập trình trực quan tương tự Spark DataFrame hoặc Polars.
* ⚙️ **Query Optimizer**: Trình tối ưu hóa truy vấn tự động tạo logical plan và physical plan tối ưu nhất.
* ⚡ **Parallel Execution**: Tận dụng tối đa kiến trúc đa luồng của Rust (Rayon/Tokio) để xử lý dữ liệu song song.

### Tại sao nên dùng DataFusion thay vì Polars?
* **Polars** rất phù hợp để xử lý dữ liệu dạng bảng đơn lẻ (Single-node DataFrame operations) giống như Pandas.
* **DataFusion** phù hợp cho các bài toán xây dựng **Database Engine custom**, cần hỗ trợ **SQL Engine** đầy đủ, xử lý truy vấn phân tán (Distributed Query Engines như Ballista), hoặc cần kết nối trực tiếp với các data source đa dạng thông qua interface mở rộng.

---

## 2. Cài đặt Dependencies

Để bắt đầu, tạo một dự án mới và thêm các dependencies sau vào `Cargo.toml`:

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
datafusion = "41.0.0" # Cập nhật phiên bản mới nhất
deltalake = { version = "0.20.0", features = ["datafusion"] } # Delta Lake integration
anyhow = "1.0"
```

---

## 3. Sử dụng DataFusion DataFrame & SQL API

Dưới đây là ví dụ thực tế đọc dữ liệu từ một thư mục chứa các file CSV/Parquet, thực hiện tính toán qua SQL hoặc DataFrame API và xuất kết quả.

```rust,ignore
use datafusion::prelude::*;
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    // 1. Khởi tạo SessionContext - Entry point của DataFusion
    let ctx = SessionContext::new();

    // 2. Register data source (CSV hoặc Parquet) dưới dạng Table
    ctx.register_csv("user_logs", "path/to/logs/*.csv", CsvReadOptions::new()).await?;

    // 3. Sử dụng SQL API để query dữ liệu
    let df_sql = ctx.sql("
        SELECT 
            user_id, 
            COUNT(1) as total_actions,
            AVG(duration) as avg_duration
        FROM user_logs
        WHERE status = 'success'
        GROUP BY user_id
        HAVING COUNT(1) > 10
        ORDER BY total_actions DESC
        LIMIT 5
    ").await?;

    // Hiển thị kết quả ra Console
    df_sql.show().await?;

    // 4. Sử dụng DataFrame API tương đương
    let df_api = ctx.table("user_logs").await?
        .filter(col("status").eq(lit("success")))?
        .aggregate(
            vec![col("user_id")],
            vec![
                count(col("user_id")).alias("total_actions"),
                avg(col("duration")).alias("avg_duration")
            ]
        )?
        .sort(vec![col("total_actions").sort(false, false)])?
        .limit(0, Some(5))?;

    // Ghi kết quả ra định dạng Parquet (Columnar Storage)
    df_api.write_parquet("output_summary.parquet", None).await?;
    
    println!("✅ Xử lý dữ liệu hoàn tất!");
    Ok(())
}
```

---

## 4. Tích hợp Delta Lake với DataFusion

[Delta Lake](https://delta.io/) là một **open-source storage framework** mang lại tính năng **ACID Transactions**, quản lý metadata, và **time travel** cho các data lake lớn. 

Trong Rust, crate `deltalake` (còn gọi là `delta-rs`) cung cấp binding trực tiếp vào DataFusion, cho phép bạn truy vấn các Delta table bằng SQL với hiệu năng native.

### Đọc và Query Delta Table bằng SQL

```rust,ignore
use datafusion::prelude::*;
use deltalake::open_table;
use std::sync::Arc;
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let ctx = SessionContext::new();

    // 1. Mở Delta Table từ local path hoặc cloud storage (S3/GCS/Azure)
    let table = open_table("path/to/delta-table").await?;

    // 2. Đăng ký Delta Table vào DataFusion Context
    ctx.register_table("my_delta_table", Arc::new(table))?;

    // 3. Thực hiện truy vấn SQL với Time Travel hoặc Filter Pushdown
    let df = ctx.sql("
        SELECT date, category, SUM(amount) as total_amount
        FROM my_delta_table
        WHERE date >= '2026-01-01'
        GROUP BY date, category
        ORDER BY total_amount DESC
    ").await?;

    df.show().await?;

    Ok(())
}
```

### Ghi dữ liệu vào Delta Table (Write Pipeline)

`delta-rs` cho phép tạo ghi trực tiếp (Append/Overwrite) thông qua API an toàn:

```rust,ignore
use deltalake::protocol::SaveMode;
use deltalake::writer::{DeltaWriter, RecordBatchWriter};
use deltalake::ops::create::CreateBuilder;
use deltalake::Schema;
use arrow::array::{Int32Array, StringArray};
use arrow::record_batch::RecordBatch;
use std::sync::Arc;
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    // 1. Định nghĩa schema bằng Apache Arrow
    let schema = Arc::new(arrow::datatypes::Schema::new(vec![
        arrow::datatypes::Field::new("id", arrow::datatypes::DataType::Int32, false),
        arrow::datatypes::Field::new("name", arrow::datatypes::DataType::Utf8, false),
    ]));

    // 2. Tạo dữ liệu mẫu dưới dạng RecordBatch (Arrow Memory Model)
    let batch = RecordBatch::try_new(
        schema.clone(),
        vec![
            Arc::new(Int32Array::from(vec![1, 2, 3])),
            Arc::new(StringArray::from(vec!["Alice", "Bob", "Charlie"])),
        ],
    )?;

    // 3. Tạo/Khởi tạo Delta Table mới
    let table = CreateBuilder::new()
        .with_location("./my_new_delta_table")
        .with_columns(schema.fields().iter().map(|f| f.into()).collect::<Vec<_>>())
        .await?;

    // 4. Thực hiện write operation
    let mut writer = RecordBatchWriter::for_table(&table)?;
    writer.write(batch).await?;
    writer.commit_with_mode(SaveMode::Append).await?;

    println!("✅ Đã ghi dữ liệu vào Delta Table thành công!");
    Ok(())
}
```

---

## 5. Các Kỹ thuật Tối ưu Hiệu suất (Performance Optimization)

Để đạt tốc độ tối đa khi xây dựng Data Pipeline với DataFusion, bạn nên áp dụng các kỹ thuật sau:

### 1. Filter Pushdown & Projection Pushdown
DataFusion tự động phân tích câu lệnh SQL để thực hiện **Projection Pushdown** (chỉ đọc các columns cần thiết từ đĩa) và **Filter Pushdown** (lọc dữ liệu ngay khi đọc từ Parquet/Delta thay vì load toàn bộ vào RAM rồi mới lọc). Để tận dụng điều này:
* Luôn sử dụng định dạng lưu trữ dạng cột (Columnar formats) như **Parquet** hoặc **Delta**.
* Hạn chế sử dụng `SELECT *` trong các query pipeline sản xuất.

### 2. Memory Management & Spilling
Khi thực hiện các phép toán nặng như `SORT` hoặc `JOIN` trên dataset lớn hơn dung lượng RAM, DataFusion hỗ trợ **memory spilling** (ghi tạm dữ liệu ra disk). Bạn có thể cấu hình thông qua `SessionConfig`:

```rust,ignore
use datafusion::prelude::*;

let config = SessionConfig::new()
    .with_target_partitions(4) // Số thread xử lý đồng thời (thường tương ứng số CPU core)
    .set("datafusion.execution.disk_manager.enabled", "true"); // Kích hoạt spilling ra disk
```

### 3. Partitioning
Chia nhỏ dữ liệu lưu trữ theo các thư mục partition (ví dụ: `year=2026/month=07/day=06/`) giúp DataFusion bỏ qua (prune) các tệp tin không liên quan khi truy vấn, giúp giảm đáng kể I/O.

---

## 6. Tổng kết

Sự kết hợp giữa **Apache DataFusion** và **Delta Lake** trong Rust đem lại giải pháp toàn diện cho Data Engineer:
* **Tốc độ cực nhanh**: Chạy trực tiếp trên memory layout của Apache Arrow, bypass hoàn toàn overhead của JVM (so với Spark).
* **Quản lý an toàn**: Tránh các lỗi bộ nhớ phổ biến nhờ vào Rust compiler, giảm thiểu lỗi crash khi chạy các batch job dài hạn.
* **Hệ sinh thái mở**: Dễ dàng tích hợp với các hệ thống Cloud lớn (AWS S3, GCP GCS, Azure Blob) thông qua các connector của `delta-rs` và `object_store` crate.

## Tài liệu Tham khảo (References)
* [Apache DataFusion Documentation](https://datafusion.apache.org/user-guide/introduction.html)
* [Delta Lake Rust (Delta-RS) Repository](https://github.com/delta-io/delta-rs)
* [Apache Arrow Rust Implementation](https://github.com/apache/arrow-rs)
