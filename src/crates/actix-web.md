# actix-web

[`actix-web`](https://actix.rs/) là một powerful, pragmatic và extremely fast web framework cho Rust. Được xây dựng trên nền tảng [`actix`](https://actix.rs/) actor framework, actix-web là một trong những web framework nhanh nhất theo benchmark.

## Đặc điểm

- ⚡ **Cực kỳ nhanh** - Thường xuyên top đầu các benchmark web frameworks
- 🔒 **Type-safe** - Tận dụng type system của Rust
- 🚀 **Async/await** - Built-in async support
- 🔧 **Flexible** - Middleware, extractors, routing mạnh mẽ
- 🛠️ **Batteries included** - WebSocket, HTTP/2, TLS, compression...

## Cài đặt

```toml
[dependencies]
actix-web = "4"
tokio = { version = "1", features = ["full"] }
```

Hoặc:

```bash
cargo add actix-web
cargo add tokio --features full
```

## Ví dụ cơ bản: Hello World

```rust
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello World!")
}

#[get("/hello/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
    HttpResponse::Ok().body(format!("Hello {}!", name))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Server chạy tại http://localhost:8080");

    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(greet)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

Chạy và test:

```bash
cargo run

# Terminal khác:
curl http://localhost:8080/
# Hello World!

curl http://localhost:8080/hello/Rust
# Hello Rust!
```

## Routing

### Route với nhiều HTTP methods

```rust
use actix_web::{get, post, put, delete, web, HttpResponse};

#[get("/users")]
async fn get_users() -> HttpResponse {
    HttpResponse::Ok().json(vec!["user1", "user2"])
}

#[post("/users")]
async fn create_user() -> HttpResponse {
    HttpResponse::Created().json("User created")
}

#[put("/users/{id}")]
async fn update_user(id: web::Path<u32>) -> HttpResponse {
    HttpResponse::Ok().json(format!("Updated user {}", id))
}

#[delete("/users/{id}")]
async fn delete_user(id: web::Path<u32>) -> HttpResponse {
    HttpResponse::Ok().json(format!("Deleted user {}", id))
}
```

### Route parameters

```rust
use actix_web::{get, web, HttpResponse};
use serde::Deserialize;

// Path parameters
#[get("/posts/{id}")]
async fn get_post(id: web::Path<u32>) -> HttpResponse {
    HttpResponse::Ok().json(format!("Post ID: {}", id))
}

// Multiple path parameters
#[get("/posts/{id}/comments/{comment_id}")]
async fn get_comment(path: web::Path<(u32, u32)>) -> HttpResponse {
    let (post_id, comment_id) = path.into_inner();
    HttpResponse::Ok().json(format!("Post {}, Comment {}", post_id, comment_id))
}

// Query parameters
#[derive(Deserialize)]
struct Pagination {
    page: Option<u32>,
    limit: Option<u32>,
}

#[get("/posts")]
async fn list_posts(query: web::Query<Pagination>) -> HttpResponse {
    let page = query.page.unwrap_or(1);
    let limit = query.limit.unwrap_or(10);
    HttpResponse::Ok().json(format!("Page {}, Limit {}", page, limit))
}
```

## JSON và Request/Response

```rust
use actix_web::{post, web, HttpResponse};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct CreateUserRequest {
    username: String,
    email: String,
}

#[derive(Serialize)]
struct UserResponse {
    id: u32,
    username: String,
    email: String,
}

#[post("/users")]
async fn create_user(user: web::Json<CreateUserRequest>) -> HttpResponse {
    // Process user data
    let response = UserResponse {
        id: 1,
        username: user.username.clone(),
        email: user.email.clone(),
    };

    HttpResponse::Created().json(response)
}
```

Test với curl:

```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"username":"duyet","email":"me@duyet.net"}'
```

## State Management

Shared application state:

```rust
use actix_web::{get, web, App, HttpResponse, HttpServer};
use std::sync::Mutex;

struct AppState {
    counter: Mutex<i32>,
}

#[get("/count")]
async fn get_count(data: web::Data<AppState>) -> HttpResponse {
    let count = data.counter.lock().unwrap();
    HttpResponse::Ok().json(*count)
}

#[get("/increment")]
async fn increment(data: web::Data<AppState>) -> HttpResponse {
    let mut count = data.counter.lock().unwrap();
    *count += 1;
    HttpResponse::Ok().json(*count)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        counter: Mutex::new(0),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .service(get_count)
            .service(increment)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## Middleware

### Custom Middleware

```rust
use actix_web::{dev::ServiceRequest, Error, HttpMessage};
use actix_web::middleware::Logger;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    HttpServer::new(|| {
        App::new()
            // Logger middleware
            .wrap(Logger::default())
            // CORS
            .wrap(
                actix_cors::Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .service(hello)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## Error Handling

```rust
use actix_web::{get, web, HttpResponse, ResponseError};
use std::fmt;

#[derive(Debug)]
enum MyError {
    NotFound,
    InternalError,
}

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MyError::NotFound => write!(f, "Resource not found"),
            MyError::InternalError => write!(f, "Internal server error"),
        }
    }
}

