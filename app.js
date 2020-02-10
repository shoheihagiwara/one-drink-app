const express = require('express');
const bodyParser = require('body-parser');
//const bcrypt = require('bcrypt-nodejs');
//const cors = require('cors');
const knex = require('knex');
const { execSync } = require('child_process');
const uuid = require('uuid/v4')

// set config vars. if production, use environmet vars. if not, it's dev env.
const PORT = process.env.PORT || 3000
const DB_URL = process.env.DATABASE_URL || 'postgres://shohei:shohei@localhost:5432/one_drink_app'

/*
console.log("before: ", DB_URL)
if (!DB_URL) {
    execSync('heroku config:get DATABASE_URL -a one-drink-app', (err, stdout, stderr) => {
        console.log("here")
        console.log(err, stdout, stderr);
        DB_URL = 'abc'
    });
}
console.log("after: ", DB_URL)
*/

const db = knex({
  client: 'pg',
  connection: DB_URL,
  debug: true
});

const app = express();

//app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("It worked!");
});

// GET /location?my_id=XXX
app.get('/location', (req, res) => {
  db
    .select('*')
    .from('session')
    .then(rows => {
      console.log(rows);

      res.send(rows)
    })
})

app.post('/location', (req, res) => {
  const { name, latitude, altitude } = req.body
  db
    .insert({
      name: name,
      altitude: altitude,
      latitude: latitude
    })
    .into('session')
    .returning('*')
    .then(rows => {
      res.send(rows);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json('unable to register...')
    })
})


app.delete('/delete_old', (req, res) => {
  db('session')
    .where('timestamp', '<', knex.raw("current_timestamp - interval '10 minutes'"))
    .del()
    .then(() => {
      const msg = "Deleted old locations.";
      res.send(msg);
      console.log(msg);
    })
})

const aliceId = uuid()
const bobId = uuid()

// get all or newer messages associated with users
app.get('/messages', (req, res) => {
  const { me, them, last = "" } = req.query
  console.log("url: ", req.url);
  console.log(`me, them, last: [${me}] [${them}] [${last}]`);

  if (typeof me === 'undefined' || me === ""
    || typeof them === 'undefined' || them === "") {
    res.status(400).json('Invalid paramter(s).')
  } else {
    let query = db.select('text')
      .from('messages')
      .whereIn('user1', [me, them])
      .whereIn('user2', [me, them])
      .orderBy('sent_at', 'asc')

    // if last specified, make sub query to get all messages AFTER the message
    if (last !== "") {
      let subQuery = db.select('sent_at')
        .from('messages')
        .where('id', '=', last)
      query.where('sent_at', '>', subQuery)
    }

    query.then(rows => {
      res.json(rows);
    });
  }
})


app.post('/message', (req, res) => {
  const { me, them, text } = req.body;
  console.log("url: ", req.url);
  console.log(`me, them: [${me}] [${them}]`);

  db
    .insert({
      text: text,
      user1: me,
      user2: them
    })
    .into('messages')
    .returning('*')
    .then(row => {
      res.json(row);
    });
});

/*
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})
*/

/*
app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})
*/

app.listen(PORT, () => {
  console.log('app is running on port 3000');
})
