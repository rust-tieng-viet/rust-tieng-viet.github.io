# Rust as an alternative to Python for data engineering tasks

Python đã thống trị lĩnh vực data engineering trong nhiều năm với các tools như Pandas, Spark, và Airflow. Tuy nhiên, Rust đang nổi lên như một lựa chọn thay thế hấp dẫn với performance vượt trội, memory safety, và khả năng concurrent processing mạnh mẽ.

Bài này sẽ so sánh chi tiết giữa Python và Rust trong các use case phổ biến của data engineering, giúp bạn quyết định khi nào nên dùng Rust thay vì Python.

## So sánh tổng quan

| Tiêu chí | Python | Rust |
|----------|--------|------|
| **Performance** | Chậm (interpreted) | Rất nhanh (compiled, gần C++) |
| **Memory Usage** | Cao (GIL, GC overhead) | Thấp (no GC, zero-cost abstractions) |
| **Type Safety** | Dynamic typing (runtime errors) | Static typing (compile-time checks) |
| **Concurrency** | Hạn chế (GIL) | Excellent (no GIL, fearless concurrency) |
| **Ecosystem** | Rất lớn (mature) | Đang phát triển nhanh |
| **Learning Curve** | Dễ học | Khó hơn (ownership, lifetimes) |
| **Development Speed** | Nhanh (scripting) | Chậm hơn (compile time) |

## 1. DataFusion vs Apache Spark

### Apache Spark (Python/Scala)

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("example").getOrCreate()

# Đọc data
df = spark.read.parquet("sales.parquet")

# Transform
result = df.groupBy("category") \
    .agg({"revenue": "sum", "quantity": "count"}) \
    .orderBy("sum(revenue)", ascending=False)

result.show()
```

**Nhược điểm:**
- Overhead của JVM
- GC pauses
- Slow startup time
- Resource hungry (cần nhiều RAM)

### DataFusion (Rust)

```rust
use datafusion::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let ctx = SessionContext::new();

    // Đọc data
    ctx.register_parquet("sales", "sales.parquet", ParquetReadOptions::default())
        .await?;

    // Transform với SQL
    let df = ctx.sql(
        "SELECT category,
         SUM(revenue) as total_revenue,
         COUNT(quantity) as num_transactions
         FROM sales
         GROUP BY category
         ORDER BY total_revenue DESC"
    ).await?;

    df.show().await?;
    Ok(())
}
```

**Ưu điểm:**
- Nhanh hơn Spark 2-10x (tùy workload)
- Memory efficient hơn nhiều
- Không cần JVM
- Startup gần như instant
- Single binary, dễ deploy

**Benchmark:**
- Query 1GB Parquet: DataFusion ~0.8s vs Spark ~5s
- GroupBy + Aggregation: DataFusion ~0.4s vs Spark ~3s

## 2. Polars vs Pandas

### Pandas (Python)

```python
import pandas as pd

# Đọc CSV
df = pd.read_csv('sales.csv')

# Transform
result = df.groupby('category').agg({
    'revenue': ['sum', 'mean', 'count'],
    'quantity': 'sum'
})

# Filter
filtered = df[df['revenue'] > 100]

# Save
result.to_parquet('output.parquet')
```

**Vấn đề của Pandas:**
- Chậm với large datasets (>1GB)
- Single-threaded (không tận dụng multi-core)
- High memory usage
- Chained operations không được optimize

### Polars (Rust)

```rust
use polars::prelude::*;

fn main() -> Result<()> {
    // Đọc CSV với lazy evaluation
    let df = LazyCsvReader::new("sales.csv")
        .has_header(true)
        .finish()?
        .filter(col("revenue").gt(100))
        .group_by([col("category")])
        .agg([
            col("revenue").sum().alias("sum_revenue"),
            col("revenue").mean().alias("avg_revenue"),
            col("revenue").count().alias("count"),
            col("quantity").sum().alias("sum_quantity"),
        ])
        .collect()?;

    // Save
    let mut file = std::fs::File::create("output.parquet")?;
    ParquetWriter::new(&mut file).finish(&mut df.clone())?;

    Ok(())
}
```

**Ưu điểm Polars:**
- Nhanh hơn Pandas 5-15x
- Multi-threaded by default
- Lazy evaluation (query optimization)
- Memory efficient (zero-copy operations)
- Syntax gần giống Pandas

**Benchmark (1GB CSV):**
```
Read CSV:       Pandas 5.2s  | Polars 0.8s  (6.5x faster)
GroupBy + Agg:  Pandas 3.1s  | Polars 0.4s  (7.8x faster)
Filter + Sort:  Pandas 2.5s  | Polars 0.3s  (8.3x faster)
Write Parquet:  Pandas 2.8s  | Polars 0.5s  (5.6x faster)
```

## 3. Search: Meilisearch vs Elasticsearch

### Elasticsearch (Java/Python client)

```python
from elasticsearch import Elasticsearch

