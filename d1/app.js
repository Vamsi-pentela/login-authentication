const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));


const users = [];


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json('login sucess fully ')

    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        users.push(newUser);
        
      
        res.status(201);
        res.sendFile(path.join(__dirname, 'public', 'login.html'));

    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});



app.get('/message', (req, res) => {
    res.send('Hello world! I am Vamsi, how are you?');
});


app.listen(5000, () => {
    console.log('Server running on port 5000.......');
});
