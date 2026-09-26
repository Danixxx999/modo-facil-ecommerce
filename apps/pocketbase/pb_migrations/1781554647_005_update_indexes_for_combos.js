migrate((app) => {
  const collection = app.findCollectionByNameOrId("combos");
  collection.indexes.push("CREATE UNIQUE INDEX idx_combos_slug ON combos (slug)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("combos");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_combos_slug"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