es = Elasticsearch(['localhost:9200'])

# Index document
es.index(index='products', body={
    'name': 'Laptop',
    'category': 'Electronics',
    'price': 1200
})

# Search
results = es.search(index='products', body={
    'query': {
        'match': {'category': 'Electronics'}
    }
})
```

**Nhược điểm:**
- Heavy (JVM, nhiều memory)
- Complex configuration
- Slow startup
- Resource intensive

### Meilisearch (Rust)

Meilisearch là full-text search engine viết bằng Rust, cực kỳ nhanh và dễ sử dụng:

```bash
# Cài đặt và chạy
curl -L https://install.meilisearch.com | sh
./meilisearch

# Hoặc dùng Docker
docker run -p 7700:7700 getmeili/meilisearch
```

```rust
use meilisearch_sdk::client::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Product {
    id: usize,
    name: String,
    category: String,
    price: f64,
}

#[tokio::main]
async fn main() {
    let client = Client::new("http://localhost:7700", Some("masterKey"));

    // Index documents
    let products = vec![
        Product { id: 1, name: "Laptop".to_string(), category: "Electronics".to_string(), price: 1200.0 },
        Product { id: 2, name: "Mouse".to_string(), category: "Electronics".to_string(), price: 25.0 },
    ];

    let index = client.index("products");
    index.add_documents(&products, Some("id")).await.unwrap();

    // Search
    let results = index.search()
        .with_query("Electronics")
        .execute::<Product>()
        .await
        .unwrap();

    println!("Found: {:?}", results.hits);
}
```

**Ưu điểm Meilisearch:**
- Cực nhanh (search <50ms)
- Low memory footprint
- Instant startup
- Typo-tolerant search
- API đơn giản
- Single binary

## 4. ETL Pipelines

### Python với Airflow

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
import pandas as pd

def extract():
    df = pd.read_csv('source.csv')
    df.to_pickle('/tmp/data.pkl')

def transform():
    df = pd.read_pickle('/tmp/data.pkl')
    result = df.groupby('category').sum()
    result.to_pickle('/tmp/transformed.pkl')

def load():
    df = pd.read_pickle('/tmp/transformed.pkl')
    df.to_parquet('output.parquet')

dag = DAG('etl_pipeline', start_date=datetime(2024, 1, 1))

extract_task = PythonOperator(task_id='extract', python_callable=extract, dag=dag)
transform_task = PythonOperator(task_id='transform', python_callable=transform, dag=dag)
load_task = PythonOperator(task_id='load', python_callable=load, dag=dag)

extract_task >> transform_task >> load_task
```

### Rust với Custom Pipeline

```rust
use polars::prelude::*;
use anyhow::Result;

struct Pipeline;

impl Pipeline {
    fn extract() -> Result<DataFrame> {
        let df = CsvReader::from_path("source.csv")?
            .has_header(true)
            .finish()?;
        Ok(df)
    }

    fn transform(df: DataFrame) -> Result<DataFrame> {
        let result = df.lazy()
            .group_by([col("category")])
            .agg([col("revenue").sum()])
            .collect()?;
        Ok(result)
    }

    fn load(df: &mut DataFrame) -> Result<()> {
        let file = std::fs::File::create("output.parquet")?;
        ParquetWriter::new(&file).finish(df)?;
        Ok(())
    }

    fn run() -> Result<()> {
        println!("🚀 Starting ETL pipeline...");

        let df = Self::extract()?;
        println!("✅ Extract: {} rows", df.height());

        let mut result = Self::transform(df)?;
        println!("✅ Transform: {} rows", result.height());

        Self::load(&mut result)?;
        println!("✅ Load complete");

        Ok(())
    }
}

fn main() -> Result<()> {
    Pipeline::run()
}
```

**Ưu điểm Rust ETL:**
- Nhanh hơn nhiều (5-10x)
- Type-safe (catch errors at compile time)
- Low resource usage
- Dễ deploy (single binary)
- No runtime dependencies

**Khi nào dùng Rust thay vì Airflow:**
- Simple pipelines không cần UI
- Performance critical
- Resource constraints
- Need for type safety

## 5. Data Validation

### Pandera (Python)

