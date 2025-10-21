# config

[`config`](https://github.com/mehcode/config-rs) là một library mạnh mẽ để quản lý configuration trong Rust applications. Nó hỗ trợ đọc config từ nhiều nguồn khác nhau (files, environment variables, command line) và merge chúng lại theo thứ tự ưu tiên.

## Đặc điểm

- 📁 **Multi-format** - JSON, TOML, YAML, INI, RON, JSON5
- 🔄 **Layered configs** - Merge từ nhiều nguồn
- 🌍 **Environment variables** - Override config với env vars
- 🎯 **Type-safe** - Deserialize vào Rust structs
- ⚙️ **Flexible** - Custom sources và formats

## Cài đặt

```toml
[dependencies]
config = "0.14"
serde = { version = "1.0", features = ["derive"] }
```

Hoặc:

```bash
cargo add config
cargo add serde --features derive
```

## Ví dụ cơ bản

### File config: `config.toml`

```toml
[database]
host = "localhost"
port = 5432
username = "admin"
password = "secret"

[server]
host = "0.0.0.0"
port = 8080
workers = 4

[logging]
level = "info"
```

### Code

```rust
use config::{Config, ConfigError, File};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Database {
    host: String,
    port: u16,
    username: String,
    password: String,
}

#[derive(Debug, Deserialize)]
struct Server {
    host: String,
    port: u16,
    workers: u8,
}

#[derive(Debug, Deserialize)]
struct Logging {
    level: String,
}

#[derive(Debug, Deserialize)]
struct Settings {
    database: Database,
    server: Server,
    logging: Logging,
}

fn main() -> Result<(), ConfigError> {
    let settings = Config::builder()
        .add_source(File::with_name("config"))
        .build()?;

    let settings: Settings = settings.try_deserialize()?;

    println!("{:#?}", settings);

    Ok(())
}
```

## Nhiều file config (Environments)

```rust
use config::{Config, ConfigError, File, Environment};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Settings {
    debug: bool,
    database: DatabaseSettings,
}

#[derive(Debug, Deserialize)]
struct DatabaseSettings {
    url: String,
}

fn main() -> Result<(), ConfigError> {
    let run_mode = std::env::var("RUN_MODE").unwrap_or_else(|_| "development".into());

    let settings = Config::builder()
        // Start with default config
        .add_source(File::with_name("config/default"))
        // Layer on environment-specific values
        .add_source(File::with_name(&format!("config/{}", run_mode)).required(false))
        // Layer on local config (ignored by git)
        .add_source(File::with_name("config/local").required(false))
        // Add environment variables (with a prefix of APP and separator of __)
        .add_source(Environment::with_prefix("APP").separator("__"))
        .build()?;

    let settings: Settings = settings.try_deserialize()?;

    println!("{:#?}", settings);

    Ok(())
}
```

File structure:
```
config/
├── default.toml      # Base config
├── development.toml  # Development overrides
├── production.toml   # Production overrides
└── local.toml        # Local overrides (gitignored)
```

**`config/default.toml`:**
```toml
debug = false

[database]
url = "postgres://localhost/myapp"
```

**`config/development.toml`:**
```toml
debug = true

[database]
url = "postgres://localhost/myapp_dev"
```

**`config/production.toml`:**
```toml
[database]
url = "postgres://prod-server/myapp"
```

## Environment Variables Override

```bash
# Override config với environment variables
export APP__DEBUG=true
export APP__DATABASE__URL="postgres://custom-host/db"

cargo run
```

Pattern: `PREFIX__SECTION__KEY`

## Nhiều format config

### JSON

```json
{
  "server": {
    "port": 8080,
    "host": "localhost"
  }
}
```

```rust
let settings = Config::builder()
    .add_source(File::with_name("config.json"))
    .build()?;
```

### YAML

```yaml
server:
  port: 8080
  host: localhost
```

```rust
let settings = Config::builder()
    .add_source(File::with_name("config.yaml"))
    .build()?;
```

### Hoặc auto-detect format:

```rust
// Sẽ tự động detect .json, .yaml, .toml, etc.
let settings = Config::builder()
    .add_source(File::with_name("config"))
    .build()?;
```

## Set default values

```rust
use config::{Config, ConfigError};

fn main() -> Result<(), ConfigError> {
    let settings = Config::builder()
        .set_default("server.port", 8080)?
        .set_default("server.host", "127.0.0.1")?
        .set_default("debug", false)?
        .add_source(File::with_name("config").required(false))
        .build()?;

    Ok(())
}
```

## Nested configuration

```rust
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Settings {
    database: DatabaseSettings,
    cache: CacheSettings,
    api: ApiSettings,
}

#[derive(Debug, Deserialize)]
struct DatabaseSettings {
    primary: ConnectionSettings,
    replica: Option<ConnectionSettings>,
}

#[derive(Debug, Deserialize)]
struct ConnectionSettings {
    host: String,
    port: u16,
    pool_size: u32,
}

#[derive(Debug, Deserialize)]
struct CacheSettings {
    redis_url: String,
    ttl: u64,
}

#[derive(Debug, Deserialize)]
struct ApiSettings {
    key: String,
    timeout: u64,
}
```

**config.toml:**
```toml
[database.primary]
host = "db-primary.example.com"
port = 5432
pool_size = 20

[database.replica]
host = "db-replica.example.com"
port = 5432
pool_size = 10

[cache]
redis_url = "redis://localhost:6379"
ttl = 3600

[api]
key = "your-api-key"
timeout = 30
```

## Validation

```rust
use config::{Config, ConfigError};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Settings {
    port: u16,
    workers: u8,
}

impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        let settings = Config::builder()
            .add_source(File::with_name("config"))
            .build()?;

        let mut settings: Settings = settings.try_deserialize()?;

        // Validate
        if settings.workers == 0 {
            return Err(ConfigError::Message("workers must be > 0".into()));
        }

        if settings.port < 1024 {
            return Err(ConfigError::Message("port must be >= 1024".into()));
        }

        Ok(settings)
    }
}

fn main() -> Result<(), ConfigError> {
    let settings = Settings::new()?;
    println!("{:#?}", settings);
    Ok(())
}
```

## Ví dụ thực tế: Web application config

```rust
use config::{Config, ConfigError, File, Environment};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Settings {
    pub server: ServerSettings,
    pub database: DatabaseSettings,
    pub redis: RedisSettings,
    pub logging: LoggingSettings,
}

#[derive(Debug, Deserialize)]
pub struct ServerSettings {
    pub host: String,
    pub port: u16,
    pub workers: usize,
    pub keep_alive: u64,
}

#[derive(Debug, Deserialize)]
pub struct DatabaseSettings {
    pub url: String,
    pub max_connections: u32,
    pub min_connections: u32,
    pub connect_timeout: u64,
}

#[derive(Debug, Deserialize)]
pub struct RedisSettings {
    pub url: String,
    pub pool_size: u32,
}

#[derive(Debug, Deserialize)]
pub struct LoggingSettings {
    pub level: String,
    pub format: String,
}

impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        let env = std::env::var("APP_ENV").unwrap_or_else(|_| "development".into());

        let config = Config::builder()
            // Defaults
            .set_default("server.host", "127.0.0.1")?
            .set_default("server.port", 8080)?
            .set_default("server.workers", 4)?
            .set_default("server.keep_alive", 75)?
            .set_default("logging.level", "info")?
            .set_default("logging.format", "json")?
            // Base config
            .add_source(File::with_name("config/default"))
            // Environment-specific
            .add_source(File::with_name(&format!("config/{}", env)).required(false))
            // Local overrides
            .add_source(File::with_name("config/local").required(false))
            // Environment variables
            .add_source(Environment::with_prefix("APP").separator("__"))
            .build()?;

        config.try_deserialize()
    }
}

fn main() -> Result<(), ConfigError> {
    let settings = Settings::new()?;

    println!("Server: {}:{}", settings.server.host, settings.server.port);
    println!("Database: {}", settings.database.url);
    println!("Redis: {}", settings.redis.url);
    println!("Logging: {} ({})", settings.logging.level, settings.logging.format);

    Ok(())
}
```

**config/default.toml:**
```toml
[database]
max_connections = 100
min_connections = 10
connect_timeout = 30

[redis]
url = "redis://127.0.0.1:6379"
pool_size = 10
```

**config/production.toml:**
```toml
[server]
host = "0.0.0.0"
workers = 8

[database]
url = "postgres://prod-db:5432/myapp"
max_connections = 200

[logging]
level = "warn"
```

## Integration với web frameworks

### Actix-web

```rust
use actix_web::{web, App, HttpServer};
use config::{Config, ConfigError};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
struct Settings {
    server: ServerConfig,
}

#[derive(Debug, Deserialize, Clone)]
struct ServerConfig {
    host: String,
    port: u16,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = Config::builder()
        .add_source(config::File::with_name("config"))
        .build()
        .unwrap();

    let settings: Settings = config.try_deserialize().unwrap();
    let server_config = settings.server.clone();

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(settings.clone()))
    })
    .bind((server_config.host, server_config.port))?
    .run()
    .await
}
```

## Best Practices

### 1. Separate configs by environment

```
config/
├── default.toml         # Shared defaults
├── development.toml     # Dev settings
├── production.toml      # Prod settings
└── local.toml          # Local overrides (gitignore)
```

### 2. Use environment variables for secrets

```rust
// ❌ Không lưu secrets trong file
[database]
password = "secret123"

// ✅ Dùng environment variable
export APP__DATABASE__PASSWORD="secret123"
```

### 3. Validate config at startup

```rust
impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        let settings = /* load config */;

        // Validate early
        settings.validate()?;

        Ok(settings)
    }

    fn validate(&self) -> Result<(), ConfigError> {
        if self.server.workers == 0 {
            return Err(ConfigError::Message("workers must be > 0".into()));
        }
        Ok(())
    }
}
```

### 4. Document your config

```rust
/// Application settings
#[derive(Debug, Deserialize)]
pub struct Settings {
    /// Server configuration
    pub server: ServerSettings,
    /// Database configuration
    pub database: DatabaseSettings,
}

/// Server settings
#[derive(Debug, Deserialize)]
pub struct ServerSettings {
    /// Bind address (default: 127.0.0.1)
    pub host: String,
    /// Bind port (default: 8080)
    pub port: u16,
}
```

## Tổng kết

config-rs là lựa chọn tốt cho configuration management:
- ✅ Multi-format support (JSON, TOML, YAML...)
- ✅ Layered configuration (defaults → files → env vars)
- ✅ Type-safe với serde
- ✅ Environment-specific configs
- ✅ Easy to test

Best practices:
1. Separate by environment
2. Use env vars for secrets
3. Validate early
4. Provide sensible defaults
5. Document your config structure

## References

- [config-rs Documentation](https://docs.rs/config/)
- [config-rs GitHub](https://github.com/mehcode/config-rs)
- [12-Factor App Config](https://12factor.net/config)
