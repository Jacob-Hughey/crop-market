const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const port = process.env.port || 3000;
const app = express();
app.use(cors());
app.use(express.json());

//import schemas here
const userSchema = require('./schema/userSchema.js');
const farmerSchema = require("./schema/farmerSchema.js");
const serviceProviderSchema = require("./schema/serviceProviderSchema.js");
const serviceSchema = require("./schema/serviceSchema.js");
const cropSchema = require("./schema/cropSchema.js");
const reviewSchema = require("./schema/reviewSchema.js");
const User = mongoose.model('user', userSchema, 'user');
const Farmer = mongoose.model('farmer', farmerSchema, 'farmer');
const ServiceProvider = mongoose.model('service_provider', serviceProviderSchema, 'service_provider');
const Service = mongoose.model('service', serviceSchema, 'service');
const Crop = mongoose.model('crop', cropSchema, 'crop');
const Review = mongoose.model('review', reviewSchema, 'review');

const connectionString = 'mongodb+srv://cropAdmin:theCropMarket@cluster0.gjru1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", express.static("public"));

const connector = mongoose.connect(connectionString);

app.get("/api/allusers", async (req, res) => {
  let users = await connector.then(async () => {
    return await User.find();
  });

  if (!users) {
    res.status(400).json({ response: 'No users found' });
  }
  else {
    res.status(200).json({ response: users });
  }
});

app.get("/api/allItems", async (req, res) => {
  let type = req.query.type;
  let items;
  if (type == "Service") {
    items = await connector.then(async () => {
      return await Service.find();
    });
  }
  else {
    items = await connector.then(async () => {
      return await Crop.find();
    });
  }

  if (!items) {
    res.status(400).json({ response: 'No items found' });
  }
  else {
    res.status(200).json({ response: items });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await connector.then(async () => {
    return await User.findOne({ username: email });
  });

  if (!user) {
    res.status(400).json({
      response: 'User not found',
    });
  }
  else {
    if (bcrypt.compare(password, user.password)) {
      res.status(200).json({ 
        response: "success",
        userId: user.user_id,
        type: user.type
       });
    }
    else {
      res.status(400).json({
        response: 'Validation failed'
      });
    }
  }
});

app.get("/api/farmers", async (req, res) => {
  let locationParam = req.query.location;
  let farmers = await connector.then(async () => {
    if (locationParam === undefined) {
      return await Farmer.find();
    }
    else {
      return await Farmer.find({location: {$regex: locationParam, $options: 'i'}});
    }
  });
  if (!farmers) {
    res.status(400).json({ response: 'No farmers found' });
  }
  else {
    res.status(200).json({ response: farmers });
  }
});

app.get("/api/service-providers", async (req, res) => {
  let locationParam = req.query.location;
  let serviceProviders = await connector.then(async () => {
    if (locationParam === undefined) {
      return await ServiceProvider.find();
    }
    else {
      return await ServiceProvider.find({location: {$regex: locationParam, $options: 'i'}});
    }
  });
  if (!serviceProviders) {
    res.status(400).json({ response: 'No service providers found' });
  }
  else {
    res.status(200).json({ response: serviceProviders });
  }
});

app.post("/api/signup", async (req, res) => {
  let { email, password, type, name } = req.body;
  let salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);

  let userId = mongoose.Types.ObjectId();
  let user = await connector.then(async () => {
    return new User({
      username: email,
      password: password,
      type: type,
      name: name,
      user_id: userId
    }).save();
  });

  if (!user) {
    res.status(400).json({
      response: 'User creation error',
    })
  }
  else {
    let userType;
    if (type == 'Farmer') {
      userType = await connector.then(async () => {
        return new Farmer({
          farmer_id: userId,
          name: name,
          description: 'Update your description!',
          location: 'Enter a location!',
          contact: 'Enter your contact information here'
        }).save();
      });
    }
    else if (type == 'Service Provider') {
      userType = await connector.then(async () => {
        return new ServiceProvider({
          provider_id: userId,
          name: name,
          description: 'Update your description!',
          location: 'Enter a location!',
          contact: 'Enter your contact information here'
        }).save();
      });
    }

    if (!userType) {
      res.status(400).json({ response: "failure in creating user type"});
    }
    res.status(200).json({ 
      response: "success",
      userId: userId,
      type: type
    });
  }
});

