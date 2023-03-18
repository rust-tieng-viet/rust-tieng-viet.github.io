fn get_id_from_name(name: &str) -> Option<i32> {
    if !name.starts_with('d') {
        return None;
    }

    Some(123)
}

fn main() {
    let name = "duyet";

    match get_id_from_name(name) {
        Some(id) => println!("User = {}", id),
        _ => println!("Not found"),
    }
}
