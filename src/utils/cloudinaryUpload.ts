import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';

export const uploadToCloudinary = (fileBuffer: Buffer, folder="auth_user_Photos"):Promise<UploadApiResponse>=>{
    return new Promise((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            {folder},
            (error, result)=>{
                if(error)return reject(error);
                resolve(result as UploadApiResponse);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    })
}