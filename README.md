# Site and Speed Optimisation for thegoodguys.com.au
CSS and JS optimisation for TGG (Aurora)


## General performance issues

**Avoid using inline base64 encoded images and icons for common elements**
  * Base64 images can be used to boost load times as it reduces the number of potential image requests
  * However when these are used in common areas like header, footer, favicons etc. this increases the total size of the HTML for all pages significantly thus negating any minor performance gain from reducing image requests.

It's also worth noting that: 

  * Base64 encoding makes file sizes roughly 33% larger than their original binary representations
  * Base64 encoded data may possibly take longer to process than binary data
  
  
