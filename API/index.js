const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('./Models/User');
const { Post } = require('./Models/Posts');
const cookieParser = require('cookie-parser');
const Story = require('./Models/Story');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

const app = express();
const secret = bcrypt.genSaltSync(10);
const jwtSecret = 'jejnfnhdbfsbndkfaslnfabsdkjda';
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//profile Picture storing 
const ProfilePic = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: ProfilePic });

//Define multer storage configurations
const PostUpload = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Posts/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

// Set up multer middleware
const Postsupload = multer({ storage: PostUpload }).array('image', 3);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).send({ message: "Invalid JSON payload" });
  } else {
    next();
  }
});
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));

app.get('/test', (req, res) => {
  res.json('test Ok');
});

mongoose.connect(process.env.MONGO_URL);

// authentication middleware
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.use(['/Stories','/allPosts',  '/Settings', '/deleteAccount', '/updateProfile', '/getImage/:userId', '/Profile', '/Post'], authenticateUser);

app.post('/SignUp', async (req, res) => {
  const { name, phoneNumber, email, username, password } = req.body;

  try {
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
          return res.status(409).json({ message: "User already exists with the same email or username." });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Make sure you use a constant salt round

      const userDoc = await User.create({
          name,
          phone: phoneNumber,
          username,
          email,
          password: hashedPassword,
      });

      const result = userDoc.toObject();
      delete result.password;

      res.status(201).json(result);
  } catch (e) {
      console.error('Signup Error:', e);
      res.status(500).json({ message: "Internal server error", error: e.message });
  }
});

app.post('/SignIn', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: 'Email/Username and password are required.' });
  }

  try {
    let userDoc;

    if (emailOrUsername.includes('@')) {
      userDoc = await User.findOne({ email: emailOrUsername });
    } else {
      userDoc = await User.findOne({ username: emailOrUsername });
    }

    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatches = await bcrypt.compare(password, userDoc.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { email: userDoc.email, username: userDoc.username, id: userDoc._id },
      jwtSecret,
      { expiresIn: '1h' } // Optional: specify a token expiration
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    }).json({ User: userDoc });

  } catch (error) {
    console.error('SignIn Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/Stories', async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId).populate('following');

    const followingIds = currentUser.following.map(user => User._id);

    const stories = await Story.find({ author: { $in: followingIds } }).populate('author', 'name');

    res.json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/search', async (req, res) => {
  const { username } = req.query;
  try {
    const users = await User.find({
      username: { $regex: username, $options: 'i' }
    }).select('-password');
    console.log(users); // Debugging line
    res.json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).send('Internal server error');
  }
});


