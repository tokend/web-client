# KYC flows

TokenD allows user to apply for 3 account roles: 
 - fund
 - us-verified
 - us-accredited.
 
It is needed because of United States law that allows only accredited investors to invest in security tokens. The module
will decide which role to set for account depending on user input. United States residents will be prompted to provide
the document proof of their accredited investor status. If user don't provide the proof, he will receive the us-verified role
and won't be allowed to invest in security tokens (or any other restrictions that can be configured with RBAC).

## Known issues:

- It is now impossible to change role because of backend restrictions. So **temporarily** we disable the country 
selector for any update of the change role request. It is needed because we'll get an error after changing selected 
non-US country to US residence and vice versa. The solution of this is cancelling the request, so we just waiting for 
backend implementation of this feature to make everything work.
