migrate((app) => {
  const email = $os.getenv("PB_ADMIN_EMAIL");
  const password = $os.getenv("PB_ADMIN_PASSWORD");

  if (!email || !password) {
    console.log("PB_ADMIN_EMAIL/PB_ADMIN_PASSWORD not set; skipping storefront admin bootstrap");
    return;
  }

  const collection = app.findCollectionByNameOrId("admins");

  try {
    app.findFirstRecordByData("admins", "email", email);
    console.log("Storefront admin already exists; skipping bootstrap");
    return;
  } catch (_) {
    // Expected when the record does not exist yet.
  }

  const record = new Record(collection);
  record.set("email", email);
  record.setPassword(password);
  record.set("name", $os.getenv("PB_ADMIN_NAME") || "Admin");
  record.set("role", "Dueño");
  app.save(record);
}, (app) => {
  const email = $os.getenv("PB_ADMIN_EMAIL");
  if (!email) return;

  try {
    const record = app.findFirstRecordByData("admins", "email", email);
    app.delete(record);
  } catch (_) {
    // Nothing to revert.
  }
});
