migrate((app) => {
  const settings = app.settings();
  settings.meta.appName = "Modo Fácil";
  settings.meta.appURL = $os.getenv("PB_PUBLIC_URL") || "http://127.0.0.1:8090";
  settings.meta.hideControls = false;
  settings.logs.maxDays = 7;
  settings.logs.minLevel = 8;
  settings.logs.logIP = false;
  app.save(settings);
});
