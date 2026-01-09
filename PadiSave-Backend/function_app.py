import azure.functions as func
import logging
import json
import pyodbc
import os
import random 
import string


app = func.FunctionApp()


@app.route(route="GetUserData", auth_level=func.AuthLevel.ANONYMOUS)
def GetUserData(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing GetUserData request.')

    user_id = req.params.get('userId')

    if not user_id:
        return func.HttpResponse("Please provide a userId", status_code=400)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 2. Fetch User Profile
        cursor.execute("SELECT FullName, TrustScore, TotalSaved, Email FROM Users WHERE UserID = ?", (user_id))
        user_row = cursor.fetchone()

        if not user_row:
            return func.HttpResponse("User not found", status_code=404)

        # 3. Fetch the Circles they belong to (Joins Users -> Members -> Circles)
        # This query finds all circles where this specific user is a member
        cursor.execute("""
            SELECT c.CircleID, c.CircleName, c.ContributionAmount, cm.IsPaidOut 
            FROM Circles c
            JOIN CircleMembers cm ON c.CircleID = cm.CircleID
            WHERE cm.UserID = ?
        """, (user_id))
        
        circles_rows = cursor.fetchall()
        
        # Format circles for the Frontend
        circles_data = []
        for row in circles_rows:
            circles_data.append({
                "id": row.CircleID,
                "name": row.CircleName,
                "amount": f"₦{row.ContributionAmount:,.0f}", # Formats 50000 -> ₦50,000
                "progress": 0.5, # Hardcoded for MVP (calculating real progress is complex)
                "nextTurn": "Pending"
            })

        # 4. Build the final response
        user_data = {
            "name": user_row.FullName,
            "email": user_row.Email,
            "trustScore": user_row.TrustScore,
            "totalSaved": f"₦{user_row.TotalSaved:,.0f}",
            "circles": circles_data 
        }

        return func.HttpResponse(
            json.dumps(user_data),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        logging.error(f"GetUserData Error: {str(e)}")
        return func.HttpResponse(f"Database error: {str(e)}", status_code=500)
    finally:
        if 'conn' in locals():
            conn.close()

    return func.HttpResponse(
        json.dumps(user_data),
        mimetype="application/json",
        status_code=200
    )

def get_db_connection():
    #helper function that's connecting to sql 
    conn_str = os.getenv("SqlConnectionString")
    return pyodbc.connect(conn_str)


@app.route(route="Login", auth_level=func.AuthLevel.ANONYMOUS)
def Login(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing Login request. ')

    try:
        req_body = req.get_json()
        email = req_body.get('email')
        password = req_body.get('password')
    except ValueError:
        return func.HttpResponse("Invalid JSON", status_code=400)
    if not email or not password:
        return func.HttpResponse("Please provice email and password", status_code=400)
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # SQL Query: Find user with matching Email AND Password
        # WARNING: For MVP, we use plain text. For production, you MUST use hashing!
        cursor.execute("SELECT UserID, FullName, TrustScore FROM Users WHERE Email = ? AND Password = ?", (email, password))
        row = cursor.fetchone()

        if row:
            # Success! Return the UserID
            user_data = {
                "id": row.UserID,
                "name": row.FullName,
                "trustScore": row.TrustScore
            }
            return func.HttpResponse(
                json.dumps(user_data), 
                mimetype="application/json", 
                status_code=200
            )
        else:
            return func.HttpResponse("Invalid credentials", status_code=401)
            
    except Exception as e:
        logging.error(str(e))
        return func.HttpResponse(f"Database error: {str(e)}", status_code=500)
    finally:
        # Always close the connection
        if 'conn' in locals():
            conn.close()

# --- 5. FUNCTION: SIGN UP (Create User) ---
@app.route(route="Signup", auth_level=func.AuthLevel.ANONYMOUS)
def Signup(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing Signup request.')

    try:
        req_body = req.get_json()
        full_name = req_body.get('fullName')
        email = req_body.get('email')
        password = req_body.get('password')
    except ValueError:
        return func.HttpResponse("Invalid JSON", status_code=400)

    if not full_name or not email or not password:
        return func.HttpResponse("Please provide Name, Email, and Password", status_code=400)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 1. Check if email already exists
        cursor.execute("SELECT UserID FROM Users WHERE Email = ?", (email))
        if cursor.fetchone():
            return func.HttpResponse("Email already registered", status_code=409)

        # 2. Insert new user (Default Score = 450)
        cursor.execute(
            "INSERT INTO Users (FullName, Email, Password, TrustScore, TotalSaved) VALUES (?, ?, ?, 450, 0)",
            (full_name, email, password)
        )
        conn.commit() # Save changes

        # 3. Get the ID of the new user to log them in immediately
        cursor.execute("SELECT @@IDENTITY") 
        new_id = cursor.fetchone()[0]

        return func.HttpResponse(
            json.dumps({"success": True, "userId": new_id, "name": full_name}),
            mimetype="application/json",
            status_code=201
        )

    except Exception as e:
        logging.error(f"Signup Error: {str(e)}")
        return func.HttpResponse(f"Database error: {str(e)}", status_code=500)
    finally:
        if 'conn' in locals():
            conn.close()

# --- 6. FUNCTION: CREATE CIRCLE ---
@app.route(route="CreateCircle", auth_level=func.AuthLevel.ANONYMOUS)
def CreateCircle(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing CreateCircle request.')

    try:
        req_body = req.get_json()
        user_id = req_body.get('userId')
        name = req_body.get('name')
        amount = req_body.get('amount')
        frequency = req_body.get('frequency')
    except ValueError:
        return func.HttpResponse("Invalid JSON", status_code=400)

    if not user_id or not name or not amount:
        return func.HttpResponse("Missing required fields", status_code=400)

    # Generate a Random 6-Character Code (Uppercase + Numbers)
    join_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 1. Create the Circle
        cursor.execute(
            "INSERT INTO Circles (CircleName, ContributionAmount, Frequency, JoinCode) VALUES (?, ?, ?, ?)",
            (name, amount, frequency, join_code)
        )
        
        # 2. Get the new Circle ID
        cursor.execute("SELECT @@IDENTITY")
        new_circle_id = cursor.fetchone()[0]

        # 3. Add the Creator as the First Member (Admin)
        # Note: We assume IsAdmin=1 for the creator
        cursor.execute(
            "INSERT INTO CircleMembers (UserID, CircleID, IsPaidOut) VALUES (?, ?, 0)",
            (user_id, new_circle_id)
        )
        
        conn.commit()

        return func.HttpResponse(
            json.dumps({
                "success": True, 
                "circleId": new_circle_id, 
                "joinCode": join_code,  # <--- Sending code back to frontend
                "message": "Circle created successfully"
            }),
            mimetype="application/json",
            status_code=201
        )

    except Exception as e:
        logging.error(f"CreateCircle Error: {str(e)}")
        return func.HttpResponse(f"Database error: {str(e)}", status_code=500)
    finally:
        if 'conn' in locals():
            conn.close()