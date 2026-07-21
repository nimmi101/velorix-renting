import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle.js';
import Package from './models/Package.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const vehiclesData = [
  {
    name: 'S-Class',
    brand: 'Mercedes-Benz',
    category: 'Luxury',
    type: 'With Driver',
    seats: 4,
    transmission: 'Automatic',
    fuel: 'Hybrid',
    ac: true,
    luggage: 3,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689398/velorix/misc/xor3tvpxpwuh9ldrwve3.jpg',
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689399/velorix/misc/vt9gve4doeptycwdiv7h.jpg'
    ],
    pricePerDay: 350,
    pricePerKm: 2.5,
    driverChargesPerDay: 50,
    securityDeposit: 500,
    minDuration: 1,
    maxDuration: 14,
    features: ['Plush Leather Seats', 'Panoramic Sunroof', 'Rear Seat Entertainment', 'Ambient Lighting', 'Soft Close Doors'],
    pickupLocations: ['Airport Terminal 1', 'Main City Office', 'Luxury Hotel Desk'],
    ratings: 4.9,
    reviewsCount: 12
  },
  {
    name: 'X5',
    brand: 'BMW',
    category: 'SUV',
    type: 'Both',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    ac: true,
    luggage: 4,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689400/velorix/misc/xo4mhfs7jrvf8rbazsci.jpg'
    ],
    pricePerDay: 250,
    pricePerKm: 1.8,
    driverChargesPerDay: 40,
    securityDeposit: 400,
    minDuration: 1,
    maxDuration: 21,
    features: ['xDrive AWD', 'Wireless Charging', 'Adaptive Air Suspension', 'Harmon Kardon Sound', 'Heated Seats'],
    pickupLocations: ['Airport Terminal 1', 'Downtown Hub'],
    ratings: 4.8,
    reviewsCount: 8
  },
  {
    name: 'A6',
    brand: 'Audi',
    category: 'Luxury',
    type: 'Self Drive',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    ac: true,
    luggage: 3,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689403/velorix/misc/csjiaucebzbc1hs2w2r9.jpg'
    ],
    pricePerDay: 220,
    pricePerKm: 1.5,
    driverChargesPerDay: 0,
    securityDeposit: 300,
    minDuration: 1,
    maxDuration: 30,
    features: ['Virtual Cockpit', 'Matrix LED Headlights', 'Audi Drive Select', 'Leather Upholstery', 'Lane Departure Warning'],
    pickupLocations: ['Main City Office', 'Downtown Hub'],
    ratings: 4.7,
    reviewsCount: 15
  },
  {
    name: 'Fortuner',
    brand: 'Toyota',
    category: 'SUV',
    type: 'With Driver',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Diesel',
    ac: true,
    luggage: 5,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689405/velorix/misc/cvnnznh4x5guzhsbxjxa.jpg'
    ],
    pricePerDay: 180,
    pricePerKm: 1.2,
    driverChargesPerDay: 30,
    securityDeposit: 200,
    minDuration: 2,
    maxDuration: 15,
    features: ['4x4 Tough Build', 'High Ground Clearance', 'Dual Zone AC', 'Touchscreen Console', 'Hill Assist Control'],
    pickupLocations: ['Airport Terminal 1', 'Main City Office'],
    ratings: 4.6,
    reviewsCount: 22
  },
  {
    name: 'Innova Crysta',
    brand: 'Toyota',
    category: 'SUV',
    type: 'With Driver',
    seats: 7,
    transmission: 'Manual',
    fuel: 'Diesel',
    ac: true,
    luggage: 6,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689406/velorix/misc/ems3hwxqomb6hdzhe27p.jpg'
    ],
    pricePerDay: 120,
    pricePerKm: 0.9,
    driverChargesPerDay: 25,
    securityDeposit: 100,
    minDuration: 1,
    maxDuration: 30,
    features: ['Captain Seats', 'Spacious Cabin', 'Rear AC Vents', 'Smooth Ride', 'Ample Legroom'],
    pickupLocations: ['Airport Terminal 1', 'Main City Office', 'Downtown Hub'],
    ratings: 4.9,
    reviewsCount: 45
  },
  {
    name: 'i20',
    brand: 'Hyundai',
    category: 'Hatchback',
    type: 'Self Drive',
    seats: 5,
    transmission: 'Manual',
    fuel: 'Petrol',
    ac: true,
    luggage: 2,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689408/velorix/misc/sset3wg0hyswkzvm06ej.jpg'
    ],
    pricePerDay: 50,
    pricePerKm: 0.5,
    driverChargesPerDay: 0,
    securityDeposit: 100,
    minDuration: 1,
    maxDuration: 30,
    features: ['Fuel Efficient', 'Easy Parking', 'Apple CarPlay', 'Rear Parking Sensors', 'Electric Sunroof'],
    pickupLocations: ['Main City Office', 'Downtown Hub'],
    ratings: 4.5,
    reviewsCount: 30
  },
  {
    name: 'Force Traveller Luxury',
    brand: 'Force Motors',
    category: 'Tempo Traveller',
    type: 'With Driver',
    seats: 12,
    transmission: 'Manual',
    fuel: 'Diesel',
    ac: true,
    luggage: 10,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689409/velorix/misc/fuykjfvsdjjtzcpahcuh.jpg'
    ],
    pricePerDay: 280,
    pricePerKm: 1.5,
    driverChargesPerDay: 35,
    securityDeposit: 150,
    minDuration: 2,
    maxDuration: 10,
    features: ['Reclining Luxury Seats', 'Individual AC Vents', 'LCD TV & Music System', 'Spacious Gangway', 'USB Charging Ports'],
    pickupLocations: ['Main City Office'],
    ratings: 4.8,
    reviewsCount: 19
  },
  {
    name: 'Volvo Multi-Axle Tourist',
    brand: 'Volvo',
    category: 'Tourist Bus',
    type: 'With Driver',
    seats: 45,
    transmission: 'Automatic',
    fuel: 'Diesel',
    ac: true,
    luggage: 40,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783690090/velorix/misc/udkqst6cfrtgsk6ooui5.jpg'
    ],
    pricePerDay: 800,
    pricePerKm: 3.5,
    driverChargesPerDay: 60,
    securityDeposit: 500,
    minDuration: 3,
    maxDuration: 7,
    features: ['Semi-Sleeper Seats', 'Premium Suspension', 'On-Board Restroom', 'PA System & Mic', 'Large Under-Cabin Storage'],
    pickupLocations: ['Main City Office'],
    ratings: 4.9,
    reviewsCount: 11
  },
  {
    name: 'Premium Cruiser Coach',
    brand: 'Scania',
    category: 'Luxury Coach',
    type: 'With Driver',
    seats: 36,
    transmission: 'Automatic',
    fuel: 'Diesel',
    ac: true,
    luggage: 30,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689410/velorix/misc/jlb89y9hm4d8ajuvoqos.jpg'
    ],
    pricePerDay: 950,
    pricePerKm: 4.0,
    driverChargesPerDay: 70,
    securityDeposit: 600,
    minDuration: 3,
    maxDuration: 7,
    features: ['Executive Reclining Seats', 'Leg-Rests', 'Reading Lights', 'Large Tinted Windows', 'Emergency Toilet'],
    pickupLocations: ['Main City Office'],
    ratings: 5.0,
    reviewsCount: 5
  },
  {
    name: 'E-Class Wedding Edition',
    brand: 'Mercedes-Benz',
    category: 'Luxury',
    type: 'With Driver',
    seats: 4,
    transmission: 'Automatic',
    fuel: 'Electric',
    ac: true,
    luggage: 2,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689412/velorix/misc/lfi5yqavzyaj2fnqwvcg.jpg'
    ],
    pricePerDay: 300,
    pricePerKm: 2.0,
    driverChargesPerDay: 40,
    securityDeposit: 300,
    minDuration: 1,
    maxDuration: 3,
    features: ['White Exterior', 'Premium Floral Decoration Option', 'Red Carpet Entry Set', 'Chilled Water & Mints', 'Uniformed Chauffeur'],
    pickupLocations: ['Main City Office', 'Luxury Hotel Desk'],
    ratings: 4.9,
    reviewsCount: 7
  }
];

