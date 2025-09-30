import app from "./startup";

const PORT = process.env.PORT || 12212;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});