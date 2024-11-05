// pings the server every 30 seconds to check if the file has been modified
// reloads the page if it has
// pings the server every 30 seconds to check if the file has been modified
// reloads the page if it has
(()=>{
    // find all files that are loaded by the page
    var reloadable = Array.from(document.querySelectorAll('script, link[rel="stylesheet"], img'));
    // Add the current page to the list
    reloadable.push({ src: location.href });
    
    
    const startTime = Date.now();
    
    // check each file for changes
    const checkForChanges = async () => {
        for (const file of reloadable) {
            const response = await fetch(file.src || file.href, { cache: 'no-store', method: 'HEAD', timeout: 5000 });
            const lastModified = response.headers.get('last-modified');
            if (lastModified && new Date(lastModified).getTime() > startTime) {
                location.reload();
            }
        }
    };
    
    
    
    
    // check for changes at least every 30 seconds
    requestIdleCallback(async function check() {
        await checkForChanges();
        setTimeout(() => requestIdleCallback(check, { timeout: 30000 }), 10000);
    }, { timeout: 30000 });
})();