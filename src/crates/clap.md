# clap

[`clap`](https://github.com/clap-rs/clap) (Command Line Argument Parser) là một trong những library phổ biến nhất để xây dựng command-line interfaces (CLI) trong Rust. Clap giúp parse arguments, generate help messages, và validate input một cách dễ dàng.

## Đặc điểm

- 🎯 **Dễ sử dụng** - Derive macros cho simple APIs
- ✅ **Type-safe** - Compile-time validation
- 📝 **Auto-generated help** - Beautiful help messages
- 🔧 **Flexible** - Builder pattern hoặc derive macros
- 🚀 **Feature-rich** - Subcommands, validation, custom types...

## Cài đặt

```toml
[dependencies]
clap = { version = "4.5", features = ["derive"] }
```

Hoặc:

```bash
cargo add clap --features derive
```

## Ví dụ cơ bản: Derive API

```rust
use clap::Parser;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Name of the person to greet
    #[arg(short, long)]
    name: String,

    /// Number of times to greet
    #[arg(short, long, default_value_t = 1)]
    count: u8,
}

fn main() {
    let args = Args::parse();

    for _ in 0..args.count {
        println!("Hello {}!", args.name);
    }
}
```

Sử dụng:

```bash
$ cargo run -- --help
Simple program to greet a person

Usage: myapp [OPTIONS] --name <NAME>

Options:
  -n, --name <NAME>    Name of the person to greet
  -c, --count <COUNT>  Number of times to greet [default: 1]
  -h, --help          Print help
  -V, --version       Print version

$ cargo run -- --name Rust
Hello Rust!

$ cargo run -- --name Rust --count 3
Hello Rust!
Hello Rust!
Hello Rust!
```

## Arguments Types

### Required Arguments

```rust
use clap::Parser;

#[derive(Parser)]
struct Args {
    /// Required argument
    name: String,
}
```

### Optional Arguments

```rust
use clap::Parser;

#[derive(Parser)]
struct Args {
    /// Optional argument
    #[arg(short, long)]
    name: Option<String>,
}

fn main() {
    let args = Args::parse();

    match args.name {
        Some(name) => println!("Hello {}", name),
        None => println!("Hello stranger!"),
    }
}
```

### Flags (Boolean)

```rust
use clap::Parser;

#[derive(Parser)]
struct Args {
    /// Enable verbose mode
    #[arg(short, long)]
    verbose: bool,

    /// Enable debug mode
    #[arg(short, long)]
    debug: bool,
}

fn main() {
    let args = Args::parse();

    if args.verbose {
        println!("Verbose mode enabled");
    }

    if args.debug {
        println!("Debug mode enabled");
    }
}
```

### Multiple Values

```rust
use clap::Parser;

#[derive(Parser)]
struct Args {
    /// Input files
    #[arg(short, long, num_args = 1..)]
    files: Vec<String>,
}

fn main() {
    let args = Args::parse();

    for file in args.files {
        println!("Processing: {}", file);
    }
}
```

Sử dụng:

```bash
$ cargo run -- --files file1.txt file2.txt file3.txt
Processing: file1.txt
Processing: file2.txt
Processing: file3.txt
```

## Subcommands

```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(author, version, about)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Add a new item
    Add {
        /// Name of the item
        name: String,
    },
    /// List all items
    List,
    /// Remove an item
    Remove {
        /// ID of the item to remove
        id: u32,
    },
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Add { name } => {
            println!("Adding: {}", name);
        }
        Commands::List => {
            println!("Listing all items...");
        }
        Commands::Remove { id } => {
            println!("Removing item with ID: {}", id);
        }
    }
}
```

Sử dụng:

```bash
$ cargo run -- add --help
Add a new item

Usage: myapp add <NAME>

Arguments:
  <NAME>  Name of the item

$ cargo run -- add "New Item"
Adding: New Item

$ cargo run -- list
Listing all items...

$ cargo run -- remove 123
Removing item with ID: 123
```

## Value Validation

### Possible Values

```rust
use clap::Parser;

#[derive(Parser)]
struct Args {
    /// Log level
    #[arg(short, long, value_parser = ["debug", "info", "warn", "error"])]
    level: String,
}
```

### Custom Validation

```rust
use clap::Parser;

fn validate_port(s: &str) -> Result<u16, String> {
    let port: u16 = s.parse()
        .map_err(|_| format!("`{}` isn't a valid port number", s))?;

    if port < 1024 {
        return Err("Port must be >= 1024".to_string());
    }

    Ok(port)
}

#[derive(Parser)]
struct Args {
    /// Port number (must be >= 1024)
    #[arg(short, long, value_parser = validate_port)]
    port: u16,
}
```

### Range Validation

```rust
use clap::Parser;

#[derive(Parser)]
struct Args {
    /// Number of threads (1-16)
    #[arg(short, long, value_parser = clap::value_parser!(u8).range(1..=16))]
    threads: u8,
}
```

## Enum Arguments

```rust
use clap::{Parser, ValueEnum};

#[derive(Copy, Clone, PartialEq, Eq, PartialOrd, Ord, ValueEnum)]
enum Mode {
    /// Fast mode
    Fast,
    /// Normal mode
    Normal,
    /// Slow but accurate mode
    Accurate,
}

#[derive(Parser)]
struct Args {
    /// Processing mode
    #[arg(short, long, value_enum)]
    mode: Mode,
}

fn main() {
    let args = Args::parse();

    match args.mode {
        Mode::Fast => println!("Running in fast mode"),
        Mode::Normal => println!("Running in normal mode"),
        Mode::Accurate => println!("Running in accurate mode"),
    }
}
```

## Environment Variables

```rust
use clap::Parser;

#[derive(Parser)]
struct Args {
    /// API token
    #[arg(short, long, env = "API_TOKEN")]
    token: String,
}
```

Sử dụng:

```bash
$ export API_TOKEN=abc123
$ cargo run

# Hoặc
$ cargo run -- --token abc123
```

## Configuration Files

Kết hợp clap với `config` crate:

```rust
use clap::Parser;
use serde::Deserialize;

#[derive(Parser)]
struct Args {
    /// Config file path
    #[arg(short, long, default_value = "config.toml")]
    config: String,

    /// Override host from config
    #[arg(long)]
    host: Option<String>,
}

#[derive(Deserialize)]
struct Config {
    host: String,
    port: u16,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    // Load config file
    let config_content = std::fs::read_to_string(&args.config)?;
    let mut config: Config = toml::from_str(&config_content)?;

    // Override with CLI args if provided
    if let Some(host) = args.host {
        config.host = host;
    }

    println!("Host: {}", config.host);
    println!("Port: {}", config.port);

    Ok(())
}
```

## Ví dụ thực tế: File processor

```rust
use clap::{Parser, Subcommand};
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "fileproc")]
#[command(about = "A file processing tool", long_about = None)]
struct Cli {
    /// Enable verbose output
    #[arg(short, long, global = true)]
    verbose: bool,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Convert file format
    Convert {
        /// Input file
        #[arg(short, long, value_name = "FILE")]
        input: PathBuf,

        /// Output file
        #[arg(short, long, value_name = "FILE")]
        output: PathBuf,

        /// Output format
        #[arg(short, long, value_parser = ["json", "yaml", "toml"])]
        format: String,
    },
    /// Validate file
    Validate {
        /// File to validate
        file: PathBuf,
    },
}

fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Convert { input, output, format } => {
            if cli.verbose {
                println!("Converting {} to {}", input.display(), output.display());
                println!("Format: {}", format);
            }
            // Conversion logic here
        }
        Commands::Validate { file } => {
            if cli.verbose {
                println!("Validating {}", file.display());
            }
            // Validation logic here
        }
    }
}
```

## So sánh với các ngôn ngữ khác

### Python (argparse)

```python
import argparse

parser = argparse.ArgumentParser(description='Simple program to greet')
parser.add_argument('--name', type=str, required=True, help='Name to greet')
parser.add_argument('--count', type=int, default=1, help='Number of times')

args = parser.parse_args()

for _ in range(args.count):
    print(f"Hello {args.name}!")
```

### Node.js (commander)

```javascript
const { program } = require('commander');

program
  .option('--name <name>', 'Name to greet')
  .option('--count <number>', 'Number of times', 1)
  .parse();

const options = program.opts();

for (let i = 0; i < options.count; i++) {
  console.log(`Hello ${options.name}!`);
}
```

**Ưu điểm của clap:**
- Type-safe at compile time
- Auto-generated help messages
- Better error messages
- No runtime type checking needed

## Best Practices

### 1. Sử dụng derive API cho simple cases

```rust
// ✅ Tốt - simple và clear
#[derive(Parser)]
struct Args {
    #[arg(short, long)]
    name: String,
}
```

### 2. Group related options

```rust
#[derive(Parser)]
struct Args {
    #[command(flatten)]
    database: DatabaseArgs,

    #[command(flatten)]
    server: ServerArgs,
}

#[derive(Args)]
struct DatabaseArgs {
    #[arg(long)]
    db_host: String,

    #[arg(long)]
    db_port: u16,
}

#[derive(Args)]
struct ServerArgs {
    #[arg(long)]
    server_port: u16,
}
```

### 3. Provide good help text

```rust
#[derive(Parser)]
#[command(about = "A comprehensive description of your tool")]
struct Args {
    /// Name of the user (used for personalization)
    #[arg(short, long, help = "Your full name")]
    name: String,
}
```

### 4. Use enums for fixed choices

```rust
// ✅ Tốt - type safe
#[derive(ValueEnum)]
enum LogLevel {
    Debug,
    Info,
    Warn,
    Error,
}

// ❌ Tránh - string validation at runtime
// level: String
```

## Advanced Features

### Custom Help Template

```rust
use clap::Parser;

#[derive(Parser)]
#[command(help_template = "\
{before-help}{name} {version}
{author-with-newline}{about-with-newline}
{usage-heading} {usage}

{all-args}{after-help}
")]
struct Args {
    name: String,
}
```

### Argument Groups

```rust
use clap::{ArgGroup, Parser};

#[derive(Parser)]
#[command(group(
    ArgGroup::new("output")
        .required(true)
        .args(["json", "yaml"]),
))]
struct Args {
    #[arg(long)]
    json: bool,

    #[arg(long)]
    yaml: bool,
}
```

## Tổng kết

clap là lựa chọn tốt nhất cho CLI development trong Rust:
- ✅ Type-safe và compile-time validation
- ✅ Auto-generated help messages
- ✅ Flexible (derive hoặc builder API)
- ✅ Rich feature set
- ✅ Great error messages

Ecosystem:
- `clap` - Core library
- `clap_complete` - Shell completion generation
- `clap_mangen` - Man page generation

## References

- [clap Documentation](https://docs.rs/clap/)
- [clap GitHub](https://github.com/clap-rs/clap)
- [clap Examples](https://github.com/clap-rs/clap/tree/master/examples)
- [Derive Reference](https://docs.rs/clap/latest/clap/_derive/index.html)
