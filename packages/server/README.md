# API Server

## Development

### Post Code Generation Tasks
* Add queries for controllers
  * Users MUST only have access to their own account
  * Users MUST only have access to files they have at least read permission for
  * Users MUST only have access to jobs that they also have access to the job's corresponding file
* Implement non-standard controllers
  * Implement the session username-password login controller
    * Verify the password against the hash using Argon2id
    * Set the session actual and effective account ID
    * If MFA is enabled, raise the session authentication-incomplete flag
  * Implement the session MFA login controller
    * Verify the OTP against the shared secret
    * Clear the session authentication-incomplete flag
  * Implement the revoke session controller
    * Destroy all other sessions
  * Implement the session logout controller
    * Destroy the current session
  * Implement the account impersonation controller
    * If enabled, set the session's effective account ID to the desired account ID
    * If disabled, set the session's effective account ID to the actual account ID
  * Implement the file creation controller
    * Upload the file via S3
  * Implement the file download controller
    * Download the file via S3
  * Implement the file update controller
    * Upload the file via S3
  * Implement the file delete controller
    * Delete the file via S3
  * Implement the relay creation controller
    * Create and sign a TLS keypair
  * Implement the relay deletion controller
    * Terminate the relay connection
    * Add the relay's TLS keypair to the Certificate Revocation List (CRL)
* Complete any remaining TODO items (Search for `TODO:`)