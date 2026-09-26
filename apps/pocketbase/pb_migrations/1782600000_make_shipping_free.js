migrate((app) => {
  const collection = app.findCollectionByNameOrId("settings");

  try {
    const records = app.findAllRecords(collection);
    for (const record of records) {
      record.set("shippingCost", 0);
      if (collection.fields.getByName("shippingFee")) {
        record.set("shippingFee", 0);
      }
      app.save(record);
    }
  } catch (error) {
    console.log("No settings records to normalize yet");
  }
});