const packagesData = [
  {
    name: 'Manali & Solang Valley Getaway',
    description: 'Breathe in the fresh mountain air of Manali. Explore snow-capped peaks, scenic valleys, and enjoy thrilling adventure sports in Solang Valley.',
    type: 'Hill Station',
    destination: 'Manali, Himachal Pradesh',
    duration: '4 Days / 3 Nights',
    days: 4,
    recommendedVehicleCategory: 'SUV',
    basePrice: 599,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689413/velorix/misc/rleafrqpmvebcnwfsw2o.jpg'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Manali & Local Sightseeing', description: 'Arrive at Manali check-in at hotel. Visit Hidimba Devi Temple, Vashisht Hot Springs, and Mall Road in the evening.' },
      { day: 2, title: 'Solang Valley Adventure', description: 'Drive to Solang valley for paragliding, zorbing, and quad-biking. Return to hotel in evening.' },
      { day: 3, title: 'Rohtang Pass Snow Excursion', description: 'Travel to the high altitude Rohtang Pass. Enjoy playing in the snow and breathtaking views of the Himalayas.' },
      { day: 4, title: 'Return Journey', description: 'Check out of hotel, shop for local handicrafts, and drive back to drop location.' }
    ]
  },
  {
    name: 'Goa Coastal Escape',
    description: 'Sun, sand, and seafood. A premium beach vacation exploring the scenic shores, colonial churches, and vibrant nightlife of North and South Goa.',
    type: 'Beach',
    destination: 'Goa',
    duration: '5 Days / 4 Nights',
    days: 5,
    recommendedVehicleCategory: 'Luxury',
    basePrice: 799,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689415/velorix/misc/gee4tpzmhjbweihdt9yn.jpg'
    ],
    itinerary: [
      { day: 1, title: 'Arrive in North Goa', description: 'Airport pickup in premium sedan. Check-in at luxury beach resort. Relax at Baga Beach.' },
      { day: 2, title: 'North Goa Forts & Beaches', description: 'Visit historic Fort Aguada, Chapora Fort, and relax at Vagator and Anjuna beaches.' },
      { day: 3, title: 'South Goa Heritage Tour', description: 'Explore Old Goa churches (Basilica of Bom Jesus), Mangueshi Temple, and Miramar beach.' },
      { day: 4, title: 'Dudh Sagar Waterfalls & Spice Plantation', description: 'Day trip to the magnificent Dudhsagar falls. Walk through organic spice plantation with buffet lunch.' },
      { day: 5, title: 'Depart Goa', description: 'Enjoy beachside breakfast, souvenir shopping, and transfer back to Goa Airport.' }
    ]
  },
  {
    name: 'Golden Triangle Historical Tour',
    description: 'Immerse in India\'s architectural history. Experience the historic monuments of Delhi, the wonder of Taj Mahal in Agra, and the pink forts of Jaipur.',
    type: 'Domestic',
    destination: 'Delhi, Agra & Jaipur',
    duration: '6 Days / 5 Nights',
    days: 6,
    recommendedVehicleCategory: 'Sedan',
    basePrice: 999,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689416/velorix/misc/hhfbyds5j5k4uz7hbr1g.jpg'
    ],
    itinerary: [
      { day: 1, title: 'Delhi Historical Exploration', description: 'Pick up and tour Delhi monuments: Red Fort, Qutub Minar, India Gate, and drive past Parliament.' },
      { day: 2, title: 'Drive to Agra & Taj Mahal Sunset', description: 'Drive to Agra in luxury comfort. Visit the world-famous Taj Mahal at sunset. Stay in Agra.' },
      { day: 3, title: 'Agra Fort & Drive to Jaipur', description: 'Visit Agra Fort and Fatehpur Sikri. Continue drive to the Pink City of Jaipur. Check in.' },
      { day: 4, title: 'Jaipur Forts & Palaces', description: 'Excursion to Amber Fort with elephant ride. Visit Hawa Mahal (Palace of Winds) and City Palace.' },
      { day: 5, title: 'Jaipur Local Market Shopping', description: 'Explore Johari Bazaar, buy gemstones and local textiles. Evening dinner at traditional Chokhi Dhani.' },
      { day: 6, title: 'Return to Delhi', description: 'Drive back to Delhi and drop off at airport/railway station.' }
    ]
  },
  {
    name: 'Kerala Backwaters & Hill Stations',
    description: 'Experience the best of Kerala. Walk through tea gardens of Munnar, go wildlife spotting in Thekkady, and float along the serene backwaters of Alleppey.',
    type: 'Family',
    destination: 'Munnar, Thekkady & Alleppey',
    duration: '6 Days / 5 Nights',
    days: 6,
    recommendedVehicleCategory: 'Tempo Traveller',
    basePrice: 1199,
    images: [
      'https://res.cloudinary.com/cyyulamp/image/upload/v1783689417/velorix/misc/k5slpxqeq9rzsvageaiu.jpg'
    ],
    itinerary: [
      { day: 1, title: 'Cochin Arrival & Drive to Munnar', description: 'Pickup from Cochin airport in luxury Traveller. Drive through waterfalls to Munnar hill station.' },
      { day: 2, title: 'Munnar Tea Estates & Lakes', description: 'Visit Mattupetty Dam, Echo Point, and Tea Museum. Walk through manicured green tea gardens.' },
      { day: 3, title: 'Transfer to Thekkady (Periyar)', description: 'Drive to Thekkady. Take a spice plantation tour and watch a traditional Kathakali dance performance.' },
      { day: 4, title: 'Periyar Lake Boating & Wildlife', description: 'Boat safari on Periyar lake to spot elephants and exotic birds. Drive to Alleppey backwaters.' },
      { day: 5, title: 'Alleppey Houseboat Cruise', description: 'Board a traditional luxury Kettuvallam Houseboat. Float through backwater canals with traditional meals served on board.' },
      { day: 6, title: 'Cochin Departure', description: 'Disembark from houseboat, explore Fort Kochi (Chinese Fishing Nets), and transfer back to Cochin airport.' }
    ]
  }
];

const seedDB = async () => {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log('MongoDB Connected successfully.');

    // 1. Clear database
    console.log('Cleaning existing collection data...');
    await Vehicle.deleteMany();
    await Package.deleteMany();
    console.log('Database cleaned.');

    // 2. Seed vehicles
    console.log('Seeding premium vehicles...');
    const seededVehicles = await Vehicle.insertMany(vehiclesData);
    console.log(`Seeded ${seededVehicles.length} vehicles.`);

    // 3. Seed packages
    console.log('Seeding tour packages...');
    const seededPackages = await Package.insertMany(packagesData);
    console.log(`Seeded ${seededPackages.length} packages.`);

    console.log('=============================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed with error:', error.message);
    process.exit(1);
  }
};

seedDB();
