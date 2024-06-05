from cryptography.fernet import Fernet
import os

# Generate a key
key = Fernet.generate_key()

# Print the key
print("Generated Key:", key)

# Save the key to an environment variable
print(key.decode())

# Later, retrieve the key from the environment variable
encryption_key = os.getenv("ENC_KEY").encode()
cipher_suite = Fernet(encryption_key)
