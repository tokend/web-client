# Document management

Document manager is needed to extended document management and verifying document integration. The core idea here is
that we can manage access on any entity by just attaching it to the account (one of main account features is role based
access management (RBAC), that allows us to give different permissions to every account).

## How it works

* When uploading the document to the system, document owner creates an account (the keypair of the account is 
calculated from the hash of the document)
* Document owner makes himself the first signer of the attached account - now he can add/manage/delete other signers to
the account - in other words, manage the access to the document.
* Any meta information goes to the "Change role request" of the account - it can be updated - and you can assign
policies about 