app.post("/api/addDesire", async (req, res) => {
  let { userId, type, desire } = req.body;
  let desires, user;
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
  }
  if (!user) {
    res.status(400).json({
      response: "user not found"
    });
  }
  
  desires = user.desires;
  desires.push(desire);
  user.desires = desires;
  await user.save();
  res.status(200).json({
    response: "success"
  });
});

app.post("/api/updateDescription", async (req, res) => {
  let { userId, type, description } = req.body;
  let user;
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
  }
  if (!user) {
    res.status(400).json({
      response: "user not found"
    });
  }
  user.description = description;
  await user.save();
  res.status(200).json({
    response: "success"
  });
});

app.post("/api/updateLocation", async (req, res) => {
  let { userId, type, location } = req.body;
  let user;
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
  }
  if (!user) {
    res.status(400).json({
      response: "user not found"
    });
  }
  user.location = location;
  await user.save();
  res.status(200).json({
    response: "success"
  });
});

app.post("/api/updateContact", async (req, res) => {
  let { userId, type, contact } = req.body;
  let user;
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
  }
  if (!user) {
    res.status(400).json({
      response: "user not found"
    });
  }
  user.contact = contact;
  await user.save();
  res.status(200).json({
    response: "success"
  });
});

app.post("/api/addItem", async (req, res) => {
  let { userId, type, item } = req.body;
  let user, newItem, allItems;
  let itemId = mongoose.Types.ObjectId();
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
    if (!user) {
      res.status(400).json({
        response: "user not found"
      });
    }
    newItem = await connector.then(async () => {
      return new Service({
        service_id: itemId,
        name: item,
        user_id: userId
      }).save();
    });
    if (!newItem) {
      res.status(400).json({
        response: "error creating new item"
      });
    }
    allItems = user.services;
    allItems.push(newItem);
    user.services = allItems;
    await user.save();
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
    if (!user) {
      res.status(400).json({
        response: "user not found"
      });
    }
    newItem = await connector.then(async () => {
      return new Crop({
        crop_id: itemId,
        name: item,
        user_id: userId
      }).save();
    });
    if (!newItem) {
      res.status(400).json({
        response: "error creating new item"
      });
    }
    allItems = user.crops;
    allItems.push(newItem);
    user.crops = allItems;
    await user.save();
  }
  res.status(200).json({
    response: "success"
  });
});

app.get("/api/getUser", async (req, res) => {
  let userId = req.query.userId;
  let type = req.query.type;
  let user;
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
  }

  if (user) {
    res.status(200).json({
      response: "success",
      user: user
    });
  }
  else {
    res.status(400).json({
      response: "user not found"
    });
  }
});

app.get("/api/getItems", async (req, res) => {
  let userId = req.query.userId;
  let type = req.query.type;
  let user, items;
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
    if (user) {
      items = (await Service.find().where('_id').in(user.services));
    }
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
    if (user) {
      items = (await Crop.find().where('_id').in(user.crops));
    }
  }

  if (user) {
    res.status(200).json({
      items: items
    });
  }
  else {
    res.status(400).json({
      response: "user not found"
    });
  }
});

app.post("/api/addReview", async (req, res) => {
  let { userId, type, name, rating, description } = req.body;
  let user, newReview, allReviews;
  let reviewId = mongoose.Types.ObjectId();
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
    if (!user) {
      res.status(400).json({
        response: "user not found"
      });
    }
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
    if (!user) {
      res.status(400).json({
        response: "user not found"
      });
    }
  }

  newReview = await connector.then(async () => {
    return new Review({
      review_id: reviewId,
      name: name, 
      rating: rating,
      description: description
    }).save();
  });
  if (!newReview) {
    res.status(400).json({
      response: "error creating new review"
    });
  }
  allReviews = user.reviews;
  allReviews.push(newReview);
  user.reviews = allReviews;
  if (user.reviews.length == 1) {
    user.rating = rating;
  }
  else {
    let totalRating = 0;
    for (let i = 0; i < user.reviews.length; i++) {
      thisRating = (await Review.find().where('_id').in(user.reviews[i]));
      totalRating += thisRating[0].rating;
    }
    totalRating = (totalRating / user.reviews.length).toFixed(2);
    user.rating = totalRating;
  }
  await user.save();
  res.status(200).json({
    response: "success"
  });
});

