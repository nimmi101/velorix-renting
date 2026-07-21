import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadImageFromUrl = async (imageUrl, folder) => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    });
    console.log(`✅ Uploaded: ${imageUrl.substring(0, 50)}... → ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${imageUrl}:`, error.message);
    return imageUrl; // Return original if upload fails
  }
};

const migrateUrls = async () => {
  console.log('📸 Starting migration of all image URLs to Cloudinary...\n');

  // Read seed.js
  const seedPath = path.join(process.cwd(), 'seed.js');
  let seedContent = fs.readFileSync(seedPath, 'utf8');

  // Find all unique image URLs
  const urlRegex = /'(https:\/\/images\.unsplash\.com\/[^']+)'/g;
  const matches = new Set();
  let match;
  
  while ((match = urlRegex.exec(seedContent)) !== null) {
    matches.add(match[1]);
  }

  const urlsArray = Array.from(matches);
  console.log(`Found ${urlsArray.length} unique image URLs to migrate\n`);

  // Create mapping of old URLs to new Cloudinary URLs
  const urlMapping = {};

  for (const oldUrl of urlsArray) {
    const folder = oldUrl.includes('tempo') || oldUrl.includes('coach') || oldUrl.includes('bus')
      ? 'velorix/vehicles'
      : oldUrl.includes('package') ? 'velorix/packages' : 'velorix/misc';

    const newUrl = await uploadImageFromUrl(oldUrl, folder);
    urlMapping[oldUrl] = newUrl;
  }

  console.log('\n🔄 Replacing URLs in seed.js...\n');

  // Replace all old URLs with new Cloudinary URLs
  let updatedContent = seedContent;
  for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
    updatedContent = updatedContent.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
  }

  // Write updated seed.js
  fs.writeFileSync(seedPath, updatedContent, 'utf8');

  console.log('✅ seed.js updated successfully!\n');
  console.log('📊 Migration Summary:');
  console.log(`   - URLs migrated: ${urlsArray.length}`);
  console.log(`   - New URLs stored in Cloudinary\n`);
  console.log('Next steps:');
  console.log('1. Run: node seed.js');
  console.log('2. Restart backend server');
  console.log('3. All vehicles & packages will now use Cloudinary images\n');
};

migrateUrls().catch(console.error);
