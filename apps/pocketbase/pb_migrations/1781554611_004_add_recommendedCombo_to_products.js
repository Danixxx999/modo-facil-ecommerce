migrate((app) => {
  const combosCollection = app.findCollectionByNameOrId("combos");
  const collection = app.findCollectionByNameOrId("products");

  const existing = collection.fields.getByName("recommendedCombo");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("recommendedCombo"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "recommendedCombo",
    collectionId: combosCollection.id
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("products");
    collection.fields.removeByName("recommendedCombo");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
