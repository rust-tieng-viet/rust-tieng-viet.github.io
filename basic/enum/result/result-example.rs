fn get_id_from_name(name: &str) -> Result<i32, &str> {
    if !name.starts_with('d') {
        return Err("not found");
    }

    Ok(123)
}

fn main() -> Result<(), &'static str> {
    let name = "duyet";

    match get_id_from_name(name) {
        Ok(id) => println!("User = {}", id),
        Err(e) => println!("Error: {}", e),
    };

    Ok(())
}
