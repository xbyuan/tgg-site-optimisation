# Site and Speed Optimisation for thegoodguys.com.au
CSS and JS optimisation for TGG (Aurora)


## General Performance Issues

**Avoid using inline base64 encoded images and icons for common elements**
  * Base64 images can be used to boost load times as it reduces the number of potential image requests
  * However when these are used in common areas like header, footer, favicons etc. this increases the total size of the HTML for all pages significantly thus negating any minor performance gain from reducing image requests.

It's also worth noting that: 

  * Base64 encoding makes file sizes roughly 33% larger than their original binary representations
  * Base64 encoded data may possibly take longer to process than binary data
  
## JavaScript Performance Issues and recommendations  

* Idenity and separate scripts that are required on all pages from scripts that are only used on certain pages
* Avoid inline JavaScript
* De-duplicate dojo and jquery scripts (these are loaded multiple times)
* Move embedded JS into separate file
* Migrate as much JS as possible to footer
* Start using `require` and `dojo.require` to load required scripts on all pages (set these up to be configured for individual page types)
* Embedded scripts are loaded whether they are required or not. Embedded scripts also use global scope 

### Google Tag Manager

Current implementation uses inline JavaScript click events for dataLayer.push across the entire site. This is not only very inefficient but also adds a significant amount of extra JavaScript code to all our pages.

* The homepage has 417 inline JavaScript onClick events for dataLayer.push
* Each product tile has 4 individual onClick events containing both dataLayer.push, additional GTM scripts and inline vanilla JS
* Additionally each product tile loads an inline script tag that is triggered on page load (this is used for tracking page views per product tile)

**GTM should be rewritten to use a generic script to handle all click events.**

* Click events can be assigned to elements using a class or data attributes. 
* Data can be passed to the function utilising data-attributes on the elements 

## CSS Performance and Refactoring

* The site contains roughly 40,000 lines of CSS
* The majority of this is duplicate, out of date or completely unused CSS
* CSS is spread across multiple CSS files generating separate http requests
* Some CSS files use @import to load even more CSS files (general speaking using @import is not recommended in a production environment as this performs worse than link)

### CSS Refactoring
 
Because of the size of the legacy CSS it will very likely be faster and more efficient to scrap the old CSS completely and rebuild page by page using a combination of the GDDS CSS and new custom CSS for each page type. 

This can be done page by page by individually disabling common and legacy CSS for a specific page type e.g. product page. We can then re-create the page with new CSS combining the design system with a custom CSS file targeted at just that page. 
