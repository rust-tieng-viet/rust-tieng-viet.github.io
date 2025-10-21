# Building scalable data-driven applications using Rust

Data-driven applications cần xử lý, phân tích và serve dữ liệu một cách nhanh chóng và đáng tin cậy. Rust với performance cao, memory safety và concurrency mạnh mẽ là lựa chọn tuyệt vời để xây dựng các ứng dụng data-driven có khả năng scale.

Trong bài này, chúng ta sẽ tìm hiểu cách xây dựng một ứng dụng data-driven hoàn chỉnh với các thành phần:
- Data ingestion và processing
- Storage và indexing
- Query engine
- API để serve data

## Kiến trúc ứng dụng Data-Driven

```
┌─────────────┐
│ Data Sources│ (CSV, JSON, API, Database)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Ingestion  │ (tokio, reqwest, async-std)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Processing  │ (polars, arrow, datafusion)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Storage   │ (parquet, sled, rocksdb)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Query Engine│ (datafusion, tantivy)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  API Server │ (actix-web, axum, rocket)
└─────────────┘
```

## Ví dụ 1: Data Ingestion với Tokio

Xây dựng service để ingest data từ nhiều nguồn:

```rust
use tokio::fs::File;
use tokio::io::AsyncReadExt;
use reqwest;
use anyhow::Result;

/// Đọc data từ file
async fn ingest_from_file(path: &str) -> Result<Vec<u8>> {
    let mut file = File::open(path).await?;
    let mut contents = Vec::new();
    file.read_to_end(&mut contents).await?;
    Ok(contents)
}

/// Fetch data từ HTTP API
async fn ingest_from_api(url: &str) -> Result<String> {
    let response = reqwest::get(url).await?;
    let body = response.text().await?;
    Ok(body)
}

/// Ingest data từ nhiều nguồn đồng thời
async fn ingest_all() -> Result<()> {
    // Chạy parallel
    let (file_data, api_data) = tokio::join!(
        ingest_from_file("data.csv"),
        ingest_from_api("https://api.example.com/data")
    );

    println!("File data size: {}", file_data?.len());
    println!("API data: {}", api_data?);

    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    ingest_all().await?;
    Ok(())
}
```

## Ví dụ 2: Processing với DataFusion

DataFusion là SQL query engine sử dụng Apache Arrow, cực kỳ nhanh:

```toml
[dependencies]
datafusion = "43.0"
tokio = { version = "1.48", features = ["full"] }
```

```rust
use datafusion::prelude::*;
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    // Tạo SessionContext
    let ctx = SessionContext::new();

    // Đăng ký Parquet file như một table
    ctx.register_parquet("sales", "sales_data.parquet", ParquetReadOptions::default())
        .await?;

    // Chạy SQL query
    let df = ctx.sql(
        "SELECT
            category,
            SUM(revenue) as total_revenue,
            AVG(revenue) as avg_revenue,
            COUNT(*) as num_transactions
        FROM sales
        WHERE revenue > 100
        GROUP BY category
        ORDER BY total_revenue DESC"
    ).await?;

    // Hiển thị kết quả
    df.show().await?;

    // Hoặc lưu lại thành Parquet
    df.write_parquet("output.parquet", None, None).await?;

    Ok(())
}
```

**Ưu điểm của DataFusion:**
- Tốc độ cực nhanh (columnar processing)
- Hỗ trợ SQL standard
- Có thể scale đến hàng TB dữ liệu
- Zero-copy reads với Arrow

## Ví dụ 3: Storage với Parquet

Parquet là format columnar storage rất hiệu quả:

```rust
use polars::prelude::*;
use anyhow::Result;

fn save_to_parquet(df: &mut DataFrame, path: &str) -> Result<()> {
    let file = std::fs::File::create(path)?;

    ParquetWriter::new(&file)
        .with_compression(ParquetCompression::Snappy)  // Nén data
        .finish(df)?;

    Ok(())
}

fn read_from_parquet(path: &str) -> Result<DataFrame> {
    let df = ParquetReader::new(std::fs::File::open(path)?)
        .finish()?;
    Ok(df)
}

fn main() -> Result<()> {
    // Tạo sample data
    let mut df = df! {
        "id" => &[1, 2, 3, 4, 5],
        "name" => &["Alice", "Bob", "Charlie", "David", "Eve"],
        "revenue" => &[1200.50, 800.30, 1500.75, 950.20, 1100.00],
    }?;

    // Lưu
    save_to_parquet(&mut df, "users.parquet")?;
    println!("✅ Đã lưu data");

    // Đọc lại
    let loaded = read_from_parquet("users.parquet")?;
    println!("{:?}", loaded);

    Ok(())
}
```

