require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });


// Define the schema for a Person
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  favoriteFoods: {
    type: [String]
  }
});

// Create the model from the schema
const Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  const personData = {
    name: 'John Doe',
    age: 30,
    favoriteFoods: ['Pizza', 'Sushi']
  };

  const newPerson = new Person(personData);

  newPerson.save((err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const createManyPeople = (peopleArray, done) => {
  Person.create(peopleArray, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const findPeopleByName = (name, done) => {
  Person.find({ name: name }, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, person) => {
    if (err) {
      return done(err);
    }

    if (!person) {
      return done(new Error('Person not found'));
    }

    // Add "hamburger" to the person's favoriteFoods
    person.favoriteFoods.push(foodToAdd);

    // Save the updated person
    person.save((err, updatedPerson) => {
      if (err) {
        return done(err);
      }
      return done(null, updatedPerson);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const options = { new: true }; // To return the updated document

  Person.findOneAndUpdate(
    { name: personName }, // Search criteria
    { age: 20 }, // Update age to 20
    options, // Options to return the updated document
    (err, updatedPerson) => {
      if (err) {
        return done(err);
      }
      return done(null, updatedPerson);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.deleteMany({ name: nameToRemove }, (err, result) => {
    if (err) {
      return done(err);
    }
    return done(null, result);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch }) // Find people who like the specified food
    .sort({ name: 1 }) // Sort by name in ascending order
    .limit(2) // Limit the results to 2 documents
    .select('-age') // Exclude the age field
    .exec((err, data) => {
      if (err) {
        return done(err);
      }
      return done(null, data);
    });
};

removeManyPeople((err, result) => {
  if (err) {
    console.error('Error removing people:', err);
  } else {
    console.log('People removed successfully:', result);
  }
});

queryChain((err, data) => {
  if (err) {
    console.error('Error querying people:', err);
  } else {
    console.log('Query results:', data);
  }
});

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
