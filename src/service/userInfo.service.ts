import pool from "../config/pgDatabase/dbConnect";

// ----------------------------------------------------UPDATE USER INFO SERVICE
export const updateUserInfoById = async (id:number, updateUserInfo: Partial<any>)=>{
    const {user_photo, dob, gender, home_address, work_address} = updateUserInfo;
    const query = await pool.query(`UPDATE user_info SET dob = $1, gender = $2, home_address = $3, work_address=$4 WHERE user_id = $5 RETURNING *`, [ dob, gender, home_address, work_address, id]);
    return query.rows[0];
}

// ----------------------------------------------------GET USER INFO BY ID SERVICE
export const getUserInfoById = async (id:number)=>{
    const query = await pool.query(`SELECT user_photo, TO_CHAR(dob, 'YYYY-MM-DD') AS dob , gender, home_address, work_address FROM user_info WHERE user_id = $1`,[id])
    return query.rows[0];
}

// ----------------------------------------------------UPDATE USER PHOTO SERVICE
export const updateUserPhotoById = async (id:number, updateUserPhoto: string)=>{
    const query = await pool.query(`UPDATE user_info SET user_photo = $1 WHERE user_id = $2 RETURNING *`, [updateUserPhoto, id]);
    return query.rows[0];
}

// ----------------------------------------------------GET USER PHOTO BY ID SERVICE
export const getUserPhotoById = async (id:number)=>{
    const query = await pool.query(`SELECT user_photo FROM user_info WHERE user_id = $1`,[id])
    return query.rows[0];
}