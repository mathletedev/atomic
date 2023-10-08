use dotenv::dotenv;
use rand::Rng;
use std::env;
use std::net::SocketAddr;

use axum::{routing::get, Router};
use axum_login::{
	axum_sessions::{async_session::MemoryStore, SessionLayer},
	secrecy::SecretVec,
	AuthLayer, AuthUser, PostgresStore,
};
use sqlx::postgres::PgPoolOptions;

#[derive(Debug, Default, Clone, sqlx::FromRow)]
struct User {
	id: i64,
	email: String,
	password: String,
}

impl AuthUser<i64> for User {
	fn get_id(&self) -> i64 {
		self.id
	}
	fn get_password_hash(&self) -> SecretVec<u8> {
		SecretVec::new(self.password.clone().into())
	}
}

async fn root() -> String {
	String::from("Hello, world!")
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
	dotenv().ok();

	let secret = rand::thread_rng().gen::<[u8; 64]>();

	let session_store = MemoryStore::new();
	let session_layer = SessionLayer::new(session_store, &secret).with_secure(false);

	let pool = PgPoolOptions::new()
		.max_connections(4)
		.connect(&env::var("DATABASE_URL")?)
		.await?;

	let user_store = PostgresStore::<User>::new(pool.clone());
	let auth_layer = AuthLayer::new(user_store, &secret);

	let app = Router::new().route("/", get(root));

	let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
	axum::Server::bind(&addr)
		.serve(app.into_make_service())
		.await?;

	Ok(())
}
