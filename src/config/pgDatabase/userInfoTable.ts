import pool from "./dbConnect";

const userInfoTable = async () => {
    const userInfoTableQuery = `CREATE TABLE IF NOT EXISTS user_info(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_photo VARCHAR(255),
    dob DATE ,
    gender VARCHAR(50),
    home_address VARCHAR(255),
    work_address VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;

    try {
        await pool.query(userInfoTableQuery);
        console.log("user_info Table Created Successfully!");
    } catch (error) {
        console.log("Error Creating user_info Table", error);
    }
}


export default userInfoTable;