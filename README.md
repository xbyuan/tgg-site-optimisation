# Site and Speed Optimisation for thegoodguys.com.au
CSS and JS optimisation for TGG (Aurora)


## General Performance Issues

**Avoid using inline base64 encoded images and icons for common elements**
  * Base64 images can be used to boost load times as it reduces the number of potential image requests
  * However when these are used in common areas like header, footer, favicons etc. this increases the total size of the HTML for all pages significantly thus negating any minor performance gain from reducing image requests.

It's also worth noting that: 

  * Base64 encoding makes file sizes roughly 33% larger than their original binary representations
  * Base64 encoded data may possibly take longer to process than binary data
  
## JavaScript Performance Issues  

* Idenity and separate scripts that are required on all pages from scripts that are only used on certain pages
* Avoid inline JavaScript
* De-duplicate dojo and jquery scripts (these are loaded multiple times)

### Google Tag Manager

Current implementation uses inline JavaScript click events for dataLayer.push across the entire site

* The homepage has 417 inline JavaScript onClick events for dataLayer.push
* Each product tile has 4 individual onClick events containing both dataLayer.push, additional GTM scripts and inline vanilla JS
* Additionally each product tile loads an inline script tag that is triggered on page load (this is used for tracking page views per product tile)
