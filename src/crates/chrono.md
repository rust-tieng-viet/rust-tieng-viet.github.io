# [`chrono`]

[`chrono`] có hầu hết mọi thứ giúp bạn xử lý dates và times. [`chrono_tz`] không được ship bên trong [`chrono`] vì lý do binary size nên chúng ta có thể cài đặt riêng nếu cần thiết.

File: Cargo.toml

```toml
[dependencies]
chrono = "*"
chrono-tz = "*"
```

Ví dụ:

```rust
use chrono::prelude::*;

let utc: DateTime<Utc> = Utc::now();
println!("{}", utc);
````

Ví dụ:

```rust
use chrono::prelude::*;

let dt: DateTime<Local> = Local::now();

println!("{}", dt); 
// 2024-06-20 09:05:39.051849711 +00:00

println!("{}", dt.format("%A, %B %e, %Y %r")); 
// Thursday, June 20, 2024 09:06:36 AM

println!("year = {}", dt.year());
// year = 2024
```

Khởi tạo naive datetime và convert thành timezone-aware datetime

```rust,no_run
use chrono::{TimeZone, NaiveDate};
use chrono_tz::Asia::Ho_Chi_Minh;

let naive_dt = NaiveDate::from_ymd(2038, 1, 19).and_hms(3, 14, 08);
let tz_aware = Ho_Chi_Minh.from_local_datetime(&naive_dt).unwrap();
println!("{}", tz_aware.to_string());
```

## Parse datetime

```rust
use chrono::prelude::*;

// method 1
let dt = "2014-11-28T12:00:09Z".parse::<DateTime<Utc>>();

println!("{:?}", dt);
```


`DateTime::parse_from_str`:

```rust
use chrono::prelude::*;

let dt = DateTime::parse_from_str("2014-11-28 21:00:09 +09:00", "%Y-%m-%d %H:%M:%S %z");
println!("{:?}", dt);
```

`DateTime::parse_from_rfc2822`, `DateTime::parse_from_rfc3339`, etc:

```rust
use chrono::prelude::*;

let dt = DateTime::parse_from_rfc2822("Tue, 1 Jul 2003 10:52:37 +0200");
println!("{:?}", dt);
```

## Documentation

Xem [docs.rs](https://docs.rs/chrono/latest/chrono/) nhiều ví dụ hơn và API reference.

[`chrono`]: https://crates.io/crates/chrono
[`chrono_tz`]: https://crates.io/crates/chrono_tz