app.get('/Settings', async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const userSettings = await User.findById(currentUserId).select('-password')

    res.json(userSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

app.delete('/deleteAccount', async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use('/profile', (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Token is invalid' });
    }
    req.user = decoded; // Attach decoded token to request
    next();
  });
});
app.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    const { name, email, _id, username, bio, image, followers, following } = user;
    res.json({ name, email, _id, username, bio, image, followers, following });
  } catch (error) {
    console.error('Error fetching user profile from token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/user/:userId', async (req, res) => {
 
  try {
    const { username } = req.params;
    const user = await User.findOne( {username} );
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal server error');
  }
});


app.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/Profile/:userId/posts', authenticateUser, async (req, res) => {
  try {
    const userId = req.params.userId; 
    

    const posts = await Post.find({ createdBy: userId })
      .lean() 
      .exec(); 

    posts.forEach(post => {
      post.media.forEach(mediaItem => {
        mediaItem.url = `http://localhost:4000/Posts/${mediaItem.fileId}`;
      });
    });

    res.json(posts); // Send the posts back to the client
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});app.post('/createPost', authenticateUser, Postsupload, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    const { description, alt } = req.body;
    const media = req.files.map(file => ({
      fileId: file.filename,
      type: 'image',  // Assuming all uploads are images
      url: `/${file.filename}`
    }));

    if (media.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newPost = new Post({
      createdBy: req.user.id,
      username: req.user.username,
      caption: description,
      alt: alt,
      media: media
    });

    await newPost.save();
    res.status(200).json({ message: 'Post created successfully', postId: newPost._id });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
app.get('/', async (req, res) => {
  try {
      const posts = await Post.find()
          .populate('createdBy', 'username image')
          .lean();
      posts.forEach(post => {
          if (post.createdBy && post.createdBy.image) {
              post.createdBy.imageUrl = `http://localhost:4000/Uploads/${post.createdBy.image}`;
          } else {
              post.createdBy.imageUrl = 'path/to/default/image.jpg';
          }
          post.media = post.media.map(mediaItem => {
              return {
                  ...mediaItem,
                  url: `http://localhost:4000/Posts/${mediaItem.fileId}` // Ensure mediaItem is treated as an object
              };
          });
      });
      res.json(posts);
  } catch (error) {
      console.error('Failed to fetch posts:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


app.use('/Uploads', express.static('Uploads'));
app.post('/posts/:postId/like', authenticateUser, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;  // Ensuring you get user ID from the authenticated user

  try {
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Check if the user has already liked the post
      const index = post.likes.indexOf(userId);
      if (index === -1) {
          // User hasn't liked the post yet, add them to the likes array
          post.likes.push(userId);
      } else {
          // User has liked the post, remove them from the likes array
          post.likes.splice(index, 1);
      }

      await post.save();
      res.json({ likes: post.likes.length, likedByUser: index === -1 });
  } catch (error) {
      console.error('Like/Unlike Error:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


app.get('/getImagePosts', (req,res)=>{
  try{

  }catch(error){

  }
})
// Route to handle following/unfollowing a user
app.post('/followUser', authenticateUser, async (req, res) => {
  const { currentUserId, followUserId } = req.body;

  if (!currentUserId || !followUserId) {
      return res.status(400).json({ message: 'Both user IDs are required.' });
  }

  try {
      const currentUser = await User.findById(currentUserId);
      const userToFollow = await User.findById(followUserId);

      if (!currentUser || !userToFollow) {
          return res.status(404).json({ message: 'One or both users not found' });
      }

      // Check if already following
      if (currentUser.following.includes(followUserId)) {
          // Remove followUserId from currentUser's following list (unfollow action)
          currentUser.following.pull(followUserId);
          userToFollow.followers.pull(followUserId)
          await currentUser.save();
          return res.status(200).json({ message: 'User unfollowed successfully' });
      } else {
          // Add followUserId to currentUser's following list (follow action)
          currentUser.following.push(followUserId);
          await currentUser.save();
          return res.status(200).json({ message: 'User followed successfully' });
      }
  } catch (error) {
      console.error('Error in followUser:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Endpoint to get user's following list
app.get('/user/:userId/following', authenticateUser, async (req, res) => {
  try {
      const user = await User.findById(req.params.userId).populate('following', 'username image _id');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.following);
  } catch (error) {
      console.error('Error fetching following list:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Endpoint to get user's followers list
app.get('/user/:userId/followers', authenticateUser, async (req, res) => {
  try {
      const user = await User.findById(req.params.userId).populate('followers', 'username image _id');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.followers);
  } catch (error) {
      console.error('Error fetching followers list:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


app.get(`/getImage/:userId`, authenticateUser, (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized - No User ID provided' });
  }
  
  User.findById(userId)
    .then(user => {
      if (!user) {
        console.error(`No user found with ID ${userId}`);
        return res.status(404).json({ message: 'User not found' });
      }
      if (!user.image) {
        console.error(`User ${userId} has no image specified`);
        return res.status(404).json({ message: 'User image not found' });
      }

      const filePath = path.join(__dirname, '/Uploads', user.image);
      res.sendFile(filePath, err => {
        if (err) {
          console.error(`Error sending file '${filePath}':`, err.message);
          res.status(500).json({ message: 'Internal server error' });
        }
      });
    })
    .catch(err => {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});


app.get('/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).lean(); // Use `.lean()` for performance if you don't need a mongoose document

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Assuming `post.media` contains filenames Astored in 'Posts' directory
    post.media = post.media.map(mediaItem => {
      return { ...mediaItem, url: `http://localhost:4000/Posts/${mediaItem.fileId}` };
    });

    res.json(post); 
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.use('/Posts', express.static('Posts'));

app.put('/updateProfile', upload.single('profileImage'), async (req, res) => {
  const { name, username, bio, email } = req.body;
  const userId = req.user.id; // Assuming user ID is available from authentication middleware

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Update user details
      user.name = name;
      user.username = username;
      user.bio = bio;
      user.email = email;

      // Handle profile image
      if (req.file) {
          user.image = req.file.filename; // Save or update the filename in user's document
      }

      await user.save();
      res.status(200).json({ message: "Profile updated successfully", user: { name, username, bio, email, image: user.image } });
  } catch (error) {
      console.error('Update Profile Error:', error);
      res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});
app.get('/allPosts', async (req, res) => {
  try {
      const posts = await Post.find()
          .populate('createdBy', 'username image') // Assuming 'image' is the field where image filename is stored
          .lean();

      const postsWithImages = await Promise.all(posts.map(async post => {
          if (post.createdBy && post.createdBy.image) {
              // Assume you store images in a public directory accessible via a static URL
              post.media = post.media.map(mediaItem => {
                return {
                    ...mediaItem,
                    url: `http://localhost:4000/Posts/${mediaItem.fileId}` // Ensure mediaItem is treated as an object
                };
            });
          } else {
              post.createdBy.imageUrl = 'path/to/default/profile.jpg'; // Provide a default image path
          }
          return post;
      }));

      res.json(postsWithImages);
  } catch (error) {
      console.error('Failed to fetch posts:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/Tags', async (req, res) => {
  res.json('Tags');
});

app.get('/SignOut', async (req, res) => {
  res.clearCookie('token').json('signed out successfully');
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).send({ message: "Invalid JSON payload" });
  } else {
    next();
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

