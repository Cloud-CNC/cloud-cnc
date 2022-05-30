# API Server

## Development

### Post Code Generation Tasks
* Complete any remaining TODO items (Search for `TODO:`)
* Account entity
  * Bifurcate the `getAccount`, `updateAccount`, and `deleteAccount` operations and their
    corresponding routes into an `own` and an `other variant`
  * Restrict access to only a user's own account for all `own` operation variants
  * Replace `:id` with `me` for all `own` operation variant routes
  * Add password hashing and TOTP secret generation to the `createUser` and `updateUser` operation
  * Update the session's effective user account ID for the `impersonateAccount` operation
* File entity
  * Restrict access to only files a user has at least `read` permission for
  * Upload the raw file via S3 for the `createFile` and `updateFile` operations
  * Download the raw file via S3 for the `getRawFile` operation
  * Delete the file via S3 for the `deleteFile` operation
* Job entity
  * Restrict access to only jobs a user has access to the job's corresponding file
* Relay entity
  * Create and sign a TLS keypair for the the `createRelay` operation
  * Terminate the relay connection and the TLS keypair to the Certificate Revocation List for the
    `deleteRelay` operation
* Session entity
  * Hash the password and update the session for the `loginUserpass` operation
  * Verify the TOTP and update the session for the `loginTotp` operation
  * Destroy all other sessions for the `revoke` operation
  * Destroy the current session for the `logout` operation