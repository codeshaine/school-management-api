# School Management API

This API allows you to manage school data. You can add a school and fetch a list of schools sorted by proximity to a given location (latitude and longitude).

## Project Setup

### Prerequisites

- **Node.js** (v14+ recommended)
- **MySQL** Database

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/school-management-api.git
   cd school-management-api
   ```

2. **Install dependencies**:
   ```bash
   pnpm install or npm install
   ```

3. **Create a `.env` file** to store your database credentials:
   ```ini
   DB_HOST=localhost
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_DATABASE=school_management
   DB_PORT=3306
   ```

4. **Create the `school` table in your MySQL database** by running the following SQL:

   ```sql
   CREATE TABLE IF NOT EXISTS school (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       address VARCHAR(255) NOT NULL,
       latitude FLOAT NOT NULL,
       longitude FLOAT NOT NULL
   );
   ```

5. **Start the server**:
   ```bash
   pnpm run start or npm run start
   ```

   The API will now be running at `http://localhost:3000`. (by default)

## API Endpoints

### 1. **Add School**

- **Endpoint**: `POST /addSchool`
- **Description**: Adds a new school to the database.
- **Request Body**:
  ```json
  {
    "name": "Green Valley School",
    "address": "123 Green St.",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
      "message": "Data inserted successfully",
      "data": {
        "name": "Green Valley School",
        "address": "123 Green St.",
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    }
    ```
  - **Error**:
    ```json
    {
      "message": "Invalid Data",
      "err": "Latitude must be between -90 and 90"
    }
    ```

### 2. **List Schools**

- **Endpoint**: `GET /listSchools`
- **Description**: Fetches all schools from the database, sorted by proximity to the user's location.
- **Query Parameters**:
  - `latitude`: User's latitude (e.g., `40.7128`)
  - `longitude`: User's longitude (e.g., `-74.0060`)

- **Example Request**:
  ```http
  GET /listSchools?latitude=40.7128&longitude=-74.0060
  ```

- **Response**:
  - **Success**:
    ```json
    {
      "message": "School data",
      "data": [
        {
          "name": "Green Valley School",
          "address": "123 Green St.",
          "latitude": 40.7128,
          "longitude": -74.0060,
          "distance": 0.0
        }
      ]
    }
    ```
  - **Error**:
    ```json
    {
      "message": "Invalid Params",
      "err": "Longitude must be between -180 and 180"
    }
    ```

