migrate((app) => {
  const email = $os.getenv("PB_SUPERUSER_EMAIL");
  const password = $os.getenv("PB_SUPERUSER_PASSWORD");

  if (!email || !password) {
    console.log("PB_SUPERUSER_EMAIL/PB_SUPERUSER_PASSWORD not set; skipping superuser bootstrap");
    return;
  }

  const superusers = app.findCollectionByNameOrId("_superusers");
  const record = new Record(superusers);
  record.set("email", email);
  record.set("password", password);
  app.save(record);
});