```python
import pandas as pd
import pandera as pa

schema = pa.DataFrameSchema({
    "id": pa.Column(int, pa.Check.greater_than(0)),
    "revenue": pa.Column(float, pa.Check.in_range(0, 1000000)),
    "category": pa.Column(str, pa.Check.isin(["Electronics", "Books"]))
})

df = pd.read_csv("data.csv")
validated = schema.validate(df)  # Runtime check
```

### Rust với Type System

```rust
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct SalesRecord {
    id: u32,              // Always positive
    revenue: f64,
    category: Category,   // Only valid categories
}

#[derive(Deserialize, Debug)]
enum Category {
    Electronics,
    Books,
}

fn main() -> Result<()> {
    let mut reader = csv::Reader::from_path("data.csv")?;

    for result in reader.deserialize() {
        let record: SalesRecord = result?;  // Compile-time + parse-time validation
        println!("{:?}", record);
    }

    Ok(())
}
```

**Ưu điểm Rust:**
- Validation at compile time
- Zero runtime overhead
- Impossible to have invalid data
- Better IDE support (autocomplete, type hints)

## Khi nào nên dùng Rust?

### ✅ Rust phù hợp khi:

1. **Performance critical:**
   - Xử lý hàng TB data
   - Real-time processing
   - Low latency requirements

2. **Long-running services:**
   - Stream processing
   - Data ingestion services
   - API servers serving data

3. **Resource constraints:**
   - Limited memory
   - Cost optimization (cloud)
   - Edge computing

4. **Type safety quan trọng:**
   - Financial data
   - Healthcare data
   - Critical infrastructure

5. **Deployment đơn giản:**
   - Cần single binary
   - No Python runtime dependency
   - Container size nhỏ

### ❌ Python vẫn tốt hơn khi:

1. **Rapid prototyping:**
   - POC, experiments
   - One-off scripts

2. **Team không biết Rust:**
   - Learning curve cao
   - Hiring khó hơn

3. **Rich ecosystem needed:**
   - Specialized ML libraries
   - Legacy integrations

4. **Notebook-based workflows:**
   - Jupyter notebooks
   - Interactive analysis

## Migration Strategy

Không cần migrate toàn bộ sang Rust cùng lúc:

### Phase 1: Hot paths
- Identify performance bottlenecks
- Rewrite critical paths in Rust
- Call from Python via PyO3

```rust
use pyo3::prelude::*;

#[pyfunction]
fn process_large_dataset(data: Vec<f64>) -> PyResult<f64> {
    // Rust implementation
    Ok(data.iter().sum())
}

#[pymodule]
fn my_module(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(process_large_dataset, m)?)?;
    Ok(())
}
```

```python
# Python code
import my_module

result = my_module.process_large_dataset(large_array)
```

### Phase 2: New services
- Xây dựng services mới bằng Rust
- Integrate với existing Python code

### Phase 3: Full rewrite
- Khi team đã quen với Rust
- Khi performance gain rõ ràng

## Ecosystem so sánh

| Category | Python | Rust |
|----------|--------|------|
| **DataFrame** | Pandas | Polars |
| **SQL Engine** | DuckDB | DataFusion |
| **Distributed Computing** | Spark | Ballista |
| **Search** | Elasticsearch | Meilisearch, Tantivy |
| **Serialization** | pickle, json | Serde |
| **Async I/O** | asyncio | Tokio |
| **Workflow** | Airflow | Custom (tokio tasks) |
| **Web Framework** | Flask, FastAPI | Axum, Actix-web |

## Tổng kết

Rust không phải để thay thế hoàn toàn Python, mà là công cụ bổ sung:

**Python:** Rapid development, prototyping, glue code, notebooks
**Rust:** Production systems, performance critical paths, long-running services

Chiến lược tốt nhất:
1. Prototype trong Python
2. Identify bottlenecks
3. Rewrite critical parts trong Rust
4. Use PyO3 để integrate

Trong 5-10 năm tới, Rust sẽ là lựa chọn phổ biến cho production data engineering workloads, tương tự như Go đã thay thế Python trong nhiều backend services.

## References

- [Are We Data Yet?](https://arewedatayet.com) - Rust data ecosystem tracker
- [Polars Benchmarks](https://www.pola.rs/benchmarks.html)
- [DataFusion vs Spark](https://arrow.apache.org/datafusion/)
- [Meilisearch](https://github.com/meilisearch/meilisearch)
- [PyO3 Documentation](https://pyo3.rs/) - Rust bindings for Python
- [Ballista](https://github.com/apache/datafusion-ballista) - Distributed DataFusion
