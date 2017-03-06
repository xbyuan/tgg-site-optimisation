# Site and Speed Optimisation for thegoodguys.com.au

Optimisation and refactoring of CSS and HTML of existing pages in Aurora.  Additionally some JavaScript optimisation where possible to limit render blocking scripts and reducing inline JavaScript.

## How do I get set up? ##

### Pre-requisites

* [Git client](https://msysgit.github.io/) 
    * NOTE: It's recommended that you add the Git client to the Windows Path so you can use it directly from regular command line/prompt. This is an option during install with most installers. 
* [Node.js](https://nodejs.org/download/) Minimum 6.9.x 
* [Python 2.7.x](https://www.python.org/downloads/)
* On Windows you'll also need to install [Microsoft Visual C++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools)
* Optional but recommended: [Cmder](http://gooseberrycreative.com/cmder/) *Recommended console emulator replacement for cmd.exe*

### Downloading the repository

Start your command prompt (either Cmder standard windows cmd.exe). 

* Create a new directory where you want to put the files from this repository. 
* For example if you already have a directory on c: drive called www you'll first want to navigate to that 
* Do this by tying `cd c:\www` 
* To create a new directory type `mkdir site-optimisation` (to call it something else just replace site-optimisation with whatever name you want it to be)
* Make sure to navigate to the new directory by then typing `cd site-optimisation`

### Then type the following commands 

* For HTTPS use: `git clone https://github.com/lifeonlars/tgg-site-optimisation.git .` 
    * NOTE: The "." at the end specifies the current folder as the checkout folder. 
    * This should download all the files from the git repository and might take a few minutes.
    * You may be prompted for your github username and password unless you are already authenticated
* When the download is complete type `npm install` 
    * This will download all the node dependencies used for the project. 
* When npm install in complete type `bower install` 
    * This will download all the plugins and vendor scripts used in the project e.g. angular, bootstrap etc.
* When bower install is complete you can now try typing `gulp serve` 
    * This will start the local web server and view the prototype in your browser. 
    * After a few seconds this should automatically start your browser and open up http://localhost:9000/

### How to use git to contribute or get updates?

Have a quick read through [The simple guide to GIT](http://rogerdudler.github.io/git-guide/) before proceeding.

*NOTE: Ensure that you are aware if any branches in use, always make sure you are working in the correct branch. If you're using Cmder it will tell you what branch you're in in brackets at the end of your path e.g. `c:\www\site-optimisation (master)`*


## General Performance Issues

**Avoid using inline base64 encoded images and icons for common elements**
  * Base64 images can be used to boost load times as it reduces the number of potential image requests
  * However when these are used in common areas like header, footer, favicons etc. this increases the total size of the HTML for all pages significantly thus negating any minor performance gain from reducing image requests.

It's also worth noting that: 

  * Base64 encoding makes file sizes roughly 33% larger than their original binary representations
  * Base64 encoded data may possibly take longer to process than binary data

Further reading: [Base64 Encoding and Performance](https://csswizardry.com/2017/02/base64-encoding-and-performance/)

## JavaScript Performance Issues and recommendations  

* Identify and separate scripts that are required on all pages from scripts that are only used on certain pages
* Avoid inline JavaScript
* De-duplicate dojo and jquery scripts (these are loaded multiple times)
* Move embedded JS into separate file
* Migrate as much JS as possible to footer
* Start using `require` and `dojo.require` to load required scripts on all pages (set these up to be configured for individual page types)
* Embedded scripts are loaded whether they are required or not. Embedded scripts also use global scope 

## Google Tag Manager

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

To achieve this we would need to

1. Create a new dedicated dev environment to edit and test the new changes
2. Move all CSS into a page type specific espot to allow us to not load a large part of the CSS for different page types

## Milestones

### 1. Refactor masthead, menus and footer

Status: *In-Progress* (James)

### 2. Home page

Status: *Not Started*

### 3. Refactor Product Page

Status: *Not Started*

### 4. Refactor Product Listing Pages (L2, L3)

Status: *Not Started*

### 5. Refactor Product Listing Page (L1)

Status: *Not Started*

### 6. Content Page Refactoring (older pages)

Status: *Not Started*