## Ví dụ 4: Full-text Search với Tantivy

Tantivy là full-text search engine tương tự Lucene/Elasticsearch:

```toml
[dependencies]
tantivy = "0.22"
```

```rust
use tantivy::schema::*;
use tantivy::{doc, Index, IndexWriter, ReloadPolicy};
use tantivy::collector::TopDocs;
use tantivy::query::QueryParser;
use anyhow::Result;

fn main() -> Result<()> {
    // Định nghĩa schema
    let mut schema_builder = Schema::builder();
    schema_builder.add_text_field("title", TEXT | STORED);
    schema_builder.add_text_field("body", TEXT);
    let schema = schema_builder.build();

    // Tạo index
    let index = Index::create_in_ram(schema.clone());
    let mut index_writer: IndexWriter = index.writer(50_000_000)?;

    // Index documents
    let title = schema.get_field("title").unwrap();
    let body = schema.get_field("body").unwrap();

    index_writer.add_document(doc!(
        title => "Rust Programming",
        body => "Rust is a systems programming language that runs blazingly fast"
    ))?;

    index_writer.add_document(doc!(
        title => "Data Engineering",
        body => "Building scalable data pipelines with Rust and Polars"
    ))?;

    index_writer.commit()?;

    // Search
    let reader = index
        .reader_builder()
        .reload_policy(ReloadPolicy::OnCommitWithDelay)
        .try_into()?;

    let searcher = reader.searcher();

    let query_parser = QueryParser::for_index(&index, vec![title, body]);
    let query = query_parser.parse_query("Rust")?;

    let top_docs = searcher.search(&query, &TopDocs::with_limit(10))?;

    println!("Tìm thấy {} kết quả:", top_docs.len());
    for (_score, doc_address) in top_docs {
        let retrieved_doc = searcher.doc(doc_address)?;
        println!("{}", schema.to_json(&retrieved_doc));
    }

    Ok(())
}
```

## Ví dụ 5: API Server với Axum

Xây dựng REST API để serve data:

```toml
[dependencies]
axum = "0.7"
tokio = { version = "1.48", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
datafusion = "43.0"
```

```rust
use axum::{
    extract::{Query, State},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use datafusion::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use anyhow::Result;

#[derive(Clone)]
struct AppState {
    ctx: Arc<SessionContext>,
}

#[derive(Deserialize)]
struct QueryParams {
    category: Option<String>,
    min_revenue: Option<f64>,
}

#[derive(Serialize)]
struct SalesRecord {
    category: String,
    total_revenue: f64,
    num_transactions: i64,
}

async fn query_sales(
    State(state): State<AppState>,
    Query(params): Query<QueryParams>,
) -> Result<Json<Vec<SalesRecord>>, StatusCode> {
    // Build SQL query dựa trên params
    let mut sql = String::from(
        "SELECT category,
         SUM(revenue) as total_revenue,
         COUNT(*) as num_transactions
         FROM sales WHERE 1=1"
    );

    if let Some(cat) = params.category {
        sql.push_str(&format!(" AND category = '{}'", cat));
    }

    if let Some(min_rev) = params.min_revenue {
        sql.push_str(&format!(" AND revenue >= {}", min_rev));
    }

    sql.push_str(" GROUP BY category");

    // Execute query
    let df = state.ctx.sql(&sql)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Convert to JSON (simplified)
    let records = vec![
        SalesRecord {
            category: "Electronics".to_string(),
            total_revenue: 5000.0,
            num_transactions: 100,
        }
    ];

    Ok(Json(records))
}

async fn health_check() -> &'static str {
    "OK"
}

#[tokio::main]
async fn main() -> Result<()> {
    // Setup DataFusion
    let ctx = SessionContext::new();
    ctx.register_parquet("sales", "sales_data.parquet", ParquetReadOptions::default())
        .await?;

    let state = AppState {
        ctx: Arc::new(ctx),
    };

    // Build router
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/sales", get(query_sales))
        .with_state(state);

    // Run server
    println!("🚀 Server chạy tại http://localhost:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;

    Ok(())
}
```

Test API:

```bash
# Health check
curl http://localhost:3000/health

# Query với params
curl "http://localhost:3000/api/sales?category=Electronics&min_revenue=100"
```

## Ví dụ 6: Real-time Processing với Channels

