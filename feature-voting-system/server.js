const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const dbPath = path.join(__dirname, 'voting_system.db');
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'voting-system-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Serve static files from web-frontend directory
app.use(express.static(path.join(__dirname, 'web-frontend')));

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

app.post('/login', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  db.get('SELECT id, username FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.session.userId = user.id;
    res.json({ user_id: user.id, username: user.username });
  });
});

app.get('/features', (req, res) => {
  const query = `
    SELECT
      f.id,
      f.title,
      f.description,
      f.created_at,
      u.username as creator,
      COUNT(v.id) as vote_count
    FROM features f
    LEFT JOIN users u ON f.user_id = u.id
    LEFT JOIN votes v ON f.id = v.feature_id
    GROUP BY f.id, f.title, f.description, f.created_at, u.username
    ORDER BY vote_count DESC, f.created_at DESC
  `;

  db.all(query, [], (err, features) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(features);
  });
});

app.post('/features', requireAuth, (req, res) => {
  const { title, description } = req.body;
  const userId = req.session.userId;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    'INSERT INTO features (title, description, user_id) VALUES (?, ?, ?)',
    [title, description || '', userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({
        id: this.lastID,
        title,
        description: description || '',
        user_id: userId
      });
    }
  );
});

app.post('/features/:id/vote', requireAuth, (req, res) => {
  const featureId = req.params.id;
  const userId = req.session.userId;

  db.get('SELECT id FROM features WHERE id = ?', [featureId], (err, feature) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    db.run(
      'INSERT INTO votes (feature_id, user_id) VALUES (?, ?)',
      [featureId, userId],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Already voted for this feature' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        res.status(201).json({ message: 'Vote added successfully' });
      }
    );
  });
});

app.delete('/features/:id/vote', requireAuth, (req, res) => {
  const featureId = req.params.id;
  const userId = req.session.userId;

  db.run(
    'DELETE FROM votes WHERE feature_id = ? AND user_id = ?',
    [featureId, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Vote not found' });
      }

      res.json({ message: 'Vote removed successfully' });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});