impl ResponseError for MyError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        match self {
            MyError::NotFound => actix_web::http::StatusCode::NOT_FOUND,
            MyError::InternalError => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

#[get("/users/{id}")]
async fn get_user(id: web::Path<u32>) -> Result<HttpResponse, MyError> {
    if *id == 0 {
        return Err(MyError::NotFound);
    }

    Ok(HttpResponse::Ok().json(format!("User {}", id)))
}
```

## Database Integration (với sqlx)

```toml
[dependencies]
actix-web = "4"
sqlx = { version = "0.7", features = ["runtime-tokio-native-tls", "postgres"] }
serde = { version = "1.0", features = ["derive"] }
```

```rust
use actix_web::{get, web, App, HttpResponse, HttpServer};
use sqlx::{PgPool, postgres::PgPoolOptions};
use serde::Serialize;

#[derive(Serialize, sqlx::FromRow)]
struct User {
    id: i32,
    username: String,
}

#[get("/users")]
async fn get_users(pool: web::Data<PgPool>) -> HttpResponse {
    let users = sqlx::query_as::<_, User>("SELECT id, username FROM users")
        .fetch_all(pool.get_ref())
        .await;

    match users {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://user:password@localhost/db")
        .await
        .expect("Failed to create pool");

    let pool_data = web::Data::new(pool);

    HttpServer::new(move || {
        App::new()
            .app_data(pool_data.clone())
            .service(get_users)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## WebSocket

```rust
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;

struct MyWebSocket;

impl actix::Actor for MyWebSocket {
    type Context = ws::WebsocketContext<Self>;
}

impl actix::StreamHandler<Result<ws::Message, ws::ProtocolError>> for MyWebSocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(msg)) => ctx.pong(&msg),
            Ok(ws::Message::Text(text)) => ctx.text(format!("Echo: {}", text)),
            Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            _ => (),
        }
    }
}

async fn ws_index(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, actix_web::Error> {
    ws::start(MyWebSocket {}, &req, stream)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().route("/ws/", web::get().to(ws_index))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{test, App};

    #[actix_web::test]
    async fn test_hello() {
        let app = test::init_service(App::new().service(hello)).await;
        let req = test::TestRequest::get().uri("/").to_request();
        let resp = test::call_service(&app, req).await;

        assert!(resp.status().is_success());
    }

    #[actix_web::test]
    async fn test_greet() {
        let app = test::init_service(App::new().service(greet)).await;
        let req = test::TestRequest::get().uri("/hello/Rust").to_request();
        let resp: String = test::read_body_json(test::call_service(&app, req).await).await;

        assert_eq!(resp, "Hello Rust!");
    }
}
```

## So sánh với framework khác

### Python (FastAPI)

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def hello():
    return {"message": "Hello World"}

@app.get("/hello/{name}")
def greet(name: str):
    return {"message": f"Hello {name}"}
```

### Node.js (Express)

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/hello/:name', (req, res) => {
  res.send(`Hello ${req.params.name}!`);
});

app.listen(8080);
```

**Ưu điểm của actix-web:**
- Nhanh hơn 5-10x so với FastAPI/Express
- Type safety tại compile time
- Memory safe (no null pointer, data races)
- Low resource usage

## Performance Tips

1. **Sử dụng connection pooling cho database**
2. **Enable compression middleware**
3. **Configure worker threads:**

```rust
HttpServer::new(|| App::new())
    .workers(4)  // Số lượng workers
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
```

4. **Use `web::Data` thay vì `Arc` trực tiếp**

## Tổng kết

actix-web là lựa chọn tuyệt vời cho:
- ✅ High-performance APIs
- ✅ Real-time applications (WebSocket)
- ✅ Microservices
- ✅ RESTful APIs
- ✅ Production-ready web services

Ecosystem phong phú:
- `actix-web` - Web framework
- `actix-cors` - CORS middleware
- `actix-session` - Session management
- `actix-files` - Static file serving
- `actix-web-actors` - WebSocket support

## References

- [actix-web Documentation](https://actix.rs/docs/)
- [actix-web GitHub](https://github.com/actix/actix-web)
- [actix-web Examples](https://github.com/actix/examples)
- [Benchmarks](https://www.techempower.com/benchmarks/)
