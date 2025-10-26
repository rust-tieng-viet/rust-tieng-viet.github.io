# Newtype Pattern

Newtype pattern sử dụng một tuple struct với một field duy nhất để tạo wrapper cho một type, tạo ra một type mới thay vì một alias. Pattern này giúp tăng type safety và tránh nhầm lẫn giữa các giá trị có cùng underlying type nhưng khác ý nghĩa.

## Vấn đề

Khi làm việc với data, ta thường có nhiều giá trị cùng kiểu nhưng khác ý nghĩa:

```rust
// ❌ Dễ nhầm lẫn - tất cả đều là f64
fn calculate_distance(lat1: f64, lon1: f64, lat2: f64, lon2: f64) -> f64 {
    // Dễ truyền sai thứ tự parameters
    // ...
    0.0
}

fn main() {
    let latitude = 37.7749;
    let longitude = -122.4194;

    // Có thể vô tình đảo vị trí
    calculate_distance(longitude, latitude, 0.0, 0.0); // ❌ Bug!
}
```

## Giải pháp: Newtype Pattern

```rust
// ✅ Type-safe với newtypes
struct Latitude(f64);
struct Longitude(f64);
struct Kilometers(f64);

fn calculate_distance(
    lat1: Latitude,
    lon1: Longitude,
    lat2: Latitude,
    lon2: Longitude
) -> Kilometers {
    // Compiler đảm bảo đúng thứ tự!
    Kilometers(0.0)
}

fn main() {
    let lat = Latitude(37.7749);
    let lon = Longitude(-122.4194);

    // ✅ Type-safe - compiler sẽ báo lỗi nếu sai thứ tự
    calculate_distance(lat, lon, Latitude(0.0), Longitude(0.0));

    // ❌ Compile error!
    // calculate_distance(lon, lat, Latitude(0.0), Longitude(0.0));
}
```

## Zero-Cost Abstraction

Newtypes không có runtime overhead:

```rust
struct UserId(u64);
struct ProductId(u64);

fn main() {
    let user = UserId(12345);
    let product = ProductId(67890);

    // ❌ Compile error - không thể nhầm lẫn!
    // let x: UserId = product;

    // Compiled code giống như dùng trực tiếp u64
    // Zero runtime cost!
}
```

## Ứng dụng trong Data Engineering

### 1. Phân biệt các loại IDs

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct CustomerId(u64);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct OrderId(u64);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct ProductId(u64);

use std::collections::HashMap;

struct DataWarehouse {
    customer_orders: HashMap<CustomerId, Vec<OrderId>>,
    order_products: HashMap<OrderId, Vec<ProductId>>,
}

impl DataWarehouse {
    fn get_customer_orders(&self, customer: CustomerId) -> Option<&Vec<OrderId>> {
        self.customer_orders.get(&customer)
    }

    // ✅ Type system đảm bảo không truyền nhầm ID type
    fn get_order_products(&self, order: OrderId) -> Option<&Vec<ProductId>> {
        self.order_products.get(&order)
    }
}

fn main() {
    let customer = CustomerId(1001);
    let order = OrderId(5001);

    let warehouse = DataWarehouse {
        customer_orders: HashMap::new(),
        order_products: HashMap::new(),
    };

    // ✅ Type-safe
    warehouse.get_customer_orders(customer);

    // ❌ Compile error!
    // warehouse.get_customer_orders(order);
}
```

### 2. Units và Measurements

```rust
#[derive(Debug, Clone, Copy)]
struct Meters(f64);

#[derive(Debug, Clone, Copy)]
struct Feet(f64);

#[derive(Debug, Clone, Copy)]
struct Celsius(f64);

#[derive(Debug, Clone, Copy)]
struct Fahrenheit(f64);

impl Meters {
    fn to_feet(self) -> Feet {
        Feet(self.0 * 3.28084)
    }
}

impl Feet {
    fn to_meters(self) -> Meters {
        Meters(self.0 / 3.28084)
    }
}

impl Celsius {
    fn to_fahrenheit(self) -> Fahrenheit {
        Fahrenheit(self.0 * 9.0 / 5.0 + 32.0)
    }
}