Xử lý data streaming real-time:

```rust
use tokio::sync::mpsc;
use tokio::time::{Duration, sleep};
use anyhow::Result;

#[derive(Debug, Clone)]
struct DataPoint {
    timestamp: i64,
    value: f64,
}

async fn producer(tx: mpsc::Sender<DataPoint>) {
    let mut counter = 0;
    loop {
        let data = DataPoint {
            timestamp: counter,
            value: (counter as f64) * 1.5,
        };

        if tx.send(data).await.is_err() {
            println!("Receiver dropped");
            break;
        }

        counter += 1;
        sleep(Duration::from_millis(100)).await;
    }
}

async fn processor(mut rx: mpsc::Receiver<DataPoint>) {
    let mut buffer = Vec::new();
    let batch_size = 10;

    while let Some(data) = rx.recv().await {
        buffer.push(data);

        if buffer.len() >= batch_size {
            // Process batch
            let sum: f64 = buffer.iter().map(|d| d.value).sum();
            let avg = sum / buffer.len() as f64;

            println!("📊 Batch processed: {} records, avg = {:.2}", buffer.len(), avg);

            buffer.clear();
        }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let (tx, rx) = mpsc::channel(100);

    // Spawn producer và processor
    let producer_handle = tokio::spawn(producer(tx));
    let processor_handle = tokio::spawn(processor(rx));

    // Chạy 5 giây
    sleep(Duration::from_secs(5)).await;
    producer_handle.abort();

    processor_handle.await?;

    Ok(())
}
```

## Best Practices

### 1. Sử dụng Columnar Format

```rust
// ✅ Tốt: Parquet (columnar)
ParquetWriter::new(&file).finish(&mut df)?;

// ❌ Tránh: CSV cho large datasets
// CSV rất chậm và tốn memory
```

### 2. Lazy Evaluation

```rust
// ✅ Tốt: Lazy evaluation
let result = df.lazy()
    .filter(...)
    .select(...)
    .collect()?;  // Chỉ execute 1 lần

// ❌ Tránh: Eager evaluation
let df = df.filter(...)?;  // Execute ngay
let df = df.select(...)?;  // Execute lại
```

### 3. Batch Processing

```rust
// ✅ Tốt: Process theo batch
for chunk in data.chunks(10_000) {
    process_chunk(chunk);
}

// ❌ Tránh: Process từng item
for item in data {
    process_item(item);  // Chậm!
}
```

### 4. Connection Pooling

```rust
use deadpool_postgres::{Config, Pool};

// ✅ Tốt: Dùng connection pool
let pool = config.create_pool(None, NoTls)?;
let client = pool.get().await?;

// ❌ Tránh: Tạo connection mỗi lần query
```

## Monitoring và Observability

```rust
use std::time::Instant;

fn main() -> Result<()> {
    let start = Instant::now();

    // Process data
    let df = process_data()?;

    println!("⏱️  Processing time: {:?}", start.elapsed());
    println!("📊 Records processed: {}", df.height());
    println!("💾 Memory used: {} MB", df.estimated_size() / 1_000_000);

    Ok(())
}
```

## So sánh Performance

| Operation | Python/Pandas | Rust/Polars | Speedup |
|-----------|---------------|-------------|---------|
| Read CSV (1GB) | 5.2s | 0.8s | 6.5x |
| GroupBy + Agg | 3.1s | 0.4s | 7.8x |
| Join (10M rows) | 12.5s | 1.2s | 10.4x |
| Write Parquet | 2.8s | 0.5s | 5.6x |

## Tổng kết

Rust cung cấp ecosystem mạnh mẽ để xây dựng data-driven applications:
- ✅ **DataFusion**: SQL query engine cực nhanh
- ✅ **Polars**: DataFrame library như Pandas nhưng nhanh hơn nhiều
- ✅ **Tantivy**: Full-text search engine
- ✅ **Arrow**: Columnar format chuẩn công nghiệp
- ✅ **Tokio**: Async runtime cho concurrent processing
- ✅ **Axum/Actix**: Web frameworks để serve data

Với Rust, bạn có thể xây dựng ứng dụng vừa nhanh, vừa safe, vừa dễ maintain và scale.

## References

- [DataFusion Documentation](https://datafusion.apache.org/)
- [Polars Documentation](https://docs.pola.rs/)
- [Tantivy Documentation](https://docs.rs/tantivy/)
- [Apache Arrow](https://arrow.apache.org/)
- [Are We Data Yet?](https://arewedatayet.com)