app.get("/api/getReviews", async (req, res) => {
  let userId = req.query.userId;
  let type = req.query.type;
  let user, reviews;
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
    if (user) {
      reviews = (await Review.find().where('_id').in(user.reviews));
    }
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
    if (user) {
      reviews = (await Review.find().where('_id').in(user.reviews));
    }
  }

  if (user) {
    res.status(200).json({
      reviews: reviews
    });
  }
  else {
    res.status(400).json({
      response: "user not found"
    });
  }
});

app.get("/api/itemName", async (req, res) => {
  let itemId = req.query.itemId;
  let type = req.query.type;
  let item, itemName;
  if (type == "Service") {
    item = await connector.then(async () => {
      return await Service.findOne({ _id: itemId });
    });
  }
  else {
    item = await connector.then(async () => {
      return await Crop.findOne({ _id: itemId });
    });
  }
  if (!item) {
    res.status(400).json({
      response: "item not found"
    });
  }

  itemName = item.name;
  res.status(200).json({
    response: "success",
    name: itemName
  });
});

app.post("/api/removeItem", async (req, res) => {
  let { userId, type, itemId } = req.body;
  let allItems, user;
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
    if (!user) {
      res.status(400).json({
        response: "user not found"
      });
    }
    await Service.findOneAndRemove({ _id: itemId });
    allItems = user.services;
    for (var i = 0; i < allItems.length; i++) {
      if (allItems[i] == itemId) {
        allItems.splice(i, 1);
        i--;
      }
    }
    user.services = allItems;
    await user.save();
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
    if (!user) {
      res.status(400).json({
        response: "user not found"
      });
    }
    await Crop.findOneAndRemove({ _id: itemId });
    allItems = user.crops;
    for (var i = 0; i < allItems.length; i++) {
      if (allItems[i] == itemId) {
        allItems.splice(i, 1);
        i--;
      }
    }
    user.crops = allItems;
    await user.save();
  }
  res.status(200).json({
    response: "success"
  });
});

app.post("/api/removeDesire", async (req, res) => {
  let { userId, type, desire } = req.body;
  let allDesires, user;
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
    if (!user) {
      res.status(400).json({
        response: "user not found"
      });
    }
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
    if (!user) {
      res.status(400).json({
        response: "user not found"
      });
    }
  }
  allDesires = user.desires;
  for (var i = 0; i < allDesires.length; i++) {
    if (allDesires[i] == desire) {
      allDesires.splice(i, 1);
      i--;
    }
  }
  user.desires = allDesires;
  await user.save();
  res.status(200).json({
    response: "success"
  });
});

app.get("/api/getDesires", async (req, res) => {
  let userId = req.query.userId;
  let type = req.query.type;
  let user, desires;
  if (type == "Service Provider") {
    user = await connector.then(async () => {
      return await ServiceProvider.findOne({ provider_id : userId });
    });
  }
  else {
    user = await connector.then(async () => {
      return await Farmer.findOne({ farmer_id : userId });
    });
  }

  if (user) {
    desires = user.desires;
    res.status(200).json({
      desires: desires
    });
  }
  else {
    res.status(400).json({
      response: "user not found"
    });
  }
});

app.get("/api/findCrops", async (req, res) => {
  let searchQuery = req.query.crop;
  let crops;
  crops = await connector.then(async () => {
    return await Crop.find({name: {$regex: searchQuery, $options: 'i'}});
  });

  if (crops) {
    res.status(200).json({
      crops: crops
    });
  }
  else {
    res.status(400).json({
      response: "no crops found"
    });
  }
});

app.get("/api/findServices", async (req, res) => {
  let searchQuery = req.query.service;
  let services;
  services = await connector.then(async () => {
    return await Service.find({name: {$regex: searchQuery, $options: 'i'}});
  });

  if (services) {
    res.status(200).json({
      services: services
    });
  }
  else {
    res.status(400).json({
      response: "no services found"
    });
  }
});

app.listen(port, () => {
  console.log(`Server on port ${port}`);
});

module.exports = {
  app,
};
