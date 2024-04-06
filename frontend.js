const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001; // Default to port 3000 if PORT is not set in the environment

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

