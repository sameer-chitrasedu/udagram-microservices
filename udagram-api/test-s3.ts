import * as AWS from './src/aws';
import { config } from './src/config/config';

async function test() {
    console.log('Testing S3 access with monolith config...');
    console.log('Bucket:', config.aws_media_bucket);
    console.log('Profile:', config.aws_profile);
    
    try {
        const url = await AWS.getGetSignedUrl('dog-puppy-on-garden-royalty-free-image-1586966191.avif');
        console.log('Generated URL:', url);
        console.log('You should try to open this URL in your browser to see if it works.');
    } catch (e) {
        console.error('Error generating signed URL:', e);
    }
}

test();
