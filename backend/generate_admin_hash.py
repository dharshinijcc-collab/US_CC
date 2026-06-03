"""
Generate bcrypt hash for admin password.
Run this to get the hashed password for your Supabase SQL insert.
"""
import bcrypt

# Set your desired password here
password = "Hrsb43QtdXa&b"

# Generate hash
password_bytes = password.encode('utf-8')
salt = bcrypt.gensalt()
password_hash = bcrypt.hashpw(password_bytes, salt)

# Print the hash to use in your SQL
print("Password:", password)
print("Hash for SQL:", password_hash.decode('utf-8'))
