use std::net::SocketAddr;

use axum::{routing::get, Router};
use sqlx::postgres::PgPoolOptions;

async fn root() -> String {
	String::from("Hello, world!")
}

#[tokio::main]
async fn main() {
	let pool = PgPoolOptions::new()
		.max_connections(4)
		.connect("postgres://user:password@localhost/atomic")
		.await
		.unwrap();

	let app = Router::new().route("/", get(root));

	let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
	axum::Server::bind(&addr)
		.serve(app.into_make_service())
		.await
		.unwrap();
}
