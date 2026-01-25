const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');

dotenv.config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: 'Invalid Login Credentials'
      });
    }

    // Password check (enable if hashes exist)
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(400).json({ message: 'Password is incorrect!' });
    // }

    const userDTO = {
      username: user.username,
      name: user.name,
      id: user.id,
      isSenior: user.isSenior
    };

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Login Successful',
      user: userDTO
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = login;
