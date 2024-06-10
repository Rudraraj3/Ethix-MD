<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WP Bot Homepage</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }

    header {
      background-color: #007bff;
      color: white;
      padding: 20px;
      text-align: center;
    }

    .container {
      max-width: 800px;
      margin: 20px auto;
      padding: 0 20px;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .info {
      padding: 20px;
      margin-top: 20px;
      border-top: 1px solid #ddd;
    }

    .deploy-buttons {
      margin-top: 20px;
      text-align: center;
    }

    .deploy-button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 0 10px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <header>
    <h1>WP Bot</h1>
    <p>Your all-in-one WhatsApp chatbot solution</p>
  </header>
  <div class="container">
    <h2>About</h2>
    <p>WP Bot is a powerful chatbot designed to enhance your WhatsApp experience. It offers a wide range of features to make your messaging more productive and enjoyable.</p>
    <h2>Project Statistics</h2>
    <div class="info">
      <p>Forks: <span id="forks">0</span></p>
      <p>Stars: <span id="stars">0</span></p>
      <p>Watchers: <span id="watchers">0</span></p>
    </div>
    <div class="deploy-buttons">
      <a href="https://heroku.com/deploy" class="deploy-button">Deploy to Heroku</a>
      <a href="https://clever-cloud.com" class="deploy-button">Deploy to Clever Cloud</a>
    </div>
  </div>

  <script>
    // Fetch GitHub repository statistics
    fetch('https://api.github.com/repos/Ethix-Xsid/Ethix-MD')
      .then(response => response.json())
      .then(data => {
        document.getElementById('forks').innerText = data.forks;
        document.getElementById('stars').innerText = data.stargazers_count;
        document.getElementById('watchers').innerText = data.watchers_count;
      })
      .catch(error => console.error('Error fetching GitHub repository statistics:', error));
  </script>
</body>
</html>