fn main() {
    let height_m = Meters(1.75);
    let height_ft = height_m.to_feet();

    println!("Height: {:?} = {:?}", height_m, height_ft);

    let temp_c = Celsius(25.0);
    let temp_f = temp_c.to_fahrenheit();

    println!("Temperature: {:?} = {:?}", temp_c, temp_f);

    // ❌ Compile error - không thể cộng các units khác nhau!
    // let x = height_m.0 + temp_c.0;
}
```

### 3. Validated Data

```rust
use std::error::Error;

#[derive(Debug)]
struct Email(String);

impl Email {
    fn new(email: String) -> Result<Self, Box<dyn Error>> {
        if email.contains('@') && email.contains('.') {
            Ok(Email(email))
        } else {
            Err("Invalid email format".into())
        }
    }

    fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug)]
struct PhoneNumber(String);

impl PhoneNumber {
    fn new(phone: String) -> Result<Self, Box<dyn Error>> {
        if phone.len() >= 10 {
            Ok(PhoneNumber(phone))
        } else {
            Err("Phone number too short".into())
        }
    }
}

fn send_notification(email: Email, phone: PhoneNumber) {
    // Email và PhoneNumber đã được validated!
    println!("Sending to {} and {:?}", email.as_str(), phone);
}

fn main() -> Result<(), Box<dyn Error>> {
    let email = Email::new("user@example.com".to_string())?;
    let phone = PhoneNumber::new("1234567890".to_string())?;

    send_notification(email, phone);

    // ❌ Invalid data không thể tạo được Email
    let bad_email = Email::new("notanemail".to_string());
    assert!(bad_email.is_err());

    Ok(())
}
```

### 4. Currency và Money

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct USD(i64);  // Cents

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct EUR(i64);  // Cents

impl USD {
    fn from_dollars(dollars: f64) -> Self {
        USD((dollars * 100.0) as i64)
    }

    fn to_dollars(&self) -> f64 {
        self.0 as f64 / 100.0
    }

    fn add(self, other: USD) -> USD {
        USD(self.0 + other.0)
    }
}

impl EUR {
    fn from_euros(euros: f64) -> Self {
        EUR((euros * 100.0) as i64)
    }

    fn to_euros(&self) -> f64 {
        self.0 as f64 / 100.0
    }
}

fn calculate_total_revenue(amounts: &[USD]) -> USD {
    amounts.iter()
        .fold(USD(0), |acc, &amount| acc.add(amount))
}

fn main() {
    let price1 = USD::from_dollars(19.99);
    let price2 = USD::from_dollars(29.99);

    let total = price1.add(price2);
    println!("Total: ${:.2}", total.to_dollars());

    let euro_price = EUR::from_euros(45.50);

    // ❌ Compile error - không thể cộng USD và EUR!
    // let wrong = price1.add(euro_price);

    // ✅ Type-safe calculations
    let revenues = vec![
        USD::from_dollars(100.0),
        USD::from_dollars(250.5),
        USD::from_dollars(75.25),
    ];

    let total_revenue = calculate_total_revenue(&revenues);
    println!("Total revenue: ${:.2}", total_revenue.to_dollars());
}
```

## Implementing Traits cho Newtypes

```rust
use std::fmt;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
struct RowId(usize);

impl RowId {
    fn new(id: usize) -> Self {
        RowId(id)
    }

    fn value(&self) -> usize {
        self.0
    }
}

// Custom Display
impl fmt::Display for RowId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Row#{}", self.0)
    }
}

// Custom Debug
impl fmt::Debug for RowId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "RowId({})", self.0)
    }
}

fn main() {
    let row = RowId::new(42);

    println!("{}", row);      // Row#42
    println!("{:?}", row);    // RowId(42)

    // Có thể dùng trong collections nhờ Hash, Eq
    let mut rows = std::collections::HashSet::new();
    rows.insert(row);
    rows.insert(RowId::new(100));

    println!("Rows: {:?}", rows);
}
```

## Deref Coercion

Cho phép newtype tự động convert sang underlying type trong một số contexts:

```rust
use std::ops::Deref;

struct DatabaseUrl(String);

impl DatabaseUrl {
    fn new(url: String) -> Self {
        DatabaseUrl(url)
    }
}

impl Deref for DatabaseUrl {
    type Target = str;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

fn connect(url: &str) {
    println!("Connecting to: {}", url);
}

fn main() {
    let db_url = DatabaseUrl::new("postgres://localhost:5432/mydb".to_string());

    // ✅ Tự động deref từ &DatabaseUrl sang &str
    connect(&db_url);

    // ✅ Có thể gọi String methods
    println!("Length: {}", db_url.len());
    println!("Starts with postgres: {}", db_url.starts_with("postgres"));
}
```

