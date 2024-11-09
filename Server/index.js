import express from 'express';
import mysql from 'mysql2/promise'; // Use mysql2/promise for async/await
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import session from'express-session';

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());

app.use(cors({
  origin: process.env.ORIGIN, // Allow only specific frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  credentials: true // Enable cookies and other credentials
}));
app.use(cookieParser());

// Create a MySQL connection pool
const pool = mysql.createPool({
  // host: process.env.DB_HOST || 'localhost',
  // user: process.env.DB_USER || 'root',
  // password: process.env.DB_PASSWORD || '',
  // database: process.env.DB_NAME || 'vrms', // Replace with your DB name
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // Replace with your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Check Database Connection
pool.getConnection()
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

const JWT_SECRET = process.env.JWT_SECRET;
// console.log(JWT_SECRET)
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log(req.cookies.token); // This should print the token if it's set correctly

  if (!token) return res.status(403).json({ message: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};


// Customer Login Route
app.post('/customer_login', async (req, res) => {
  const {c_no, c_password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM customer WHERE c_no = ? AND c_password = ?', [c_no, c_password]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    console.log(user)
    const token = jwt.sign({ c_no: user.c_no, c_name: user.c_name,role:user.c_roll }, JWT_SECRET, { expiresIn: '1h' });
    console.log(token);
    res.cookie('token', token, { httpOnly: true, secure: false, path: '/', sameSite: 'Lax' });
    res.status(200).json({ message: 'Login successful', user: { name: user.c_name },token});
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Customer Register Route
app.post('/customer_register', async (req, res) => {
  const { c_no, c_name, c_aadhar, c_lic_no, c_DOB, c_state, c_city, c_street, c_pin, c_email, c_gender, c_password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM customer WHERE c_no = ?', [c_no]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await pool.query(
      'INSERT INTO customer (c_no, c_name, c_lic_no, c_DOB, c_aadhar, c_email, c_state, c_city, c_street, c_pin, c_gender, c_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [c_no, c_name, c_lic_no, c_DOB, c_aadhar, c_email, c_state, c_city, c_street, c_pin, c_gender, c_password]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//owner login
app.post('/owner_login', async (req, res) => {
  const { number, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM owner WHERE o_no = ? AND o_password = ?', [number, password]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    const token = jwt.sign({ o_no: user.o_no, o_name: user.o_name,role:user.o_roll }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Owner Register Route
app.post('/owner_register', async (req, res) => {
  const { o_no, o_name, o_aadhar, o_DOB, o_state, o_city, o_street, o_pin, o_email, o_gender, o_password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM owner WHERE o_no = ?', [o_no]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await pool.query(
      'INSERT INTO owner (o_no, o_name, o_DOB, o_aadhar, o_email, o_state, o_city, o_street, o_pin, o_gender, o_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [o_no, o_name, o_DOB, o_aadhar, o_email, o_state, o_city, o_street, o_pin, o_gender, o_password]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//admin login
app.post('/admin', async (req, res) => {
  const { number, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM admin WHERE a_no = ? AND a_password = ?', [number, password]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    const token = jwt.sign({ a_no: user.a_no, a_name: user.a_name,role:user.a_roll }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
);


//get all the data of vehicle
app.get('/vehicles', async (req, res) => {
    try {
        // Extract query parameters from the request
        const { vehicleType, color, priceRange, pickUp } = req.query;
        console.log(vehicleType+" "+color+" "+priceRange+" "+pickUp);

        // SQL query with the base structure for vehicle, owner, and driver details
        let sqlQuery = `
            SELECT 
                v.v_name,
                v.v_image,
                v.v_type,
                v.v_color,
                v.v_insurance,
                v.v_rto,
                v.v_mileage,
                v.v_engine_type,
                v.v_pay,
                o.o_name,
                o.o_no,
                o.o_street,
                o.o_driver_count
            FROM 
                vehicle v
            JOIN 
                owner o ON v.o_no = o.o_no  -- Join vehicle with owner
            WHERE 1 = 1
        `;

        // Array to hold conditions and query parameters
        const conditions = [];
        const queryParams = [];

        // Dynamically build query based on provided filters
        if (vehicleType) {
            conditions.push(`v.v_type = ?`);
            queryParams.push(vehicleType);
        }
        if (color) {
            conditions.push(`v.v_color = ?`);
            queryParams.push(color);
        }
        if (priceRange) {
            conditions.push(`v.v_pay <= ?`);
            queryParams.push(priceRange);
        }
        if (pickUp) {
            conditions.push(`o.o_street = ?`);
            queryParams.push(pickUp);
        }

        // Add conditions to the query if any exist
        if (conditions.length > 0) {
            sqlQuery += ` AND ${conditions.join(' AND ')}`;
        }

        // Execute the query with the provided query parameters
        const [rows] = await pool.execute(sqlQuery, queryParams);
        console.log(rows[0]); // Log the first row for debugging

        // Send response back to the client
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ message: 'Error fetching vehicles' });
    }
});

//to get the alloted driver 
app.get('/book/driver/:insuranceId', verifyToken, async (req, res) => {
  const insuranceId = req.params.insuranceId; // Updated from req.query to req.params
   console.log(req.user.c_no);
  // Check if insuranceId is provided
  if (!insuranceId) {
    return res.status(400).json({ error: 'Insurance ID is required' });
  }

  try {
    // Query to find drivers and vehicle details based on specified vehicle insurance
    const [rows] = await pool.query(
      `
      SELECT 
          v.v_name,
          v.v_pay,
          v.v_image,
          v.v_desp,
          v.v_rto,
          d.d_no,
          d.d_name,
          o.o_street,
          o.o_name,
          o.o_no
      FROM 
          vehicle v
      JOIN 
          owner o ON v.o_no = o.o_no    -- Join vehicle with owner
      LEFT JOIN
          driver d ON d.o_no = o.o_no    -- Left join with driver to include driver details even if not assigned
      WHERE 
          v.v_insurance = ?
      `,
      [insuranceId]
    );

    const Data = {
      customerNumber: req.user.c_no, // Access customer number from the decoded token
      detail: rows[0] // Include the drivers and vehicle information fetched from the database
    };

    console.log({Data});

    // Send the result as JSON
    res.json(Data);

  } catch (error) {
    console.error('Error fetching drivers:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching drivers' });
  }
});


//to get all the drivers
app.get('/alldriver', verifyToken, async (req, res) => {
    try {
        // Query all drivers
        const [data] = await pool.query('SELECT * FROM driver'); 
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching drivers:", error);
        res.status(500).json({ message: 'An error occurred while fetching drivers.' });
    }
});

//to get all customer
app.get('/allcustomer', verifyToken, async (req, res) => {
    try {
        // Query all customer
        const [data] = await pool.query('SELECT * FROM customer'); 
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ message: 'An error occurred while fetching customer.' });
    }
});

//to get all owner
app.get('/allowner', verifyToken, async (req, res) => {
    try {
        // Query all customer
        const [data] = await pool.query('SELECT * FROM owner'); 
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching owner:", error);
        res.status(500).json({ message: 'An error occurred while fetching owner.' });
    }
});

//all get all booking
// Get all bookings
app.get('/allbooking', verifyToken, async (req, res) => {
    try {
        // Query to retrieve all bookings
        const [data] = await pool.query('SELECT * FROM booking'); 
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: 'An error occurred while fetching bookings.' });
    }
});


//all payment detail
app.get('/allpayment', verifyToken, async (req, res) => {
    try {
        // Query all customer
        const [data] = await pool.query('SELECT * FROM admin_payment'); 
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching payment:", error);
        res.status(500).json({ message: 'An error occurred while fetching payment.' });
    }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} ${process.env.DB_NAME}`);
});
