import pool from "../config/pgDatabase/dbConnect";

// ----------------------------------------------------UPDATE USER INFO SERVICE
export const updateUserInfoById = async (id:number, updateUserInfo: Partial<any>)=>{
    const {user_photo, dob, gender, home_address, work_address} = updateUserInfo;
    const query = await pool.query(`UPDATE user_info SET user_photo = $1, dob = $2, gender = $3, home_address = $4, work_address=$5 WHERE user_id = $6 RETURNING *`, [user_photo, dob, gender, home_address, work_address, id]);
    return query.rows[0];
}