## Ví dụ thực tế: Data Pipeline

```rust
use std::collections::HashMap;

// Newtypes cho data pipeline
#[derive(Debug, Clone, Hash, PartialEq, Eq)]
struct SourceId(String);

#[derive(Debug, Clone, Hash, PartialEq, Eq)]
struct DatasetId(String);

#[derive(Debug, Clone, Copy)]
struct Timestamp(i64);

#[derive(Debug, Clone, Copy)]
struct RecordCount(usize);

struct DataPipeline {
    datasets: HashMap<DatasetId, DatasetInfo>,
}

#[derive(Debug)]
struct DatasetInfo {
    source: SourceId,
    last_updated: Timestamp,
    record_count: RecordCount,
}

impl DataPipeline {
    fn new() -> Self {
        DataPipeline {
            datasets: HashMap::new(),
        }
    }

    fn add_dataset(
        &mut self,
        dataset_id: DatasetId,
        source: SourceId,
        timestamp: Timestamp,
        count: RecordCount,
    ) {
        self.datasets.insert(
            dataset_id,
            DatasetInfo {
                source,
                last_updated: timestamp,
                record_count: count,
            },
        );
    }

    fn get_dataset(&self, dataset_id: &DatasetId) -> Option<&DatasetInfo> {
        self.datasets.get(dataset_id)
    }
}

fn main() {
    let mut pipeline = DataPipeline::new();

    let dataset = DatasetId("users_2024".to_string());
    let source = SourceId("postgresql".to_string());
    let timestamp = Timestamp(1704067200);  // 2024-01-01
    let count = RecordCount(1_000_000);

    pipeline.add_dataset(dataset.clone(), source, timestamp, count);

    if let Some(info) = pipeline.get_dataset(&dataset) {
        println!("Dataset info: {:?}", info);
    }
}
```

## Best Practices

### 1. Derive useful traits

```rust
// ✅ Derive các traits thường dùng
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct TransactionId(u64);

#[derive(Debug, Clone, PartialEq)]
struct Amount(f64);
```

### 2. Provide accessor methods

```rust
struct Score(f64);

impl Score {
    fn new(value: f64) -> Self {
        Score(value.max(0.0).min(100.0))  // Clamp 0-100
    }

    // Accessor
    fn value(&self) -> f64 {
        self.0
    }

    // Business logic
    fn is_passing(&self) -> bool {
        self.0 >= 60.0
    }
}
```

### 3. Implement conversion traits

```rust
struct Percentage(f64);

impl From<f64> for Percentage {
    fn from(value: f64) -> Self {
        Percentage(value)
    }
}

impl From<Percentage> for f64 {
    fn from(p: Percentage) -> Self {
        p.0
    }
}

fn main() {
    let p: Percentage = 75.5.into();
    let f: f64 = p.into();
    println!("{}", f);  // 75.5
}
```

## Khi nào nên dùng Newtype?

### ✅ Nên dùng khi:

1. **Phân biệt giá trị cùng type** - IDs, measurements, currencies
2. **Validation** - Email, phone, URL phải valid
3. **Type safety** - Tránh truyền sai parameters
4. **Domain modeling** - Express business concepts
5. **Implementing traits cho external types** - Orphan rule workaround

### ❌ Không cần dùng khi:

1. **Simple local variables** - Overhead không đáng
2. **Performance-critical code** - Nếu cần optimize extreme
3. **Prototype code** - Quá nhiều boilerplate ban đầu

## Tổng kết

Newtype pattern là một idiom quan trọng trong Rust:
- ✅ Zero-cost abstraction
- ✅ Type safety tăng cao
- ✅ Self-documenting code
- ✅ Compile-time guarantees
- ✅ Tránh bugs phổ biến

Best practices:
1. Dùng cho IDs, units, validated data
2. Derive useful traits
3. Provide accessor methods
4. Implement conversion traits khi cần
5. Document the invariants

## References

- [Newtype Pattern - Rust Design Patterns](https://rust-unofficial.github.io/patterns/patterns/behavioural/newtype.html)
- [New Type Idiom - Rust By Example](https://doc.rust-lang.org/rust-by-example/generics/new_types.html)
- [Advanced Types - The Rust Book](https://doc.rust-lang.org/book/ch20-03-advanced-types.html)
